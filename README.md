# Score Strategist — gg-edu-sat-score-simulator

**Live: [gg-edu-sat-score-simulator.vercel.app](https://gg-edu-sat-score-simulator.vercel.app)**

SAT score simulator for Global Generation. Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4.

---

## English

### What it is

**Score Strategist** is an interactive Digital SAT score simulator. The Digital SAT is
adaptive — Module 2 of each section is served in an "easy" or "hard" version depending on how
many questions you get right in Module 1, and that routing caps how high your final score can
go. Most students never see this mechanic explained; Score Strategist makes it tangible by
letting you play with mistake counts and watch the score, the routing, and the score range
react live.

The whole app is a single page with three tabs, fully client-side (no backend, no database) —
state lives in the URL, so any configuration can be bookmarked or shared as a link.

### Features

- **Симуляция (Simulation)** — a guided, module-by-module walkthrough of a full exam. Pick how
  many questions you get right in each module, watch the Module 1 → Module 2 routing reveal
  play out (with a plain-language explanation of *why* you got routed there), and land on a
  results screen with your score range and the single mistake that cost you the most.
- **Песочница (Sandbox)** — free-form sliders for mistakes in each section/module, with the
  score, score range, and routing recalculating instantly. Includes:
  - **A/B scenario comparison** — freeze your current setup as scenario A, keep tweaking as
    scenario B, and see per-metric deltas (+/− points) between the two.
  - **Share link** — copies the current scenario (including a frozen A/B comparison) to the
    clipboard as a URL; opening that URL reproduces the exact same setup.
- **Мой план (My Plan)** — the inverse problem: pick a target total score and get an error
  budget — how many mistakes you can afford per section (and specifically in Module 1, without
  losing the hard-module routing) — plus a priority list of which section to shore up first,
  driven by live results from the other two tabs.

### How to use

1. Open the [live app](https://gg-edu-sat-score-simulator.vercel.app).
2. Start on **Симуляция** to experience a full exam walkthrough and see how routing works.
3. Switch to **Песочница** to explore freely: drag the mistake sliders per section and watch
   the score/routing update live. Use **Сравнить сценарии** to freeze a baseline and compare it
   against changes, then **Поделиться** to copy a link to your current setup.
4. Switch to **Мой план**, set a target score, and read the error budget and priority
   recommendations for what to practice first.

All scoring is an approximation based on public Digital SAT scoring guidance, not an official
College Board tool.

## Русский

### Что это

**«Стратег балла»** — интерактивный симулятор балла Digital SAT. Digital SAT — адаптивный
экзамен: второй модуль каждой секции выдаётся в «лёгкой» или «сложной» версии в зависимости от
того, сколько вопросов решено правильно в первом модуле, — и от этого маршрута зависит потолок
итогового балла. Большинству учеников этот механизм никто не объясняет; «Стратег балла» делает
его наглядным — можно менять количество ошибок и в реальном времени смотреть, как меняются
балл, маршрут и диапазон возможного результата.

Всё приложение — одна страница с тремя вкладками, полностью на клиенте (без бэкенда и базы
данных): состояние хранится в URL, поэтому любую конфигурацию можно сохранить в закладки или
отправить ссылкой.

### Функции

- **Симуляция** — пошаговое прохождение полного экзамена по модулям. Указываешь, сколько
  вопросов решено верно в каждом модуле, смотришь анимацию маршрутизации между Module 1 и
  Module 2 (с объяснением, почему экзамен направил именно туда), и в конце — экран результатов
  с диапазоном балла и указанием, какая именно ошибка стоила дороже всего.
- **Песочница** — свободные ползунки ошибок по каждой секции/модулю: балл, диапазон и маршрут
  пересчитываются мгновенно. Внутри:
  - **Сравнение сценариев A/B** — заморозить текущую настройку как сценарий A, продолжить
    менять сценарий B и увидеть разницу по каждой метрике (+/− баллов) между ними.
  - **Ссылка на сценарий** — копирует текущий сценарий (включая замороженное сравнение A/B) в
    буфер обмена в виде URL; переход по этой ссылке воспроизводит ту же настройку.
- **Мой план** — обратная задача: задаёшь целевой итоговый балл и получаешь бюджет ошибок —
  сколько ошибок допустимо в каждой секции (и отдельно в Module 1, чтобы не потерять маршрут в
  сложный модуль) — плюс список приоритетов, что подтянуть в первую очередь, на основе
  результатов с двух других вкладок.

### Как пользоваться

1. Открыть [приложение](https://gg-edu-sat-score-simulator.vercel.app).
2. Начать с вкладки **Симуляция**, чтобы пройти полный экзамен и увидеть, как работает
   маршрутизация.
3. Перейти в **Песочницу** для свободного исследования: двигать ползунки ошибок по каждой
   секции и наблюдать за live-пересчётом балла и маршрута. Кнопка **«Сравнить сценарии»**
   замораживает текущий сценарий как базу для сравнения, **«Поделиться»** копирует ссылку на
   текущую настройку.
4. Перейти в **Мой план**, задать целевой балл и посмотреть бюджет ошибок и приоритеты, с чего
   начать подготовку.

Расчёт балла — приближение на основе публичных данных о шкале Digital SAT, а не официальный
инструмент College Board.

---

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Design system

The app is built on the Global Generation SAT Portal UI kit. Read
[`docs/design-system.md`](docs/design-system.md) **before writing UI** — the Tailwind theme clears
and redefines the stock color, radius and shadow namespaces, so utilities like `rounded-2xl`,
`shadow-lg` and `bg-blue-500` deliberately emit nothing.

Every component, variant and state renders at [`/design-system`](http://localhost:3000/design-system).
That route is the visual regression surface.

## Checks

```bash
make check
```

Runs ESLint, `tsc --noEmit`, and `scripts/check-utilities.mjs` — which fails the build on any class
that compiles to nothing under this project's theme. `make check-file FILE=<path>` lints one file.

Typography comes from Inter via `next/font/google`, self-hosted at build time.
