/* ============================================================
   THE CLIVIET — cinematic luxury interactions
   Three.js hero + GSAP/ScrollTrigger + Lenis + custom cursor
   ============================================================ */
(function () {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* ---------- register GSAP ---------- */
  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ============================================================
     1. LOADER
     ============================================================ */
  function runLoader() {
    const loader = document.getElementById('loader');
    const letters = document.querySelectorAll('.loader__word span');
    const tl = gsap.timeline();

    tl.to('#cPath', { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
      .to(letters, { y: 0, opacity: 1, duration: 0.7, stagger: 0.045, ease: 'power3.out' }, '-=0.5')
      .to('.loader__tag', { opacity: 1, duration: 0.6 }, '-=0.3')
      .to('.loader__bar i', { width: '100%', duration: 0.9, ease: 'power2.inOut' }, '-=0.5')
      .to(loader, {
        yPercent: -100, duration: 1.0, ease: 'expo.inOut',
        onComplete: () => { loader.style.display = 'none'; }
      }, '+=0.2')
      .add(revealHero, '-=0.6');
  }

  /* ============================================================
     2. HERO INTRO
     ============================================================ */
  function revealHero() {
    gsap.to('.hero__title .w', { y: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out' });
    gsap.to('.hero [data-fade]', { opacity: 1, duration: 1, stagger: 0.15, delay: 0.35, ease: 'power2.out' });
  }

  /* ============================================================
     3. LENIS SMOOTH SCROLL
     ============================================================ */
  let lenis = null;
  function initLenis() {
    if (reduceMotion || typeof Lenis === 'undefined') return;
    lenis = new Lenis({ duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    // anchor links
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length > 1) {
          const el = document.querySelector(id);
          if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: 0 }); closeMenu(); }
        }
      });
    });
  }

  /* ============================================================
     4. THREE.JS HERO — floating gold particles + light ribbon
     ============================================================ */
  function initThree() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 14;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    /* --- gold particle field --- */
    const COUNT = 900;
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 34;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
      speeds[i] = 0.002 + Math.random() * 0.006;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // soft round gold sprite
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(232,207,148,1)');
    g.addColorStop(0.4, 'rgba(198,161,91,0.6)');
    g.addColorStop(1, 'rgba(198,161,91,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
    const sprite = new THREE.CanvasTexture(c);

    const mat = new THREE.PointsMaterial({
      size: 0.42, map: sprite, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, opacity: 0.9
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    /* --- floating gold torus (abstract "bag handle" ring) --- */
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xc6a15b, metalness: 1, roughness: 0.25, emissive: 0x3a2a12, emissiveIntensity: 0.4 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.14, 32, 160), ringMat);
    ring.rotation.x = 0.7;
    scene.add(ring);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(4.8, 0.05, 24, 160), ringMat);
    ring2.rotation.x = -0.5; ring2.rotation.y = 0.4;
    scene.add(ring2);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const key = new THREE.PointLight(0xffe6b0, 1.6, 60); key.position.set(6, 8, 12); scene.add(key);
    const fill = new THREE.PointLight(0xc6a15b, 1.1, 60); fill.position.set(-8, -4, 8); scene.add(fill);

    let mx = 0, my = 0, tx = 0, ty = 0;
    if (!isTouch) {
      window.addEventListener('mousemove', (e) => {
        tx = (e.clientX / window.innerWidth - 0.5);
        ty = (e.clientY / window.innerHeight - 0.5);
      });
    }

    const clock = new THREE.Clock();
    function animate() {
      const t = clock.getElapsedTime();
      const arr = geo.attributes.position.array;
      for (let i = 0; i < COUNT; i++) {
        arr[i * 3 + 1] += speeds[i];
        if (arr[i * 3 + 1] > 11) arr[i * 3 + 1] = -11;
      }
      geo.attributes.position.needsUpdate = true;

      mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
      points.rotation.y = t * 0.03 + mx * 0.4;
      points.rotation.x = my * 0.2;
      ring.rotation.z = t * 0.15; ring.rotation.y = t * 0.1 + mx * 0.6;
      ring2.rotation.z = -t * 0.1; ring2.rotation.x = -0.5 + my * 0.5;
      camera.position.x += (mx * 2 - camera.position.x) * 0.05;
      camera.position.y += (-my * 1.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    // parallax scroll fade of the whole canvas
    if (window.ScrollTrigger) {
      gsap.to(canvas, {
        opacity: 0.15, yPercent: 12, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* ============================================================
     5. SCROLL REVEALS
     ============================================================ */
  function initReveals() {
    if (reduceMotion || !window.ScrollTrigger) {
      document.querySelectorAll('[data-reveal]').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
      return;
    }
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 86%' }
      });
    });
    // stagger grids
    ['.collection__grid', '.why__grid', '.contact__cards'].forEach((sel) => {
      const parent = document.querySelector(sel);
      if (!parent) return;
      const kids = parent.querySelectorAll('[data-reveal]');
      ScrollTrigger.create({
        trigger: parent, start: 'top 82%',
        onEnter: () => gsap.to(kids, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out' })
      });
    });
    // section title parallax
    gsap.utils.toArray('.section-head__title').forEach((t) => {
      gsap.fromTo(t, { y: 30 }, {
        y: -30, ease: 'none',
        scrollTrigger: { trigger: t, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    // spotlight image reveal
    const sImg = document.querySelector('.spotlight__media img');
    if (sImg) gsap.fromTo(sImg, { scale: 1.25 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.spotlight', start: 'top bottom', end: 'center center', scrub: true }
    });
  }

  /* ============================================================
     6. MARQUEE
     ============================================================ */
  function initMarquee() {
    if (reduceMotion || !window.gsap) return;
    gsap.to('#marqueeTrack', { xPercent: -50, duration: 22, ease: 'none', repeat: -1 });
  }

  /* ============================================================
     7. NAV + MOBILE MENU
     ============================================================ */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  function closeMenu() { burger && burger.classList.remove('open'); menu && menu.classList.remove('open'); }
  function initNav() {
    const nav = document.getElementById('nav');
    const onScroll = () => { nav.classList.toggle('scrolled', window.scrollY > 60); };
    window.addEventListener('scroll', onScroll); onScroll();
    if (burger) burger.addEventListener('click', () => {
      burger.classList.toggle('open'); menu.classList.toggle('open');
    });
    menu && menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  }

  /* ============================================================
     8. CUSTOM CURSOR
     ============================================================ */
  function initCursor() {
    if (isTouch) return;
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let dx = 0, dy = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', (e) => { dx = e.clientX; dy = e.clientY; });
    function loop() {
      dot.style.transform = `translate(${dx}px,${dy}px) translate(-50%,-50%)`;
      rx += (dx - rx) * 0.18; ry += (dy - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    }
    loop();
    document.querySelectorAll('[data-hover],a,button,.product').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('grow'));
      el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  window.addEventListener('load', () => {
    initCursor();
    initNav();
    initLenis();
    initThree();
    initMarquee();
    initReveals();
    if (!reduceMotion && window.gsap) { runLoader(); }
    else {
      const l = document.getElementById('loader'); if (l) l.style.display = 'none';
      document.querySelectorAll('.hero__title .w').forEach(w => w.style.transform = 'none');
      document.querySelectorAll('.hero [data-fade]').forEach(f => f.style.opacity = 1);
    }
  });
})();
