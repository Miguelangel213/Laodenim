const phone = process.env.NEXT_PUBLIC_WHATSAPP ?? "573012054476";

export function whatsapp(message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export const nav = [
  { href: "#piezas", label: "Piezas" },
  { href: "#modalidad", label: "Modalidad" },
  { href: "#estructura", label: "Clases" },
  { href: "#precios", label: "Precios" },
  { href: "#faq", label: "Preguntas" },
];

export const pieces = [
  { src: "/img/tiedye-1.png", alt: "Camiseta con tie-dye en espiral naranja y azul", name: "Espiral naranja", tag: "Clase 2, tie-dye" },
  { src: "/img/tiedye-2.png", alt: "Camiseta con tie-dye azul en estallido", name: "Estallido azul", tag: "Clase 2, shibori" },
  { src: "/img/tiedye-3.png", alt: "Camiseta con tie-dye morado tipo galaxia", name: "Galaxia morada", tag: "Clase 2, bleached" },
  { src: "/img/tiedye-4.png", alt: "Camiseta con tie-dye azul en espiral", name: "Espiral índigo", tag: "Clase 2, tie-dye" },
];

export const pieceFacts: [string, string][][] = [
  [
    ["Técnica:", "Espiral con pinzas y bandas elásticas."],
    ["Colores:", "Naranja y azul índigo sobre fondo oscuro."],
    ["Clase:", "Clase 2, tie-dye y decoloración."],
    ["Resultado:", "Una prenda única: no hay dos espirales iguales."],
  ],
  [
    ["Técnica:", "Shibori: plegado y amarre antes del tinte."],
    ["Colores:", "Azul índigo y blanco, con rayos desde el centro."],
    ["Clase:", "Clase 2, tie-dye y decoloración."],
    ["Resultado:", "Un estallido que cambia según cómo doblas la tela."],
  ],
  [
    ["Técnica:", "Bleached: se decolora y luego se tiñe encima."],
    ["Colores:", "Morado, negro y destellos claros."],
    ["Clase:", "Clase 2, tie-dye y decoloración."],
    ["Resultado:", "Efecto galaxia, pensado para vender como pieza de colección."],
  ],
  [
    ["Técnica:", "Espiral clásica, con más capas de tinte."],
    ["Colores:", "Tonos de índigo, del azul profundo al casi blanco."],
    ["Clase:", "Clase 2, tie-dye y decoloración."],
    ["Resultado:", "El color del denim, llevado a una prenda nueva."],
  ],
];

export const manifesto =
  "Un jean viejo no es basura, es la tela más resistente de tu closet. Lo desarmamos, lo tiñemos y lo volvemos a coser hasta que sea tuyo.";

export const facts = [
  { big: "8 sábados", small: "Tres horas por sesión, con grabación si faltas" },
  { big: "3 piezas", small: "Tu colección cápsula, lista para mostrar y vender" },
  { big: "Desde cero", small: "No necesitas saber coser, solo traer 3 jeans viejos" },
];

export const modes = [
  {
    title: "Presencial en Envigado",
    text: "Ocho sábados de 3 horas en nuestro espacio dotado, con máquinas, tintes y patio para los teñidos.",
    items: ["Materiales incluidos", "Maquinaria disponible", "Refrigerio para cada participante"],
  },
  {
    title: "Virtual desde tu casa",
    text: "El mismo sábado por Zoom, con grabación disponible y un kit de materiales enviado a tu puerta.",
    items: ["Clase en vivo y grabación", "Kit de materiales a domicilio", "Acompañamiento por chat"],
  },
];

export const modules = [
  {
    title: "Bases",
    range: "Clases 1 y 2",
    classes: [
      { n: 1, title: "Anatomía del denim", text: "Tipos de jean, qué se puede transformar y herramientas de trabajo. Desarme de una prenda paso a paso." },
      { n: 2, title: "Tie-dye y decoloración", text: "Las 3 técnicas que más se venden: espiral, shibori y bleached. Sales con tu primera prenda terminada." },
    ],
  },
  {
    title: "Reconstrucción",
    range: "Clases 3 a 5",
    classes: [
      { n: 3, title: "Corte y parche creativo", text: "De jean largo a short, falda o top. Parches visibles para dar nueva vida a la prenda." },
      { n: 4, title: "Bordado y pintura sobre denim", text: "Iniciales, flores y frases: personaliza cada pieza con acabado a mano." },
      { n: 5, title: "Reconstrucción total", text: "Unes dos prendas para crear una nueva. Dos jeans se convierten en un bolso o una chaqueta oversize." },
    ],
  },
  {
    title: "Marca y producto final",
    range: "Clases 6 a 8",
    classes: [
      { n: 6, title: "Custom Pro", text: "Rasgados, deshilachados, tachas y pines con acabado profesional." },
      { n: 7, title: "Tu colección cápsula", text: "Diseñas tu mini colección de 3 piezas transformadas, lista para mostrar." },
      { n: 8, title: "Pasarela y ventas", text: "Cómo fotografiar tu pieza, ponerle precio y venderla. Certificado LAODENIM y mini desfile final." },
    ],
  },
];

export const prices = [
  { title: "Presencial", amount: "$500.000", text: "8 sábados en Envigado, con materiales, máquina y tintes incluidos.", cta: "Inscribirme", label: "Inscribirme al taller presencial", msg: "Hola, quiero inscribirme al taller presencial", featured: false },
  { title: "Presencial, feria del sábado 19", amount: "$420.000", text: "Precio de lanzamiento si pagas en la feria el sábado 19. Cupos limitados.", cta: "Reservar en la feria", label: "Reservar en la feria del sábado 19", msg: "Hola, quiero reservar en la feria", featured: true },
  { title: "Virtual con kit", amount: "$550.000", text: "Clase en vivo por Zoom con grabación y kit de materiales enviado a tu casa.", cta: "Inscribirme", label: "Inscribirme al taller virtual", msg: "Hola, quiero inscribirme al taller virtual", featured: false },
];

export const faqs = [
  { q: "¿Necesito saber coser para inscribirme?", a: "No. El taller está pensado para principiantes. Arrancamos desde cero: desde conocer la tela hasta usar la máquina. Solo necesitas ganas de crear." },
  { q: "¿Qué materiales necesito traer?", a: "Solo 3 prendas de jean viejas de tu closet: pantalones, chaquetas o faldas, cualquier denim sirve. Los tintes, hilos y herramientas están incluidos." },
  { q: "¿Cuál es el horario exacto?", a: "Todos los sábados, 3 horas por sesión. El horario específico se confirma al inscribirte, según el grupo disponible." },
  { q: "¿Qué pasa si falto a una clase?", a: "Cada clase queda grabada, tanto en presencial como en virtual. Si faltas, ves la grabación y recuperas el contenido." },
  { q: "¿Cómo puedo pagar?", a: "Por transferencia bancaria, Nequi, Daviplata o en efectivo en la feria. Al escribirnos por WhatsApp te enviamos los datos de pago." },
  { q: "¿La modalidad virtual incluye materiales?", a: "Sí. Te enviamos a domicilio un kit completo con tintes, hilos, agujas y herramientas especiales. Solo necesitas tus 3 prendas de jean." },
];
