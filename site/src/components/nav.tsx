"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { nav } from "@/data/content";
import { cn } from "@/lib/utils";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: ".manifesto",
      start: "top 40px",
      onToggle: (self) => setLight(self.isActive || self.progress === 1),
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={cn("header", light ? "header--light" : "header--dark")}>
      <nav className="nav" aria-label="Navegación principal">
        <a href="#main" className="logo" aria-label="LAODENIM, inicio">LAODENIM</a>
        <div className={cn("nav-links", open && "open")} id="nav-links">
          {nav.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
        </div>
        <a href="#precios" className="nav-cta">[ Inscribirme ]</a>
        <button
          className={cn("nav-toggle", open && "open")}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span />
        </button>
      </nav>
    </header>
  );
}
