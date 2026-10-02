"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { pieces, pieceFacts } from "@/data/content";
import { asset } from "@/lib/utils";

const PERSPECTIVE = 850;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function buildPoster(img: HTMLImageElement) {
  const w = 1600, h = 1000;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#0b1230");
  g.addColorStop(1, "#040611");
  x.fillStyle = g;
  x.fillRect(0, 0, w, h);
  const zoom = Math.max(w / img.width, h / img.height) * 3;
  x.globalAlpha = 0.6;
  x.drawImage(img, (w - img.width * zoom) / 2, (h - img.height * zoom) / 2, img.width * zoom, img.height * zoom);
  x.globalAlpha = 1;
  x.fillStyle = "rgba(5,8,24,0.5)";
  x.fillRect(0, 0, w, h);
  const th = h * 0.9;
  const tw = (img.width / img.height) * th;
  x.shadowColor = "rgba(0,0,0,0.55)";
  x.shadowBlur = 60;
  x.shadowOffsetY = 30;
  x.drawImage(img, (w - tw) / 2, (h - th) / 2 + 20, tw, th);
  return c;
}

function roundedPoints(w: number, h: number, r: number) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  const arcs: [number, number, number, number][] = [
    [w / 2 - r, -h / 2 + r, -Math.PI / 2, 0],
    [w / 2 - r, h / 2 - r, 0, Math.PI / 2],
    [-w / 2 + r, h / 2 - r, Math.PI / 2, Math.PI],
    [-w / 2 + r, -h / 2 + r, Math.PI, Math.PI * 1.5],
  ];
  const pts: [number, number][] = [];
  for (const [cx, cy, a0, a1] of arcs) {
    for (let i = 0; i <= 10; i++) {
      const a = a0 + ((a1 - a0) * i) / 10;
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  }
  return pts;
}

export function PiecePortal() {
  const [index, setIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const portalRef = useRef<HTMLButtonElement>(null);
  const indexRef = useRef(0);
  const nextRef = useRef(1);
  const [nextIdx, setNextIdx] = useState(1);
  const busyRef = useRef(false);
  const exp = useRef(0);
  const maskScale = useRef(1);
  const target = useRef({ x: 0, y: 0 });
  const rot = useRef({ x: 0, y: 0 });
  const posters = useRef<HTMLCanvasElement[]>([]);
  const reduced = useRef(false);
  const [ready, setReady] = useState(false);

  const animate = useCallback((set: (v: number) => void, ms: number) => {
    return new Promise<void>((resolve) => {
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / ms);
        set(ease(t));
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
  }, []);

  const travel = useCallback(async (to?: number) => {
    if (busyRef.current || !ready) return;
    busyRef.current = true;
    target.current = { x: 0, y: 0 };
    const next = to ?? (indexRef.current + 1) % pieces.length;
    nextRef.current = next;
    setNextIdx(next);
    const settle = () => {
      indexRef.current = next;
      setIndex(next);
      nextRef.current = (next + 1) % pieces.length;
      setNextIdx(nextRef.current);
    };
    if (reduced.current) {
      settle();
      busyRef.current = false;
      return;
    }
    sectionRef.current?.classList.add("is-transitioning");
    await animate((v) => (exp.current = v), 1100);
    settle();
    exp.current = 0;
    maskScale.current = 0;
    sectionRef.current?.classList.remove("is-transitioning");
    await animate((v) => (maskScale.current = v), 1050);
    busyRef.current = false;
  }, [animate, ready]);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    Promise.all(
      pieces.map(
        (p) =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = asset(p.src);
          }),
      ),
    )
      .then((imgs) => {
        if (cancelled) return;
        posters.current = imgs.map(buildPoster);
        setReady(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current!;
    const canvas = canvasRef.current!;
    const portal = portalRef.current!;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0;
    let raf = 0;
    let last = performance.now();
    let visible = true;
    let hover = 0;
    let hovering = false;

    const resize = () => {
      const d = Math.min(window.devicePixelRatio || 1, 2);
      W = section.clientWidth;
      H = section.clientHeight;
      canvas.width = W * d;
      canvas.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };

    const cover = (src: HTMLCanvasElement) => {
      const s = Math.max(W / src.width, H / src.height);
      const w = src.width * s, h = src.height * s;
      ctx.drawImage(src, (W - w) / 2, (H - h) / 2, w, h);
    };

    const shade = () => {
      const g = ctx.createLinearGradient(0, H * 0.52, 0, H);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,0.85)");
      ctx.fillStyle = g;
      ctx.fillRect(0, H * 0.52, W, H * 0.48);
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dt = Math.min(40, now - last);
      last = now;
      const k = Math.min(1, dt * 0.009);
      rot.current.x += (target.current.x - rot.current.x) * k;
      rot.current.y += (target.current.y - rot.current.y) * k;

      ctx.clearRect(0, 0, W, H);
      const ps = posters.current;
      if (!ps.length) return;
      const cur = indexRef.current;
      cover(ps[cur]);
      shade();

      const nextPoster = ps[nextRef.current];
      const sr = section.getBoundingClientRect();
      const pr = portal.getBoundingClientRect();
      const e = exp.current;
      const rcx = pr.left - sr.left + pr.width / 2;
      const rcy = pr.top - sr.top + pr.height / 2;
      const cx = rcx + (W / 2 - rcx) * e;
      const cy = rcy + (H / 2 - rcy) * e;
      const bw = pr.width + (W - pr.width) * e;
      const bh = pr.height + (H - pr.height) * e;
      const scale = e ? 1 : maskScale.current;
      const w = bw * scale, h = bh * scale;
      const r = (pr.width < 280 ? 70 : 90) * (1 - e) * scale;
      const ax = ((rot.current.x * (1 - e)) * Math.PI) / 180;
      const ay = ((rot.current.y * (1 - e)) * Math.PI) / 180;
      if (w > 1 && h > 1) {
        const pts = roundedPoints(w, h, r);
        const trace = () => {
          ctx.beginPath();
          pts.forEach(([x, y], i) => {
            const xx = x * Math.cos(ay);
            const yy = y * Math.cos(ax);
            const z = x * Math.sin(ay) - y * Math.sin(ax);
            const p = PERSPECTIVE / (PERSPECTIVE + z);
            const sx = cx + xx * p, sy = cy + yy * p;
            if (i === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          });
          ctx.closePath();
        };
        const edge = 1 - e;
        hover += ((hovering ? 1 : 0) - hover) * Math.min(1, dt * 0.01);
        const pulse = reduced.current ? 0.5 : (Math.sin(now / 650) + 1) / 2;

        if (edge > 0.02) {
          ctx.save();
          trace();
          ctx.shadowColor = `rgba(0, 0, 0, ${0.6 * edge})`;
          ctx.shadowBlur = 50;
          ctx.shadowOffsetY = 24;
          ctx.fillStyle = "#030303";
          ctx.fill();
          ctx.restore();
        }

        ctx.save();
        trace();
        ctx.clip();
        ctx.fillStyle = "#030303";
        ctx.fillRect(0, 0, W, H);
        cover(nextPoster);
        if (e > 0) shade();
        ctx.restore();

        if (edge > 0.02) {
          ctx.save();
          trace();
          ctx.lineJoin = "round";
          ctx.shadowColor = `rgba(140, 185, 255, ${edge})`;
          ctx.shadowBlur = 22 + pulse * 22 + hover * 18;
          ctx.lineWidth = 2.5 + hover * 1.5;
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.92 * edge})`;
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.lineWidth = 9 + pulse * 6;
          ctx.strokeStyle = `rgba(150, 195, 255, ${(0.1 + 0.1 * pulse + 0.12 * hover) * edge})`;
          ctx.stroke();
          ctx.restore();
        }
      }
    };

    const onMove = (ev: PointerEvent) => {
      if (busyRef.current || reduced.current || ev.pointerType === "touch") return;
      const r = section.getBoundingClientRect();
      target.current = {
        y: ((ev.clientX - r.left) / r.width - 0.5) * 37.4,
        x: ((ev.clientY - r.top) / r.height - 0.5) * -33,
      };
    };
    const onLeave = () => (target.current = { x: 0, y: 0 });
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting), { threshold: 0 });
    io.observe(section);
    const ro = new ResizeObserver(resize);
    ro.observe(section);
    resize();
    const enter = () => (hovering = true);
    const leave = () => (hovering = false);
    portal.addEventListener("pointerenter", enter);
    portal.addEventListener("pointerleave", leave);
    portal.addEventListener("focus", enter);
    portal.addEventListener("blur", leave);
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      portal.removeEventListener("pointerenter", enter);
      portal.removeEventListener("pointerleave", leave);
      portal.removeEventListener("focus", enter);
      portal.removeEventListener("blur", leave);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const next = nextIdx;

  return (
    <section id="piezas" className="px" ref={sectionRef} aria-label="Piezas hechas en el taller">
      <canvas className="px-canvas" ref={canvasRef} aria-hidden="true" />
      <h2 className="sr-only">Piezas que salen del taller</h2>

      <ol className="px-list" aria-label="Piezas">
        {pieces.map((p, i) => (
          <li key={p.src} className={i === index ? "px-item active" : "px-item"}>
            <button type="button" onClick={() => i !== index && travel(i)} aria-current={i === index} disabled={i === index}>{p.name}</button>
          </li>
        ))}
      </ol>

      <div className="px-wrap">
        <div className="px-heading">
          <span>Siguiente:</span>
          <strong>{pieces[next].name}</strong>
        </div>
        <button
          ref={portalRef}
          className="px-portal"
          type="button"
          onClick={() => travel()}
          aria-label={`Ver la siguiente pieza: ${pieces[next].name}`}
        >
          <span className="px-enter" aria-hidden="true">Ver</span>
        </button>
        <p className="px-hint">Toca la ventana o elige una pieza de la lista</p>
      </div>

      <div className="px-content" key={index} aria-live="polite">
        <h3 className="px-title">{pieces[index].name}</h3>
        <dl className="px-facts">
          {pieceFacts[index].map(([k, v]) => (
            <div className="px-fact" key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
