# Nikhil Salunke — Portfolio

A portfolio built around a white-and-gold 3D particle swarm that re-forms for
every section as you scroll, with a blog you write in plain text files.
Plain HTML, CSS and JavaScript, ready for GitHub Pages.

## Write a blog (Notepad++ is all you need)

1. Copy `blog/posts/_TEMPLATE.txt`, write your blog in Notepad++, and save it
   with a short lowercase name, for example `rag-chunking.txt`.
   The name becomes the link: `blog/post.html?p=rag-chunking`.
2. On github.com, open `blog/posts`, click **Add file → Upload files**, drag
   the file in, and click **Commit changes**.
3. For images, upload them the same way into `blog/images` and write
   `![caption](images/your-image.png)` where they should appear.
4. About a minute later the blog is live: on the homepage tiles, in the
   Library and on its own page. Newest `Date` first.

The top of each file is a few header lines, then a blank line, then the text:

```
Title: Chunking strategies that survive policy docs
Date: 2026-11-04
Topic: RAG
Tags: RAG, Chunking, LangChain
Summary: Why fixed-size chunks fail on policy documents.
Takeaway: Split on headings, not characters

## First section
Your text...
```

Writing rules: `## Heading` for sections (they fill the Contents panel),
`**bold**`, `*italic*`, `- bullets`, `1. numbers`, `> pull quote` (words in
`*stars*` turn gold), paragraphs starting with `Note:`, `Tip:`, `Rule:` or
`Warning:` become highlighted boxes, and code goes between three backticks.
`_TEMPLATE.txt` shows every option and the optional header lines (`Quote`,
`Cover`, `Draft: yes`). Files starting with `_` are never published.

To edit a blog, open its file on GitHub and click the pencil. To remove it,
delete the file.

## Résumé

Put the PDF at `assets/resume.pdf`. The **Download résumé** buttons (hero,
contact and every blog) download it as `Nikhil-Salunke-Resume.pdf`. Until the
file exists they open the résumé on the old site.

## Structure

```
index.html          The homepage (markup, styles and the WebGL swarm engine)
blog/posts/         The blogs: one .txt file each (see _TEMPLATE.txt)
blog/images/        Images used in blogs
blog/index.html     The Library: every blog as a card, with topic filter and search
blog/post.html      The reader: one blog, opened with ?p=<file name>
blog/manifest.json  Built by GitHub Pages: the list of files in blog/posts
blog/loader.js      Reads and parses the blog files
blog/blog.js        Shared blog code: gold covers, cursor, the Library swarm
blog/blog.css       Blog styles (same tokens as the homepage)
blog/vendor/        marked 4.3.0 (Markdown parser, MIT licence)
assets/             The résumé PDF
concept/index.html  The annotated review version of the design
design-system/      Design notes
```

`blog/manifest.json` is filled in by GitHub Pages' built-in Jekyll build, so
keep **Deploy from a branch** as the Pages source and don't add a `.nojekyll`
file. Blog files are plain text, so nothing inside them (template braces in
code included) is processed by that build.

## Scenes

| # | Section | Swarm |
|---|---------|-------|
| 01 | Hero | Name forms from particles, then an exact rotating sphere |
| 02 | Thesis | Trefoil knot |
| 03 | Selected work | Orbit rings; each project is a body you can fly to |
| 04 | Skills | Spiral galaxy; each skill domain is a star cluster |
| 05 | Watch a query think | Vector space playing a RAG pipeline as you scroll |
| 06 | Journey | Twisting stream with a ring per milestone |
| 07 | Proof & writing | Rolling terrain, honours celebration, latest blogs |
| 08 | Contact | Eclipse ring with outward gold waves |

Rendering: additive points with motion trails, a quarter-resolution bloom pass,
depth-of-field bokeh, and cursor ripples. Honours `prefers-reduced-motion`
(slower swarm, no intro or ripples) and falls back to a static page without WebGL.

## Publish on GitHub Pages

Settings → Pages → Build and deployment → **Deploy from a branch** → choose the
branch and `/ (root)` → Save. Free for public repositories. Upload blogs to
the same branch that Pages deploys from.

## Dependencies

Three.js r128 (cdnjs), Lenis 1.1.13 (unpkg), Anton / Hanken Grotesk /
JetBrains Mono (Google Fonts), marked 4.3.0 (bundled in `blog/vendor`).
