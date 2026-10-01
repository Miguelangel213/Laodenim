(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lenis;

  if (!reduced && typeof Lenis !== 'undefined') {
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
    initHero();
    initReel();
  });

  function initNav() {
    var toggle = document.getElementById('nav-toggle');
    var navLinks = document.getElementById('nav-links');
    if (!toggle || !navLinks) return;

    function close() {
      toggle.classList.remove('open');
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    }

    toggle.addEventListener('click', function () {
      var isOpen = toggle.classList.toggle('open');
      navLinks.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (lenis) { isOpen ? lenis.stop() : lenis.start(); }
    });
    navLinks.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  function setHeader(light) {
    var header = document.querySelector('.header');
    if (!header) return;
    header.classList.toggle('header--light', light);
    header.classList.toggle('header--dark', !light);
  }

  function initHero() {
    var frame = document.querySelector('.hero-frame');
    var canvas = document.querySelector('.hero-canvas');
    var video = document.querySelector('.hero-video');
    if (!frame || !canvas || !video) return;

    var ctx = canvas.getContext('2d');
    var frames = [];
    var totalFrames = 60;
    var current = -1;

    function sizeCanvas() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = frame.offsetWidth * dpr;
      canvas.height = frame.offsetHeight * dpr;
      if (current >= 0) draw(current);
    }

    function draw(i) {
      var img = frames[i];
      if (!img) return;
      var cw = canvas.width, ch = canvas.height;
      var scale = Math.max(cw / img.width, ch / img.height);
      var dw = img.width * scale, dh = img.height * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    }

    function grab(canvasEl, cb) {
      canvasEl.getContext('2d').drawImage(video, 0, 0);
      createImageBitmap(canvasEl).then(cb).catch(function () { cb(null); });
    }

    function extractFrames() {
      return new Promise(function (resolve) {
        var temp = document.createElement('canvas');
        temp.width = video.videoWidth;
        temp.height = video.videoHeight;
        var n = 0;

        function next() {
          if (n >= totalFrames) { video.removeEventListener('seeked', onSeeked); resolve(); return; }
          video.currentTime = (n / (totalFrames - 1)) * video.duration;
        }
        function onSeeked() {
          grab(temp, function (bmp) {
            frames[n] = bmp;
            n++;
            next();
          });
        }
        video.addEventListener('seeked', onSeeked);
        next();
      });
    }

    function isBlank(bmp) {
      if (!bmp) return true;
      var probe = document.createElement('canvas');
      probe.width = 32; probe.height = 18;
      var pctx = probe.getContext('2d');
      pctx.drawImage(bmp, 0, 0, 32, 18);
      var d = pctx.getImageData(0, 0, 32, 18).data;
      for (var i = 0; i < d.length; i += 4) { if (d[i] + d[i + 1] + d[i + 2] > 0) return false; }
      return true;
    }

    function buildScroll() {
      if (reduced || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
      var state = { frame: 0 };
      gsap.to(state, {
        frame: totalFrames - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: '+=220%',
          scrub: 0.3,
          pin: true,
          anticipatePin: 1,
          refreshPriority: 10
        },
        onUpdate: function () {
          var f = Math.round(state.frame);
          if (f !== current && frames[f]) { current = f; draw(f); }
        }
      });
    }

    function buildHeader() {
      if (typeof ScrollTrigger === 'undefined') return;
      ScrollTrigger.create({
        trigger: '#piezas',
        start: 'top 40px',
        onEnter: function () { setHeader(true); },
        onLeaveBack: function () { setHeader(false); }
      });
    }

    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      buildHeader();
    }

    var started = false;
    function onReady() {
      if (started || video.readyState < 2) return;
      started = true;
      var first = document.createElement('canvas');
      first.width = video.videoWidth;
      first.height = video.videoHeight;
      grab(first, function (bmp) {
        frames[0] = bmp;
        current = 0;
        draw(0);
        if (reduced) return;
        extractFrames().then(function () {
          if (isBlank(frames[totalFrames - 1])) { canvas.hidden = true; return; }
          buildScroll();
          ScrollTrigger.refresh();
        });
      });
    }

    video.addEventListener('loadeddata', onReady);
    video.addEventListener('canplay', onReady);
    video.load();
    if (video.readyState >= 2) onReady();
  }

  function initReel() {
    var reel = document.querySelector('.reel');
    var track = document.querySelector('.reel-track');
    if (!reel || !track || reduced) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.matchMedia({
      '(min-width: 900px)': function () {
        track.style.overflowX = 'visible';
        track.style.scrollSnapType = 'none';
        var distance = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
        gsap.to(track, {
          x: function () { return -distance(); },
          ease: 'none',
          scrollTrigger: {
            trigger: reel,
            start: 'top 12%',
            end: function () { return '+=' + distance(); },
            scrub: 0.5,
            pin: true,
            invalidateOnRefresh: true
          }
        });
        return function () {
          track.style.overflowX = '';
          track.style.scrollSnapType = '';
          gsap.set(track, { clearProps: 'transform' });
        };
      }
    });
  }
})();
