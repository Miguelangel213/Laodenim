# AUDIT.md — LaoDenim

**Auditoría de diseño y técnica**
Evaluado como: Senior Design Engineer (Stripe / Linear / Apple / Vercel)
Fecha: 2026-09-28

---

## Estado actual

El sitio es una landing page estática (HTML + CSS + JS vanilla) para un taller de upcycling de denim en Envigado, Antioquia. Tres archivos: `index.html` (245 líneas), `style.css` (320 líneas), `script.js` (61 líneas). Sin framework, sin build system, sin imágenes.

**Lo que funciona bien:**
- Paleta de color coherente y evocadora (denim oscuro + dorado stitch + bone)
- Tipografía con personalidad (Fraunces serif + Space Mono)
- Estructura de contenido clara y completa
- Textura crosshatch CSS que simula tela denim
- Efecto "stitch border" con CSS puro — detalle artesanal auténtico
- Animación de entrada del hero con cascade timing

**Veredicto:** Buenas bases creativas. Ejecución técnica y nivel de pulido muy por debajo de lo que la marca necesita para convertir a $420-550K COP.

---

## A. Conversión — Problemas Críticos

> Estos problemas impactan directamente en ventas. Prioridad máxima.

| # | Problema | Impacto | Archivo |
|---|---------|---------|---------|
| A1 | **CTAs muertos** — Todos los botones "Inscribirme" y "Reservar en la feria" apuntan a `href="#"`. No hay WhatsApp, formulario, ni pasarela de pago. | El visitante no puede comprar. Conversión = 0%. | `index.html:207,215,223,232` |
| A2 | **Sin WhatsApp** — En Colombia, WhatsApp es el canal de conversión #1 para negocios locales. No hay botón flotante ni link directo. | Pierdes el canal más natural para tu mercado. | — |
| A3 | **Sin prueba social** — Cero testimonios, cero fotos de trabajos anteriores, cero conteo de alumnos, cero reseñas. | Un taller de $420-550K COP necesita confianza. Sin prueba social, el precio se siente arriesgado. | — |
| A4 | **Sin instructor** — No hay sección "Quién enseña". Sin nombre, foto, biografía ni credenciales. | El visitante no sabe a quién le está pagando. La confianza se construye con personas, no con logos. | — |
| A5 | **Sin galería de trabajos** — Cero imágenes en todo el sitio. Un taller de moda creativa sin fotografía es como un restaurante sin fotos de platos. | La fotografía es el 60% de la decisión de compra en moda. | — |
| A6 | **Sin FAQ** — Preguntas sin responder: horarios exactos, métodos de pago, política de cancelación, nivel requerido, qué pasa si falto a una clase. | Cada pregunta sin responder es una razón para no comprar. | — |
| A7 | **Sin urgencia real** — No hay contador de cupos disponibles, countdown a fecha de inicio, ni indicador de "últimos lugares". | Sin escasez percibida, la decisión se posterga indefinidamente. | — |

---

## B. Diseño Visual

> Problemas que reducen la percepción de calidad y profesionalismo.

| # | Problema | Detalle | Archivo |
|---|---------|---------|---------|
| B1 | **Cero fotografía** — Todo el diseño es tipografía + color. Para una marca de moda, necesitas: hero con imagen de producto, galería de transformaciones antes/después, fotos del espacio del taller, instructor trabajando. | Las marcas premium de moda (Aesop, COS, Acne Studios) son 70% imagen, 30% tipo. | — |
| B2 | **Sin favicon** — El browser muestra el ícono genérico. Genera un 404 silencioso en cada carga. | Señal inmediata de sitio no profesional. | `index.html` (head) |
| B3 | **Sin Open Graph image** — Al compartir en WhatsApp, Instagram o Twitter, aparece un link sin preview visual. | En Colombia, el tráfico viene por redes sociales. Sin preview = sin clicks. | `index.html` (head) |
| B4 | **Un solo breakpoint (820px)** — El CSS tiene una única media query. Diseño premium necesita 4+ breakpoints para cubrir: móvil pequeño (375px), móvil grande (480px), tablet (768px), desktop (1024px), wide (1280px+). | En tablets y móviles grandes el diseño queda en un limbo — ni desktop ni mobile. | `style.css:310` |
| B5 | **Footer mínimo** — Solo copyright y tagline. Falta: navegación secundaria, redes sociales (Instagram es crucial para moda), ubicación/mapa, contacto, horarios. | El footer es la última oportunidad de conversión. Los visitantes que llegan al final están interesados. | `index.html:236-241` |
| B6 | **Jerarquía de precios débil** — La tarjeta featured usa `transform: scale(1.04)` que causa overflow y problemas de layout. La diferenciación visual entre las 3 opciones es sutil. | El visitante debería saber en < 2 segundos cuál es la opción recomendada. | `style.css:276` |
| B7 | **Inline styles** — 3 elementos con `style="..."` directo en HTML (footer flex, incluye nota, sec-title max-width). | Rompe la separación de concerns. Dificulta mantenimiento y temas. | `index.html:172,191,237` |
| B8 | **Marquee duplicado** — El HTML ya tiene el contenido del marquee duplicado manualmente, y el JS intenta duplicarlo de nuevo (aunque tiene un guard). Código redundante. | Confuso para mantenimiento. | `index.html:40-42`, `script.js:51-59` |
| B9 | **Sin transiciones entre secciones** — Las secciones pasan de una a otra sin ritmo visual. Falta espaciado variable, elementos de separación, o cambios de fondo que creen ritmo de lectura. | Las páginas de Stripe y Linear usan cambios de background, ilustraciones entre secciones, y variación de layout para mantener el engagement. | `style.css:174` |

---

## C. Técnicos

> Problemas de infraestructura, SEO y arquitectura.

| # | Problema | Detalle | Archivo |
|---|---------|---------|---------|
| C1 | **Sin build system** — No hay `package.json`, bundler, ni proceso de build. Los archivos se sirven sin minificar ni optimizar. | En producción: CSS sin minificar (320 líneas), JS sin minificar (61 líneas), sin tree-shaking, sin code splitting. | — |
| C2 | **Sin meta description** — El `<head>` solo tiene title. Sin description, Google muestra un snippet aleatorio de la página. | SEO básico roto. Cada búsqueda "taller denim Envigado" pierde posicionamiento. | `index.html:3-11` |
| C3 | **Sin Open Graph tags** — No hay `og:title`, `og:description`, `og:image`, `og:url`. Sin Twitter cards. | Links compartidos en redes sociales aparecen sin preview. Mata el click-through rate. | `index.html` (head) |
| C4 | **Sin JSON-LD structured data** — Google no puede entender que esto es un curso/taller con precio, ubicación y fechas. | Pierde rich snippets en resultados de búsqueda (precio, rating, fechas). | — |
| C5 | **Sin robots.txt ni sitemap.xml** — Los crawlers no tienen guía de qué indexar. | SEO técnico básico ausente. | — |
| C6 | **Sin analytics** — No hay Google Analytics, Plausible, ni ningún tracking. | No puedes medir tráfico, fuentes, ni conversiones. Decisiones a ciegas. | — |
| C7 | **Smooth scroll redundante** — CSS declara `scroll-behavior: smooth` (línea 15) Y el JS reimplementa smooth scroll manualmente (líneas 16-25). | Código muerto. El CSS ya lo resuelve. El JS solo agrega `e.preventDefault()` innecesariamente. | `style.css:15`, `script.js:16-25` |
| C8 | **JS manipula estilos inline** — `header.style.boxShadow = '...'` en vez de agregar/quitar una clase CSS como `.header--scrolled`. | Antipatrón. Mezcla lógica con presentación. Imposible de sobreescribir con CSS. | `script.js:8-12` |
| C9 | **Google Fonts render-blocking** — Las dos fuentes cargan síncronamente. Si Google Fonts está lento, la página queda en blanco. | Necesita `<link rel="preload">` y considerar self-hosting para control total. | `index.html:7-9` |

---

## D. Accesibilidad (a11y)

> Problemas que excluyen usuarios y violan WCAG 2.1 AA.

| # | Problema | Criterio WCAG | Archivo |
|---|---------|--------------|---------|
| D1 | **Sin skip navigation** — No hay link para saltar al contenido principal. Usuarios de teclado deben Tab por todo el header. | 2.4.1 Bypass Blocks | `index.html:14-19` |
| D2 | **Sin focus styles** — No hay `:focus` ni `:focus-visible` definidos. Usuarios de teclado pierden contexto de dónde están. | 2.4.7 Focus Visible | `style.css` (ausente) |
| D3 | **Sin aria-labels** — Links y botones sin texto descriptivo para lectores de pantalla. Los botones "Inscribirme" no indican cuál plan. | 4.1.2 Name, Role, Value | `index.html:207,215,223` |
| D4 | **Marquee sin `prefers-reduced-motion`** — Animación infinita que no se detiene si el usuario tiene sensibilidad al movimiento. | 2.3.3 Animation from Interactions | `style.css:165,171` |
| D5 | **Links `href="#"` no accesibles** — Lectores de pantalla los anuncian como links pero no llevan a ningún destino significativo. | 2.4.4 Link Purpose | `index.html:207,215,223` |
| D6 | **Touch targets < 44px** — Los pills del hero (padding: 9px 16px) y algunos elementos de lista tienen área táctil inferior al mínimo recomendado. | 2.5.8 Target Size | `style.css:131` |
| D7 | **Sin landmarks ARIA** — Las secciones no usan `role` ni `aria-label` para navegación por landmarks. El `<nav>` existe pero no tiene label. | 1.3.1 Info and Relationships | `index.html` |

---

## E. Performance

| # | Problema | Detalle |
|---|---------|---------|
| E1 | **Dos fuentes externas sin preload** — Fraunces variable (~80KB) + Space Mono cargan desde Google CDN sin `preload`. FOUT o FOIT dependiendo del browser. |
| E2 | **Crosshatch en `body::before`** — `position: fixed` con `repeating-linear-gradient` fuerza una compositing layer sobre toda la página. En móviles de gama media puede causar jank durante scroll. |
| E3 | **Sin lazy loading preparado** — Cuando se agreguen imágenes (que se DEBEN agregar), necesitarán `loading="lazy"` y dimensiones explícitas para evitar layout shift. |
| E4 | **CSS y JS sin minificar** — ~12KB de CSS y ~2KB de JS que podrían reducirse ~40% con minificación básica. |

---

## F. Mobile-First

| # | Problema | Detalle | Archivo |
|---|---------|---------|---------|
| F1 | **Desktop-first** — El CSS define todo para desktop y luego reduce con `@media (max-width: 820px)`. La filosofía correcta es mobile-first: empezar mínimo y escalar con `min-width`. | `style.css:310-321` |
| F2 | **Sin `dvh` para hero** — Usa `padding: 110px 0 90px` fijo. En móvil, la barra de navegación del browser hace que `vh` mienta. `dvh` (dynamic viewport height) resuelve esto. | `style.css:75-76` |
| F3 | **Hero text overflow en tablets** — `clamp(46px, 8vw, 96px)` en un iPad (768px) da ~61px. Con line-height 0.95 y 3 líneas de texto, puede sentirse apretado con los pills debajo. | `style.css:99` |
| F4 | **Grid 4 columnas sin intermedio** — `.incluye-grid` pasa de 4 columnas a 2 en un solo salto. En 821px tiene 4 columnas en ~200px cada una, apretadas. | `style.css:248,312` |
| F5 | **Nav sin patrón mobile** — Solo logo + CTA. Si el sitio crece (galería, blog, contacto), no hay hamburger menu ni drawer preparado. | `index.html:15-18` |

---

## Resumen de Prioridades

```
IMPACTO EN CONVERSIÓN        ESFUERZO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A1  CTAs funcionales          ██░░░  Bajo     ← HACER PRIMERO
A2  WhatsApp button           █░░░░  Bajo
A5  Fotografía / galería      █████  Alto     ← Mayor impacto visual
A3  Prueba social             ███░░  Medio
A4  Sección instructor        ██░░░  Bajo
B1  Imágenes en hero          ████░  Medio
C2  SEO meta tags             █░░░░  Bajo
B2  Favicon + OG image        █░░░░  Bajo
D2  Focus styles              █░░░░  Bajo
F1  Mobile-first rewrite      █████  Alto
```

---

## Siguiente paso

Con este audit aprobado, el próximo paso es la **transformación premium completa**:
migrar a Next.js + Tailwind, implementar sistema de diseño con tokens, agregar fotografía, animaciones tipo Apple/Stripe, SEO completo, integración WhatsApp, y accesibilidad WCAG AA.

No se modifica código hasta recibir aprobación.
