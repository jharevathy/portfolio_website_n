# Design System — Graphite & Ice

The single source of truth for the portfolio's visual language. Tokens are
defined at the top of `css/style.css`; this file explains how to use them.

## Principles

1. **One surface.** Every block of text sits on the same glass panel
   (`.glass`). No glass on glass — inner areas use a flat `--well`.
2. **One accent.** Ice blue `#7CC4FF` marks interaction and emphasis only:
   links, indices, active states, diagram flow. Never decorative gradients.
3. **Text always wins.** The swarm dims in reading sections; panels keep
   body copy above 4.5:1 contrast regardless of what moves behind them.
4. **Calm motion.** Long, eased transitions (`--ease-out`), no bounce, and
   everything collapses to a still state under `prefers-reduced-motion`.

## Colour

| Token          | Value                      | Use                             |
|----------------|----------------------------|---------------------------------|
| `--bg`         | `#07080A`                  | Page background                 |
| `--text`       | `#F2F4F7`                  | Headings, primary text          |
| `--text-2`     | `#A3A9B4`                  | Body copy, descriptions         |
| `--text-3`     | `#8A92A0`                  | Meta, labels                    |
| `--accent`     | `#7CC4FF`                  | Interaction & emphasis          |
| `--line`       | `rgba(255,255,255,.08)`    | Hairline dividers               |
| `--line-2`     | `rgba(255,255,255,.14)`    | Control outlines                |

## Glass

`.glass` = tinted fill (`--glass-fill`) + `backdrop-filter: blur(8px)
saturate(170%)` + gradient hairline edge (`::before`) + top gloss and a
pointer-tracked spotlight (`::after`). The blur is deliberately light so the
swarm reads through as soft, out-of-focus light. Falls back to an opaque fill
where `backdrop-filter` is unsupported.

## Type

| Role        | Family            | Notes                                       |
|-------------|-------------------|---------------------------------------------|
| Display/H   | Geist 500         | Tight tracking (−0.035 to −0.045em)         |
| Accent word | Instrument Serif  | Italic, one phrase per heading, `<em>`      |
| Body        | Geist 400         | 16–20px, line-height 1.55–1.6               |
| Labels      | Geist Mono 500    | 12px uppercase, +0.08em tracking            |

Scale: `--fs-display`, `--fs-h2`, `--fs-h3`, `--fs-h4`, `--fs-lead`,
`--fs-body`, `--fs-sm`, `--fs-xs`, `--fs-label` (all fluid via `clamp`).

## Shape & space

- Radii: `--r-xl` 32 (section panels), `--r-lg` 24 (cards), `--r-md` 16,
  `--r-sm` 10, `--r-pill`.
- Container 1240px, gutter `clamp(20px, 4vw, 48px)`, card gap `--stack`,
  section padding `--section-y`.

## Components

`btn--primary` (white pill), `btn--ghost` (outlined glass pill), `chips`,
`tag--accent`, `section-head`, `project` (+ generated `diagram`),
`capability`, `timeline`/`role`, `step`, `post`, `drawer` + `prose`, `toast`.

## Checklist

- [ ] Text on glass ≥ 4.5:1; focus ring visible (`:focus-visible`)
- [ ] Works at 375, 768, 1024, 1440+; no horizontal scroll
- [ ] Reduced motion: no reveals, no drift, diagram flow hidden
- [ ] All interactive elements are real `<a>` or `<button>`
