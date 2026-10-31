# Nikhil Salunke — Portfolio

A single-page portfolio built around a white-and-gold 3D particle swarm that
re-forms for every section as you scroll. Plain HTML, CSS and JavaScript, no
build step, ready for GitHub Pages.

## Structure

```
index.html          The live site (markup, styles and the WebGL swarm engine)
concept/index.html  The annotated review version of the design (scene captions + design primitives)
design-system/      Design notes
```

## Scenes

| # | Section | Swarm |
|---|---------|-------|
| 01 | Hero | Name forms from particles, then an exact rotating sphere |
| 02 | Thesis | Trefoil knot |
| 03 | Selected work | Orbit rings; each project is a body you can fly to |
| 04 | Skills | Spiral galaxy; each skill domain is a star cluster |
| 05 | Watch a query think | Vector space playing a RAG pipeline as you scroll |
| 06 | Journey | Twisting stream with a ring per milestone |
| 07 | Proof & writing | Rolling terrain |
| 08 | Contact | Eclipse ring with outward gold waves |

Rendering: additive points with motion trails, a quarter-resolution bloom pass,
depth-of-field bokeh, and cursor ripples. Honours `prefers-reduced-motion`
(slower swarm, no intro or ripples) and falls back to a static page without WebGL.

## Publish on GitHub Pages

Settings → Pages → Build and deployment → **Deploy from a branch** → choose the
branch and `/ (root)` → Save. Free for public repositories.

## Dependencies (CDN)

Three.js r128 (cdnjs), Lenis 1.1.13 (unpkg), Anton / Hanken Grotesk /
JetBrains Mono (Google Fonts).
