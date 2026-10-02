"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset } from "@/lib/utils";
import { whatsapp } from "@/data/content";

const scenes = [
  { src: "/img/scene-atelier.webp", alt: "Taller de teñido al amanecer con telas de índigo colgando del techo" },
  { src: "/img/scene-tintes.webp", alt: "Tinas de piedra con índigo y vapor" },
  { src: "/img/scene-prenda.webp", alt: "Camiseta con tie-dye índigo colgada en el taller" },
];

const chapters = [
  { title: "El índigo se construye por capas.", text: "Cada inmersión oscurece el azul. Entre una y otra, la tela respira." },
  { title: "Cada nudo es una decisión.", text: "Donde el hilo aprieta, el tinte no entra. Ahí queda el dibujo." },
  { title: "Y de ahí sale tu pieza.", text: "Ocho sábados, tres prendas y una colección que firmas tú." },
];

export function Hero() {
  const frameRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const frame = frameRef.current!;
    const dust = dustRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = dust.getContext("2d")!;
    const motes = Array.from({ length: 42 }, () => ({
      x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.6,
      vx: (Math.random() - 0.3) * 0.00006, vy: -0.00003 - Math.random() * 0.00005, a: 0.15 + Math.random() * 0.4,
    }));
    const size = () => {
      const d = Math.min(window.devicePixelRatio || 1, 2);
      dust.width = frame.clientWidth * d;
      dust.height = frame.clientHeight * d;
    };
    const ro = new ResizeObserver(size);
    ro.observe(frame);
    size();

    let raf = 0, last = performance.now(), visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(frame);
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(48, now - last);
      last = now;
      if (!visible || reduced) return;
      ctx.clearRect(0, 0, dust.width, dust.height);
      for (const m of motes) {
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); }
        if (m.x < -0.02) m.x = 1.02;
        if (m.x > 1.02) m.x = -0.02;
        ctx.beginPath();
        ctx.arc(m.x * dust.width, m.y * dust.height, m.r * (dust.width / 1400 + 0.6), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 236, 205, ${m.a})`;
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(loop);

    let tl: gsap.core.Timeline | undefined;
    if (!reduced) {
      tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ".hero", start: "top top", end: "+=520%", scrub: 0.6, pin: true, anticipatePin: 1, refreshPriority: 10 },
      });
      tl.set(".hero-mark", { opacity: 1 }, 0)
        .fromTo(".hero-layer:nth-child(1)", { scale: 1.02 }, { scale: 1.22, duration: 5 }, 0)
        .to(".hero-layer:nth-child(2)", { opacity: 1, duration: 1.2 }, 3.6)
        .fromTo(".hero-layer:nth-child(2)", { scale: 1.05 }, { scale: 1.24, duration: 5 }, 3.6)
        .to(".hero-layer:nth-child(3)", { opacity: 1, duration: 1.2 }, 7)
        .fromTo(".hero-layer:nth-child(3)", { scale: 1.04 }, { scale: 1.2, duration: 3.4 }, 7)
        .to(".hero-copy", { y: -60, opacity: 0, duration: 1.2, ease: "power2.in" }, 0.5)
        .to(".hero-frame", { "--gap": "0px", borderRadius: 0, duration: 2, ease: "power2.inOut" }, 0.9)
        .fromTo(".hero-mark .char", { yPercent: 115 }, { yPercent: 0, stagger: 0.12, duration: 1.1, ease: "power4.out" }, 1.4)
        .fromTo(".hero-tagline", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, 2.6)
        .to(".hero-mark .char", { yPercent: -115, stagger: 0.07, duration: 0.8, ease: "power3.in" }, 3.5)
        .to(".hero-tagline", { opacity: 0, duration: 0.5 }, 3.5);
      const caps = gsap.utils.toArray<HTMLElement>(".hero-chap");
      const slots: [number, number][] = [[4.5, 6.4], [6.6, 8.2], [8.5, 10]];
      caps.forEach((el, i) => {
        tl!.fromTo(el, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, slots[i][0]);
        if (i < caps.length - 1) tl!.to(el, { opacity: 0, y: -22, duration: 0.45, ease: "power2.in" }, slots[i][1] - 0.45);
      });
      tl.fromTo(".hero-end", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 9.4);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, []);

  return (
    <section className="hero" aria-label="LAODENIM, taller de upcycling denim">
      <div className="hero-frame" ref={frameRef}>
        <div className="hero-layers">
          {scenes.map((s) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={s.src} className="hero-layer" src={asset(s.src)} alt={s.alt} fetchPriority="high" />
          ))}
        </div>
        <canvas className="hero-dust" ref={dustRef} aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-mark" aria-hidden="true">
          <p className="hero-mark-word">
            {"LAODENIM".split("").map((c, i) => (
              <span className="char-wrap" key={i}><span className="char">{c}</span></span>
            ))}
          </p>
          <p className="hero-tagline">Hecho con lo que ya tienes</p>
        </div>
        <div className="hero-chaps">
          {chapters.map((c) => (
            <div className="hero-chap" key={c.title}>
              <h2>{c.title}</h2>
              <p>{c.text}</p>
            </div>
          ))}
          <div className="hero-end">
            <a href={whatsapp("Hola, quiero info del taller LAODENIM")} className="pill" target="_blank" rel="noopener">
              Reservar cupo <span className="pill-plus" aria-hidden="true">+</span>
            </a>
          </div>
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
