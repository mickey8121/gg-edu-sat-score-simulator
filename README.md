# gg-edu-sat-score-simulator

SAT score simulator for Global Generation. Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4.

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
