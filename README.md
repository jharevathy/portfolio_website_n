# Applied GenAI & Agentic Systems Portfolio

A tactical dark minimalist personal portfolio website engineered specifically for **Applied Generative AI & Agentic Systems Architects**. Inspired by the high-craft tactical aesthetics of Merkur Design and optimized for instantaneous deployment on **GitHub Pages**.

---

## ⚡ Core Features

- **Tactical Dark Minimalist Aesthetic:** Deep obsidian canvas (`#08090B`), razor-thin 0.5px/1px borders, subtle analog noise film grain overlay, and high-contrast monospace telemetry.
- **Interactive 3D Latent Space Canvas:** Real-time Three.js 3D network visualizing agentic synapses and latent space nodes with cursor gravity interaction and click-pulse impulse waves.
- **Architectural Capabilities Matrix (OS Window Style):** Tabbed inspection of Agentic Orchestration, Graph-RAG Retrieval, Continuous Evaluation & Guardrails, and High-Throughput Inference Serving.
- **Proven Systems Showcase (`SYS-001` — `SYS-004`):** Production case studies indexed in tactical monospace with quantifiable SLAs (P95 latency, recall benchmarks, token cost savings).
- **Dedicated Interactive Resume Section:** Complete chronological experience, foundations, technical matrix, and a one-click **Print / Download PDF** action with print-optimized CSS.
- **Client-Side Markdown Blog Engine:** Real-time category filtering, instant keyword search, and a slide-over full-screen reader with syntax highlighting, KaTeX math rendering, and deep link URL hashes (`#blog/multi-agent-architectures`).
- **Tactical Contact Terminal:** Direct terminal interface with one-click clipboard copying and direct social links.

---

## 🚀 1-Minute GitHub Pages Deployment

Because this project is built with **100% pure static web standards** (Tailwind CDN, Three.js, Marked.js, vanilla JavaScript):

1. **Push this folder to a GitHub repository:**
   ```bash
   git init
   git add .
   git commit -m "feat: initial genai portfolio deployment"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub.
   - Click **Settings** → **Pages** (in the left sidebar).
   - Under **Build and deployment > Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and `/ (root)`.
   - Click **Save**.

Your portfolio will be live at:
`https://<your-username>.github.io/<your-repo-name>/` (or `https://<your-username>.github.io/` if using a user page).

---

## ✍️ How to Add or Edit Blog Posts

Open `js/blogs-data.js` and add or modify items in the `window.BLOG_POSTS` array:

```javascript
{
  id: "your-article-slug",
  title: "Your Article Title",
  slug: "your-article-slug",
  category: "Agent Architectures", // or "RAG & Retrieval", "Evaluation & Safety", etc.
  date: "NOV 2026",
  readTime: "5 MIN READ",
  summary: "Brief synopsis displayed on the card preview.",
  tags: ["LangGraph", "Multi-Agent", "System Design"],
  content: `
### Your Heading

Write standard **Markdown** here! Code blocks, bullet points, and math are supported:

\`\`\`python
def agent_loop():
    print("Agent active")
\`\`\`
  `
}
```

---

## 🎨 Design System Tokens

Detailed design guidelines and architectural tokens are stored in:
- `design-system/genai-portfolio/MASTER.md`
- `design-system/genai-portfolio/pages/home.md`
