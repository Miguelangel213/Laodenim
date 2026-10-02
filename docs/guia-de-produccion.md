# Guía de producción: qué hacer primero

Meta: 6 clips de 10 s + 3 imágenes de estilo. Todo en 16:9, 1080p, 24 fps, sin audio, sin texto ni logos.
Guarda los archivos en la carpeta `clips/` del proyecto con los nombres de abajo.

## Orden de trabajo

1. Imágenes de estilo (3), para que todos los clips se parezcan entre sí.
2. Clip 1, entrada. Define el look de todo.
3. Clip 2 y Clip 3, continuando desde el clip anterior.
4. Clip 5, prenda en 360 (independiente, se puede hacer en cualquier momento).
5. Clip 4 y Clip 6.

## Parte A: imágenes de estilo

Úsalas como «ingredientes» o imagen de referencia en Flow.

**A1. `estilo-atelier.png`** (cuadro inicial del clip 1)
> Wide cinematic photograph inside a tall quiet textile workshop at dawn. Long indigo-dyed and tie-dye cloths hang from the ceiling like banners. Soft god rays, floating dust, warm concrete floor, deep shadows, muted palette of indigo blue, bone white and warm brown. 35mm film look, no people, no text, no logos.

**A2. `estilo-tintes.png`**
> Dark workshop room with large stone vats full of deep indigo dye, light steam rising, one beam of warm side light, wooden shelves with folded denim in the background. Cinematic, shallow depth of field, no people, no text.

**A3. `estilo-prenda.png`**
Sube tus fotos `tiedye-2.png` o `tiedye-1.png` y pide:
> Same t-shirt, centered, on an invisible mannequin, dark warm studio background, soft rim light, high detail of the dye pattern, no text.

## Parte B: los 6 clips

Para cada clip: pega el prompt, sube el cuadro inicial indicado, duración 8–10 s.
Al final de cada clip **guarda el último cuadro** (captura o exporta como imagen): es el cuadro inicial del siguiente.

| # | Archivo | Cuadro inicial | Prompt |
|---|---------|----------------|--------|
| 1 | `clip1-entrada.mp4` | A1 | `Slow forward dolly into a tall quiet textile workshop at dawn. Long indigo-dyed cloths hang from the ceiling and sway very slightly. God rays, floating dust, warm concrete floor. Cinematic 35mm, no people, no text.` |
| 2 | `clip2-tintes.mp4` | último cuadro del clip 1 | `Camera keeps moving forward from the hall into a dark room with stone vats of deep indigo dye. Light steam. A pair of hands lowers a thread-bound cloth bundle into a vat. Dramatic warm side light, shallow depth of field, slow motion.` |
| 3 | `clip3-salon.mp4` | último cuadro del clip 2 | `Camera continues forward into a wide hall with a curved backdrop. Workbenches with silhouettes of artisans sewing denim. In the center a tie-dye indigo t-shirt floats and rotates slowly. Warm dark atmosphere, volumetric light, slow dolly in, no faces.` |
| 4 | `clip4-revelado.mp4` | foto de un tie-dye ya amarrado, si la tienes, o A2 | `Macro close-up. Scissors cut the knots of an indigo-dyed bundle and the cloth unfolds to reveal a white starburst pattern. Soft window light, slow motion, shallow depth of field, no text.` |
| 5 | `clip5-360.mp4` | A3 | `Turntable video of a tie-dye indigo and white oversized t-shirt on an invisible mannequin, rotating one full 360 degrees at constant slow speed. Locked camera, dark warm studio background, soft rim light, no text.` |
| 6 | `clip6-cierre.mp4` | cualquier foto de 3 prendas, o A1 | `Three finished upcycled denim garments hang in a row, backlit by a large window. Slow lateral dolly, gentle fabric movement, warm dark room, cinematic, no text.` |

## Reglas para que salga bien

- Siempre añade al final: `no text, no logos, no watermark`.
- Siluetas, no caras: las IAs deforman los rostros. Si salen caras raras, repite o pide `silhouettes only`.
- Genera 3 versiones de cada clip y elige la más estable (sin parpadeos, sin telas que se derriten).
- Para el 360: si la camiseta se deforma al girar, graba una real en una base giratoria (instrucciones en `docs/direccion-cinematica-zaran.md`).
- Movimiento de cámara siempre hacia adelante en los clips 1 a 3, y a la misma velocidad.

## Qué me mandas

Los archivos de `clips/`, más tres cosas: el orden final que elegiste, si algún clip no te convenció, y si quieres sonido ambiente. Con eso hago la conversión a cuadros, la unión de clips y la capa 3D.
