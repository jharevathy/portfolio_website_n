# Page-Specific Design System: Home & GenAI Portfolio

> **PARENT:** Inherits from `design-system/genai-portfolio/MASTER.md`
> **OVERRIDE FOCUS:** Tactical Dark Minimalist (Deep Obsidian, Hairline Borders, GenAI Telemetry, GitHub Pages Compatible)

---

## 1. Color Tokens (Tactical Dark Minimalist)

```css
:root {
  --bg-primary: #08090B;          /* Deep obsidian canvas */
  --bg-surface: #0E1015;          /* Card & compartment surface */
  --bg-surface-elevated: #14171E; /* Hover & active panel */
  --bg-surface-subtle: #181C24;   /* Nested code / metrics box */
  
  --border-hairline: rgba(255, 255, 255, 0.08); /* 0.5px / 1px crisp technical border */
  --border-focus: #00E5FF;                       /* Active focus / hover accent */
  --border-subtle: rgba(255, 255, 255, 0.04);
  
  --text-primary: #F3F4F6;        /* High-contrast crisp foreground */
  --text-secondary: #9CA3AF;      /* Technical metadata & descriptions */
  --text-muted: #6B7280;          /* Monospace indices & timestamps */
  
  --accent-cyan: #00E5FF;         /* Primary signal: Agent state & inference */
  --accent-emerald: #10B981;      /* Telemetry: Online status, benchmark wins */
  --accent-violet: #818CF8;       /* Neural/RAG pipeline diagrams */
  --accent-amber: #F59E0B;        /* Warnings / experimental model tags */
  
  --noise-opacity: 0.035;         /* Analog tactile film grain */
}
```

## 2. Typography Rules
- **Display Headings (`h1`, `h2`):** `Space Grotesk`, sans-serif (700/800 weight, tight letter-spacing `-0.03em`).
- **Body & Long-form Content (Blog & About):** `Inter`, sans-serif (400/500 weight, line-height `1.65`, max measure `68ch`).
- **Technical Metadata, Labels, Metrics & Code:** `JetBrains Mono`, monospace (400/500 weight, uppercase tracking `+0.05em`).

## 3. GitHub Pages Architecture
- Fully static, dependency-free runtime.
- CDN-loaded modern libraries:
  - **Tailwind CSS v3 CDN** with custom theme config
  - **Three.js** (for interactive Neural Latent Space background canvas)
  - **GSAP + ScrollTrigger** (for smooth stagger reveals & pinned window metrics)
  - **Marked.js + Prism.js** (for client-side fast markdown blog rendering with syntax highlighting)
  - **Lucide Icons** (clean SVG vectors, zero emojis)
- Direct relative pathing (`./`) ensuring seamless deployment to `https://<username>.github.io/<repo>/`.
