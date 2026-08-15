# Score Strategist — Development Plan

## Context

We are building "Score Strategist" — a Digital SAT score simulator SPA — per the
spec (`score-strategist-dev-spec.md`), on top of the project's ready
design-system kit (`components/ui`, `components/layout`, tokens in
`app/globals.css`). The product: a single page `/`, three tabs («Симуляция» — an
exam-walkthrough stepper with the routing-reveal animation; «Песочница» —
mistake sliders with live recalc and A/B comparison; «Мой план» — the inverse
problem: target score → error budget). Fully client-side, no API or DB; state
syncs to the URL. All UI copy is Russian (SAT terminology stays English), code
and comments are English, verbatim strings from spec §7 ship as-is.

This file is the plan of record: the "Current state" block below is updated
after every step.

## Decisions made

- **Engine constants come from the spec as-is**, no Bluebook research now. Calibration happens later, separately; the config carries an "approximation" comment.
- **The «Проверить на пробном экзамене» CTA** is a placeholder constant `TRIAL_EXAM_URL` in `lib/site-config.ts`; the real URL goes in before deploy.
- **Workflow: one PR per step.** Branches `feat/<slug>` off `main`, squash-merge, delete the branch locally and on the remote after merge. No task-ids in branches/titles — the project has no tracker.
- **`scripts/check-engine.ts` is wired into `make check`** (and therefore CI). Runner: devDep `tsx` (resolves the `@/` alias from tsconfig; node's type-stripping would require `.ts` extensions in imports and loosening tsconfig).
- **Client boundary** — `components/simulator/` (the `"use client"` directive lives only in `simulator.tsx`, the provider, and hooks). `app/page.tsx` stays a server component. `components/ui/` remains directive-free: the new primitives (SegmentedTabs, RangeSlider) are dumb markup with handlers passed in from client parents (the same contract `Input` already uses).
- **URL sync without `useSearchParams`**: read `window.location.search` in a mount effect + write via `window.history.replaceState` with a 300 ms debounce. The page stays statically prerendered, no Suspense boundary needed, slider drags never touch the router. URL keys: `tab, rw1, rw2, ma1, ma2, a, target`; `simStep`/`simResult` are deliberately absent (a refresh restarts the simulation).
- **No new `--text-*` tokens** (each would require touching the twMerge config in `lib/utils.ts`) — the large Total number reuses `text-display`/`text-stat`.

## Steps

### Step 0 — land the design system on `main`

Done: the kit is squash-merged into `main` (`f9ede6a`, PR #1), the
`feat/design-system` branch is deleted, this plan is committed to
`.claude/plans/`.

### Step 1 — engine · `feat/engine`

Pure TS module, zero dependencies, isolated from the UI.

**Create:** `lib/engine/{types,config,scoring,budget,priorities,index}.ts`, `scripts/check-engine.ts`.
**Modify:** `package.json` (devDep `tsx`, script `check:engine`), `Makefile` (4th line of the `check` recipe; TABs, flat targets).

Key algorithms:

- `scoreSection`: routing by `m1Correct >= threshold`; linear interpolation over the route's anchors from total correct; rounding to 10; clamps to `[200, 800]` and to `easyRouteCap` on easy; `scoreLow/High = score ∓/± 30` with the same clamps.
- `distanceToThreshold = m1Correct − threshold + 1` — "how many more M1 mistakes until you drop to easy". This resolves the off-by-one in the sandbox copy: exactly at the threshold it equals 1 → «Ещё 1 ошибка…»; ≤ 0 means already easy.
- `SectionResult` gains `marginalCost` (points lost to the next mistake) — so `priorities(result)` keeps the spec signature without needing the inputs back.
- `errorBudget(target)` — two honest numbers instead of the underspecified "binary search":
  cards = balanced 50/50 target split per section, exhaustive scan over correct
  counts (domain ≤ 54 values), `m1Max = questions − threshold − 1` (the spec's
  M1-protection buffer); the high end of «Итого ~N−M» = the maximum total
  mistakes over all hard/hard combinations (≤ ~1100 pairs). Reference: 1400 →
  R&W up to 8 / Math up to 6, «~14−15»; 1500 → 4 / 3, «~7−8»; 1600 → «~0».
- `priorities(result)`: weighted candidates — `route-lost` (easy route, weight ~1000+) > `threshold-risk` (hard route, `distanceToThreshold ≤ 2`, weight ~500+) > `steep-curve` (max `marginalCost`). The UI composes copy from `kind`; the engine knows no copy.
- `check-engine.ts`: prints the reference table (0 mistakes → 1600; all wrong → 400; threshold ±1; 1300/1400/1500; budgets) **and asserts**: multiples of 10, ranges, easy ≤ cap, a full monotonicity sweep (the domain is tiny), budget round-trip (each card budget fed back through `scoreTotal` reaches the target). Exit 1 on failure.

**Done when:** `pnpm check:engine` prints the table, all asserts green, `make check` (now 4 commands) passes.

### Step 2 — shell and state · `feat/shell-state`

**Create:** `components/ui/segmented-tabs.tsx` (primitive without `"use client"`, roles/aria from props; static specimen on `/design-system`); `components/simulator/{types,url-state,use-url-state,simulator-provider,simulator,simulator-header,step-tabs,footer-disclaimer}.tsx`.
**Modify:** `app/page.tsx` (stub → `PageContainer` + `<Simulator />`), `app/layout.tsx` (`lang="ru"`, Russian metadata; the Inter cyrillic subset is already loaded).

- `SimulatorProvider`: `useReducer` (atomic transitions — the sim→lab transfer is one dispatch), derived engine results via `useMemo`.
- `url-state.ts` — pure `parseSearch`/`serializeState`; invalid values are silently clamped/reset.
- `step-tabs.tsx`: `Play, SlidersHorizontal, Target` icons, labels «Симуляция · Песочница · Мой план», roving tabindex with arrow keys (keyboard logic here, not in the primitive).
- Header: `Eyebrow` «SAT PORTAL · ИНСТРУМЕНТ», h1 `text-display` «Стратег балла», lead from §7: «Пойми, как Digital SAT превращает твои ответы в балл — и сколько ошибок можно позволить на пути к цели.» Footer disclaimer from §2: «Оценка на основе официальных practice-тестов College Board. Реальный балл зависит от версии экзамена.»

**Done when:** tabs switch by mouse and arrow keys, `?tab=lab&rw1=2…` restores after refresh, malformed params silently fall back to defaults, URL writes are debounced, `/design-system` is untouched.

### Step 3 — sandbox (base mode) · `feat/sandbox`

**Create:** `components/ui/range-slider.tsx` (primitive: styled `<input type="range">`, thumb/track via `[&::-webkit-slider-thumb]:…` variants, brand fill via a CSS variable in `style` — not a class, to keep `check-utilities` candidates clean; a `marker` prop for the threshold tick with the caption «порог сложного модуля»; specimen on `/design-system`); `components/simulator/{lab,section-sliders,metric-card,route-badge,live-panel,smart-alert}.tsx`.

- `MetricCard` — wraps `StatCard`: value + range line «690–750», a large-total variant, a badge slot (for step 6 deltas).
- `RouteBadge` — `Badge`: green «Сложный модуль 2» / amber «Лёгкий модуль 2».
- Number pulse on change — `key={score}` + `transition-[opacity,translate]` (never transition `transform` alone — v4 standalone properties).
- `SmartAlert` — a single `Alert` by spec priority: (1) warn when `0 < distanceToThreshold ≤ 2`: «Ещё N ошибки в {section} Module 1 — и полетишь в лёгкий модуль: потолок упадёт до ~630»; (2) warn on an easy route: «{Section}: лёгкий маршрут. Балл выше ~630 недоступен, сколько ни решай второй модуль»; (3) default info hint «Подвигай ползунки — увидишь, как ошибки превращаются в балл» only while `labTouched === false` (a reducer flag, not URL-persisted).

**Done when:** dragging a slider updates metrics synchronously; crossing the M1 tick flips the route badge and the ceiling; alert priority matches the spec; all-zero default shows max score + the info hint; the URL reflects slider values; `node scripts/check-utilities.mjs` is green.

### Step 4 — «Мой план» tab · `feat/plan`

**Create:** `lib/site-config.ts` (`TRIAL_EXAM_URL`, TODO comment); `components/simulator/{plan,target-picker,preset-pills,budget-cards,priority-block}.tsx`.

- TargetPicker: large `RangeSlider` 400–1600 step 10 + preset pills «1300 · 1400 · 1500» (`Button variant="outline" size="sm" rounded-full` + `aria-pressed`; `Chip` won't do — it is non-interactive). `PresetPills` is reused in step 5.
- Budget cards from `errorBudget(target).perSection`: «R&W: до N ошибок · в Module 1 — не больше K», «Math: до N ошибок · в Module 1 — не больше K» + summary «Итого ~N−M ошибок на весь экзамен» (collapses to «~N» when N = M).
- PriorityBlock: with `simResult` or `labTouched` — top 1–2 from `priorities()` as «Начни с {X} — там ошибки стоят дороже всего»; otherwise the placeholder «Пройди симуляцию — подскажем, что подтянуть первым» + a ghost button to the simulation tab.
- Edge alerts: 1600 → warn «1600 — это идеальный проход. Бюджета на ошибки нет, но диапазон прощает 1–2 в сильной секции»; ≤ 800 → info «Такой балл даёт даже частичный проход — смело целься выше»; `!reachable` → err «Не смогли посчитать. Попробуй другую цель».
- CTA: primary `ButtonLink` → `TRIAL_EXAM_URL`, «Проверить на пробном экзамене».

**Done when:** 1300/1400/1500 produce the budgets from step 1's reference table; 1600 shows the warn and «~0»; `target` is in the URL; the priority block switches after the sandbox is touched.

### Step 5 — simulation · `feat/simulation`

**Create:** `components/simulator/{sim-flow,sim-progress,sim-intro,module-step,routing-reveal,sim-results}.tsx`.

- `sim-flow`: renders by `simStep` (0 intro / 1,3,4,6 ModuleStep / 2,5 RoutingReveal / 7 results); the answer draft lives in the reducer (`simDraft`), not URL-synced; `simResult` commits at step 7.
- `sim-progress`: 7 dots for steps 1–7, hidden on the intro (resolves the spec's "7 dots vs 8 screens" mismatch); visually-hidden «Шаг N из 7».
- `module-step`: module card («27 вопросов · 32 минуты»), CorrectPicker = `RangeSlider` (correct answers) + presets («Почти всё» 25 / «Норм» 20 / «Тяжело зашло» 15; scaled for Math); on M2 — `RouteBadge` + ceiling caption, on easy the scale is visually truncated above the cap; 0 correct → soft info «Бывает. Смотри, что это значит для маршрута», never err. Every sub-component hoisted to module scope (`react-hooks/static-components` is an error).
- `routing-reveal`: phase machine `idle → travel → verdict → done` on a `setTimeout` chain with cleanup; the fill **width** animates (the marker rides its right edge — no measurement, no `left`/`transform`); threshold tick + caption «порог сложного модуля»; verdict badge «Сложный модуль 2» (success) / «Лёгкий модуль 2» (warning) enters via `transition-[opacity,translate]`; explanation alert — hard: «Экзамен решил: ты готов к сложным вопросам. Открыт полный диапазон до 800.», easy: «Модуль 1 не добрал до порога. Второй модуль будет легче, но потолок — около 630.»; a click on the container clears the timers and snaps to `done` (`transition-none`); `matchMedia('(prefers-reduced-motion: reduce)')` → straight to `done` (global CSS collapses transitions, but the JS timers must be short-circuited separately); «Дальше» receives focus. The `Alert` live region announces the verdict for free.
- `sim-results`: `StatGrid` of 4 MetricCards (R&W range, Math range, Total large, «Маршруты: 2/2 сложных» etc.), the biggest-loss line from `priorities()[0]` (e.g. «Ошибки в Math Module 1 стоили тебе дороже всего — они чуть не сбросили маршрут»), perfect-run ok alert «Идеальный проход. На реальном экзамене так же?», CTA row: primary «Покрутить в песочнице» (one atomic `transferSimToLab` dispatch: values + tab + a transient flag for step 6's alert) and secondary «Пройти ещё раз».

**Done when:** a full 0→7 run works; both reveals play ~2.5 s and skip on click; reduced-motion shows the final frame immediately; the easy M2 step shows the truncated scale; the transfer lands in the sandbox sliders with the tab switched; «Пройти ещё раз» resets cleanly.

### Step 6 — A/B + sharing · `feat/compare-share`

**Create:** `components/simulator/{use-transient-flag,delta-badge,compare-bar,scenario-card-a,share-button}.tsx`.
**Modify:** `lab.tsx` (2-column compare layout, deltas on the metrics, the «Перенесли твой результат из симуляции» alert), `url-state.ts` (key `a` = `rw1.rw2.ma1.ma2` dot-joined), `use-url-state.ts` (export `flushUrl()`).

- No toast system: `Alert` + a `useTransientFlag` hook (3 s, timer cleanup), rendered next to the trigger.
- `DeltaBadge`: `+40` green / `−60` red (typographic minus) / `0` neutral; the delta is **midpoint vs midpoint** (fixed in a comment so it isn't "fixed" later).
- CompareBar: secondary «Сравнить сценарии» → freeze into `frozenA`; in compare mode «Поменять местами» (B→A) and «Выйти из сравнения» (`frozenA = null`).
- «Поделиться» (ghost + `Link` icon): `flushUrl()` first (otherwise a 300 ms-stale URL gets copied), then `navigator.clipboard.writeText`; success — ok alert «Ссылка скопирована» for 3 s; denial/insecure context — a readonly `Input` with the URL, `select()` on focus.

**Done when:** freeze → edit B → deltas have the right sign/tone; swap and exit work; opening a URL with `a=` restores compare mode; «Поделиться» copies the current state; the clipboard-denied fallback is visible.

### Step 7 — polish · `feat/polish`

- Side-by-side audit against `/design-system`: radii/shadows/hovers/focus rings from kit tokens only; the SegmentedTabs and RangeSlider specimens look native on the showcase.
- Copy pass against §7: verbatim strings, no emoji, no formal «вы», «ёлочки» quotes and proper dashes, SAT terms in English.
- Mobile 390 px: `Cols` collapses, slider hit targets, tab wrapping, single-column StatGrid, the reveal track fits.
- A11y: tab keyboard nav, slider `aria-valuetext` («N ошибок»), focus management on step change, Alert live-region tones.
- **Local `pnpm build`** — CI never builds; an Inter fetch failure only shows in the build/dev log (synthetic `__Inter_` face, no exception).

**Done when:** a screenshot next to the kit reads as one design language; the 390 px walkthrough is clean; `make check` green; local `pnpm build` succeeds.

### Step 8 — deploy + README · `feat/deploy`

- README (EN): product, stack, engine model (approximation, calibration pending), the `make check` contract incl. `check:engine`, demo links for Loom (`/`, `/?tab=lab&…`, `/?tab=plan&target=1500`).
- Vercel: import the repo (Next 16 auto-detected), no env vars; before deploy — substitute the real `TRIAL_EXAM_URL` (ask Mickey). Run the prod URL through the spec §9 DoD, including a shared `a=` URL.

**Done when:** the prod URL passes the full manual DoD checklist, README is on `main`.

## Current state

> Updated after every step. This file is the primary tracker.

| Step | Branch | Status |
|---|---|---|
| 0 · Design system on main + plan in repo | `feat/design-system` | ✅ |
| 1 · Engine + check-engine | `feat/engine` | ✅ |
| 2 · Shell, tabs, provider, URL | `feat/shell-state` | ✅ |
| 3 · Sandbox (base) | `feat/sandbox` | ✅ |
| 4 · «Мой план» tab | `feat/plan` | ✅ |
| 5 · Simulation | `feat/simulation` | ✅ |
| 6 · A/B + sharing | `feat/compare-share` | ✅ |
| 7 · Polish | `feat/polish` | ✅ |
| 8 · Deploy + README | `feat/deploy` | ⬜ ← **we are here** |

Done so far: the kit (`components/ui`, `components/layout`, tokens, the
`/design-system` showcase, `check-utilities`, the Makefile contract) is on
`main` (`f9ede6a`, PR #1). The scoring engine (`lib/engine`,
`scripts/check-engine.ts`, `check:engine` wired into `make check`) is on
`main` (`983c8b0`, PR #2). The shell (`SegmentedTabs` primitive,
`SimulatorProvider` with `useReducer` + debounced URL sync, `StepTabs` roving
tabindex, placeholder tab panels wired to `scoreTotal`) is on `main`
(`603657b`, PR #3). The sandbox (`RangeSlider` primitive, per-section mistake
sliders, the live metrics panel with route badges, and contextual alerts
whose ceiling numbers are computed live via `scoreSection` rather than a
static value) is on `main` (`c12a4b9`, PR #4). The plan tab (`TargetPicker`
slider + preset pills, `BudgetCards` from `errorBudget()`, edge-case alerts
for 1600/≤800/unreachable, and the CTA to the trial exam) is on `main`
(`72af8e7`, PR #5). The simulation tab (the 0→7 exam-walkthrough stepper —
intro, module steps, two routing-reveal animations, and a results screen —
plus the `simStep`/`simDraft`/`simResult` reducer wiring and the handoff into
the sandbox) is on `main` (`50136f3`, PR #6). This step also finished
`priority-block.tsx`'s "has data" branch that Step 4 left as a stub, and
fixed the plan tab to prefer live lab data over a stale frozen simulation
result once the sandbox is touched. The A/B compare mode (freeze the sandbox
as scenario A via `FREEZE_COMPARE`, live `DeltaBadge`s on scenario B, swap
and exit controls, the `a=` URL param with silent fallback on malformed
values) and URL sharing (`flushUrl` flush-then-copy, the "Ссылка скопирована"
confirmation, the clipboard-denied readonly-input fallback, and the
transfer-from-simulation alert) are on `main` (`1130747`, PR #7). The polish
pass — audited against `/design-system` (tokens already conformant, no
changes needed), copy checked verbatim against spec §7/§3 (clean except one
already-documented deliberate deviation), a 390px walkthrough, and an
accessibility pass — found and fixed three real issues: a dangling
`aria-controls`/`role="tabpanel"` wiring gap between `StepTabs` and its three
panels, wrong Russian pluralization ("1 ошибок") in the frozen A/B scenario
card, and the `StepTabs` pill row overflowing the page horizontally at 390px
(now scrolls within its own pill). `pnpm build` and `make check` are both
green. Committed directly to `main` (`265dfe4`), no PR for this step.

## Risks (what bites at each step)

- `check-utilities.mjs` fails stock utilities (`bg-blue-*`, bare `shadow`, `rounded-2xl`) → steps 3 and 5 (slider/reveal styling) — kit tokens only.
- `transform`-only transitions animate nothing → steps 3 (pulse) and 5 (badge).
- A new `--text-*` token requires editing `lib/utils.ts` → don't mint any.
- `react-hooks/static-components` is an error → step 5, all sub-components at module scope.
- ESLint (arrow-only, types-before-values, perfectionist) applies to `scripts/*.ts` too → step 1.
- `lint` has no `--max-warnings` → read the ESLint output, not just the exit code.
- URL debounce vs «Поделиться» → step 6, `flushUrl()`.
- CI never builds; a font failure is silently green → step 7, local `pnpm build`.

## Verification

Each step closes with its "Done when" + `make check` before the PR. The engine
is verified by the executable `check-engine.ts` (references + monotonicity sweep
+ budget round-trip) on every CI run. UI steps are verified in the browser via
the dev preview (`pnpm dev` from `.claude/launch.json`): tab switching, slider
drags, a full simulation run, URL restore, 390 px. The finale is a manual pass
of the spec §9 DoD checklist on the prod URL.
