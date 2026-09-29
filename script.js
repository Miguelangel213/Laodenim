(function () {
  'use strict';

  var lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf() { lenis.raf(performance.now()); requestAnimationFrame(raf); })();
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initReveals();
    initCinema();
  });

  function initNav() {
    var toggle = document.getElementById('nav-toggle');
    var navLinks = document.getElementById('nav-links');
    if (!toggle || !navLinks) return;
    toggle.addEventListener('click', function () {
      var isOpen = toggle.classList.toggle('open');
      navLinks.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (lenis) { isOpen ? lenis.stop() : lenis.start(); }
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
        document.body.style.overflow = '';
        if (lenis) lenis.start();
      });
    });
  }

  function initReveals() {
    var reveals = document.querySelectorAll('[data-reveal]');
    if (!reveals.length) return;
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('revealed'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = el.dataset.revealDelay || 0;
          setTimeout(function () { el.classList.add('revealed'); }, delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) {
      var parent = el.parentElement;
      var siblings = parent ? Array.from(parent.children).filter(function (c) { return c.hasAttribute('data-reveal'); }) : [];
      var index = siblings.indexOf(el);
      if (index > 0) el.dataset.revealDelay = index * 80;
      observer.observe(el);
    });
  }

  function initCinema() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    var cinema = document.querySelector('.cinema');
    var canvas = document.querySelector('.cinema-canvas');
    var video = document.querySelector('.cinema-video');
    var header = document.querySelector('.header');
    if (!cinema || !canvas || !video) return;

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      cinema.style.display = 'none';
      if (header) { header.classList.remove('header--dark'); header.classList.add('header--light'); }
      return;
    }

    var ctx = canvas.getContext('2d', { alpha: false });
    var frames = [];
    var totalFrames = 60;
    var currentFrame = -1;
    var ready = false;

    function sizeCanvas() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = cinema.offsetWidth * dpr;
      canvas.height = cinema.offsetHeight * dpr;
      canvas.style.width = cinema.offsetWidth + 'px';
      canvas.style.height = cinema.offsetHeight + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      if (currentFrame >= 0 && frames[currentFrame]) {
        drawFrame(currentFrame);
      }
    }

    function drawFrame(index) {
      var img = frames[index];
      if (!img) return;
      var cw = canvas.width;
      var ch = canvas.height;
      var iw = img.width;
      var ih = img.height;
      var scale = Math.max(cw / iw, ch / ih);
      var dw = iw * scale;
      var dh = ih * scale;
      var dx = (cw - dw) / 2;
      var dy = (ch - dh) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    function extractFrames() {
      return new Promise(function (resolve) {
        var duration = video.duration;
        var extracted = 0;
        var extracting = false;
        var tempCanvas = document.createElement('canvas');
        var tempCtx = tempCanvas.getContext('2d', { alpha: false });
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;

        function seekNext() {
          if (extracted >= totalFrames) {
            console.log('✓ Frames ready:', totalFrames);
            resolve();
            return;
          }
          var time = (extracted / (totalFrames - 1)) * duration;
          extracting = true;
          video.currentTime = time;
        }

        video.addEventListener('seeked', function onSeeked() {
          if (!extracting) return;
          extracting = false;
          tempCtx.drawImage(video, 0, 0);
          createImageBitmap(tempCanvas).then(function (bmp) {
            frames[extracted] = bmp;
            extracted++;
            if (extracted % 30 === 0) {
              console.log('Loading:', Math.round((extracted / totalFrames) * 100) + '%');
            }
            seekNext();
          }).catch(function () {
            extracted++;
            seekNext();
          });
        });

        seekNext();
      });
    }

    function splitTitle() {
      var title = document.querySelector('.c-title');
      if (!title) return;
      var text = title.textContent;
      title.setAttribute('aria-label', text);
      title.innerHTML = '';
      text.split('').forEach(function (ch) {
        var wrap = document.createElement('span');
        wrap.className = 'char-wrap';
        var span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch;
        wrap.appendChild(span);
        title.appendChild(wrap);
      });
    }

    function buildTimeline() {
      var scrubObj = { frame: 0 };

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: cinema,
          start: 'top top',
          end: '+=5000',
          scrub: 0.3,
          pin: true,
          anticipatePin: 1
        }
      });

      // Phase 1-3: Video frames (0s – 7s of timeline)
      tl.to(scrubObj, {
        frame: totalFrames - 1,
        ease: 'none',
        duration: 7,
        onUpdate: function () {
          var f = Math.round(scrubObj.frame);
          if (f !== currentFrame && frames[f]) {
            currentFrame = f;
            drawFrame(f);
          }
        }
      }, 0);

      // Phase 4: Typography reveal over last portion of video (5s – 7s)
      tl.fromTo('.c-title .char',
        { yPercent: 110 },
        { yPercent: 0, stagger: 0.04, duration: 0.7, ease: 'power4.out' },
        5
      );

      tl.fromTo('.c-subtitle',
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        5.8
      );

      // Phase 5: Dissolve — fade everything out (8s – 10s)
      tl.to('.c-title .char', {
        y: -40,
        opacity: 0,
        stagger: 0.02,
        duration: 0.6,
        ease: 'power3.in'
      }, 8);

      tl.to('.c-subtitle', {
        y: -20,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.in'
      }, 8.3);

      tl.to(cinema, {
        opacity: 0,
        duration: 0.8
      }, 9.2);
    }

    function buildHeaderTransition() {
      if (!header) return;
      ScrollTrigger.create({
        trigger: '.hero-landing',
        start: 'top 60%',
        onEnter: function () {
          header.classList.remove('header--dark');
          header.classList.add('header--light');
        },
        onLeaveBack: function () {
          header.classList.remove('header--light');
          header.classList.add('header--dark');
        }
      });
    }

    function buildStats() {
      var stats = document.querySelectorAll('.hl-stat-num');
      if (!stats.length) return;
      gsap.from(stats, {
        textContent: 0,
        duration: 1.5,
        snap: { textContent: 1 },
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.hl-stats',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }

    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);

    video.load();
    video.currentTime = 0;

    var firstFrameDrawn = false;

    function drawFirstFrame() {
      if (firstFrameDrawn || video.readyState < 2) return;
      firstFrameDrawn = true;

      var tempCanvas = document.createElement('canvas');
      var tempCtx = tempCanvas.getContext('2d', { alpha: false });
      tempCanvas.width = video.videoWidth;
      tempCanvas.height = video.videoHeight;
      tempCtx.drawImage(video, 0, 0);

      createImageBitmap(tempCanvas).then(function (bmp) {
        frames[0] = bmp;
        currentFrame = 0;
        drawFrame(0);
        console.log('✓ First frame visible');
      });
    }

    video.addEventListener('loadeddata', function () {
      drawFirstFrame();

      extractFrames().then(function () {
        ready = true;

        var brand = document.querySelector('.c-brand');
        if (brand) brand.classList.add('ready');

        splitTitle();
        buildTimeline();
        buildHeaderTransition();
        buildStats();
      });
    });

    video.addEventListener('canplay', drawFirstFrame);

    if (video.readyState >= 2) {
      drawFirstFrame();
      video.dispatchEvent(new Event('loadeddata'));
    }
  }

  // ========================
  // 3D Shirt — Three.js + Mouse Drag Interaction
  // ========================

  // ========================
  // Carousel 3 Cards
  // ========================
  function initCarousel() {
    const HOLD = 2200;
    const MOVE = 1500;
    document.querySelectorAll('[data-carousel]').forEach((stage) => {
      const cards = [...stage.querySelectorAll('.c3d__card')];
      const N = cards.length;
      if (N < 4) return;
      let active = 0;
      const prev = new Array(N).fill(null);

      const offset = (i) => {
        const o = (((i - active) % N) + N) % N;
        return o > N / 2 ? o - N : o;
      };

      function render() {
        cards.forEach((card, i) => {
          const o = offset(i);
          card.classList.toggle('is-jump', prev[i] !== null && Math.abs(o - prev[i]) > 2);
          card.dataset.pos = Math.max(-2, Math.min(2, o));
          prev[i] = o;
        });
      }
      render();

      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;

      let timer;
      const start = () => { timer = setInterval(() => { active = (active + 1) % N; render(); }, HOLD + MOVE); };
      const stop = () => clearInterval(timer);
      start();
      document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    });
  }

  initCarousel();

  // ========================
  // Mesh Gradient Background
  // ========================
  function initMeshGradient() {
    const mesh = document.getElementById('mesh');
    const orange = document.getElementById('orange');
    if (!mesh || !orange) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const LERP = 0.07;
    const IDLE_MS = 2500;

    let w = mesh.clientWidth, h = mesh.clientHeight;
    let x = w * .9, y = h * .15, tx = x, ty = y;
    let lastMove = -Infinity;

    addEventListener('resize', function() { w = mesh.clientWidth; h = mesh.clientHeight; });
    addEventListener('pointermove', function(e) {
      const r = mesh.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top; lastMove = performance.now();
    }, { passive: true });

    function frame(t) {
      if (!reduce && t - lastMove > IDLE_MS) {
        tx = w * (.5 + .42 * Math.sin(t / 3400));
        ty = h * (.5 + .38 * Math.sin(t / 2300 + 1.2));
      }
      x += (tx - x) * LERP; y += (ty - y) * LERP;
      orange.style.transform = 'translate(' + x + 'px, ' + y + 'px) translate(-50%, -50%)';
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  initMeshGradient();

})();
