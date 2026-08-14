# gg-edu-sat-score-simulator

SAT score simulator for Global Generation, built on the client's SAT Portal UI kit.

## Stack

- [Next.js](https://nextjs.org) 16.3.0 (App Router), React 19.2.8
- TypeScript 5, strict mode
- Tailwind CSS 4 (via `@tailwindcss/postcss`), CSS-first — there is no `tailwind.config`
- `class-variance-authority` + `clsx` + `tailwind-merge` for component variants
- `lucide-react` for icons
- Inter via `next/font/google`, self-hosted at build time
- pnpm 10.13.1 (single package, no workspace)

## Map

- `app/` — Next.js App Router: `layout.tsx`, `page.tsx`, `globals.css`
- `app/design-system/` — the UI-kit route: every component, variant and state, from real code
- `components/ui/` — design-system primitives (Button, Badge, Input, Card, Alert, …)
- `components/layout/` — page shell (PageContainer, Section, Hero, StickyNav, SiteFooter)
- `lib/utils.ts` — `cn()`
- `docs/design-system.md` — the design system's decision record
- `scripts/check-utilities.mjs` — CI guard, run by `make check`
- `public/` — static assets (favicon)

## Commands

The `Makefile` is the contract the harness reads — target *names* are the
interface, the recipes behind them are this project's business. The hooks and
skills never invoke a package manager directly.

| Target | What it runs | Who calls it |
|---|---|---|
| `check-file FILE=<path>` | ESLint on a single file | the `post-edit` hook, after every edit |
| `check` | `pnpm run lint` (ESLint across the project) | `/ship` and CI |

Day-to-day commands that are not part of the contract:

- `pnpm dev` — start the Next.js dev server
- `pnpm build` — production build
- `pnpm start` — run the production build

## Conventions

How this project *writes* things is decided once and written down under
`.claude/rules/`, read at a declared path and authoritative where it applies.
A rules file that exists governs alone: the skill reading it does not fall back
to imitating neighbouring code, and where the file and the tree disagree the
file wins and the disagreement is reported rather than reconciled.

- `api.md` via `/api-rules` — not yet written.
- `llm.md` via `/llm-rules` — not yet written.

These files are owned by a human. A skill may draft one and must show the whole
draft first; nothing lands without an explicit yes.

## Module style

Two rules, enforced by ESLint where the tooling allows:

- **Order inside every module: imports → types → values.** Every `type` and
  `interface` sits above the first value, not next to the component that uses it.
  Referring forward (`VariantProps<typeof buttonVariants>`) is fine — type
  positions hoist.
- **Components are arrow functions.** So is every other function: `func-style`
  bans the declaration form outright. Default-exported pages read
  `const Page = () => {…}; export default Page;`.

Imports are grouped builtin → external → internal (`@/…`) → relative → style,
one blank line between groups, alphabetical inside a group. `eslint --fix`
sorts them; don't do it by hand.

**What is not enforced:** `perfectionist/sort-modules` cannot see arrow
functions — it only classifies `function` declarations — so once rule 2 makes
every component a `const`, nothing machine-checks the *ordering among values*.
The `no-restricted-syntax` selector in `eslint.config.mjs` covers the part that
matters (no type may follow a value) and is not autofixable. Group related
values by hand.

## Hard conventions

Full reasoning in `docs/design-system.md`. The short version — none of these are
accidents, do not "fix" them:

- **`app/globals.css` clears `--color-*`, `--radius-*` and `--shadow-*`, then redefines
  them.** Tailwind v4's oklch palette is not the kit's v3 hex (`green-500` renders
  `#00c950`, not `#22c55e`). So `rounded-2xl`, bare `shadow`, `shadow-lg` and every stock
  color utility emit **nothing** — by design. Use the project's tokens.
- **Radius is `sm` 10 / `md` 12 / `lg` 16 / `xl` 20px**, not Tailwind's. Pills use
  `rounded-full`.
- **Never name a token in both `--color-*` and `--text-*`.** The color wins silently and
  the font size is never emitted. This is why the kit's `--body` is `--color-copy` here.
- **`components/ui/` has no `"use client"`.** Every primitive is a Server Component. If a
  component needs state, lift the state — don't move the primitive.
- **`cn()` keeps its `extendTailwindMerge` config.** Stock `twMerge` drops the font size
  from `text-display text-ink`.

## Gotchas

- `make check-file FILE=<path>.css` prints `File ignored because no matching configuration
  was supplied` and exits **0**. Expected noise on every CSS edit, not a failure.
- CI runs `make check` only — it never builds. `next build` reaches `fonts.googleapis.com`
  for Inter, so a font failure stays green in CI and surfaces at deploy. Run `pnpm build`
  locally when touching fonts.
- A failed font fetch in dev does **not** throw. The loader logs `Failed to download 'Inter'`
  and returns a synthetic face still named `__Inter_` — read the dev-server log rather than
  inspecting computed `font-family`.
- `"lint": "eslint"` has no `--max-warnings`, so warnings accumulate invisibly. Read the
  output, not just the exit code.
- `react-hooks/static-components` is an **error**: never define a helper component inside a
  page component. Hoist it to module scope.
- `not-disabled:` is a no-op on `<a>` — `ButtonLink` relies on the `aria-disabled:` twin.
- **Never transition `transform` alone.** Tailwind v4's `translate-*` / `scale-*` / `rotate-*`
  compile to the standalone `translate` / `scale` / `rotate` properties, so a `transform`-only
  transition animates nothing and the element jumps. Include `translate` and `scale`, or use
  `transition-transform` (which expands to all four).
