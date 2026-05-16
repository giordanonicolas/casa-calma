import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

export default function Nosotros() {
  return (
    <>
      <Header />
      <main style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh' }}>

        {/* Hero */}
        <div className="px-6 pt-16 pb-14 md:pt-24 md:pb-20" style={{ borderBottom: '1px solid var(--linen-mid)' }}>
          <div className="max-w-3xl mx-auto">
            <span className="eyebrow block mb-4">Nuestra historia</span>
            <h1
              className="font-serif font-light mb-6"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', color: 'var(--charcoal)', lineHeight: 1.1 }}
            >
              Casa Calma
            </h1>
            <p
              className="font-serif italic font-light mb-8"
              style={{ fontSize: '1.1rem', color: 'var(--linen-warm)' }}
            >
              tu espacio, tu pausa
            </p>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-6 py-16 md:py-24">
          <div className="max-w-2xl mx-auto flex flex-col gap-10">

            <div>
              <p
                className="font-sans font-light"
                style={{ fontSize: '0.9rem', color: 'var(--taupe)', lineHeight: 2 }}
              >
                Casa Calma nació en Montevideo con una idea simple: que cada rincón del hogar pueda
                ser un lugar de descanso real. No de decoración por decorar, sino de objetos que se
                sienten bien al tocarlos, que duran, que tienen historia.
              </p>
            </div>

            <div>
              <p
                className="font-sans font-light"
                style={{ fontSize: '0.9rem', color: 'var(--taupe)', lineHeight: 2 }}
              >
                Trabajamos con materiales naturales — lino, algodón, lana — elegidos por su textura,
                su resistencia y su impacto ambiental. Cada pieza pasa por manos que conocen el oficio
                y entienden que el detalle importa.
              </p>
            </div>

            <div>
              <p
                className="font-sans font-light"
                style={{ fontSize: '0.9rem', color: 'var(--taupe)', lineHeight: 2 }}
              >
                Creemos que vivir bien no requiere de lujos inaccesibles, sino de objetos bien pensados,
                en el lugar correcto, con la calidad que merece tu cotidiano.
              </p>
            </div>

            {/* Valores */}
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6"
              style={{ borderTop: '1px solid var(--linen-mid)' }}
            >
              {[
                { label: 'Materiales naturales', text: 'Lino, algodón y lana seleccionados con criterio.' },
                { label: 'Hecho en Uruguay', text: 'Producción local, artesanal, con atención al detalle.' },
                { label: 'Para el diario', text: 'Objetos que se usan, se disfrutan y duran.' },
              ].map(({ label, text }) => (
                <div key={label}>
                  <p className="eyebrow mb-2" style={{ color: 'var(--leather)' }}>{label}</p>
                  <p className="font-sans font-light" style={{ fontSize: '0.78rem', color: 'var(--taupe)', lineHeight: 1.8 }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ paddingTop: '1rem' }}>
              <Link to="/coleccion" className="btn-primary" style={{ display: 'inline-block' }}>
                Ver colección
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
