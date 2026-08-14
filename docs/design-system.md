# Design system — Global Generation SAT Portal

The app's visual foundation, ported from the client's UI kit
(`UI-кит и дизайн-система - Global Generation.html`).

Live reference: **`/design-system`** — every component, variant and state, rendered from the real
code. Treat it as the regression surface: there is no test runner, so a visual diff against that
route is how you catch breakage.

## The one thing to know first

**The kit is a Tailwind v3-era artifact.** Tailwind v4 ships an oklch palette at raised chroma that
resolves to visibly different colors — `green-500` becomes `#00c950` instead of the kit's `#22c55e`,
`red-500` becomes `#fb2c36` instead of `#ef4444`, and every slate step from 300 down shifts.

So `app/globals.css` **clears `--color-*`, `--radius-*` and `--shadow-*` entirely** and redefines
them with the kit's literal hex. Corroboration that the kit is v3: its own shadow tints are raw v3
palette entries (`rgba(2,6,23,…)` = v3 slate-950, `rgba(8,47,73,…)` = v3 sky-950).

## Consequences you will hit

Clearing those namespaces removes utilities **silently** — Tailwind drops unknown classes without
error and ESLint cannot see class validity. These now emit nothing:

- `rounded-xs`, `rounded-2xl`, `rounded-3xl`, `rounded-4xl`, bare `rounded`, and all their
  corner/side forms
- bare `shadow`, `shadow-2xs`, `shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`,
  `shadow-2xl`
- every stock color family — `bg-blue-500`, `text-zinc-400`, `border-gray-200`, ~250 utilities

`make check` runs `scripts/check-utilities.mjs`, which compiles `app/globals.css` through the repo's
own Tailwind and fails on any class in `app/`, `components/` or `lib/` that emits nothing here but
exists in stock Tailwind. That is the safety net. Do not weaken it.

## Scales

| | Values |
|---|---|
| Radius | `sm` 10px · `md` 12px · `lg` 16px · `xl` 20px · `rounded-full` for pills |
| Shadow | `soft` panels · `card` cards · `lift` hover · `brand` / `brand-lg` primary button glow |
| Type | `display` 40/800 · `title` 26/800 · `stat` 30/800 · `lead` 18/400 · `card-title` 17/800 · `body` 16/400 · `field` 15/400 · `ui` 14.5/700 · `body-sm` 14 · `caption` 13 · `badge` 12.5/700 · `eyebrow` 12.5/800 · `sub` 11.5/800 · `micro` 11 |
| Ring | bare `ring` = the kit's `0 0 0 3px rgb(0 156 220 / .15)` |
| Gradients | `gradient-brand`, `gradient-hero`, `text-gradient-hero` |

Type tokens carry paired weight, tracking and line-height, so `text-display` alone produces all four
properties. Note `--text-<n>--tracking` is **silently ignored** by Tailwind — the working key is
`--text-<n>--letter-spacing`.

Spacing stays on Tailwind's 4px grid. The kit's padding is systematically off-grid (`7px 13px`,
`11px 14px`), so **components own odd numbers as arbitrary values inside their cva definition;
application code stays on the grid.**

## Motion

The kit declares transitions in exactly three places, and all three resolve to **`ease`** —
the button states it, the other two omit the timing function and inherit CSS's initial value:

| Component | Property | Duration | Easing |
|---|---|---|---|
| Button | `transform`, `box-shadow`, `background-color` | `.12s`, `.2s`, `.2s` | `ease` |
| Card | `transform`, `box-shadow` | `.18s` | `ease` |
| Input / Select / Textarea | `border-color`, `box-shadow` | `.2s` | `ease` |

Paired with two hover lifts: button `translateY(-1px)`, card `translateY(-3px)` + `shadow-lift`.
Nothing else in the kit animates.

**Trap 1 — the curve.** Omitting the timing function in plain CSS gives you `ease`, but Tailwind's
`transition-*` utilities always write `--default-transition-timing-function`. That token is
therefore set to `ease` in `@theme` — without it, cards and fields silently animate on Material's
`cubic-bezier(0.4, 0, 0.2, 1)` while the button (which pins `ease` in an arbitrary shorthand) does
not, and the two drift apart.

**Trap 2 — never transition `transform` alone.** Tailwind v4 compiles `-translate-y-px` to the
standalone **`translate`** property (and `scale-*`/`rotate-*` likewise), not to `transform`:

```css
.-translate-y-px { --tw-translate-y: -1px; translate: var(--tw-translate-x) var(--tw-translate-y); }
```

A transition listing only `transform` therefore animates nothing and the element jumps. Any
hand-written property list must include `translate` (and `scale`) — which is exactly what
Tailwind's own `transition-transform` expands to: `transform, translate, scale, rotate`. Prefer
`transition-transform` when one duration covers everything; spell the list out only when
per-property durations are needed, as on Button.

Button keeps the arbitrary `[transition:…]` shorthand because it needs **three different durations
on three properties**, which Tailwind's utilities cannot express.

## Rules that are not obvious

- **Never give the same name to a `--color-*` and a `--text-*` token.** The color wins silently —
  `text-body` would emit `color:` and never `font-size:`. This is why the kit's `--body` became
  `--color-copy`.
- **`cn()` must keep its `extendTailwindMerge` config** (`lib/utils.ts`). Stock `twMerge` reads
  `text-display` as a text color and drops the font size from `text-display text-ink`.
- **`components/ui/` has no `"use client"` and that is load-bearing.** Every primitive is a Server
  Component; the kit's interactivity is native (`<input>`, `<select>`, CSS `:hover`). The first
  directive added to `button.tsx` pulls its whole subtree client-side on every static page. If a
  component needs state, lift the state — don't move the primitive.
- **Gradient utilities are named `gradient-*`, not `bg-*`.** tailwind-merge's `bg-color` group
  matches any `bg-…` string, so `bg-brand-gradient bg-white` would silently delete the gradient.
- Light theme only. `dark:` is repointed at `[data-theme="dark"]` so a stray `dark:` class cannot
  fire off the visitor's OS setting. A future dark palette is a `[data-theme="dark"] { … }` block
  redefining the surface/ink tokens — no change to the utilities.

## Deliberate departures from the kit

| What | Why |
|---|---|
| **Icon geometry** | `lucide-react` matches only 1 of the kit's 12 icons (`check`). The kit was drawn against lucide ~0.2xx, which 1.x redrew — `target` is r=10/6/2 vs the kit's 9/5/1. Accepted for one icon source and unlimited coverage. To restore exact fidelity, hand-roll the kit's 20 paths; no component changes. |
| **Button focus outline** | The kit gives buttons no focus style, and its 15%-alpha ring is 1.15:1 — illegal as a sole indicator. Buttons get a 2px opaque `#009CDC` outline (3.09:1). Fields keep the kit's ring, which is legal because the border also goes brand. |
| **`:focus` → `:focus-visible`** | The kit's `:focus` fires on mouse click. |
| **`warn` alert tone** | The kit ships `--warn` and `.b-amber` but no amber alert. Built by applying the `ok` alert's exact construction to `--warn` — no new values. |
| **Empty state / sub-label text** | Moved from slate-400 (2.36:1) to `--muted` (4.76:1). |
| **`hover:` is inside `@media (hover: hover)`** | Tailwind's default. The kit's hover lift will not fire on touch — an improvement, but a visible delta in a side-by-side on a tablet. |

## Open question for the designer

The kit's `.field label` is **13px/700**, but its own type-scale row says field labels are
**14px/600**. The components follow the component (13/700). Only the designer can say which was
intended.
