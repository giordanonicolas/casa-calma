import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

const CUIDADOS = [
  {
    titulo: 'Lino natural',
    pasos: [
      'Lavar a mano o en ciclo delicado a 30 °C.',
      'No usar blanqueadores ni detergentes agresivos.',
      'Secar a la sombra, extendido o colgado.',
      'Planchar húmedo a temperatura media — el lino agradece el vapor.',
      'Con el tiempo y los lavados, el lino se suaviza. Eso es normal y bienvenido.',
    ],
  },
  {
    titulo: 'Algodón tejido',
    pasos: [
      'Lavar a máquina en ciclo suave con agua fría.',
      'Girar del revés antes de lavar para preservar el color.',
      'No centrifugar en exceso.',
      'Secar extendido para evitar deformaciones.',
      'Planchar a temperatura media si es necesario.',
    ],
  },
  {
    titulo: 'Sherpa y materiales suaves (cuchas)',
    pasos: [
      'Lavar a mano con agua tibia y jabón suave.',
      'No frotar — presionar con suavidad.',
      'Enjuagar bien y escurrir sin torcer.',
      'Secar extendido, nunca en secadora.',
      'Cepillar suavemente en seco para restaurar el volumen.',
    ],
  },
]

export default function CuidadoDelTextil() {
  return (
    <>
      <Header />
      <main style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh' }}>

        {/* Hero */}
        <div className="px-6 pt-16 pb-14 md:pt-24 md:pb-20" style={{ borderBottom: '1px solid var(--linen-mid)' }}>
          <div className="max-w-2xl mx-auto">
            <span className="eyebrow block mb-4">Guía de cuidados</span>
            <h1
              className="font-serif font-light mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', color: 'var(--charcoal)', lineHeight: 1.1 }}
            >
              Cuidado del textil
            </h1>
            <p
              className="font-sans font-light"
              style={{ fontSize: '0.85rem', color: 'var(--taupe)', lineHeight: 1.9, maxWidth: 440 }}
            >
              Los textiles naturales mejoran con el tiempo si se cuidan bien.
              Acá te explicamos cómo mantener cada material en su mejor estado.
            </p>
          </div>
        </div>

        {/* Cuidados por material */}
        <div className="px-6 py-16 md:py-24">
          <div className="max-w-2xl mx-auto flex flex-col gap-14">

            {CUIDADOS.map(({ titulo, pasos }) => (
              <div key={titulo}>
                <p className="eyebrow mb-5" style={{ color: 'var(--leather)' }}>{titulo}</p>
                <ul className="flex flex-col gap-3">
                  {pasos.map((paso, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <span
                        style={{
                          fontFamily: 'Cormorant Garamond, serif',
                          fontSize: '0.9rem',
                          color: 'var(--linen-warm)',
                          flexShrink: 0,
                          marginTop: '0.05rem',
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className="font-sans font-light"
                        style={{ fontSize: '0.83rem', color: 'var(--taupe)', lineHeight: 1.85 }}
                      >
                        {paso}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Nota general */}
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--cream)',
                border: '1px solid var(--linen-mid)',
                borderLeft: '3px solid var(--linen-warm)',
              }}
            >
              <p
                className="font-sans font-light"
                style={{ fontSize: '0.78rem', color: 'var(--taupe)', lineHeight: 1.9 }}
              >
                ¿Tenés alguna duda sobre el cuidado de tu producto específico?{' '}
                <Link
                  to="/contacto"
                  style={{ color: 'var(--leather)', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  Escribinos por WhatsApp
                </Link>{' '}
                y te ayudamos.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
