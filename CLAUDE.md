# LAODENIM — Project Conventions

## What is this

Landing page for LAODENIM, a denim upcycling workshop in Envigado, Antioquia, Colombia. The site sells an 8-Saturday workshop where students transform old jeans into new fashion pieces.

## Stack

Plain HTML + CSS + vanilla JS. No framework, no build step, no package manager. Files are served directly.

## Files

- `index.html` — single page, all sections
- `style.css` — all styles, mobile-first responsive
- `script.js` — scroll-linked hero video, horizontal pieces reel, nav toggle
- `video.mp4` — hero background video (scroll-animated)
- `design.md` — design system tokens and decisions
- `AUDIT.md` — visual/technical audit (reference, not active)

## Design direction

Editorial fashion — inspired by the OYLA jewelry site, Celine, Acne Studios. The hero is a rounded, inset frame with a scroll-linked video and a giant condensed-serif headline bottom-left. The rest is white with 1px black hairlines, pill buttons with a + icon, and indigo as the single accent. See `design.md` for the full token system.

## Key conventions

- Mobile-first CSS (base styles = mobile, `min-width` media queries scale up)
- Two font families only: Instrument Serif (display/headings) + Inter (UI/body)
- No monospace fonts, no ALL-CAPS tracked labels, no numbered markers on non-sequential content
- Indigo (#1B3A8C) is the primary brand color — derived from actual denim dye
- All CTAs link to WhatsApp (replace `57XXXXXXXXXX` with real number)
- Accessibility: skip link, focus-visible, aria-labels, prefers-reduced-motion
- No comments in code unless explaining a non-obvious constraint

## WhatsApp

All "Inscribirme" and "Reservar" buttons point to `wa.me/57XXXXXXXXXX`. Replace with the real phone number before deploying.
