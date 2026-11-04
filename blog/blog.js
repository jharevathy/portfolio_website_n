/* Shared by the blog pages: helpers, generated gold covers, cursor ring, and the swarm.
   The swarm uses the homepage's pipeline: additive points with motion trails, a
   quarter-resolution bloom, vignette and grain. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- generated gold covers, one per blog ---------- */
  function rng(seed) { var h = 2166136261; for (var i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); } return function () { h += 0x6D2B79F5; var t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var GOLD = ['255,246,232', '255,222,168', '247,190,110', '226,140,62'];
  function dot(c, x, y, r, col, a) { c.fillStyle = 'rgba(' + col + ',' + a + ')'; c.beginPath(); c.arc(x, y, r, 0, 6.283); c.fill(); }
  function glow(c, x, y, r, a) { var g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(255,241,212,' + a + ')'); g.addColorStop(1, 'rgba(243,198,140,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 6.283); c.fill(); }
  function cover(cv, p) {
    var W = 640, H = 280; cv.width = W; cv.height = H;
    var c = cv.getContext('2d'), R = rng(p.slug), i, k, x, y, a;
    var bg = c.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#0b0c12'); bg.addColorStop(1, '#06070b'); c.fillStyle = bg; c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = 'lighter';
    var cx = W * (.55 + R() * .25), cy = H * .5, style = (p.cover || 0) % 6;
    if (style === 0) { // orbits
      for (k = 0; k < 3; k++) for (i = 0; i < 260; i++) { a = i / 260 * 6.283; dot(c, cx + Math.cos(a) * (90 + k * 60), cy + Math.sin(a) * (34 + k * 22), .8 + (Math.sin(a) + 1) * .6, GOLD[k + 1], .55); }
      for (k = 0; k < 3; k++) { a = R() * 6.283; glow(c, cx + Math.cos(a) * (90 + k * 60), cy + Math.sin(a) * (34 + k * 22), 26, .9); }
    } else if (style === 1) { // sunflower
      for (i = 0; i < 900; i++) { var r = Math.sqrt(i) * 6.4; a = i * 2.39996; dot(c, cx + Math.cos(a) * r, cy + Math.sin(a) * r * .9, .6 + i / 900 * 2.2, GOLD[i % 4], .25 + (1 - i / 900) * .6); }
      glow(c, cx, cy, 60, .5);
    } else if (style === 2) { // balanced waves
      for (k = 0; k < 11; k++) for (i = 0; i < 160; i++) { x = i / 159 * W; y = cy + (k - 5) * 18 + Math.sin(i / 159 * 9 + k * .55) * 30 * Math.sin(i / 159 * 3.14); dot(c, x, y, .9 + (k === 5 ? 1.2 : 0), GOLD[k % 4], k === 5 ? .9 : .35); }
    } else if (style === 3) { // graph
      var pts = []; for (i = 0; i < 46; i++) pts.push([W * .3 + R() * W * .66, 26 + R() * (H - 52)]);
      c.lineWidth = .8;
      for (i = 0; i < pts.length; i++) for (k = i + 1; k < pts.length; k++) { var d = Math.hypot(pts[i][0] - pts[k][0], pts[i][1] - pts[k][1]); if (d < 92) { c.strokeStyle = 'rgba(243,198,140,' + (.32 * (1 - d / 92)) + ')'; c.beginPath(); c.moveTo(pts[i][0], pts[i][1]); c.lineTo(pts[k][0], pts[k][1]); c.stroke(); } }
      pts.forEach(function (q, j) { dot(c, q[0], q[1], 1.6 + R() * 2, GOLD[j % 4], .9); if (j % 9 === 0) glow(c, q[0], q[1], 22, .7); });
    } else if (style === 4) { // helix
      for (i = 0; i < 420; i++) { var t = i / 419; x = 40 + t * (W - 80); a = t * 14; var y1 = cy + Math.sin(a) * 60, y2 = cy - Math.sin(a) * 60, z = Math.cos(a);
        dot(c, x, y1, 1.2 + (z + 1), GOLD[1], .35 + (z + 1) * .3); dot(c, x, y2, 1.2 + (1 - z), GOLD[2], .35 + (1 - z) * .3);
        if (i % 14 === 0) for (k = 0; k < 10; k++) dot(c, x, y1 + (y2 - y1) * k / 9, .8, GOLD[0], .35); }
    } else { // radial breakthrough
      cx = W * .78; cy = H * .9;
      for (k = 0; k < 64; k++) { a = Math.PI + k / 63 * Math.PI; for (i = 0; i < 26; i++) { var rr = 30 + i * i * .45 + R() * 6; dot(c, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, .7 + (1 - i / 26) * 1.4, GOLD[k % 4], .7 * (1 - i / 26) + .1); } }
      glow(c, cx, cy, 110, .8);
    }
    c.globalCompositeOperation = 'source-over';
    var v = c.createLinearGradient(0, 0, W * .6, 0); v.addColorStop(0, 'rgba(5,6,10,.55)'); v.addColorStop(1, 'rgba(5,6,10,0)'); c.fillStyle = v; c.fillRect(0, 0, W, H);
  }

  function copy(btn, text) {
    var t = btn.dataset.label || (btn.dataset.label = btn.textContent);
    var show = function (msg) { btn.textContent = msg; setTimeout(function () { btn.textContent = t; }, 1600); };
    var legacy = function () {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); var ok = false; try { ok = document.execCommand('copy'); } catch (e) {} ta.remove();
      show(ok ? 'Copied' : 'Copy failed');
    };
    try { navigator.clipboard.writeText(text).then(function () { show('Copied'); }, legacy); } catch (e) { legacy(); }
  }

  /* ---------- cursor ring + glass sheen ---------- */
  function chrome() {
    var cursor = $('#cursor');
    if (cursor && fine && !reduce) {
      var cx = -100, cy = -100, tx = -100, ty = -100;
      addEventListener('pointermove', function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
      document.addEventListener('pointerover', function (e) { cursor.classList.toggle('big', !!(e.target.closest && e.target.closest('a,button,.card'))); });
      (function loop() { cx += (tx - cx) * .22; cy += (ty - cy) * .22; cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; requestAnimationFrame(loop); })();
    } else if (cursor) cursor.style.display = 'none';
    document.addEventListener('pointermove', function (e) {
      var g = e.target.closest && e.target.closest('.glass'); if (!g) return;
      var r = g.getBoundingClientRect(); g.style.setProperty('--mx', (e.clientX - r.left) + 'px'); g.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ---------- swarm ---------- */
  // Forms: 0 dust, 1 ripple rings, 2 double helix, 3 silk ribbon, 4 petals
  function swarm(opts) {
    var api = { go: function () {}, dim: function () {}, next: function () {} };
    if (!window.THREE) { document.documentElement.classList.add('no-gl'); return api; }
    var cv = $('#stage'), renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: false, alpha: false, powerPreference: 'high-performance' }); } catch (e) { renderer = null; }
    if (!renderer || !renderer.getContext()) { document.documentElement.classList.add('no-gl'); return api; }
    var BG = new THREE.Color(0x05060a);
    var DPR = Math.min(devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(1); renderer.setClearColor(BG, 1);
    var scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(40, 1, .1, 200);
    camera.position.set(0, 0, 30);
    var small = Math.min(innerWidth, innerHeight) < 720;
    var N = small ? 7000 : (navigator.hardwareConcurrency || 8) <= 4 ? 9000 : 13000;
    var F = ['aE', 'aA', 'aB', 'aC', 'aD'];
    var buf = {}; F.forEach(function (k) { buf[k] = new Float32Array(N * 3); });
    var aR = new Float32Array(N * 4);
    for (var i = 0; i < N; i++) {
      var r1 = Math.random(), r2 = Math.random(), r3 = Math.random(), r4 = Math.random();
      aR.set([r1, r2, r3, r4], i * 4);
      buf.aE.set([(r1 - .5) * 44, (r2 - .5) * 26, (r3 - .5) * 20 - 4], i * 3);                       // dust
      var ring = Math.floor(Math.sqrt(r4) * 34), rr = (ring + .6) / 34 * 11.5, th = r3 * 6.2832;      // ripple rings
      buf.aA.set([Math.cos(th) * rr, 0, Math.sin(th) * rr], i * 3);
      var rung = i % 5 === 0;                                                                         // helix
      buf.aB.set([(i / N) * 2 - 1, rung ? r1 : (i % 2), rung ? 1 : 0], i * 3);
      buf.aC.set([(i % 180) / 179 * 2 - 1, Math.floor(i / 180) / Math.ceil(N / 180) * 2 - 1, 0], i * 3); // silk
      buf.aD.set([i / N * Math.PI * 4, (r1 - .5), (r2 - .5)], i * 3);                                // petals
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(buf.aE, 3));
    F.forEach(function (k) { geo.setAttribute(k, new THREE.BufferAttribute(buf[k], 3)); });
    geo.setAttribute('aR', new THREE.BufferAttribute(aR, 4));
    var U = {
      uTime: { value: 0 }, uFrom: { value: 0 }, uTo: { value: 0 }, uMix: { value: 1 }, uDim: { value: 1 }, uComp: { value: 1 },
      uPix: { value: 1 }, uAspect: { value: 1 }, uMouse: { value: new THREE.Vector2(9, 9) }, uShock: { value: new THREE.Vector4(0, 0, -99, 0) }, uScale: { value: 1 }, uX: { value: 0 }
    };
    var VS = [
      'attribute vec3 aA; attribute vec3 aB; attribute vec3 aC; attribute vec3 aD; attribute vec3 aE; attribute vec4 aR;',
      'uniform float uTime, uFrom, uTo, uMix, uDim, uComp, uPix, uAspect, uScale, uX; uniform vec2 uMouse; uniform vec4 uShock;',
      'varying vec3 vCol; varying float vA;',
      'mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }',
      'vec3 form(float id, float t){',
      '  vec3 p;',
      '  if (id < .5) {',
      '    p = aE; p.y = mod(aE.y + 13. + t*(.2 + aR.x*.35), 26.) - 13.; p.x += sin(t*.3 + aR.w*6.28)*.8;',
      '  } else if (id < 1.5) {',
      '    p = aA; float r = length(p.xz); float an = atan(p.z, p.x);',
      '    p.xz *= 1. + .035*sin(an*6. - t*.9);',
      '    p.y += sin(r*1.05 - t*2.2)*1.1*(1.1 - r/13.);',
      '    p.xz = rot(t*.12) * p.xz; p.yz = rot(-1.3) * p.yz; p.xy = rot(.18) * p.xy; p.x += 5.*uX; p.y += .5;',
      '  } else if (id < 2.5) {',
      '    float h = aB.x; float a = h*7.5 + t*.7;',
      '    vec3 s0 = vec3(cos(a)*3.4, h*13., sin(a)*3.4), s1 = vec3(cos(a+3.1416)*3.4, h*13., sin(a+3.1416)*3.4);',
      '    p = aB.z > .5 ? mix(s0, s1, aB.y) : (aB.y > .5 ? s1 : s0);',
      '    p += (aR.xyz - .5)*.35; p.xy = rot(-.62) * p.xy; p.x += 5.*uX;',
      '  } else if (id < 3.5) {',
      '    float u = aC.x, v = aC.y;',
      '    p = vec3(u*17., sin(u*3.2 + t*1.05)*1.8 + sin(v*3.5 - t*.8 + u*2.)*.6, v*4.2);',
      '    p.yz = rot(u*1.6 + sin(t*.35)*.9) * p.yz; p.y += sin(u*1.4 - t*.5)*2.2;',
      '  } else {',
      '    float a = aD.x; float rr = 9.*cos(3.5*a)*(1. + .07*sin(t*1.3 + a*2.));',
      '    p = vec3(cos(a)*rr, sin(a)*rr, sin(a*3. + t*.9)*1.8*abs(rr)/9.);',
      '    p += vec3(aD.y, aD.z, aR.w - .5)*.55; p.xy = rot(t*.1) * p.xy; p.yz = rot(-.5) * p.yz; p.x += 4.5*uX;',
      '  }',
      '  return p;',
      '}',
      'void main(){',
      '  float t = uTime;',
      '  float m = clamp(uMix*1.45 - aR.x*.45, 0., 1.); m = m*m*(3. - 2.*m);',
      '  vec3 p = mix(form(uFrom, t), form(uTo, t), m);',
      '  float arc = sin(m*3.1416);',
      '  p.xz = rot(arc*1.1*(aR.y - .5)) * p.xz; p.y += arc*2.4*(aR.z - .5);',
      '  p += .16*vec3(sin(p.y*.7 + t + aR.w*6.28), cos(p.x*.6 - t*.8), sin(p.z*.8 + t*.6));',
      '  p *= uScale;',
      '  vec4 mv = modelViewMatrix * vec4(p, 1.);',
      '  vec4 cl = projectionMatrix * mv; vec2 nd = cl.xy / cl.w;',
      '  vec2 d = nd - uMouse; d.x *= uAspect; float dist = length(d);',
      '  float push = exp(-dist*dist*22.)*.9;',
      '  float age = t - uShock.z;',
      '  float band = exp(-pow((dist - age*1.25)*7., 2.)) * exp(-age*1.4) * uShock.w;',
      '  vec2 dir = dist > .0001 ? d/dist : vec2(0.);',
      '  mv.xy += vec2(dir.x/uAspect, dir.y) * (push + band*1.6) * (-mv.z) * .07;',
      '  gl_Position = projectionMatrix * mv;',
      '  float depth = clamp((-mv.z - 8.)/40., 0., 1.);',
      '  gl_PointSize = uPix * (1.5 + aR.y*2.8) * (50. / -mv.z) * (1. + band*1.5);',
      '  vec3 W = vec3(1., .97, .93), C = vec3(1., .86, .62), G = vec3(.98, .70, .33), A = vec3(.90, .46, .16);',
      '  float h = aR.z; vec3 col = h < .33 ? mix(W, C, h/.33) : h < .66 ? mix(C, G, (h - .33)/.33) : mix(G, A, (h - .66)/.34);',
      '  vCol = col * (1. + band*1.2 + push*.6);',
      '  vA = uDim * uComp * (.5 + .5*aR.y) * (1. - depth*.5);',
      '}'
    ].join('\n');
    var FS = 'varying vec3 vCol; varying float vA; void main(){ float d = length(gl_PointCoord - .5); float a = smoothstep(.5, .0, d); a *= a; gl_FragColor = vec4(vCol, a*vA); }';
    var pts = new THREE.Points(geo, new THREE.ShaderMaterial({ uniforms: U, vertexShader: VS, fragmentShader: FS, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending }));
    pts.frustumCulled = false; scene.add(pts);

    // post: trails (fade quad) -> bloom (bright pass + separable blur at quarter res) -> vignette + grain
    var quadVS = 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }';
    var ortho = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    function quadScene(mat) { var s = new THREE.Scene(), m = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat); s.add(m); s.m = m; return s; }
    var fadeMat = new THREE.ShaderMaterial({ uniforms: { uBg: { value: new THREE.Vector3(BG.r, BG.g, BG.b) }, uFade: { value: .3 } }, vertexShader: quadVS, transparent: true, depthTest: false, depthWrite: false,
      fragmentShader: 'uniform vec3 uBg; uniform float uFade; void main(){ gl_FragColor=vec4(uBg,uFade); }' });
    var brightMat = new THREE.ShaderMaterial({ uniforms: { uTex: { value: null }, uTexel: { value: new THREE.Vector2() } }, vertexShader: quadVS, depthTest: false, depthWrite: false,
      fragmentShader: 'uniform sampler2D uTex; uniform vec2 uTexel; varying vec2 vUv; void main(){ vec3 c=texture2D(uTex,vUv+uTexel*vec2(-1.,-1.)).rgb+texture2D(uTex,vUv+uTexel*vec2(1.,-1.)).rgb+texture2D(uTex,vUv+uTexel*vec2(-1.,1.)).rgb+texture2D(uTex,vUv+uTexel*vec2(1.,1.)).rgb; c*=.25; float l=max(c.r,max(c.g,c.b)); c*=smoothstep(.16,.65,l); gl_FragColor=vec4(c,1.); }' });
    var blurMat = new THREE.ShaderMaterial({ uniforms: { uTex: { value: null }, uDir: { value: new THREE.Vector2() } }, vertexShader: quadVS, depthTest: false, depthWrite: false,
      fragmentShader: 'uniform sampler2D uTex; uniform vec2 uDir; varying vec2 vUv; void main(){ vec3 c=texture2D(uTex,vUv).rgb*.227027; c+=(texture2D(uTex,vUv+uDir).rgb+texture2D(uTex,vUv-uDir).rgb)*.1945946; c+=(texture2D(uTex,vUv+uDir*2.).rgb+texture2D(uTex,vUv-uDir*2.).rgb)*.1216216; c+=(texture2D(uTex,vUv+uDir*3.).rgb+texture2D(uTex,vUv-uDir*3.).rgb)*.054054; c+=(texture2D(uTex,vUv+uDir*4.).rgb+texture2D(uTex,vUv-uDir*4.).rgb)*.016216; gl_FragColor=vec4(c,1.); }' });
    var blitMat = new THREE.ShaderMaterial({ uniforms: { uTex: { value: null }, uBloom: { value: null }, uRes: { value: new THREE.Vector2(1, 1) }, uTime: { value: 0 }, uBloomStr: { value: .9 } }, vertexShader: quadVS, depthTest: false, depthWrite: false,
      fragmentShader: 'uniform sampler2D uTex; uniform sampler2D uBloom; uniform vec2 uRes; uniform float uTime; uniform float uBloomStr; varying vec2 vUv; float hs(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); } void main(){ vec3 c=texture2D(uTex,vUv).rgb; c+=texture2D(uBloom,vUv).rgb*uBloomStr*vec3(1.,.95,.86); vec2 q=vUv-.5; q.x*=uRes.x/uRes.y; c*=mix(.6,1.,smoothstep(1.15,.25,length(q))); c+=(hs(vUv*uRes+fract(uTime)*91.7)-.5)*.028; gl_FragColor=vec4(c,1.); }' });
    var fadeScene = quadScene(fadeMat), passScene = quadScene(brightMat), blitScene = quadScene(blitMat);
    var rt, bA, bB;
    function makeRT() {
      var w = Math.floor(innerWidth * DPR), h = Math.floor(innerHeight * DPR);
      [rt, bA, bB].forEach(function (t) { if (t) t.dispose(); });
      var half = renderer.capabilities.isWebGL2 || renderer.extensions.get('OES_texture_half_float');
      var o = { type: half ? THREE.HalfFloatType : THREE.UnsignedByteType, depthBuffer: false, stencilBuffer: false };
      rt = new THREE.WebGLRenderTarget(w, h, o);
      bA = new THREE.WebGLRenderTarget(Math.max(1, w >> 2), Math.max(1, h >> 2), o); bB = new THREE.WebGLRenderTarget(Math.max(1, w >> 2), Math.max(1, h >> 2), o);
      renderer.setRenderTarget(rt); renderer.clear(); renderer.setRenderTarget(null);
      brightMat.uniforms.uTexel.value.set(2 / w, 2 / h);
      blitMat.uniforms.uTex.value = rt.texture; blitMat.uniforms.uBloom.value = bA.texture; blitMat.uniforms.uRes.value.set(w, h);
    }
    function blur(src, dst, dx, dy) { passScene.m.material = blurMat; blurMat.uniforms.uTex.value = src.texture; blurMat.uniforms.uDir.value.set(dx, dy); renderer.setRenderTarget(dst); renderer.render(passScene, ortho); }
    function size() {
      var w = innerWidth, h = innerHeight;
      renderer.setSize(Math.floor(w * DPR), Math.floor(h * DPR), false); cv.style.width = w + 'px'; cv.style.height = h + 'px';
      camera.aspect = w / h; camera.updateProjectionMatrix();
      U.uPix.value = DPR * Math.min(1.25, Math.max(.8, h / 900)); U.uAspect.value = w / h;
      U.uScale.value = w / h < .95 ? .62 : 1;
      U.uX.value = w < 900 ? 0 : 1;   // patterns sit right of the headline on wide screens, centred on narrow ones
      makeRT();
    }
    size();
    var rz; addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(size, 120); });

    var tm = { x: 9, y: 9 }, mm = { x: 9, y: 9 }, onPage = false;
    addEventListener('pointermove', function (e) { onPage = e.pointerType === 'mouse'; tm.x = e.clientX / innerWidth * 2 - 1; tm.y = -(e.clientY / innerHeight * 2 - 1); }, { passive: true });
    document.documentElement.addEventListener('pointerleave', function () { onPage = false; });
    addEventListener('pointerdown', function (e) {
      if (reduce || (e.target.closest && e.target.closest('a,button,input,label'))) return;
      U.uShock.value.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight * 2 - 1), U.uTime.value, 1);
    });

    var cycle = opts.cycle || null, ci = 0, hold = 0, mixing = false, dimT = opts.dim == null ? 1 : opts.dim;
    var HOLD = reduce ? 16 : 7.5, MORPH = reduce ? 4 : 2.8;
    function go(to) { var vis = U.uMix.value > .5 ? U.uTo.value : U.uFrom.value; if (vis === to && !mixing) return; U.uFrom.value = vis; U.uTo.value = to; U.uMix.value = 0; mixing = true; hold = 0; }
    U.uFrom.value = U.uTo.value = cycle ? cycle[0] : (opts.form || 0);
    api.go = go;
    api.dim = function (v) { dimT = v; };
    api.next = function () { if (cycle && !mixing) { ci = (ci + 1) % cycle.length; go(cycle[ci]); } };
    api.U = U;
    if (cycle) {
      var acc = 0, lastY = scrollY;
      addEventListener('scroll', function () { acc += Math.abs(scrollY - lastY); lastY = scrollY; if (acc > 700 && !mixing) { acc = 0; api.next(); } }, { passive: true });
    }

    var prev = performance.now(), time = 0, fade = .3, visible = true;
    document.addEventListener('visibilitychange', function () { visible = !document.hidden; if (visible) { prev = performance.now(); requestAnimationFrame(frame); } });
    function frame(now) {
      if (!visible) return;
      var dt = Math.max(0, Math.min(.05, (now - prev) / 1000)); prev = now;
      time += dt * (reduce ? .3 : 1);
      U.uTime.value = time;
      if (mixing) { U.uMix.value = Math.min(1, U.uMix.value + dt / MORPH); if (U.uMix.value >= 1) mixing = false; }
      else if (cycle) { hold += dt; if (hold > HOLD) api.next(); }
      U.uDim.value += (dimT - U.uDim.value) * Math.min(1, dt * 2.5);
      var on = onPage && !reduce;
      mm.x += ((on ? tm.x : 9) - mm.x) * Math.min(1, dt * 6); mm.y += ((on ? tm.y : 9) - mm.y) * Math.min(1, dt * 6);
      if (!on) { mm.x = 9; mm.y = 9; }
      U.uMouse.value.set(mm.x, mm.y);
      var px = on ? tm.x : 0, py = on ? tm.y : 0;
      pts.rotation.y += ((px * .12) - pts.rotation.y) * Math.min(1, dt * 2);
      pts.rotation.x += ((-py * .07) - pts.rotation.x) * Math.min(1, dt * 2);
      // trails: a partial fade each frame, frame-rate independent; alpha compensates so brightness holds
      var want = reduce ? 1 : (mixing ? .2 : .28);
      fade += (want - fade) * .1;
      var fpf = reduce ? 1 : 1 - Math.pow(1 - fade, dt * 60);
      fadeMat.uniforms.uFade.value = fpf; U.uComp.value = Math.min(1, fpf * 2.2);
      blitMat.uniforms.uTime.value = time;
      renderer.setRenderTarget(rt); renderer.render(fadeScene, ortho); renderer.render(scene, camera);
      passScene.m.material = brightMat; brightMat.uniforms.uTex.value = rt.texture;
      renderer.setRenderTarget(bA); renderer.render(passScene, ortho);
      var tw = 1 / bA.width, th = 1 / bA.height;
      blur(bA, bB, tw, 0); blur(bB, bA, 0, th); blur(bA, bB, tw * 2.2, 0); blur(bB, bA, 0, th * 2.2);
      renderer.setRenderTarget(null); renderer.render(blitScene, ortho);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return api;
  }

  window.Blog = { $: $, $$: $$, esc: esc, cover: cover, copy: copy, chrome: chrome, swarm: swarm, reduce: reduce };
})();
