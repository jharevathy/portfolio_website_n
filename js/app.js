/**
 * Page interactions: header, navigation, reveals, glass spotlight,
 * magnetic buttons, architecture diagrams, writing list + reader.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ------------------------------------------------------------------
  // Intro
  // ------------------------------------------------------------------
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.body.classList.add('is-ready'); });
  });

  // ------------------------------------------------------------------
  // Header: hide on scroll down, show on scroll up
  // ------------------------------------------------------------------
  var header = $('#site-header');
  var lastY = window.scrollY;
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      var menuOpen = header.classList.contains('menu-open');
      if (!menuOpen) header.classList.toggle('is-hidden', y > lastY && y > 320);
      lastY = y;
      ticking = false;
    });
  }, { passive: true });

  // ------------------------------------------------------------------
  // Active section + sliding nav indicator
  // ------------------------------------------------------------------
  var nav = $('.nav');
  var indicator = $('.nav__indicator');
  var navLinks = $$('.nav__link');

  function moveIndicator(link) {
    if (!link) { nav.classList.remove('has-active'); return; }
    nav.classList.add('has-active');
    indicator.style.width = link.offsetWidth + 'px';
    indicator.style.transform = 'translateX(' + link.offsetLeft + 'px)';
  }

  var sectionIds = navLinks.map(function (l) { return l.dataset.nav; });
  var current = null;
  function updateActive() {
    var probe = window.innerHeight * 0.4;
    var found = null;
    sectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) found = id;
    });
    if (found === current) return;
    current = found;
    navLinks.forEach(function (l) {
      var on = l.dataset.nav === found;
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
    });
    moveIndicator(found ? $('.nav__link[data-nav="' + found + '"]') : null);
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('resize', function () { current = undefined; updateActive(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { current = undefined; updateActive(); });
  updateActive();

  // ------------------------------------------------------------------
  // Mobile menu
  // ------------------------------------------------------------------
  var toggle = $('.menu-toggle');
  var menu = $('#mobile-menu');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    header.classList.toggle('menu-open', open);
    header.classList.remove('is-hidden');
    document.body.classList.toggle('is-locked', open);
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add('is-open'); });
    } else {
      menu.classList.remove('is-open');
      setTimeout(function () { if (!menu.classList.contains('is-open')) menu.hidden = true; }, reduceMotion ? 0 : 400);
    }
  }
  toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1100 && header.classList.contains('menu-open')) setMenu(false); });

  // ------------------------------------------------------------------
  // Reveal on scroll
  // ------------------------------------------------------------------
  var revealables = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  // ------------------------------------------------------------------
  // Glass spotlight + magnetic buttons (fine pointers only)
  // ------------------------------------------------------------------
  if (finePointer && !reduceMotion) {
    document.addEventListener('pointermove', function (e) {
      var g = e.target.closest && e.target.closest('.glass');
      if (!g || g.classList.contains('glass--pill')) return;
      var r = g.getBoundingClientRect();
      g.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      g.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
    $$('.glass').forEach(function (g) {
      g.addEventListener('pointerenter', function () { g.classList.add('is-lit'); });
      g.addEventListener('pointerleave', function () { g.classList.remove('is-lit'); });
    });

    $$('[data-magnetic]').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width;
        var y = (e.clientY - r.top - r.height / 2) / r.height;
        btn.style.transform = 'translate(' + (x * 8).toFixed(2) + 'px,' + (y * 6).toFixed(2) + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  }

  // ------------------------------------------------------------------
  // Architecture diagrams — rendered from data-flow
  // "A > B, C > D" → columns of nodes, fully connected between columns
  // ------------------------------------------------------------------
  var SVGNS = 'http://www.w3.org/2000/svg';
  function svgEl(name, attrs) {
    var el = document.createElementNS(SVGNS, name);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  function renderDiagram(host) {
    var cols = host.dataset.flow.split('>').map(function (c) {
      return c.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    });
    var CH = 6.7, PADX = 14, NH = 34, GAPY = 14, GAPX = 40, M = 18;
    var widths = cols.map(function (c) {
      return Math.max.apply(null, c.map(function (s) { return s.length * CH + PADX * 2; }));
    });
    var tallest = Math.max.apply(null, cols.map(function (c) { return c.length * NH + (c.length - 1) * GAPY; }));
    var hasLoop = host.hasAttribute('data-loop');
    var H = Math.max(tallest, NH) + M * 2 + (hasLoop ? 36 : 0);
    var W = widths.reduce(function (a, b) { return a + b; }, 0) + GAPX * (cols.length - 1) + M * 2;
    var midY = M + Math.max(tallest, NH) / 2;

    var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, 'aria-hidden': 'true', focusable: 'false' });
    var gEdges = svgEl('g', {}), gFlow = svgEl('g', {}), gNodes = svgEl('g', {});
    svg.appendChild(gEdges); svg.appendChild(gFlow); svg.appendChild(gNodes);

    var x = M, boxes = [];
    cols.forEach(function (col, ci) {
      var colH = col.length * NH + (col.length - 1) * GAPY;
      var y0 = midY - colH / 2;
      boxes.push(col.map(function (label, ni) {
        var w = label.length * CH + PADX * 2;
        var bx = x + (widths[ci] - w) / 2, by = y0 + ni * (NH + GAPY);
        var type = ci === 0 ? 'io' : ci === cols.length - 1 ? 'out' : 'mid';
        var g = svgEl('g', { class: 'dg-node dg-node--' + type });
        g.appendChild(svgEl('rect', { x: bx, y: by, width: w, height: NH, rx: 9 }));
        var t = svgEl('text', { x: bx + w / 2, y: by + NH / 2 + 4, 'text-anchor': 'middle' });
        t.textContent = label;
        g.appendChild(t);
        gNodes.appendChild(g);
        return { l: bx, r: bx + w, cy: by + NH / 2 };
      }));
      x += widths[ci] + GAPX;
    });

    var delay = 0;
    for (var c = 0; c < boxes.length - 1; c++) {
      boxes[c].forEach(function (a) {
        boxes[c + 1].forEach(function (b) {
          var mx = (a.r + b.l) / 2;
          var d = 'M' + a.r + ' ' + a.cy + ' C' + mx + ' ' + a.cy + ' ' + mx + ' ' + b.cy + ' ' + b.l + ' ' + b.cy;
          gEdges.appendChild(svgEl('path', { d: d, class: 'dg-edge' }));
          var fl = svgEl('path', { d: d, class: 'dg-flow' });
          fl.style.animationDelay = (-(delay++ * 0.37) % 1.6).toFixed(2) + 's';
          gFlow.appendChild(fl);
          gNodes.appendChild(svgEl('circle', { cx: a.r, cy: a.cy, r: 2, class: 'dg-port' }));
          gNodes.appendChild(svgEl('circle', { cx: b.l, cy: b.cy, r: 2, class: 'dg-port' }));
        });
      });
    }

    if (hasLoop && boxes.length > 2) {
      var first = boxes[1][0], lastB = boxes[boxes.length - 1][0];
      var fx = (first.l + first.r) / 2, lx = (lastB.l + lastB.r) / 2;
      var by = midY + NH / 2, ly = H - M + 4;
      var ld = 'M' + lx + ' ' + by + ' C' + lx + ' ' + ly + ' ' + fx + ' ' + ly + ' ' + fx + ' ' + by;
      gEdges.appendChild(svgEl('path', { d: ld, class: 'dg-loop' }));
      var lf = svgEl('path', { d: ld, class: 'dg-flow' });
      gFlow.appendChild(lf);
    }

    host.style.setProperty('--min-w', Math.round(W * 0.82) + 'px');
    host.appendChild(svg);
  }
  $$('.diagram[data-flow]').forEach(renderDiagram);

  // Only animate diagrams that are on screen — infinite SVG animations
  // repaint every frame, so off-screen ones are paused.
  var diagrams = $$('.diagram[data-flow]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var dio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle('is-live', e.isIntersecting); });
    }, { rootMargin: '100px 0px' });
    diagrams.forEach(function (d) { dio.observe(d); });
  }
  // Drop the swipe-fade once a scrollable diagram reaches its end.
  diagrams.forEach(function (d) {
    var check = function () { d.classList.toggle('is-end', d.scrollLeft + d.clientWidth >= d.scrollWidth - 4); };
    d.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    check();
  });

  // ------------------------------------------------------------------
  // Writing: list, filters, reader
  // ------------------------------------------------------------------
  var posts = window.BLOG_POSTS || [];
  var list = $('#posts');
  var filters = $$('.filter');
  var filterBar = $('.filters');
  var filterInd = $('.filters__indicator');
  var activeCat = 'all';

  var ARROW = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';

  function renderPosts() {
    if (!list) return;
    var shown = posts.filter(function (p) { return activeCat === 'all' || p.category === activeCat; });
    list.innerHTML = shown.map(function (p) {
      return '<li><button class="post" type="button" data-id="' + escapeHtml(p.id) + '">' +
        '<span class="post__cat">' + escapeHtml(p.category) + '</span>' +
        '<span class="post__main"><span class="post__title">' + escapeHtml(p.title) + '</span>' +
        '<span class="post__summary">' + escapeHtml(p.summary) + '</span></span>' +
        '<span class="post__meta"><span>' + escapeHtml(p.date) + ' · ' + escapeHtml(p.readTime.replace(/ READ$/i, '')).toLowerCase() + '</span>' +
        '<span class="post__arrow">' + ARROW + '</span></span>' +
        '</button></li>';
    }).join('') || '<li class="post"><span class="muted">No articles in this topic yet.</span></li>';
  }

  function moveFilterIndicator(btn) {
    if (!btn || !filterInd) return;
    filterInd.style.width = btn.offsetWidth + 'px';
    filterInd.style.transform = 'translateX(' + (btn.offsetLeft - 4 + 4) + 'px)';
  }

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.dataset.category === activeCat) return;
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      moveFilterIndicator(btn);
      activeCat = btn.dataset.category;
      if (reduceMotion) { renderPosts(); return; }
      list.classList.add('is-swapping');
      setTimeout(function () { renderPosts(); list.classList.remove('is-swapping'); }, 220);
    });
  });
  renderPosts();
  var relayoutFilters = function () { moveFilterIndicator($('.filter.is-active')); };
  relayoutFilters();
  window.addEventListener('resize', relayoutFilters);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayoutFilters);

  // Reader drawer
  var drawer = $('#drawer');
  var scrim = $('.drawer-scrim');
  var drawerContent = $('#drawer-content');
  var drawerMeta = $('#drawer-meta');
  var progress = $('.drawer__progress span');
  var lastFocus = null;

  function openPost(id, fromHash) {
    var p = posts.find(function (x) { return x.id === id || x.slug === id; });
    if (!p) return;
    lastFocus = document.activeElement;
    var body = typeof marked !== 'undefined' && marked.parse ? marked.parse(p.content) : '<pre>' + escapeHtml(p.content) + '</pre>';
    drawerMeta.textContent = p.category;
    drawerContent.innerHTML =
      '<header class="prose__head">' +
        '<p class="eyebrow">' + escapeHtml(p.date) + ' · ' + escapeHtml(p.readTime.toLowerCase()) + '</p>' +
        '<h1 id="drawer-title">' + escapeHtml(p.title) + '</h1>' +
        '<ul class="chips">' + p.tags.map(function (t) { return '<li>' + escapeHtml(t) + '</li>'; }).join('') + '</ul>' +
      '</header>' + body;
    drawerContent.scrollTop = 0;
    if (progress) progress.style.transform = 'scaleX(0)';

    drawer.hidden = false;
    scrim.hidden = false;
    document.body.classList.add('is-locked');
    requestAnimationFrame(function () {
      drawer.classList.add('is-open');
      scrim.classList.add('is-open');
      $('.icon-btn', drawer).focus({ preventScroll: true });
    });
    if (!fromHash) history.replaceState(null, '', '#blog/' + p.slug);
  }

  function closePost() {
    if (drawer.hidden) return;
    drawer.classList.remove('is-open');
    scrim.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    setTimeout(function () {
      if (!drawer.classList.contains('is-open')) { drawer.hidden = true; scrim.hidden = true; }
    }, reduceMotion ? 0 : 600);
    if (location.hash.indexOf('#blog/') === 0) history.replaceState(null, '', location.pathname + location.search);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  if (list) list.addEventListener('click', function (e) {
    var b = e.target.closest('.post[data-id]');
    if (b) openPost(b.dataset.id);
  });
  $$('[data-drawer-close]').forEach(function (el) { el.addEventListener('click', closePost); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!drawer.hidden) closePost();
      else if (header.classList.contains('menu-open')) { setMenu(false); toggle.focus(); }
    }
    if (e.key === 'Tab' && !drawer.hidden) {
      var f = $$('button, a[href], [tabindex]:not([tabindex="-1"])', drawer).filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    }
  });

  drawerContent.addEventListener('scroll', function () {
    var max = drawerContent.scrollHeight - drawerContent.clientHeight;
    if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? drawerContent.scrollTop / max : 0) + ')';
  }, { passive: true });

  function fromHash() {
    var m = location.hash.match(/^#blog\/(.+)$/);
    if (m) openPost(decodeURIComponent(m[1]), true);
  }
  window.addEventListener('hashchange', fromHash);
  fromHash();

  // ------------------------------------------------------------------
  // Contact utilities
  // ------------------------------------------------------------------
  var toast = $('.toast');
  var toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 2200);
  }

  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.dataset.copy;
      var done = function () { showToast('Email copied to clipboard'); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      } else { fallbackCopy(text); done(); }
    });
  });
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  $$('[data-print]').forEach(function (b) { b.addEventListener('click', function () { window.print(); }); });

  var yearEl = $('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var timeEl = $('[data-local-time]');
  function tick() {
    if (!timeEl) return;
    try {
      timeEl.textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
    } catch (e) { timeEl.textContent = ''; }
  }
  tick();
  setInterval(tick, 30000);
})();
