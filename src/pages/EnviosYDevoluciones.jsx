import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

const SECCIONES = [
  {
    titulo: 'Envíos',
    items: [
      { q: '¿A dónde enviamos?', a: 'Enviamos a todo el territorio uruguayo — Montevideo y el interior del país.' },
      { q: '¿Cuánto tarda?', a: 'El plazo habitual es de 24 a 48 horas hábiles desde la confirmación del pago. En el interior puede demorar un día más dependiendo de la zona.' },
      { q: '¿Cómo se coordina el envío?', a: 'Una vez que confirmamos tu pago, te contactamos por WhatsApp para acordar los detalles del envío.' },
      { q: '¿Cuánto cuesta el envío?', a: 'El costo de envío se calcula según la dirección y se informa antes de confirmar el pedido. Para compras en Montevideo capital, consultanos por posibles envíos sin costo.' },
    ],
  },
  {
    titulo: 'Devoluciones y cambios',
    items: [
      { q: '¿Puedo cambiar un producto?', a: 'Sí. Si el producto llegó en mal estado o hubo un error en el pedido, lo resolvemos sin costo adicional. Tenés hasta 7 días corridos desde la recepción para contactarnos.' },
      { q: '¿Puedo devolver si cambié de opinión?', a: 'Aceptamos devoluciones dentro de los 7 días siempre que el producto esté sin uso, en su estado original. El costo de devolución corre por cuenta del comprador.' },
      { q: '¿Cómo inicio una devolución?', a: 'Escribinos por WhatsApp con tu nombre, número de pedido y motivo. Te indicamos los pasos a seguir.' },
    ],
  },
]

export default function EnviosYDevoluciones() {
  return (
    <>
      <Header />
      <main style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh' }}>

        {/* Hero */}
        <div className="px-6 pt-16 pb-14 md:pt-24 md:pb-20" style={{ borderBottom: '1px solid var(--linen-mid)' }}>
          <div className="max-w-2xl mx-auto">
            <span className="eyebrow block mb-4">Políticas</span>
            <h1
              className="font-serif font-light mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', color: 'var(--charcoal)', lineHeight: 1.1 }}
            >
              Envíos y devoluciones
            </h1>
            <p
              className="font-sans font-light"
              style={{ fontSize: '0.85rem', color: 'var(--taupe)', lineHeight: 1.9, maxWidth: 440 }}
            >
              Queremos que tu experiencia sea simple y transparente.
              Acá encontrás todo lo que necesitás saber.
            </p>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-6 py-16 md:py-24">
          <div className="max-w-2xl mx-auto flex flex-col gap-16">

            {SECCIONES.map(({ titulo, items }) => (
              <div key={titulo}>
                <p className="eyebrow mb-8" style={{ color: 'var(--leather)' }}>{titulo}</p>
                <div className="flex flex-col gap-8">
                  {items.map(({ q, a }) => (
                    <div key={q} style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--linen-pale)' }}>
                      <p
                        className="font-sans"
                        style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '0.6rem', letterSpacing: '0.02em' }}
                      >
                        {q}
                      </p>
                      <p
                        className="font-sans font-light"
                        style={{ fontSize: '0.8rem', color: 'var(--taupe)', lineHeight: 1.9 }}
                      >
                        {a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* CTA */}
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--cream)',
                border: '1px solid var(--linen-mid)',
              }}
            >
              <p
                className="font-sans font-light"
                style={{ fontSize: '0.78rem', color: 'var(--taupe)', lineHeight: 1.9 }}
              >
                ¿Tenés alguna consulta adicional?{' '}
                <Link
                  to="/contacto"
                  style={{ color: 'var(--leather)', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  Contactanos
                </Link>
                {' '}y te respondemos a la brevedad.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
