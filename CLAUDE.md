# LAODENIM — Project Conventions

## What is this
Sitio del taller LAODENIM (upcycling denim, Envigado). Vende un taller de 8 sábados. Ver `README.md` y `docs/brand-context-laodenim.md`.

## Stack
Next.js 16 (App Router, `output: "export"`), React 19, TypeScript, Tailwind CSS 4, Motion, GSAP + ScrollTrigger, Lenis. Todo vive en `site/`. Antes de tocar APIs de Next lee `site/node_modules/next/dist/docs/` (ver `site/AGENTS.md`).

## Files
- `site/src/data/content.ts` — todos los textos, precios, clases y FAQ
- `site/src/components/` — hero (video por scroll), reel (tira horizontal), manifesto, nav, preloader
- `site/src/app/globals.css` — estilos (tokens en `:root`)
- `site/public/` — `hero-frames/` (60 cuadros JPG del hero) e imágenes
- `docs/` — marca, sistema de diseño v1, auditoría v1

## Design direction
Editorial, inspirado en OYLA: marco redondeado con video, titular serif grande, líneas finas de 1px, botones píldora con "+", índigo (#1B3A8C) como único acento.

## Conventions
- Mobile-first, `min-width` media queries
- Dos fuentes: Instrument Serif (display) + Inter (UI/texto)
- Sin monoespaciada, sin etiquetas en mayúsculas espaciadas, sin números en contenido no secuencial
- Accesibilidad: skip link, focus-visible, aria-labels, `prefers-reduced-motion`
- Sin comentarios salvo restricciones no obvias
- No inventar reseñas ni testimonios

## WhatsApp y secretos
El número sale de `NEXT_PUBLIC_WHATSAPP` (`site/.env.local`, ignorado por git). Nunca commitear `.env*` ni tokens.
