"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset } from "@/lib/utils";

type Manifest = { count: number };

const steps = [
  { title: "Amarrar", text: "Se dobla la tela y se ata con hilo. Donde hay nudo, no entra el tinte." },
  { title: "Teñir", text: "Cada inmersión en el baño de índigo oscurece el azul. Después se deja respirar al aire." },
  { title: "Revelar", text: "Se desatan los nudos. El dibujo que aparece es irrepetible." },
];

const frameUrl = (i: number) => asset(`/garment-360/f${String(i + 1).padStart(3, "0")}.jpg`);

export function Garment360() {
  const [count, setCount] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(asset("/garment-360/manifest.json"))
      .then((r) => (r.ok ? (r.json() as Promise<Manifest>) : null))
      .then((m) => !cancelled && m && m.count > 1 && setCount(m.count))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!count) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const images: (HTMLImageElement | undefined)[] = [];
    let wanted = 0;
    let cancelled = false;

    const nearest = (i: number) => {
      for (let d = 0; d < count; d++) {
        if (images[i - d]) return i - d;
        if (images[i + d]) return i + d;
      }
      return -1;
    };
    const draw = () => {
      const i = nearest(wanted);
      if (i < 0) return;
      const img = images[i]!;
      const s = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    };
    const size = () => {
      const d = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * d;
      canvas.height = canvas.clientHeight * d;
      draw();
    };
    const load = (i: number) => {
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        images[i] = img;
        draw();
      };
      img.src = frameUrl(i);
    };
    load(0);
    for (let i = count - 1; i > 0; i--) load(i);

    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    size();

    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tl: gsap.core.Timeline | undefined;
    if (!reduced) {
      const state = { f: 0 };
      tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "+=360%", scrub: 0.5, pin: true, anticipatePin: 1 },
      });
      tl.to(state, { f: count - 1, duration: 3, onUpdate: () => { const f = Math.round(state.f); if (f !== wanted) { wanted = f; draw(); } } }, 0);
      gsap.utils.toArray<HTMLElement>(".g360-step").forEach((el, i) => {
        tl!.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }, i + 0.05)
          .to(el, { opacity: 0, y: -24, duration: 0.25, ease: "power2.in" }, i + 0.75);
      });
    }
    return () => {
      cancelled = true;
      ro.disconnect();
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, [count]);

  if (!count) return null;

  return (
    <section className="g360" ref={sectionRef} aria-label="Una prenda en 360 grados">
      <canvas className="g360-canvas" ref={canvasRef} role="img" aria-label="Camiseta con tie-dye girando 360 grados mientras haces scroll" />
      <div className="g360-steps">
        {steps.map((s) => (
          <div className="g360-step" key={s.title}>
            <h2>{s.title}</h2>
            <p>{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
