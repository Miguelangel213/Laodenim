import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

const description =
  "Transforma jeans viejos en piezas únicas. Taller de 8 sábados en Envigado o virtual. Tie-dye, bordado, reconstrucción y tu propia colección cápsula. Desde $420.000 COP.";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://miguelangel213.github.io/Laodenim/"),
  title: "LAODENIM — Taller de upcycling denim en Envigado",
  description,
  openGraph: {
    title: "LAODENIM — Taller de upcycling denim",
    description: "8 sábados para convertir el jean que ya no usas en una pieza que sí quieres llevar puesta.",
    type: "website",
    locale: "es_CO",
    siteName: "LAODENIM",
    images: [{ url: `${basePath}/og.png`, width: 1600, height: 640, alt: "LAODENIM, taller de upcycling denim" }],
  },
  twitter: { card: "summary_large_image", images: [`${basePath}/og.png`] },
};

export const viewport: Viewport = { themeColor: "#1b3a8c" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Taller de upcycling denim LAODENIM",
  description,
  provider: {
    "@type": "Organization",
    name: "LAODENIM",
    address: { "@type": "PostalAddress", addressLocality: "Envigado", addressRegion: "Antioquia", addressCountry: "CO" },
  },
  offers: { "@type": "Offer", priceCurrency: "COP", price: "420000" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} ${instrument.variable}`}>
      <body>
        <noscript>
          <style>{`.hero-title .line>span{animation:none!important}`}</style>
        </noscript>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
