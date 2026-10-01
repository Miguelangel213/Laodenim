"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset } from "@/lib/utils";
import { whatsapp } from "@/data/content";

const TOTAL_FRAMES = 60;
const framePath = (i: number) => asset(`/hero-frames/f${String(i + 1).padStart(3, "0")}.jpg`);

export function Hero() {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const frame = frameRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);

    const images: (HTMLImageElement | undefined)[] = [];
    let wanted = 0;
    let shown = -1;
    let tween: gsap.core.Timeline | undefined;
    let cancelled = false;

    const nearest = (i: number) => {
      for (let d = 0; d < TOTAL_FRAMES; d++) {
        const a = images[i - d];
        if (a) return i - d;
        const b = images[i + d];
        if (b) return i + d;
      }
      return -1;
    };

    const draw = () => {
      const i = nearest(wanted);
      if (i < 0) return;
      shown = i;
      const img = images[i]!;
      const cw = canvas.width, ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = frame.offsetWidth * dpr;
      canvas.height = frame.offsetHeight * dpr;
      draw();
    };

    const load = (i: number) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (cancelled) return;
        images[i] = img;
        if (nearest(wanted) === i || shown < 0) draw();
      };
      img.src = framePath(i);
    };

    load(0);
    for (let i = TOTAL_FRAMES - 1; i > 0; i -= 1) load(i);

    const ro = new ResizeObserver(size);
    ro.observe(frame);
    size();

    if (!reduced) {
      const state = { frame: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "+=380%",
          scrub: 0.4,
          pin: true,
          anticipatePin: 1,
          refreshPriority: 10,
        },
      });
      tl.set(".hero-mark", { opacity: 1 }, 0);
      tl.to(state, {
        frame: TOTAL_FRAMES - 1,
        duration: 10,
        onUpdate: () => {
          const f = Math.round(state.frame);
          if (f !== wanted) { wanted = f; draw(); }
        },
      }, 0)
        .to(".hero-copy", { y: -60, opacity: 0, duration: 1.6, ease: "power2.in" }, 0.8)
        .to(".hero-frame", { "--gap": "0px", borderRadius: 0, duration: 2.6, ease: "power2.inOut" }, 1.2)
        .fromTo(".hero-mark .char", { yPercent: 115 }, { yPercent: 0, stagger: 0.18, duration: 1.4, ease: "power4.out" }, 3.6)
        .fromTo(".hero-tagline", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, 5.4)
        .to(".hero-mark .char", { yPercent: -115, stagger: 0.1, duration: 1.1, ease: "power3.in" }, 8)
        .to(".hero-tagline", { opacity: 0, duration: 0.8 }, 8)
        .to(".hero-frame", { opacity: 0, duration: 1, ease: "power1.in" }, 9);
      tween = tl;
    }

    return () => {
      cancelled = true;
      ro.disconnect();
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, []);

  return (
    <section className="hero" aria-label="LAODENIM, taller de upcycling denim">
      <div className="hero-frame" ref={frameRef}>
        <canvas className="hero-canvas" ref={canvasRef} aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-mark" aria-hidden="true">
          <p className="hero-mark-word">
            {"LAODENIM".split("").map((c, i) => (
              <span className="char-wrap" key={i}><span className="char">{c}</span></span>
            ))}
          </p>
          <p className="hero-tagline">Hecho con lo que ya tienes</p>
        </div>
        <div className="hero-copy">
          <h1 className="hero-title">
            <span className="line"><span>Transforma,</span></span>
            <span className="line"><span>reconstruye,</span></span>
            <span className="line"><span>renueva.</span></span>
          </h1>
          <p className="hero-sub">
            Taller de upcycling denim en Envigado y virtual. 8 sábados para convertir el jean que ya no usas en una pieza que sí quieres llevar puesta.
          </p>
          <a href={whatsapp("Hola, quiero info del taller LAODENIM")} className="pill" target="_blank" rel="noopener">
            Reservar cupo <span className="pill-plus" aria-hidden="true">+</span>
          </a>
        </div>
      </div>
    </section>
  );
}
