/**
 * Merkur-Caliber Architectural Interactions - Dark Edition
 * For Nikhil Salunke - GenAI & Agentic Systems Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  initWorldClocks();
  initBlogSection();
});

/* 1. Live World Clocks (SF, London, Bangalore) */
function initWorldClocks() {
  const sfEl = document.getElementById('clock-sf');
  const londonEl = document.getElementById('clock-london');
  const blrEl = document.getElementById('clock-blr');

  function update() {
    const now = new Date();

    if (sfEl) {
      sfEl.textContent = now.toLocaleTimeString('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }

    if (londonEl) {
      londonEl.textContent = now.toLocaleTimeString('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }

    if (blrEl) {
      blrEl.textContent = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  }

  update();
  setInterval(update, 1000);
}

/* 2. Blog Engine: Render Editorial Rows, Filter & Drawer */
function initBlogSection() {
  const container = document.getElementById('blog-articles-container');
  const filterBtns = document.querySelectorAll('.blog-filter-btn');
  const drawer = document.getElementById('blog-drawer');
  const drawerContent = document.getElementById('blog-drawer-content');
  const closeBtn = document.getElementById('blog-drawer-close-btn');

  if (!container || !window.BLOG_POSTS) return;

  let activeCategory = 'all';

  function renderRows() {
    const filtered = window.BLOG_POSTS.filter(post => {
      return activeCategory === 'all' || post.category.toLowerCase() === activeCategory.toLowerCase();
    });

    container.innerHTML = filtered.map(post => `
      <div class="blog_article_row" onclick="openBlogArticle('${post.id}')">
        <div style="font-family: var(--mono-font); font-size: var(--tiny); color: var(--chroma-cyan); text-transform: uppercase;">
          ${post.category}
        </div>
        <div>
          <div class="blog_article_title">
            ${post.title}
          </div>
          <div class="blog_article_summary">
            ${post.summary}
          </div>
        </div>
        <div style="font-family: var(--mono-font); font-size: var(--tiny); color: var(--_default-color---grey-500);">
          ${post.tags.slice(0, 2).map(t => `#${t}`).join(' ')}
        </div>
        <div style="font-family: var(--mono-font); font-size: var(--tiny); text-align: right; color: var(--chroma-cyan); font-weight: 600;">
          ${post.readTime} &rarr;
        </div>
      </div>
    `).join('');
  }

  // Filter handlers
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.style.background = 'rgba(255, 255, 255, 0.04)';
        b.style.color = 'var(--_default-color---grey-400)';
      });
      btn.classList.add('active');
      btn.style.background = '#ffffff';
      btn.style.color = '#08080c';

      activeCategory = btn.getAttribute('data-category');
      renderRows();
    });
  });

  // Drawer Opening
  window.openBlogArticle = function (id) {
    const post = window.BLOG_POSTS.find(p => p.id === id);
    if (!post) return;

    window.location.hash = `blog/${post.slug}`;

    const parsedMarkdown = typeof marked !== 'undefined' ? marked.parse(post.content) : post.content;

    drawerContent.innerHTML = `
      <div style="margin-bottom: var(--space-xxl);">
        <div style="font-family: var(--mono-font); font-size: var(--tiny); color: var(--chroma-cyan); text-transform: uppercase; margin-bottom: 8px;">
          ${post.category} &bull; ${post.date} &bull; ${post.readTime}
        </div>
        <h1 style="font-family: var(--primary-font); font-size: var(--h4); text-transform: uppercase; line-height: 1.1; margin-bottom: var(--space-m); color: #ffffff;">
          ${post.title}
        </h1>
        <div style="font-family: var(--mono-font); font-size: var(--tiny); color: var(--_default-color---grey-400);">
          Tags: ${post.tags.map(t => `#${t}`).join(' ')}
        </div>
      </div>
      <div style="font-size: var(--body); line-height: 1.8; color: #d4d4d8; font-family: var(--secondary-font);">
        ${parsedMarkdown}
      </div>
    `;

    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Close Drawer
  function closeDrawer() {
    drawer.classList.remove('active');
    document.body.style.overflow = 'auto';
    if (window.location.hash.startsWith('#blog/')) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  renderRows();
}
