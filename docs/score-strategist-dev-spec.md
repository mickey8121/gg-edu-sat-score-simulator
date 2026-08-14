# Score Strategist · Functional Dev Spec

Built on top of the ready base: Next.js + Tailwind + playbook tokens/icons/styles.

> **Language policy.** All UI copy and product content is **Russian** — this is a Russian-language platform. Exceptions: exact SAT terminology stays in **English** (`Reading & Writing`, `Math`, `Module 1/2`, `Digital SAT`, score numbers), because these mirror the real exam. Code, comments, commits, identifiers — English. Verbatim Russian strings that ship in the product are quoted below as «...» — use them as-is.

---

## 0. Assumptions (verify and correct)

1. **Engine constants are approximations, not facts.** College Board does not publish exact curves. We start with the constants below and calibrate against official Bluebook practice test tables in plan step 1. All numbers live in a single config.
2. Single page `/`, three sections via tabs, no page routing.
3. Desktop-first; mobile = "doesn't fall apart" (single column, no dedicated design).
4. No API, server actions, or DB. Fully client-side.

---

## 1. Scoring Engine

Pure TS module `lib/engine/`, zero dependencies, isolated from UI.

### Types

```ts
type SectionId = 'rw' | 'math';
type Route = 'hard' | 'easy';

interface SectionInput {
  m1Mistakes: number; // 0..m1Questions
  m2Mistakes: number; // 0..m2Questions
}

interface SectionResult {
  route: Route;
  score: number;        // midpoint, multiple of 10
  scoreLow: number;     // score - band, clamped to 200
  scoreHigh: number;    // score + band, clamped to 800
  distanceToThreshold: number; // mistakes left before losing the hard route (can be negative)
}

interface TotalResult {
  rw: SectionResult;
  math: SectionResult;
  total: number;
  totalLow: number;
  totalHigh: number;
}

interface ErrorBudget {
  perSection: Record<SectionId, { total: number; m1Max: number; note: string }>;
  reachable: boolean; // false if the target is unreachable even with a perfect model run
}
```

### Config (starting values)

```ts
const ENGINE_CONFIG = {
  rw:   { m1Questions: 27, m2Questions: 27, routingThreshold: 18 }, // correct in M1 required for hard M2
  math: { m1Questions: 22, m2Questions: 22, routingThreshold: 14 },
  easyRouteCap: { rw: 630, math: 630 }, // score ceiling on the easy route
  scoreBand: 30,
  // anchor points of the correct→score curve per route; linear interpolation between anchors
  anchors: {
    hard: { rw: [[54, 800], [48, 720], [40, 620], [30, 480], [18, 350]],
            math: [[44, 800], [39, 720], [32, 600], [24, 470], [14, 340]] },
    easy: { rw: [[54, 630], [40, 540], [27, 430], [14, 320], [0, 200]],
            math: [[44, 630], [33, 540], [22, 430], [11, 320], [0, 200]] },
  },
};
```

### Functions

```ts
scoreSection(section: SectionId, input: SectionInput): SectionResult
scoreTotal(inputs: Record<SectionId, SectionInput>): TotalResult
errorBudget(target: number): ErrorBudget    // inverse problem
priorities(result: TotalResult): Priority[] // where a mistake cost the most
```

Rules:
- routing: `m1Correct >= routingThreshold` → hard, otherwise easy;
- on easy the score is clamped to `easyRouteCap`;
- monotonic: more mistakes → never a higher score;
- `errorBudget`: binary search over `scoreTotal` for max allowed mistakes with hard routes on both sections; M1/M2 split favors protecting M1 (`m1Max ≤ questions − threshold − 1`);
- everything is a multiple of 10; range = ±`scoreBand`.

### Verification

`scripts/check-engine.ts` (run via `pnpm check:engine`): prints a table of reference cases (0 mistakes → 1600; all wrong → 400; threshold ±1; typical 1300/1400/1500). Manually cross-checked against practice tests during calibration. No unit tests — out of scope.

---

## 2. Shell and State

### Layout

- **Header**: eyebrow «SAT PORTAL · ИНСТРУМЕНТ», title «Стратег балла», one-sentence lead, tabs.
- **Tabs** (3): «Симуляция» · «Песочница» · «Мой план». Kit segment-control style. Lucide icons: `play`, `sliders-horizontal`, `target`.
- **Footer disclaimer** (all tabs, muted): «Оценка на основе официальных practice-тестов College Board. Реальный балл зависит от версии экзамена.»

### Global state (React context `SimulatorProvider`)

```ts
interface AppState {
  tab: 'sim' | 'lab' | 'plan';
  lab: Record<SectionId, SectionInput>;            // sandbox sliders
  frozenA: Record<SectionId, SectionInput> | null; // scenario A
  target: number;                                  // goal, default 1400
  simResult: Record<SectionId, SectionInput> | null; // simulation outcome
  simStep: number;                                 // 0..7
}
```

### URL sync

`useUrlState` hook: serialize to query, restore on load.
`?tab=lab&rw1=2&rw2=1&ma1=3&ma2=0&a=4.2.3.1&target=1500`
- keys: `tab`, `rw1|rw2|ma1|ma2` (sandbox mistakes), `a` (frozen A, dot-separated), `target`;
- invalid values are silently clamped / reset to defaults;
- URL updates via `replaceState`, 300ms debounce.

---

## 3. Tab «Симуляция»

A "walk the exam in 60 seconds" stepper. Steps (`simStep`):

| # | Screen | Content |
|---|---|---|
| 0 | Intro | Card: what's about to happen (2 sentences), primary «Начать» |
| 1 | R&W · Module 1 | Module card: «27 вопросов · 32 минуты». Correct-answers picker: slider 0–27 + quick preset pills («Почти всё» = 25, «Норм» = 20, «Тяжело зашло» = 15). Primary «Дальше» |
| 2 | R&W routing | RoutingReveal (below) |
| 3 | R&W · Module 2 | Same as step 1, but the card reflects the route: badge + ceiling caption. On easy, the score scale is visually truncated |
| 4 | Math · Module 1 | Same as step 1 (0–22) |
| 5 | Math routing | RoutingReveal |
| 6 | Math · Module 2 | Same as step 3 |
| 7 | Results | Below |

### RoutingReveal (the aha moment, steps 2 and 5)

~2.5s animation, CSS transitions:
1. horizontal scale 0..m1Questions with a marked threshold (vertical tick + caption «порог сложного модуля»);
2. a "your result" marker travels from 0 to the value (~1.2s ease-out);
3. verdict: badge «Сложный модуль 2» (success) or «Лёгкий модуль 2» (warning), fade + lift entrance;
4. explanation alert — hard: «Экзамен решил: ты готов к сложным вопросам. Открыт полный диапазон до 800.»; easy: «Модуль 1 не добрал до порога. Второй модуль будет легче, но потолок — около 630.»;
5. primary «Дальше» appears after the animation (click anywhere skips it).

### Results screen (step 7)

- 4 metric cards: R&W (range), Math (range), Total (large, range), routes summary («Маршруты: 2/2 сложных» etc.);
- "biggest loss" block: 1–2 lines from `priorities()` (e.g. «Ошибки в Math Module 1 стоили тебе дороже всего — они чуть не сбросили маршрут»);
- CTA row: primary «Покрутить в песочнице» (moves `simResult` → `lab`, switches tab), secondary «Пройти ещё раз» (reset `simStep` → 0).

### Simulation states

- `simStep=0` — intro (initial state);
- step progress indicator on top (7 dots/segments);
- edge: 0 correct in a module — soft copy («Бывает. Смотри, что это значит для маршрута»), no red;
- perfect run — success alert on results: «Идеальный проход. На реальном экзамене так же?» + CTA.

---

## 4. Tab «Песочница»

### Base mode

- 2 groups (R&W, Math), each with 2 mistake sliders: `Module 1`, `Module 2`;
- M1 sliders show a visible routing-threshold tick with a caption;
- live panel beside/below: R&W, Math, Total metrics (ranges), route badges per section;
- recalc synchronously on every input; number animation via short CSS transition;
- default: all 0 → maximum score, info alert «Подвигай ползунки — увидишь, как ошибки превращаются в балл»;
- contextual alerts (priority top-down, only the most important one is shown):
  1. warn, if any section has `0 < distanceToThreshold ≤ 2`: «Ещё N ошибки в {section} Module 1 — и полетишь в лёгкий модуль: потолок упадёт до ~630»;
  2. warn (route = easy): «{Section}: лёгкий маршрут. Балл выше ~630 недоступен, сколько ни решай второй модуль»;
  3. info (default hint) — only while the user hasn't touched anything.

### A/B comparison

- secondary button «Сравнить сценарии»: freezes current state into `frozenA`, layout switches to 2 columns: A (read-only card with values and metrics) and B (active sliders);
- B metrics get delta badges vs A: `+40` (success) / `−60` (err) / `0` (neutral);
- compare-mode buttons: «Поменять местами» (B→A), «Выйти из сравнения» (frozenA = null);
- entering from the simulation with a result: values are loaded into sliders, toast/alert «Перенесли твой результат из симуляции».

### Sharing

- ghost button «Поделиться» with `link` icon: copies current URL; success — success alert/toast «Ссылка скопирована» (3s); clipboard failure — fallback: show the URL in an input for manual copy.

---

## 5. Tab «Мой план»

1. **Target**: large slider 400–1600 (step 10) + preset pills «1300 · 1400 · 1500»; default 1400.
2. **Error budget** (live recalc from target), per-section cards:
   - «R&W: до N ошибок · в Module 1 — не больше K»;
   - «Math: до N ошибок · в Module 1 — не больше K»;
   - summary line: «Итого ~N−M ошибок на весь экзамен».
3. **Priorities** — block appears only if `simResult` exists or the sandbox was touched: 1–2 recommendations from `priorities()`, format «Начни с {X} — там ошибки стоят дороже всего». Otherwise a placeholder: «Пройди симуляцию — подскажем, что подтянуть первым» with a link button to the simulation tab.
4. **CTA**: primary «Проверить на пробном экзамене» → external link to the portal section.

### Plan states

- target 1600: warn alert «1600 — это идеальный проход. Бюджета на ошибки нет, но диапазон прощает 1–2 в сильной секции»;
- target ≤ 800: info «Такой балл даёт даже частичный проход — смело целься выше»;
- `reachable = false` (shouldn't occur with valid data) — fallback err alert «Не смогли посчитать. Попробуй другую цель».

---

## 6. Component tree

```
app/page.tsx
└── SimulatorProvider (context + useUrlState)
    ├── Header (eyebrow, h1, lead)
    ├── StepTabs
    ├── tab=sim → SimFlow
    │   ├── SimProgress
    │   ├── SimIntro | ModuleStep (ModuleCard + CorrectPicker) | RoutingReveal | SimResults
    │   └── SimResults → MetricCard×4, PriorityNote, CtaRow
    ├── tab=lab → Lab
    │   ├── SectionSliders×2 (ModuleSlider×2, ThresholdMark)
    │   ├── LivePanel (MetricCard×3, RouteBadge×2, DeltaBadge*)
    │   ├── SmartAlert (single, by priority)
    │   └── CompareBar (enter/swap/exit) + ScenarioCardA
    ├── tab=plan → Plan
    │   ├── TargetPicker (slider + preset pills)
    │   ├── BudgetCards + BudgetSummary
    │   ├── PriorityBlock | PriorityPlaceholder
    │   └── CtaButton
    └── FooterDisclaimer
```

Reusable primitives on top of the playbook: `MetricCard`, `RouteBadge`, `DeltaBadge`, `Alert(kind)`, `PillButton`, `RangeSlider` (styled range: brand track, threshold tick, focus ring).

---

## 7. Key copy (kit tone: «ты», short) — ships verbatim

- Lead: «Пойми, как Digital SAT превращает твои ответы в балл — и сколько ошибок можно позволить на пути к цели.»
- Simulation intro: «Пройди структуру экзамена за минуту. Без вопросов — только механика: два модуля, развилка, балл.»
- Empty sandbox: «Подвигай ползунки — увидишь, как ошибки превращаются в балл.»
- Threshold: «Ещё 2 ошибки в Module 1 — и полетишь в лёгкий модуль. Потолок упадёт до ~630.»
- Perfect: «Идеальный проход. На реальном экзамене так же?»

Forbidden: emoji, formal «вы», bureaucratic phrasing, stacked exclamation marks.

---

## 8. Step-by-step build plan

| Step | What | Done when |
|---|---|---|
| 1 | Data calibration: compile 2–3 official Bluebook practice test tables, refine anchors/threshold/cap in `ENGINE_CONFIG` | Config numbers have source links in comments |
| 2 | `lib/engine` + `scripts/check-engine.ts` | Reference cases print and match expectations, monotonicity holds |
| 3 | Shell: layout, Header, StepTabs, FooterDisclaimer, `SimulatorProvider`, `useUrlState` | Tabs switch, state lives in the URL, refresh restores it |
| 4 | Sandbox base: sliders, threshold ticks, live panel, SmartAlert | Moving a slider updates metrics and badges instantly, alerts follow priority |
| 5 | Plan: TargetPicker, budget, edge states, CTA | Budgets for 1300/1400/1500 are sensible, 1600 shows warn |
| 6 | Simulation: stepper, ModuleStep, RoutingReveal, SimResults, handoff to sandbox | Full 0→7 run, routing animation plays and skips, result transfers to lab |
| 7 | A/B comparison + sharing | Freeze/swap/exit work, deltas correct, «Поделиться» copies URL with state |
| 8 | Polish: kit audit (palette, radii, shadows, hover), copy pass, mobile check | A screenshot next to the kit reads as the same design language; nothing breaks at 390px |
| 9 | Deploy to Vercel + README (EN) + prepared demo links for Loom | Prod URL passes end-to-end, README done |

If time runs short, cut from step 7 down (sharing first, then A/B); simplify the routing animation to a fade without the traveling marker.

---

## 9. Definition of Done

- [ ] All three tabs work end-to-end and share data
- [ ] Engine calibrated against practice tests, disclaimer in place
- [ ] URL state: sharing and restore
- [ ] Style and tone audited against the kit, no emoji, no formal «вы»
- [ ] Vercel + repo + README (EN)
- [ ] 2–3 min Loom + the short write-up with AI-workflow notes
