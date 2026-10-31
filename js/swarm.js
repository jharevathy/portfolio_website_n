/**
 * Swarm — a single particle field that re-forms for every section.
 *
 *   0  Hero        sphere (the signature)
 *   1  Work        agent network: hubs joined by dotted links
 *   2  Expertise   four orbiting clusters, one per discipline
 *   3  Experience  double helix
 *   4  Approach    torus — the feedback loop
 *   5  Writing     calm wave plane, low and far back for reading
 *   6  Contact     spiral galaxy
 *
 * Every formation is precomputed once into its own attribute buffer; the
 * vertex shader animates and morphs between them, so the CPU does no
 * per-particle work per frame. Sections declare their formation with
 * data-formation="n"; the morph is driven by where the viewport sits
 * relative to those sections, holding a shape while you read and
 * transitioning across section boundaries.
 */
(function () {
  'use strict';

  var host = document.getElementById('swarm');
  if (!host || typeof THREE === 'undefined') return;

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduceMotion = motionQuery.matches;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    return; // No WebGL: the page still works, just without the swarm.
  }

  // 1.5x keeps dots crisp on retina while cutting fill cost ~45% vs 2x.
  var DPR = Math.min(window.devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(DPR);
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  var FOV = 40;
  var CAM_Z = 32;
  var camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200);
  camera.position.set(0, 0, CAM_Z);

  var w0 = window.innerWidth;
  var COUNT = w0 < 640 ? 5200 : w0 < 1100 ? 7400 : 9600;
  // Lighter swarm on low-core devices.
  if ((navigator.hardwareConcurrency || 8) <= 4) COUNT = Math.round(COUNT * 0.65);
  var FORMS = 7;

  // Per-formation brightness and point-size multipliers. Reading sections
  // sit dimmer so text always wins; hero and finale are allowed to shine.
  var DIM = [1.0, 0.9, 0.95, 0.9, 0.95, 0.8, 1.1];
  var SIZE = [1.0, 0.95, 0.95, 0.95, 0.95, 1.05, 1.0];

  // ------------------------------------------------------------------
  // Deterministic randomness so shapes are identical on every visit.
  // ------------------------------------------------------------------
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gauss(r) {
    var u = 1 - r(), v = r();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  // ------------------------------------------------------------------
  // Geometry
  // ------------------------------------------------------------------
  var geometry = new THREE.BufferGeometry();
  var bufs = [];
  for (var f = 0; f < FORMS; f++) bufs.push(new Float32Array(COUNT * 3));
  var info = new Float32Array(COUNT * 4);

  (function fillInfo() {
    var r = rng(7);
    for (var i = 0; i < COUNT; i++) {
      info[i * 4] = r();       // morph stagger
      info[i * 4 + 1] = r();   // size / drift phase
      info[i * 4 + 2] = r();   // twinkle / colour
      info[i * 4 + 3] = i % 4; // cluster id (formation 2)
    }
  })();

  geometry.setAttribute('position', new THREE.BufferAttribute(bufs[0], 3));
  for (var a = 1; a < FORMS; a++) geometry.setAttribute('p' + a, new THREE.BufferAttribute(bufs[a], 3));
  geometry.setAttribute('aInfo', new THREE.BufferAttribute(info, 4));

  var V3 = function (x, y, z) { return new THREE.Vector3(x, y, z); };

  var uniforms = {
    uTime: { value: 0 },
    uMorph: { value: 0 },
    uDim: { value: 1 },
    uSize: { value: 2.2 * DPR },
    uAspect: { value: 1 },
    uMouse: { value: new THREE.Vector2(9, 9) },
    uMouseOn: { value: 0 },
    uColA: { value: V3(0.86, 0.9, 0.97) },
    uColB: { value: V3(0.486, 0.769, 1.0) },
    uHelixAxis: { value: V3(1, 0, 0) },
    uC0: { value: V3(0, 0, 0) }, uC1: { value: V3(0, 0, 0) }, uC2: { value: V3(0, 0, 0) },
    uC3: { value: V3(0, 0, 0) }, uC4: { value: V3(0, 0, 0) }, uC5: { value: V3(0, 0, 0) },
    uC6: { value: V3(0, 0, 0) },
    uK0: { value: V3(0, 0, 0) }, uK1: { value: V3(0, 0, 0) }, uK2: { value: V3(0, 0, 0) }, uK3: { value: V3(0, 0, 0) }
  };

  var vertexShader = [
    'uniform float uTime, uMorph, uDim, uSize, uAspect, uMouseOn;',
    'uniform vec2 uMouse;',
    'uniform vec3 uColA, uColB, uHelixAxis;',
    'uniform vec3 uC0, uC1, uC2, uC3, uC4, uC5, uC6;',
    'uniform vec3 uK0, uK1, uK2, uK3;',
    'attribute vec3 p1, p2, p3, p4, p5, p6;',
    'attribute vec4 aInfo;',
    'varying vec3 vColor;',
    'varying float vAlpha;',

    'vec3 rotX(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z); }',
    'vec3 rotY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z); }',
    'vec3 rotZ(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z); }',
    'vec3 rotAxis(vec3 p, vec3 k, float a) { float c = cos(a), s = sin(a); return p * c + cross(k, p) * s + k * dot(k, p) * (1.0 - c); }',

    'vec3 form(float k, float t) {',
    '  if (k < 0.5) {',                                   // sphere
    '    vec3 p = rotY(position, t * 0.1);',
    '    p = rotZ(rotX(p, 0.32), -0.18);',
    '    return p + uC0;',
    '  }',
    '  if (k < 1.5) {',                                   // network
    '    vec3 p = rotY(p1, sin(t * 0.06) * 0.22);',
    '    p *= 1.0 + 0.018 * sin(t * 0.8 + aInfo.y * 6.2831);',
    '    return p + uC1;',
    '  }',
    '  if (k < 2.5) {',                                   // clusters
    '    vec3 c = aInfo.w < 0.5 ? uK0 : (aInfo.w < 1.5 ? uK1 : (aInfo.w < 2.5 ? uK2 : uK3));',
    '    vec3 p = rotY(p2, t * (0.26 + aInfo.w * 0.05));',
    '    return p + c + uC2;',
    '  }',
    '  if (k < 3.5) {',                                   // helix
    '    return rotAxis(p3, uHelixAxis, t * 0.3) + uC3;',
    '  }',
    '  if (k < 4.5) {',                                   // torus
    '    vec3 p = rotY(p4, t * 0.12);',
    '    p = rotZ(rotX(p, 1.12), 0.3);',
    '    return p + uC4;',
    '  }',
    '  if (k < 5.5) {',                                   // wave plane
    '    vec3 p = p5;',
    '    p.y += sin(p.x * 0.22 + t * 0.35) * 1.0 + cos(p.z * 0.26 + t * 0.28) * 0.8 + sin((p.x + p.z) * 0.11 + t * 0.2) * 0.5;',
    '    return p + uC5;',
    '  }',
    '  vec3 p = p6;',                                     // galaxy
    '  float r = length(p.xz);',
    '  p = rotY(p, t * (0.2 / (0.6 + r * 0.14)));',
    '  p = rotZ(rotX(p, 0.62), 0.12);',
    '  return p + uC6;',
    '}',

    'void main() {',
    '  float t = uTime;',
    '  float k = floor(uMorph);',
    '  float f = uMorph - k;',
    '  float ff = clamp(f * 1.6 - aInfo.x * 0.6, 0.0, 1.0);',
    '  ff = ff * ff * (3.0 - 2.0 * ff);',
    '  vec3 pos = form(k, t);',
    '  if (f > 0.0005) {',
    '    vec3 b = form(min(k + 1.0, 6.0), t);',
    '    pos = mix(pos, b, ff);',
    '    float arc = sin(ff * 3.14159);',
    '    pos += vec3(sin(aInfo.y * 31.0 + t * 0.4), cos(aInfo.z * 29.0 + t * 0.35), sin(aInfo.x * 37.0)) * arc * 1.8;',
    '  }',
    '  pos += vec3(sin(t * 0.3 + aInfo.y * 20.0), cos(t * 0.25 + aInfo.z * 20.0), sin(t * 0.2 + aInfo.x * 20.0)) * 0.05;',

    '  vec4 mv = modelViewMatrix * vec4(pos, 1.0);',
    '  vec4 clip = projectionMatrix * mv;',
    '  vec2 ndc = clip.xy / clip.w;',
    '  vec2 d = (ndc - uMouse) * vec2(uAspect, 1.0);',
    '  float dl = length(d);',
    '  float push = uMouseOn * smoothstep(0.3, 0.0, dl);',
    '  mv.xy += (d / max(dl, 0.0001)) * push * 1.2 * (-mv.z / 32.0);',
    '  gl_Position = projectionMatrix * mv;',

    '  float depth = -mv.z;',
    '  gl_PointSize = clamp(uSize * (0.55 + aInfo.y * 0.9) * (32.0 / depth), 1.0, 14.0);',
    '  float tw = 0.72 + 0.28 * sin(t * (0.6 + aInfo.z * 1.8) + aInfo.x * 40.0);',
    '  float df = smoothstep(62.0, 24.0, depth);',
    '  vAlpha = tw * uDim * mix(0.3, 1.0, df) * (1.0 + push * 0.8);',
    '  vColor = mix(uColA, uColB, step(0.84, aInfo.z));',
    '}'
  ].join('\n');

  var fragmentShader = [
    'varying vec3 vColor;',
    'varying float vAlpha;',
    'void main() {',
    '  vec2 c = gl_PointCoord - 0.5;',
    '  float d = length(c);',
    '  if (d > 0.5) discard;',
    '  float a = smoothstep(0.5, 0.0, d);',
    '  gl_FragColor = vec4(vColor, pow(a, 1.6) * vAlpha);',
    '}'
  ].join('\n');

  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending
  });

  var points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);

  // ------------------------------------------------------------------
  // Formation builders. hw/hh = visible half-width/height at z = 0.
  // Each writes LOCAL coordinates; centres go to uniforms.
  // ------------------------------------------------------------------
  var GOLDEN = Math.PI * (3 - Math.sqrt(5));

  function buildSphere(out, hw, hh, mode) {
    var R, cx, cy, cz;
    if (mode === 'wide') { R = Math.min(hh * 0.64, hw * 0.37); cx = hw * 0.5; cy = hh * 0.06; cz = 0; }
    else if (mode === 'mid') { R = Math.min(hh * 0.5, hw * 0.48); cx = hw * 0.38; cy = hh * 0.12; cz = -2; }
    else { R = Math.min(hw * 0.74, hh * 0.42); cx = 0; cy = hh * 0.5; cz = -4; }
    var r = rng(11);
    for (var i = 0; i < COUNT; i++) {
      var y = 1 - ((i + 0.5) / COUNT) * 2;
      var rad = Math.sqrt(1 - y * y);
      var th = GOLDEN * i;
      var s = R * (1 + (r() - 0.5) * 0.03);
      out[i * 3] = Math.cos(th) * rad * s;
      out[i * 3 + 1] = y * s;
      out[i * 3 + 2] = Math.sin(th) * rad * s;
    }
    uniforms.uC0.value.set(cx, cy, cz);
  }

  function buildNetwork(out, hw, hh) {
    var r = rng(23);
    var H = 18, hubs = [], i, j;
    for (i = 0; i < H; i++) {
      hubs.push({
        x: (r() * 2 - 1) * hw * 1.02,
        y: (r() * 2 - 1) * hh * 0.92,
        z: (r() * 2 - 1) * 5,
        s: 0.6 + r() * 0.9
      });
    }
    var edges = [], seen = {};
    for (i = 0; i < H; i++) {
      var d = [];
      for (j = 0; j < H; j++) if (j !== i) {
        var dx = hubs[i].x - hubs[j].x, dy = hubs[i].y - hubs[j].y, dz = hubs[i].z - hubs[j].z;
        d.push({ j: j, d: dx * dx + dy * dy + dz * dz });
      }
      d.sort(function (p, q) { return p.d - q.d; });
      for (var n = 0; n < 2; n++) {
        var key = Math.min(i, d[n].j) + '-' + Math.max(i, d[n].j);
        if (!seen[key]) { seen[key] = 1; edges.push([i, d[n].j]); }
      }
    }
    for (i = 0; i < COUNT; i++) {
      var q = r(), x, y, z;
      if (q < 0.34) {
        var h = hubs[(r() * H) | 0];
        x = h.x + gauss(r) * 0.3 * h.s; y = h.y + gauss(r) * 0.3 * h.s; z = h.z + gauss(r) * 0.3 * h.s;
      } else if (q < 0.94) {
        var e = edges[(r() * edges.length) | 0], A = hubs[e[0]], B = hubs[e[1]], t = r();
        x = A.x + (B.x - A.x) * t + gauss(r) * 0.04;
        y = A.y + (B.y - A.y) * t + gauss(r) * 0.04;
        z = A.z + (B.z - A.z) * t + gauss(r) * 0.04;
      } else {
        x = (r() * 2 - 1) * hw * 1.2; y = (r() * 2 - 1) * hh * 1.1; z = (r() * 2 - 1) * 8;
      }
      out[i * 3] = x; out[i * 3 + 1] = y; out[i * 3 + 2] = z;
    }
    uniforms.uC1.value.set(0, 0, -3);
  }

  function buildClusters(out, hw, hh, mode) {
    var r = rng(31);
    var sx = mode === 'narrow' ? hw * 0.5 : hw * 0.56;
    var sy = mode === 'narrow' ? hh * 0.5 : hh * 0.44;
    var centers = [V3(-sx, sy, -1), V3(sx, sy, -4), V3(-sx, -sy, -4), V3(sx, -sy, -1)];
    uniforms.uK0.value.copy(centers[0]); uniforms.uK1.value.copy(centers[1]);
    uniforms.uK2.value.copy(centers[2]); uniforms.uK3.value.copy(centers[3]);
    var rc = Math.min(hw, hh) * (mode === 'narrow' ? 0.3 : 0.22);
    for (var i = 0; i < COUNT; i++) {
      var c = i % 4, x, y, z;
      if (r() < 0.55) {
        var u = r() * 2 - 1, th = r() * Math.PI * 2, s = Math.sqrt(1 - u * u);
        x = Math.cos(th) * s * rc; y = u * rc; z = Math.sin(th) * s * rc;
      } else {
        var a = r() * Math.PI * 2, rr = rc * (1.6 + gauss(r) * 0.025);
        x = Math.cos(a) * rr; y = gauss(r) * 0.03; z = Math.sin(a) * rr;
        // tilt each cluster's ring differently
        var tx = 0.35 + c * 0.28, tz = -0.3 + c * 0.22;
        var y1 = y * Math.cos(tx) - z * Math.sin(tx), z1 = y * Math.sin(tx) + z * Math.cos(tx);
        var x2 = x * Math.cos(tz) - y1 * Math.sin(tz), y2 = x * Math.sin(tz) + y1 * Math.cos(tz);
        x = x2; y = y2; z = z1;
      }
      out[i * 3] = x; out[i * 3 + 1] = y; out[i * 3 + 2] = z;
    }
    uniforms.uC2.value.set(0, 0, -2);
  }

  function buildHelix(out, hw, hh, mode) {
    var r = rng(41);
    var vertical = mode === 'narrow';
    var L = vertical ? hh * 2.2 : hw * 2.3;
    var R = vertical ? hw * 0.55 : hh * 0.32;
    var turns = vertical ? 2.6 : 3.2, rungs = 44;
    for (var i = 0; i < COUNT; i++) {
      var along, ang, k;
      if (r() < 0.7) {
        var t = r(), strand = i % 2;
        along = (t - 0.5) * L;
        ang = t * turns * Math.PI * 2 + strand * Math.PI;
        k = 1;
      } else {
        var rung = (r() * rungs) | 0, tt = (rung + 0.5) / rungs;
        along = (tt - 0.5) * L;
        ang = tt * turns * Math.PI * 2;
        k = 1 - 2 * r();
      }
      var a1 = Math.cos(ang) * R * k + gauss(r) * 0.06;
      var a2 = Math.sin(ang) * R * k + gauss(r) * 0.06;
      if (vertical) { out[i * 3] = a1; out[i * 3 + 1] = along; out[i * 3 + 2] = a2; }
      else { out[i * 3] = along; out[i * 3 + 1] = a1; out[i * 3 + 2] = a2; }
    }
    uniforms.uHelixAxis.value.set(vertical ? 0 : 1, vertical ? 1 : 0, 0);
    uniforms.uC3.value.set(0, 0, -3);
  }

  function buildTorus(out, hw, hh, mode) {
    var r = rng(53);
    var R = mode === 'narrow' ? hw * 0.85 : Math.min(hh * 0.74, hw * 0.55);
    var tube = R * 0.15;
    for (var i = 0; i < COUNT; i++) {
      var u = r() * Math.PI * 2, x, y, z;
      if (r() < 0.84) {
        var v = r() * Math.PI * 2;
        x = (R + tube * Math.cos(v)) * Math.cos(u);
        y = tube * Math.sin(v);
        z = (R + tube * Math.cos(v)) * Math.sin(u);
      } else {
        var ri = R * (0.56 + gauss(r) * 0.01);
        x = Math.cos(u) * ri; y = gauss(r) * 0.04; z = Math.sin(u) * ri;
      }
      out[i * 3] = x; out[i * 3 + 1] = y; out[i * 3 + 2] = z;
    }
    uniforms.uC4.value.set(0, 0, -4);
  }

  function buildWave(out, hw, hh) {
    var r = rng(61);
    var W = hw * 3.4, D = 32;
    var cols = Math.ceil(Math.sqrt(COUNT * (W / D))), rows = Math.ceil(COUNT / cols);
    for (var i = 0; i < COUNT; i++) {
      var cx = i % cols, cz = (i / cols) | 0;
      out[i * 3] = (cx / (cols - 1) - 0.5) * W + (r() - 0.5) * 0.12;
      out[i * 3 + 1] = 0;
      out[i * 3 + 2] = (cz / (rows - 1)) * -D + 8 + (r() - 0.5) * 0.12;
    }
    uniforms.uC5.value.set(0, -hh * 0.62, -4);
  }

  function buildGalaxy(out, hw, hh, mode) {
    var r = rng(71);
    var Rg = mode === 'narrow' ? hw * 1.5 : hw * 1.12;
    var arms = 3;
    for (var i = 0; i < COUNT; i++) {
      var x, z, y;
      if (r() < 0.16) {
        var rr0 = Math.abs(gauss(r)) * Rg * 0.1, a0 = r() * Math.PI * 2;
        x = Math.cos(a0) * rr0; z = Math.sin(a0) * rr0; y = gauss(r) * Rg * 0.04;
      } else {
        var rr = Math.pow(r(), 0.75) * Rg;
        var arm = (i % arms) * (Math.PI * 2 / arms);
        var a = arm + rr / Rg * 4.2 + gauss(r) * (0.12 + 0.1 * (1 - rr / Rg));
        x = Math.cos(a) * rr; z = Math.sin(a) * rr; y = gauss(r) * 0.18;
      }
      out[i * 3] = x; out[i * 3 + 1] = y; out[i * 3 + 2] = z;
    }
    uniforms.uC6.value.set(0, mode === 'narrow' ? hh * 0.08 : 0, -6);
  }

  var currentKey = '';
  function rebuild(force) {
    var aspect = window.innerWidth / window.innerHeight;
    var hh = Math.tan((FOV / 2) * Math.PI / 180) * CAM_Z;
    var hw = hh * aspect;
    var mode = aspect >= 1.3 ? 'wide' : aspect >= 0.9 ? 'mid' : 'narrow';
    // Rebuild only when the shape of the viewport changes meaningfully
    // (avoids churn from mobile URL-bar resizes).
    var key = mode + ':' + Math.round(aspect * 10);
    if (!force && key === currentKey) return;
    currentKey = key;

    buildSphere(bufs[0], hw, hh, mode);
    buildNetwork(bufs[1], hw, hh);
    buildClusters(bufs[2], hw, hh, mode);
    buildHelix(bufs[3], hw, hh, mode);
    buildTorus(bufs[4], hw, hh, mode);
    buildWave(bufs[5], hw, hh);
    buildGalaxy(bufs[6], hw, hh, mode);
    geometry.attributes.position.needsUpdate = true;
    for (var a = 1; a < FORMS; a++) geometry.attributes['p' + a].needsUpdate = true;
  }

  function resize() {
    var w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    uniforms.uAspect.value = w / h;
    var base = w < 640 ? 2.3 : w < 1100 ? 2.5 : 2.7;
    uniforms.uSize.value = base * DPR;
    rebuild(false);
    requestRender();
  }

  // ------------------------------------------------------------------
  // Scroll → formation
  // ------------------------------------------------------------------
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-formation]'))
    .sort(function (a, b) { return +a.dataset.formation - +b.dataset.formation; });

  function targetMorph() {
    if (!sections.length) return 0;
    var vh = window.innerHeight;
    var c = vh * 0.5;
    var T = vh * 0.38; // half-width of the transition zone around each boundary
    var last = sections.length - 1;
    for (var i = 0; i <= last; i++) {
      var rect = sections[i].getBoundingClientRect();
      if (c < rect.bottom || i === last) {
        if (c < rect.top) return i; // above first section edge
        var dTop = c - rect.top, dBot = rect.bottom - c;
        var idx = +sections[i].dataset.formation;
        if (dTop < T && i > 0) return idx - 0.5 + 0.5 * (dTop / T);
        if (dBot < T && i < last) return idx + 0.5 - 0.5 * (dBot / T);
        return idx;
      }
    }
    return 0;
  }

  // ------------------------------------------------------------------
  // Pointer
  // ------------------------------------------------------------------
  var mouse = { x: 9, y: 9, on: 0, active: false };
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouse.active = true;
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', function () { mouse.active = false; });

  // ------------------------------------------------------------------
  // Loop
  // ------------------------------------------------------------------
  var morph = targetMorph();
  var time = 0;
  var last = performance.now();
  var raf = 0;

  function requestRender() {
    if (!raf && !document.hidden) raf = requestAnimationFrame(frame);
  }

  function lerpArr(arr, m) {
    var k = Math.floor(m), f = m - k;
    var a = arr[Math.max(0, Math.min(arr.length - 1, k))];
    var b = arr[Math.max(0, Math.min(arr.length - 1, k + 1))];
    return a + (b - a) * f;
  }

  function frame(now) {
    raf = 0;
    // While the article reader or mobile menu covers the page, idle.
    if (document.body.classList.contains('is-locked')) {
      last = now;
      setTimeout(requestRender, 250);
      return;
    }
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    var target = targetMorph();
    if (reduceMotion) {
      morph = Math.round(target); // jump between still shapes
    } else {
      time += dt;
      morph += (target - morph) * (1 - Math.exp(-dt * 3.2));
    }

    uniforms.uTime.value = reduceMotion ? 12 : time;
    uniforms.uMorph.value = Math.max(0, Math.min(FORMS - 1, morph));
    uniforms.uDim.value = lerpArr(DIM, morph);
    var s = lerpArr(SIZE, morph);

    var mu = uniforms.uMouse.value;
    mu.x += (mouse.x - mu.x) * 0.12;
    mu.y += (mouse.y - mu.y) * 0.12;
    mouse.on += ((mouse.active && !reduceMotion ? 1 : 0) - mouse.on) * 0.06;
    uniforms.uMouseOn.value = mouse.on;

    var base = window.innerWidth < 640 ? 2.3 : window.innerWidth < 1100 ? 2.5 : 2.7;
    uniforms.uSize.value = base * DPR * s;

    renderer.render(scene, camera);

    if (!reduceMotion) raf = requestAnimationFrame(frame);
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  });
  window.addEventListener('scroll', function () { if (reduceMotion) requestRender(); }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else { last = performance.now(); requestRender(); }
  });

  var onMotionChange = function (e) { reduceMotion = e.matches; requestRender(); };
  if (motionQuery.addEventListener) motionQuery.addEventListener('change', onMotionChange);
  else if (motionQuery.addListener) motionQuery.addListener(onMotionChange);

  rebuild(true);
  resize();
  requestRender();
})();
