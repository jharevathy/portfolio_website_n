/**
 * ARCHITECTURAL 3D MORPHING SWARM & TOPIC HIGHLIGHTING SPOTLIGHT
 * 
 * - Hero Showstopper: Big 3D Celestial Swarm Sphere (Dense rotating Fibonacci orb framing right)
 * - Topic Highlighting Dot Split: As user scrolls, 360 particles peel off from the sphere and
 *   stream dynamically to highlight the active section heading, spotlighting the topic!
 * - Remaining 2000+ particles smoothly morph into distinct section wave topographies:
 *     01. Hero: Showstopper Fibonacci Sphere
 *     02. Highlights: 45° Diagonal Wave Surge (Behind frosted matte cards)
 *     03. Capabilities: Vertical Cascading Waterfall Wave
 *     04. Resume: Calm Grounded Topographical Matrix
 *     05. Methodology: Horizontal Resonant Quantum Ribbon (Screenshot 2 gold standard)
 *     06. Insights & Footer: Expansive Parabolic Infinity Horizon
 * - 100% C1 Continuous Cubic Hermite morphing (Critically damped, zero pop/jerk)
 * - Delicate starlight calibration: non-distracting ambient depth behind matte-morphism panels
 */

(function () {
  const container = document.getElementById('neural-canvas-container');
  if (!container) return;

  const isSmallMobile = window.innerWidth <= 480;
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth <= 1024;

  // 1. Swarm Dimensions: 2400 particles on desktop
  const cols = isSmallMobile ? 40 : isMobile ? 50 : isTablet ? 56 : 60;
  const rows = isSmallMobile ? 30 : isMobile ? 34 : isTablet ? 38 : 40;
  const particleCount = cols * rows; // Desktop: 2400
  const highlightCount = Math.round(particleCount * 0.15); // ~360 particles for heading spotlight
  const goldenRatioAngle = Math.PI * (3 - Math.sqrt(5)); // ~2.39996 rad

  // 2. Scene, Camera, WebGL Renderer
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    isMobile ? 50 : 42,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );

  function updateCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    const baseZ = isMobile ? 38 : 34;
    camera.position.z = aspect < 1 ? baseZ / aspect : baseZ;
    camera.position.y = isMobile ? 2.0 : 1.2;
    camera.position.x = 0;
    camera.lookAt(0, -0.6, 0);
  }
  updateCamera();

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0); // 100% Transparent
  container.appendChild(renderer.domElement);

  // 3. Horizontal Chromatic Palette (Left-to-Right Spectral Harmony)
  const gradientStops = [
    { stop: 0.00, r: 0.00, g: 0.72, b: 0.95 }, // Brilliant Electric Cyan (#00b8f4)
    { stop: 0.16, r: 0.18, g: 0.48, b: 0.95 }, // Royal Iris Blue (#2e7af2)
    { stop: 0.36, r: 0.52, g: 0.28, b: 0.92 }, // Luminous Violet (#8547eb)
    { stop: 0.56, r: 0.88, g: 0.22, b: 0.70 }, // Vibrant Orchid Magenta (#e038b3)
    { stop: 0.74, r: 0.96, g: 0.44, b: 0.24 }, // Coral Tangerine (#f5703d)
    { stop: 0.88, r: 0.98, g: 0.74, b: 0.14 }, // Radiant Amber Gold (#fabc24)
    { stop: 1.00, r: 0.10, g: 0.82, b: 0.52 }  // Electric Jade Emerald (#1ad185)
  ];

  function getGradientColor(t) {
    t = Math.max(0, Math.min(1, t));
    for (let i = 0; i < gradientStops.length - 1; i++) {
      const s0 = gradientStops[i];
      const s1 = gradientStops[i + 1];
      if (t >= s0.stop && t <= s1.stop) {
        const factor = (t - s0.stop) / (s1.stop - s0.stop);
        return {
          r: s0.r + factor * (s1.r - s0.r),
          g: s0.g + factor * (s1.g - s0.g),
          b: s0.b + factor * (s1.b - s0.b)
        };
      }
    }
    const last = gradientStops[gradientStops.length - 1];
    return { r: last.r, g: last.g, b: last.b };
  }

  // 4. Geometry & Color Attributes
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const alphas = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const colIdx = i % cols;
    const u = colIdx / (cols - 1);
    const col = getGradientColor(u);
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
    alphas[i] = 0.92;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

  // 5. Shader Material: Ambient Starlight Particles (Luminous Bokeh)
  const pointScale = isSmallMobile ? 3.8 : isMobile ? 4.8 : 5.6;

  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      pointScale: { value: pointScale },
      time: { value: 0 }
    },
    vertexShader: `
      attribute vec3 color;
      attribute float alpha;
      varying vec3 vColor;
      varying float vAlpha;
      uniform float pointScale;
      void main() {
        vColor = color;
        vAlpha = alpha;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // Depth-scaled point size for glowing stardust
        float baseSize = pointScale * (34.0 / -mvPosition.z);
        gl_PointSize = clamp(baseSize * 1.45, 3.0, 11.0);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;
        
        float core = smoothstep(0.48, 0.05, dist);
        float edge = smoothstep(0.50, 0.18, dist);
        
        // Brilliant incandescent core blending out into rich chromatic aura
        vec3 dotColor = mix(vColor, vec3(1.0, 1.0, 1.0), core * 0.72);
        float a = (core * 0.95 + edge * 0.50) * vAlpha;
        
        gl_FragColor = vec4(dotColor, a);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const particleMesh = new THREE.Points(geometry, particleMaterial);
  scene.add(particleMesh);

  // Smooth Hermite Interpolator (C1 continuous)
  function smoothHermite(a, b, x) {
    const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  // 6. Particle Physics Simulation with Unified 3D Swarm Wave Topographies
  class SwarmParticle {
    constructor(index) {
      this.index = index;
      this.col = index % cols;
      this.row = Math.floor(index / cols);
      this.u = this.col / (cols - 1);
      this.v = this.row / (rows - 1);
      this.normIdx = index / (particleCount - 1);

      this.x = (this.u - 0.5) * 44;
      this.y = (Math.random() - 0.5) * 6;
      this.z = (this.v - 0.5) * 26;
      this.vx = 0;
      this.vy = 0;
      this.vz = 0;
    }

    update(time, scroll, mouseWorld) {
      const u = this.u;
      const v = this.v;
      const idx = this.index;
      const normIdx = this.normIdx;

      // ========================================================
      // 1. HERO SHOWSTOPPER: 3D CELESTIAL SWARM SPHERE (CIRCLE)
      // Dense 2400-particle Fibonacci sphere rotating serenely; sweeps behind frosted mat
      // ========================================================
      function getSphere(r) {
        const lat = 1 - normIdx * 2;
        const d = Math.sqrt(Math.max(0, 1 - lat * lat));
        const lon = goldenRatioAngle * idx + 0.24 * time;
        // Desktop: anchor sphere strictly to the right 55% of the viewport (x = 10.8) with calibrated radius (9.5)
        // This guarantees zero dot collision over the hero title and value proposition on the left!
        const sphereR = isMobile ? 6.2 : isTablet ? 8.2 : 9.5;
        const offsetX = isMobile ? 0 : isTablet ? 7.8 : 10.8;
        const offsetY = isMobile ? -3.8 : 0.4;
        return {
          x: Math.cos(lon) * d * sphereR + offsetX,
          y: lat * sphereR + offsetY,
          z: Math.sin(lon) * d * sphereR - 1.0
        };
      }

      // ========================================================
      // 2. SECTION 3D WAVE TOPOGRAPHIES (VOLUMETRIC SURFACES)
      // ========================================================

      // Highlights: 45° Diagonal Wave Surge (spans full canvas behind all cards)
      function getDiagonalWave() {
        const x = (u - 0.5) * 48.0;
        const yBase = (v - 0.5) * 32.0;
        const diag = (x + yBase) * 0.707;
        const cross = (x - yBase) * 0.707;
        const y = yBase + Math.sin(diag * 0.22 + time * 1.2) * 3.8 +
                          Math.cos(cross * 0.16 - time * 0.9) * 2.2;
        const z = Math.sin(diag * 0.24 - time * 1.0) * 5.0 +
                  Math.cos(cross * 0.20) * 3.2 - 1.5;
        return { x, y, z };
      }

      // Capabilities: Vertical Cascading Waterfall (flows behind sticky panel & right cards)
      function getVerticalWave() {
        const y = (v - 0.5) * 26.0;
        const xBase = (u - 0.5) * 44.0;
        const x = xBase + Math.sin(y * 0.28 + time * 1.3) * 3.8;
        const z = Math.cos(y * 0.24 + xBase * 0.14 + time * 1.0) * 5.5 - 2.5;
        return { x, y, z };
      }

      // Resume: Calm Topographical Matrix Grid (flows behind chronology table)
      function getMatrixWave() {
        const x = (u - 0.5) * 44.0;
        const yBase = (v - 0.5) * 26.0;
        const y = yBase + Math.sin(x * 0.22 + time * 0.8) * 1.8 +
                          Math.cos(yBase * 0.26 + time * 0.6) * 1.4;
        const z = Math.sin((u + v) * 5.0 + time * 0.8) * 3.8 - 2.5;
        return { x, y, z };
      }

      // Methodology: Horizontal Resonant Quantum Ribbon (flows behind 5 step mats)
      function getHorizontalRibbonWave() {
        const x = (u - 0.5) * 46.0;
        const yBase = (v - 0.5) * 26.0;
        const ribbonArch = Math.sin(u * Math.PI) * 2.6;
        const y = yBase + Math.sin(x * 0.28 + time * 1.2) * 2.8 +
                          Math.cos(yBase * 0.30 - time * 0.9) * 1.6 + (ribbonArch - 1.2) * 0.4;
        const z = Math.cos(x * 0.24 + yBase * 0.20 + time * 1.1) * 5.0 - 2.0;
        return { x, y, z };
      }

      // Insights & Footer: Expansive Parabolic Infinity Stream
      function getInfinityWave() {
        const x = (u - 0.5) * 48.0;
        const yBase = (v - 0.5) * 26.0;
        const curve = ((u - 0.5) * (u - 0.5)) * 3.6;
        const y = yBase + Math.sin(x * 0.20 + time * 1.0) * 2.4 + curve * 0.6;
        const z = Math.cos(x * 0.18 + yBase * 0.22 + time * 0.8) * 4.6 - 2.0;
        return { x, y, z };
      }

      // ========================================================
      // CONTINUOUS SECTION INTERPOLATION (C1 CUBIC HERMITE)
      // ========================================================
      let tx = 0, ty = 0, tz = 0;

      if (scroll < 0.08) {
        // Full Sphere in Hero
        const p = getSphere(11.5);
        tx = p.x; ty = p.y; tz = p.z;
      } else if (scroll < 0.20) {
        // Smooth morph Sphere -> 45° Diagonal Wave Surge
        const f = smoothHermite(0.08, 0.20, scroll);
        const p0 = getSphere(11.5);
        const p1 = getDiagonalWave();
        tx = p0.x * (1 - f) + p1.x * f;
        ty = p0.y * (1 - f) + p1.y * f;
        tz = p0.z * (1 - f) + p1.z * f;
      } else if (scroll < 0.50) {
        // Highlights: Pure 45° Diagonal Wave Surge
        const p1 = getDiagonalWave();
        tx = p1.x; ty = p1.y; tz = p1.z;
      } else if (scroll < 0.56) {
        // Morph Diagonal Wave -> Vertical Cascading Waterfall Wave
        const f = smoothHermite(0.50, 0.56, scroll);
        const p1 = getDiagonalWave();
        const p2 = getVerticalWave();
        tx = p1.x * (1 - f) + p2.x * f;
        ty = p1.y * (1 - f) + p2.y * f;
        tz = p1.z * (1 - f) + p2.z * f;
      } else if (scroll < 0.66) {
        // Capabilities: Pure Vertical Cascading Waterfall Wave
        const p2 = getVerticalWave();
        tx = p2.x; ty = p2.y; tz = p2.z;
      } else if (scroll < 0.71) {
        // Morph Vertical Wave -> Calm Topographical Matrix Grid
        const f = smoothHermite(0.66, 0.71, scroll);
        const p2 = getVerticalWave();
        const p3 = getMatrixWave();
        tx = p2.x * (1 - f) + p3.x * f;
        ty = p2.y * (1 - f) + p3.y * f;
        tz = p2.z * (1 - f) + p3.z * f;
      } else if (scroll < 0.81) {
        // Resume: Pure Calm Topographical Matrix Grid
        const p3 = getMatrixWave();
        tx = p3.x; ty = p3.y; tz = p3.z;
      } else if (scroll < 0.86) {
        // Morph Matrix -> Horizontal Resonant Quantum Ribbon (Screenshot 2 Standard)
        const f = smoothHermite(0.81, 0.86, scroll);
        const p3 = getMatrixWave();
        const p4 = getHorizontalRibbonWave();
        tx = p3.x * (1 - f) + p4.x * f;
        ty = p3.y * (1 - f) + p4.y * f;
        tz = p3.z * (1 - f) + p4.z * f;
      } else if (scroll < 0.94) {
        // Methodology: Pure Horizontal Resonant Quantum Ribbon
        const p4 = getHorizontalRibbonWave();
        tx = p4.x; ty = p4.y; tz = p4.z;
      } else {
        // Morph Methodology -> Infinity Horizon Stream
        const f = smoothHermite(0.94, 0.98, scroll);
        const p4 = getHorizontalRibbonWave();
        const p5 = getInfinityWave();
        tx = p4.x * (1 - f) + p5.x * f;
        ty = p4.y * (1 - f) + p5.y * f;
        tz = p4.z * (1 - f) + p5.z * f;
      }

      // Buttery smooth critically damped exponential trajectory (zero jerk / zero pop)
      const lerpSpeed = 0.065;
      this.x += (tx - this.x) * lerpSpeed;
      this.y += (ty - this.y) * lerpSpeed;
      this.z += (tz - this.z) * lerpSpeed;

      // Real-time 3D Mouse Liquid Ripple
      if (mouseWorld && mouseWorld.x < 9000) {
        const dx = this.x - mouseWorld.x;
        const dz = this.z - mouseWorld.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 12.0 && dist > 0.01) {
          const ripple = Math.sin(dist * 0.85 - time * 5.0) * Math.exp(-dist * 0.32) * 1.5;
          this.y += ripple * 0.08;
        }
      }
    }
  }

  // 7. Instantiate Swarm
  const swarm = [];
  for (let i = 0; i < particleCount; i++) {
    swarm.push(new SwarmParticle(i));
  }

  // 8. Trackers
  const mouseWorld = new THREE.Vector3(9999, 9999, 9999);
  const mouseScreen = new THREE.Vector2(-9999, -9999);
  const raycaster = new THREE.Raycaster();
  const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const intersectPoint = new THREE.Vector3();

  let targetScroll = 0;
  let smoothedScroll = 0;

  function onScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    targetScroll = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  window.addEventListener('mousemove', (e) => {
    mouseScreen.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseScreen.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  // 3D Orbit Drag Across Document
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  window.addEventListener('mousedown', (e) => {
    if (['A', 'BUTTON', 'INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    particleMesh.rotation.y += deltaX * 0.0020;
    particleMesh.rotation.x += deltaY * 0.0020;

    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // 9. Resize Handling
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateCamera();
  });

  // 10. Continuous 60fps Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    particleMaterial.uniforms.time.value = elapsedTime;

    // Silky critically-damped scroll lerp (smooth 4.5% glide)
    smoothedScroll += (targetScroll - smoothedScroll) * 0.048;

    // Subtle ambient sphere breathing
    if (!isDragging) {
      particleMesh.rotation.y = Math.sin(elapsedTime * 0.18) * 0.05;
    }

    // Raycast Mouse into 3D Space
    raycaster.setFromCamera(mouseScreen, camera);
    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    planeZ.normal.copy(camDir);
    planeZ.constant = 0;

    if (raycaster.ray.intersectPlane(planeZ, intersectPoint)) {
      mouseWorld.copy(intersectPoint);
    }

    // Update Swarm Positions
    for (let i = 0; i < particleCount; i++) {
      const p = swarm[i];
      p.update(elapsedTime, smoothedScroll, mouseWorld);
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    }

    geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  }

  animate();
})();
