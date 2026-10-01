"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pieces } from "@/data/content";
import { asset } from "@/lib/utils";

export function Reel() {
  const reelRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const track = trackRef.current!;
      track.classList.add("is-pinned");
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: reelRef.current,
          start: "top 12%",
          end: () => `+=${distance()}`,
          scrub: 0.5,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
      return () => track.classList.remove("is-pinned");
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="piezas" className="reel" ref={reelRef} aria-label="Piezas hechas en el taller">
      <div className="reel-track" ref={trackRef}>
        <div className="reel-panel reel-intro">
          <h2>Piezas que salen del taller.</h2>
          <p>Todas nacieron de un jean que nadie usaba. Tinte, hilo y ocho sábados después, son otra cosa.</p>
        </div>
        {pieces.map((p) => (
          <figure className="reel-panel reel-piece" key={p.src}>
            <div className="reel-tile">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(p.src)} alt={p.alt} loading="lazy" />
            </div>
            <figcaption><span>{p.name}</span><span>{p.tag}</span></figcaption>
          </figure>
        ))}
        <div className="reel-panel reel-outro">
          <h2>Las tuyas serán distintas.</h2>
          <a href="#precios" className="pill pill-ink">Ver precios <span className="pill-plus" aria-hidden="true">+</span></a>
        </div>
      </div>
    </section>
  );
}
