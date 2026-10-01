import { Hero } from "@/components/hero";
import { PiecePortal } from "@/components/piece-portal";
import { Manifesto } from "@/components/manifesto";
import { Nav } from "@/components/nav";
import { Preloader } from "@/components/preloader";
import { SmoothScroll } from "@/components/smooth-scroll";
import { asset } from "@/lib/utils";
import { facts, faqs, modes, modules, prices, whatsapp, nav } from "@/data/content";

function Pill({ href, children, ink, label }: { href: string; children: React.ReactNode; ink?: boolean; label?: string }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={ink ? "pill pill-ink" : "pill"}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
    >
      {children} <span className="pill-plus" aria-hidden="true">+</span>
    </a>
  );
}

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">Ir al contenido principal</a>
      <Preloader />
      <SmoothScroll />
      <Nav />

      <main id="main">
        <Hero />
        <PiecePortal />
        <Manifesto />

        <section className="block taller">
          <div className="taller-grid">
            <div className="taller-text">
              <h2>Hecho a mano, sin atajos.</h2>
              <div className="taller-copy">
                <p>Cada sábado trabajas sobre jeans de tu propio closet: los desarmas, los tiñes, los cortas y los coses de nuevo.</p>
                <p>Trabajamos con tintes de índigo, hilo grueso y parches visibles. Los rasgados y los deshilachados se hacen a propósito, nada queda suave por comodidad.</p>
                <p>El taller es para quien llega sin saber coser y sale con tres piezas propias, un certificado y una forma de venderlas.</p>
              </div>
              <Pill href="#estructura">Ver las 8 clases</Pill>
            </div>
            <div className="taller-facts">
              {facts.map((f) => (
                <div className="fact" key={f.big}>
                  <p className="fact-big">{f.big}</p>
                  <p className="fact-small">{f.small}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="modalidad" className="block modalidad">
          <div className="wrap">
            <h2 className="title-l">Dos formas de vivirlo, el mismo cronograma.</h2>
          </div>
          <div className="modos">
            {modes.map((m) => (
              <article className="modo" key={m.title}>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
                <ul>{m.items.map((i) => <li key={i}>{i}</li>)}</ul>
              </article>
            ))}
          </div>
          <div className="wrap">
            <p className="note">Cada alumna trae 3 prendas de jean viejas de su closet para intervenir.</p>
          </div>
        </section>

        <section id="estructura" className="block estructura">
          <div className="wrap">
            <h2 className="title-l">Ocho clases, tres módulos, una colección propia.</h2>
          </div>
          <div className="modulos">
            {modules.map((m) => (
              <div className="modulo" key={m.title}>
                <div className="modulo-head">
                  <h3>{m.title}</h3>
                  <p>{m.range}</p>
                </div>
                <ol className="clases" start={m.classes[0].n}>
                  {m.classes.map((c) => (
                    <li className="clase" key={c.n}>
                      <span className="clase-n">{c.n}</span>
                      <h4>{c.title}</h4>
                      <p>{c.text}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        <section id="precios" className="block precios">
          <div className="wrap">
            <h2 className="title-l">Reserva tu lugar en el taller.</h2>
          </div>
          <div className="precios-grid">
            {prices.map((p) => (
              <article className={p.featured ? "precio precio-feat" : "precio"} key={p.title}>
                <h3>{p.title}</h3>
                <p className="precio-amount">{p.amount}<span>COP</span></p>
                <p className="precio-desc">{p.text}</p>
                <Pill href={whatsapp(p.msg)} ink={!p.featured} label={p.label}>{p.cta}</Pill>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="block faq">
          <div className="faq-grid">
            <h2 className="title-l">Preguntas frecuentes</h2>
            <div className="faq-list">
              {faqs.map((f) => (
                <details className="faq-item" key={f.q}>
                  <summary><span>{f.q}</span><span className="faq-plus" aria-hidden="true" /></summary>
                  <div className="faq-body"><p>{f.a}</p></div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="cta" aria-label="Reserva tu cupo">
          <div className="cta-frame">
            <div className="cta-text">
              <h2>Ese jean guardado en el closet puede ser tu próxima colección.</h2>
              <p>8 sábados, 3 piezas transformadas y un certificado.</p>
              <Pill href={whatsapp("Hola, quiero mi cupo en el taller LAODENIM")}>Quiero mi cupo</Pill>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="cta-img" src={asset("/img/tiedye-3.png")} alt="" loading="lazy" />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <p>Taller de upcycling denim.</p>
            <p>Envigado, Antioquia, Colombia</p>
          </div>
          <div className="footer-col">
            {nav.slice(1).map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          </div>
          <div className="footer-col">
            <a href={whatsapp("Hola, quiero info del taller LAODENIM")} target="_blank" rel="noopener">WhatsApp</a>
            <a href="https://instagram.com/laodenim" target="_blank" rel="noopener">Instagram</a>
            <a href="#main">Volver arriba</a>
          </div>
        </div>
        <div className="footer-mark" aria-hidden="true">LAODENIM</div>
        <p className="footer-legal">&copy; 2026 LAODENIM</p>
      </footer>

      <a href={whatsapp("Hola, quiero info del taller LAODENIM")} className="wa-float" aria-label="Contactar por WhatsApp" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>
    </>
  );
}
