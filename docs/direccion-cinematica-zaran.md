# Dirección cinematográfica: Zaran y el índigo

Guion de producción para los videos del sitio. Cada archivo que generes se coloca en la ruta indicada y la página lo usa sola (si el archivo no existe, la página sigue funcionando con imágenes).

## Qué es el Zaran (扎染)

Es el tinturado por amarre de la etnia Bai, en Dali (Yunnan, China). *Zha* significa atar y *ran* teñir. Las fuentes ubican la técnica en China desde hace más de mil años, con raíces que algunos textos llevan al siglo III a. C. El centro más conocido es la aldea de Zhoucheng, que hoy tiene cerca de 300 artesanos. Fue declarada patrimonio cultural inmaterial nacional en 2006.

Cómo se hace:
1. Se dobla la tela de algodón o lino y se amarra o se cose con hilo, según el dibujo buscado.
2. Se sumerge en un baño de índigo hecho con hojas de planta añil (indigowoad) fermentadas en un pozo.
3. Se repite la inmersión varias veces: cada una oscurece el azul. Entre inmersiones la tela respira al aire y pasa de verdoso a azul.
4. Se secan y se desatan los nudos. Donde había hilo queda blanco, con bordes suaves como nubes.

Lo que le sirve a LAODENIM: el azul del jean viene del mismo índigo, y el taller enseña la misma idea (resistir, teñir, revelar). Usamos el Zaran como inspiración visual y no decimos que el taller enseñe Zaran tradicional. Primos de la técnica: shibori (Japón) y bandhani (India).

Fuentes: [Beijing Review](https://www.bjreview.com/Lifestyle/202208/t20220817_800303870.html), [Baidu Baike](https://baike.baidu.com/en/item/Bai%20Ethnic%20Tie-Dyeing%20Technique/135900), [Wander in China](https://www.wanderinchina.com/en/cultural-experience/tie-dye-zharan-in-china-a-travelers-guide-to-this-ancient-art/), [Chinese Indigo Tie-Dyeing](https://www.chinatextiletour.com/chinese-indigo-tie-dyeing), [Dali Bai Indigo Craft Guide](https://unforgottengift.com/chinese-tie-dye-dali-bai/).

## Referencia de estilo: Cartier, Watches & Wonders

- Fondo casi negro cálido (`#120d0a`), texto hueso (`#f3ece4`), un solo acento.
- Un video a pantalla completa por capítulo, cámara lenta, sin textos dentro del video.
- Poca interfaz: marca arriba, el resto desaparece. El scroll cambia de capítulo.
- Titulares serif grandes con mucho aire.

## Capítulos del sitio

| # | Capítulo | Archivo | Cómo se usa |
|---|----------|---------|-------------|
| 1 | Hero: tela entrando al baño de índigo | `site/public/video/hero.mp4` | Video en bucle detrás del titular |
| 2 | Prenda en 360 grados | `site/public/garment-360/` (secuencia) | Gira con el scroll, con textos Amarrar, Teñir y Revelar |
| 3 | Galería de piezas | ya existe | Usa las 4 fotos actuales |

## Especificaciones

- Horizontal 16:9, 1920×1080, 24 fps, sin audio, sin texto ni logos.
- Hero: 6 a 8 segundos, que cierre casi igual a como abre (bucle), menos de 8 MB.
- 360: 5 a 8 segundos, una vuelta completa, cámara fija, fondo oscuro liso, prenda centrada.

## Video 1: hero (copiar y pegar en tu IA de video)

Prompt principal (Veo, Kling, Runway o Seedance):

> Macro cinematic shot, slow motion. Hands lower a white cotton cloth bound with thread into a wooden vat of deep indigo dye. Dark warm studio, soft side light, subtle steam. The cloth emerges dripping, greenish and turns deep blue as it touches the air. Shallow depth of field, 35mm film grain, no text, no logos, slow dolly in, seamless loop feeling.

Variantes por si la primera no sale bien:
- Solo el líquido: "extreme macro of indigo dye swirling around a thread-bound cloth, ink-in-water, deep blue, black background, slow motion."
- Solo las manos: "close-up of an artisan's hands untying knots from an indigo-dyed cloth, revealing a white starburst pattern, soft window light, slow."

Con imagen inicial: sube `site/public/img/tiedye-2.png` como primer cuadro y pide "slow push-in, the fabric breathes, subtle light shimmer".

## Video 2: prenda en 360

Dos caminos:

1. **Real (la mejor calidad):** pon la camiseta sobre un maniquí o un percherito en una base giratoria (o gira tú el soporte con la mano, muy lento), fondo negro o gris oscuro, luz suave lateral, celular fijo en trípode a 1080p. Graba una vuelta completa.
2. **Con IA:** pide una vuelta tipo turntable. Las IAs suelen deformar la prenda al girar, así que usa la misma imagen como primer y último cuadro si la herramienta lo permite:

> Product turntable video of a tie-dye indigo and white oversized t-shirt on an invisible mannequin, rotating a full 360 degrees at constant slow speed, locked camera, seamless dark warm studio background, soft rim light, sharp fabric detail, no text.

Convertir el video en cuadros para el scroll (solo macOS):

```bash
swift scripts/video-to-frames.swift ruta/a/tu-video.mp4 site/public/garment-360 90
```

Eso crea 90 JPG y `manifest.json`. En cuanto existe, la sección "Prenda en 360" aparece sola en la página.

## Otras IAs que ayudan

- **Imágenes base y variaciones de color:** Midjourney, Ideogram o Flux.
- **Video:** Veo, Kling, Runway, Seedance o Luma.
- **Música ambiente (opcional, para reels):** Suno o ElevenLabs Music.
- Si quieres bajar el peso del video: `ffmpeg -i entrada.mp4 -vf scale=1920:-2 -crf 26 -an hero.mp4`.

## Pendiente de tu lado

- Generar `hero.mp4` y el video de 360 con las instrucciones de arriba.
- Decidir si el hero lleva sonido (hoy va sin sonido).
