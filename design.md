# LAODENIM — Design System

## Research: Typography for Premium Fashion

After analyzing Celine, Bottega Veneta, Acne Studios, COS, OUONA, and Maison Margiela's digital presence:

**Finding 1 — Serif for display, sans for function.** Every luxury fashion brand uses a refined serif for hero/display text. The serif carries personality; the sans handles UI. Two families maximum. Three is clutter.

**Finding 2 — Tight tracking at large sizes.** Display text uses negative letter-spacing (-0.02em to -0.04em). This is the opposite of the tracked-out ALL-CAPS pattern common in generic SaaS pages. Tight type reads as editorial; loose type reads as institutional.

**Finding 3 — Line height collapses at scale.** Hero headings use 0.9–1.05 line-height. Body uses 1.6+. The contrast between dense display and airy body creates visual hierarchy without decoration.

**Selected typefaces:**
- **Fraunces** (variable serif, optical sizing) — hero headings, section titles, editorial body. Its slight quirkiness matches the handcraft spirit of a denim workshop. At large optical sizes, serifs refine; at small sizes, they become more readable.
- **Inter** — brand identity ("LAODENIM"), navigation, buttons, small UI text. Clean, neutral, disappears into function.

## Research: Color for Video Hero Sections

**Finding 1 — Cream over white on dark.** Text over dark video overlays reads better in cream/bone (#F2EDE4) than pure white. White feels "screen"; cream feels "print" (editorial). The warmth connects to undyed cotton/denim fiber.

**Finding 2 — Gradient overlays, not flat.** A single-tone dark overlay kills the video. A gradient (strong at bottom where text sits, fading to transparent at top) preserves visual interest while ensuring readability.

**Finding 3 — One accent maximum.** With a video background, every extra color competes. One accent for the primary CTA. Everything else is neutral.

**Finding 4 — Indigo is on-brand.** The #1B3A8C range is the natural color of indigo dye used in denim manufacturing. Using it as the primary accent connects the visual design to the physical material of the workshop.

---

## Tokens

### Color

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#FFFFFF` | Page background |
| `--bg-soft` | `#F5F4F0` | Alternating section backgrounds |
| `--bg-dark` | `#0E1420` | Hero overlay, footer, marquee, dark sections |
| `--text` | `#0A0A0A` | Primary text on light backgrounds |
| `--text-2` | `#5C5C5C` | Secondary text, descriptions |
| `--text-3` | `#999999` | Muted text, placeholders |
| `--text-light` | `#F2EDE4` | Primary text on dark backgrounds (bone/cream) |
| `--text-light-dim` | `rgba(242,237,228,0.5)` | Secondary text on dark backgrounds |
| `--indigo` | `#1B3A8C` | Primary brand color, CTAs, accents |
| `--indigo-deep` | `#0E2057` | Hover states, emphasis |
| `--brass` | `#C8943E` | Sparse accent (badges, one highlight) |
| `--border` | `#E0E0E0` | Borders on light backgrounds |
| `--border-dark` | `rgba(255,255,255,0.08)` | Borders on dark backgrounds |

### Typography

| Role | Family | Weight | Size | Line-height | Tracking |
|------|--------|--------|------|-------------|----------|
| Brand (giant) | Inter | 700 | clamp(60px, 14vw, 200px) | 0.9 | -0.03em |
| Hero heading | Fraunces | 700 | clamp(42px, 8vw, 88px) | 1.0 | -0.02em |
| Section heading | Fraunces | 600 | clamp(26px, 4.5vw, 46px) | 1.08 | -0.02em |
| Body (editorial) | Fraunces | 400 | 16–17px | 1.65 | 0 |
| Body (UI) | Inter | 400–500 | 13–14px | 1.5 | 0 |
| Navigation | Inter | 500 | 13px | 1 | 0 |
| Buttons | Inter | 600 | 13px | 1 | 0.02em |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| Container max-width | 1140px | `.wrap` |
| Container padding | 24px mobile, 32px desktop | |
| Section padding | 80px mobile → 140px desktop | |
| Hero height | 300vh (scroll area) | Video scroll distance |
| Hero viewport | 100vh (sticky inner) | Visible area |

### Motion

| Property | Value |
|----------|-------|
| Ease curve | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Video scroll | Linear mapping, `requestAnimationFrame`, 60fps |
| Reveal | `opacity 0.6s + translateY(20px)` |
| Reduced motion | All animations disabled via `prefers-reduced-motion` |

### Hero Overlay

```
Gradient: linear-gradient(to top,
  rgba(14, 20, 32, 0.88) 0%,
  rgba(14, 20, 32, 0.55) 40%,
  rgba(14, 20, 32, 0.2) 70%,
  rgba(14, 20, 32, 0.05) 100%
)
```

### Video Crop

The video uses `object-fit: cover` with `transform: scale(1.3)` inside an `overflow: hidden` container. This crops approximately 15% from each lateral edge while maintaining full-screen coverage.
