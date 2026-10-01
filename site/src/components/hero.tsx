"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset } from "@/lib/utils";
import { whatsapp } from "@/data/content";

const TOTAL_FRAMES = 60;

function isBlank(bmp: ImageBitmap | undefined) {
  if (!bmp) return true;
  const probe = document.createElement("canvas");
  probe.width = 32;
  probe.height = 18;
  const pctx = probe.getContext("2d")!;
  pctx.drawImage(bmp, 0, 0, 32, 18);
  const d = pctx.getImageData(0, 0, 32, 18).data;
  for (let i = 0; i < d.length; i += 4) if (d[i] + d[i + 1] + d[i + 2] > 0) return false;
  return true;
}

export function Hero() {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const frame = frameRef.current!;
    const canvas = canvasRef.current!;
    const video = videoRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);

    const frames: ImageBitmap[] = [];
    let current = -1;
    let started = false;
    let tween: gsap.core.Tween | undefined;
    let cancelled = false;

    const draw = (i: number) => {
      const img = frames[i];
      if (!img) return;
      const cw = canvas.width, ch = canvas.height;
      const scale = Math.max(cw / img.width, ch / img.height);
      const dw = img.width * scale, dh = img.height * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = frame.offsetWidth * dpr;
      canvas.height = frame.offsetHeight * dpr;
      if (current >= 0) draw(current);
    };

    const grab = async (target: HTMLCanvasElement) => {
      target.getContext("2d")!.drawImage(video, 0, 0);
      try { return await createImageBitmap(target); } catch { return undefined; }
    };

    const extract = async () => {
      const temp = document.createElement("canvas");
      temp.width = video.videoWidth;
      temp.height = video.videoHeight;
      for (let n = 0; n < TOTAL_FRAMES && !cancelled; n++) {
        await new Promise<void>((resolve) => {
          video.addEventListener("seeked", () => resolve(), { once: true });
          video.currentTime = (n / (TOTAL_FRAMES - 1)) * video.duration;
        });
        const bmp = await grab(temp);
        if (bmp) frames[n] = bmp;
      }
    };

    const onReady = async () => {
      if (started || video.readyState < 2) return;
      started = true;
      const first = document.createElement("canvas");
      first.width = video.videoWidth;
      first.height = video.videoHeight;
      const bmp = await grab(first);
      if (!bmp || cancelled) return;
      frames[0] = bmp;
      current = 0;
      draw(0);
      if (reduced) return;
      await extract();
      if (cancelled) return;
      if (isBlank(frames[TOTAL_FRAMES - 1])) { canvas.hidden = true; return; }
      const state = { frame: 0 };
      tween = gsap.to(state, {
        frame: TOTAL_FRAMES - 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "+=220%",
          scrub: 0.3,
          pin: true,
          anticipatePin: 1,
          refreshPriority: 10,
        },
        onUpdate: () => {
          const f = Math.round(state.frame);
          if (f !== current && frames[f]) { current = f; draw(f); }
        },
      });
      ScrollTrigger.refresh();
    };

    size();
    window.addEventListener("resize", size);
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    video.load();
    if (video.readyState >= 2) onReady();

    return () => {
      cancelled = true;
      window.removeEventListener("resize", size);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, []);

  return (
    <section className="hero" aria-label="LAODENIM, taller de upcycling denim">
      <div className="hero-frame" ref={frameRef}>
        <canvas className="hero-canvas" ref={canvasRef} aria-hidden="true" />
        <video className="hero-video" ref={videoRef} src={asset("/hero.mp4")} muted playsInline preload="auto" />
        <div className="hero-shade" aria-hidden="true" />
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
