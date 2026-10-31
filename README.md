# Nikhil Salunke — Portfolio

A static, single-page portfolio for an applied AI engineer. A WebGL particle
swarm forms a sphere in the hero and re-forms into a different shape for every
section as you scroll; all reading content sits on frosted-glass panels so the
swarm stays visible but never competes with the text.

No build step — plain HTML, CSS and JavaScript, ready for GitHub Pages.

---

## Structure

```
index.html            Page markup and all copy
css/style.css         Design tokens + components (graphite / ice-blue)
js/swarm.js           WebGL particle swarm (Three.js r128)
js/app.js             Navigation, reveals, diagrams, writing list + reader
js/blogs-data.js      Articles (Markdown)
design-system/        Design system reference
```

## Swarm formations

Each `<section>` declares which shape the swarm takes with `data-formation`:

| # | Section    | Shape                                   |
|---|------------|-----------------------------------------|
| 0 | Hero       | Sphere                                  |
| 1 | Work       | Agent network — hubs joined by links    |
| 2 | Expertise  | Four orbiting clusters                  |
| 3 | Experience | Double helix                            |
| 4 | Approach   | Torus (the feedback loop)               |
| 5 | Writing    | Calm wave plane                         |
| 6 | Contact    | Spiral galaxy                           |

Shapes hold while a section is being read and morph across section boundaries.
All animation runs in the vertex shader. The swarm pauses when the tab is
hidden or the article reader is open, honours `prefers-reduced-motion`
(still shapes, no drift), and the page works without WebGL.

## Editing content

All copy lives in `index.html`, grouped by clearly commented sections.

- **Projects** — each `<article class="project">`. The architecture diagram is
  generated from its `data-flow` attribute: columns separated by `>`,
  parallel nodes by `,`. Add `data-loop` to draw a feedback arc.

  ```html
  <div class="diagram" data-flow="Query > Dense, Graph, ColBERT > Reranker > Top‑5"></div>
  ```

- **Experience** — each `<li class="role">` in the timeline.
- **Articles** — add objects to `window.BLOG_POSTS` in `js/blogs-data.js`
  (`id`, `slug`, `title`, `category`, `date`, `readTime`, `summary`, `tags`,
  `content` in Markdown). Filter categories must match the `data-category`
  values of the filter buttons. Articles deep-link as `#blog/<slug>`.
- **Download CV** prints the Experience section through a dedicated print
  stylesheet (save as PDF from the print dialog).

## Deploy to GitHub Pages

1. Push to GitHub.
2. **Settings → Pages → Build and deployment → Deploy from a branch**, choose
   your branch and `/ (root)`.

## Dependencies (CDN)

- Three.js r128 — cdnjs
- Marked 12.0.2 — jsDelivr
- Geist, Geist Mono, Instrument Serif — Google Fonts
