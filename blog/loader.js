/* Finds and reads the blogs in blog/posts/.
   Each blog is a plain .txt file: a few "Key: value" lines, a blank line, then the text.
   GitHub Pages lists the files for us in blog/manifest.json, so a new file appears on the
   site as soon as it is uploaded. See blog/posts/_TEMPLATE.txt for the format. */
(function () {
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function parseDate(v) {
    var m = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/.exec((v || '').trim());
    if (m) return new Date(+m[1], +m[2] - 1, +(m[3] || 1));
    var d = new Date(v);
    return isNaN(d) ? null : d;
  }
  function showDate(d, hasDay) { return d ? (hasDay ? d.getDate() + ' ' : '') + MONTHS[d.getMonth()] + ' ' + d.getFullYear() : ''; }

  // header lines until the first blank line; everything after is the body
  function parse(name, raw) {
    var text = raw.replace(/^﻿/, '').replace(/\r\n?/g, '\n');
    var lines = text.split('\n'), meta = { takeaway: [] }, i = 0;
    while (i < lines.length && !lines[i].trim()) i++;
    for (; i < lines.length; i++) {
      var line = lines[i];
      if (!line.trim()) { i++; break; }
      var m = /^\s*([A-Za-z][A-Za-z ]{0,20}?)\s*:\s*(.*)$/.exec(line);
      if (!m) break;                       // not a header line: the body starts here
      var key = m[1].toLowerCase().replace(/\s+/g, ' ');
      if (key === 'takeaway' || key === 'takeaways') meta.takeaway.push(m[2].trim());
      else meta[key] = m[2].trim();
    }
    var body = lines.slice(i).join('\n').trim();
    if (!meta.title) {                     // no Title line: use the first "# Heading"
      var h = /^#\s+(.+)$/m.exec(body);
      if (h) { meta.title = h[1].trim(); body = body.replace(h[0], '').trim(); }
    }
    var slug = name.replace(/\.txt$/i, '');
    var dateRaw = meta.date || '', date = parseDate(dateRaw);
    var words = (body + ' ' + (meta.summary || '')).replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
    var firstQuote = /^>\s*(.+)$/m.exec(body);
    var tags = (meta.tags || '').split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    return {
      slug: slug,
      file: name,
      title: meta.title || slug.replace(/[-_]+/g, ' '),
      topic: meta.topic || tags[0] || 'Blog',
      date: showDate(date, /^\d{4}-\d{1,2}-\d{1,2}$/.test(dateRaw.trim())),
      time: date ? date.getTime() : 0,
      tags: tags,
      dek: meta.summary || meta.dek || '',
      quote: meta.quote || (firstQuote ? firstQuote[1].replace(/[*_]/g, '').trim() : '') || meta.summary || '',
      take: meta.takeaway,
      cover: meta.cover && /^\d+$/.test(meta.cover) ? +meta.cover - 1 : null,
      coverImage: meta.cover && !/^\d+$/.test(meta.cover) ? meta.cover : (meta['cover image'] || ''),
      draft: /^(yes|true|draft)$/i.test(meta.draft || ''),
      min: Math.max(1, Math.round(words / 200)),
      body: body
    };
  }

  // where am I? '' on blog pages, 'blog/' on the homepage
  var base = /\/blog\/[^/]*$/.test(location.pathname) ? '' : 'blog/';

  function listFiles() {
    return fetch(base + 'manifest.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) { return j.files; })
      .catch(function () {
        // Not built by GitHub Pages (for example a local preview): ask GitHub for the folder listing
        var host = /^([^.]+)\.github\.io$/.exec(location.hostname), seg = location.pathname.split('/')[1];
        var repo = window.BLOG_REPO || (host ? host[1] + '/' + (seg && seg !== 'blog' ? seg : host[1] + '.github.io') : '');
        if (!repo) throw new Error('No blog list');
        return fetch('https://api.github.com/repos/' + repo + '/contents/blog/posts')
          .then(function (r) { return r.json(); })
          .then(function (a) { return a.map(function (f) { return f.name; }); });
      })
      .then(function (names) { return names.filter(function (n) { return /\.txt$/i.test(n) && !/^[_.]/.test(n); }); });
  }

  var cache = null;
  function load() {
    if (cache) return cache;
    cache = listFiles().then(function (names) {
      return Promise.all(names.map(function (n) {
        return fetch(base + 'posts/' + encodeURIComponent(n)).then(function (r) { return r.ok ? r.text() : ''; })
          .then(function (t) { return t ? parse(n, t) : null; }, function () { return null; });
      }));
    }).then(function (posts) {
      posts = posts.filter(function (p) { return p && !p.draft; });
      posts.sort(function (a, b) { return b.time - a.time || a.slug.localeCompare(b.slug); });
      posts.forEach(function (p, i) { p.i = i; });
      return posts;
    });
    return cache;
  }

  window.BLOG = {
    load: load,
    parse: parse,
    find: function (posts, slug) { for (var i = 0; i < posts.length; i++) if (posts[i].slug === slug) return posts[i]; return null; },
    href: function (slug, from) { return (from || '') + 'post.html?p=' + encodeURIComponent(slug); }
  };
})();
