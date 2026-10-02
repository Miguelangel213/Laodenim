"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset } from "@/lib/utils";
import { whatsapp } from "@/data/content";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);
    const video = videoRef.current!;
    const show = () => {
      video.classList.add("is-ready");
      if (!reduced) video.play().catch(() => {});
    };
    video.addEventListener("canplay", show);
    if (video.readyState >= 3) show();

    let tl: gsap.core.Timeline | undefined;
    if (!reduced) {
      tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "+=300%",
          scrub: 0.4,
          pin: true,
          anticipatePin: 1,
          refreshPriority: 10,
        },
      });
      tl.set(".hero-mark", { opacity: 1 }, 0)
        .to(".hero-bg", { scale: 1.18, duration: 10 }, 0)
        .to(".hero-copy", { y: -60, opacity: 0, duration: 1.6, ease: "power2.in" }, 0.8)
        .to(".hero-frame", { "--gap": "0px", borderRadius: 0, duration: 2.6, ease: "power2.inOut" }, 1.2)
        .fromTo(".hero-mark .char", { yPercent: 115 }, { yPercent: 0, stagger: 0.18, duration: 1.4, ease: "power4.out" }, 3.6)
        .fromTo(".hero-tagline", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, 5.4)
        .to(".hero-mark .char", { yPercent: -115, stagger: 0.1, duration: 1.1, ease: "power3.in" }, 8)
        .to(".hero-tagline", { opacity: 0, duration: 0.8 }, 8)
        .to(".hero-frame", { opacity: 0, duration: 1, ease: "power1.in" }, 9);
    }

    return () => {
      video.removeEventListener("canplay", show);
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, []);

  return (
    <section className="hero" aria-label="LAODENIM, taller de upcycling denim">
      <div className="hero-frame">
        <div className="hero-bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hero-poster" src={asset("/img/tiedye-2.png")} alt="" />
          <video className="hero-video" ref={videoRef} src={asset("/video/hero.mp4")} muted loop playsInline preload="auto" />
        </div>
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
