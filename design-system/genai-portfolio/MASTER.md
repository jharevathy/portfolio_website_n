# Design System — White & Gold Swarm

The portfolio's visual language. Tokens live at the top of the `<style>` in
`index.html` and in `blog/blog.css` (the same values in both).

## Principles

1. **The swarm is the stage.** One fixed WebGL particle field sits behind
   everything. It re-forms for each homepage section, flows between patterns
   in the Library and dims to slow dust behind a blog.
2. **Text always wins.** Every block of text sits on liquid glass. Reading
   surfaces (`.paper`) use a darker, more solid tint so long text stays crisp.
3. **Gold is earned.** Gold foil marks the one phrase that matters in a
   heading, active states, counts and celebrations. Everything else is white
   on ink.
4. **One orchestrated moment per surface.** The intro on the homepage, the
   pattern flow in the Library, the honours celebration. Everything else is
   quiet, and everything collapses to a still state under
   `prefers-reduced-motion`.

## Colour

| Token          | Value                      | Use                               |
|----------------|----------------------------|-----------------------------------|
| `--ink`        | `#05060a`                  | Page and stage background         |
| `--paper`      | `#eef0f3`                  | Headings, primary text            |
| `--paper-2`    | `#a9afba`                  | Body copy, descriptions           |
| `--paper-3`    | `#858c98`                  | Meta, labels                      |
| `--accent`     | `#f3c68c`                  | Gold: interaction and emphasis    |
| `--hair`       | `rgba(255,255,255,.09)`    | Hairline dividers                 |
| `--hair-2`     | `rgba(255,255,255,.16)`    | Control outlines                  |

Particle ramp (shader): white `#fff7ed` → champagne `#ffdb9e` → gold
`#fab354` → amber `#e67529`.

Gold foil (`.foil`, `.gold`): a moving gradient
`#b9823a → #f3c68c → #fff3dc → #e9b467 → #b77a33 → #f7d49c → #fff1d4 → #c98d42`
clipped to text.

## Type

| Role     | Family           | Notes                                         |
|----------|------------------|-----------------------------------------------|
| Display  | Anton 400        | Uppercase, line-height .86–.98                |
| Body     | Hanken Grotesk   | 400/500/600, 17px base, 18.5px in blogs       |
| Labels   | JetBrains Mono   | 11–12px uppercase, +0.14em tracking           |

## Surfaces

- `.glass`: noise + top-lit gradient + `backdrop-filter: blur(16px)
  saturate(150%)`, a gold-lit engraved edge (`::before`) and a pointer-tracked
  sheen (`::after`). Radius 22px.
- `.paper`: `.glass` with `--read-tint` for long reading.
- Rules: `.rule` is an engraved gold line with a diamond.

## Components

Buttons (`btn--solid` white pill with gold fill sweep, `btn--ghost`), `chip`,
`card` (blog card with generated gold cover), `feature` (newest blog),
`honours` rows with seals and the gold-foil burst, `takeaways`, `pull` quote,
`callout`, `codeblock` with Copy, `toc` with minutes left, `nextprev`.

## Motion

- Easing: `--ease-out` `cubic-bezier(.16, 1, .3, 1)`; no bounce.
- Swarm: morphs stagger per particle with a gentle arc; trails use a
  frame-rate independent fade; bloom at quarter resolution.
- Celebration: gold-leaf flakes that flash as they turn, a few glints and one
  thin ring, about 1.5 seconds, once per visit plus on hover and click.
- Reduced motion: swarm slows to 30%, no trails, no intro, no bursts.
