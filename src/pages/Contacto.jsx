import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

const WA_NUMBERS = [
  { number: '091 749 718', wa: '59891749718' },
  { number: '091 742 782', wa: '59891742782' },
]

function WaIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function Contacto() {
  return (
    <>
      <Header />
      <main style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh' }}>

        {/* Hero */}
        <div className="px-6 pt-16 pb-14 md:pt-24 md:pb-20" style={{ borderBottom: '1px solid var(--linen-mid)' }}>
          <div className="max-w-2xl mx-auto">
            <span className="eyebrow block mb-4">Contacto</span>
            <h1
              className="font-serif font-light mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', color: 'var(--charcoal)', lineHeight: 1.1 }}
            >
              Hablemos
            </h1>
            <p
              className="font-sans font-light"
              style={{ fontSize: '0.85rem', color: 'var(--taupe)', lineHeight: 1.9, maxWidth: 400 }}
            >
              Respondemos por WhatsApp. Preferimos mensajes para poder atenderte mejor.
            </p>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-6 py-16 md:py-24">
          <div className="max-w-2xl mx-auto flex flex-col gap-12">

            {/* WhatsApp */}
            <div>
              <p className="eyebrow mb-5" style={{ color: 'var(--leather)' }}>WhatsApp</p>
              <div className="flex flex-col gap-3">
                {WA_NUMBERS.map(({ number, wa }) => (
                  <a
                    key={wa}
                    href={`https://wa.me/${wa}?text=Hola%20Casa%20Calma%2C%20quisiera%20consultar`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3"
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '1.25rem',
                      color: 'var(--charcoal)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--leather)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--charcoal)')}
                  >
                    <WaIcon />
                    {number}
                  </a>
                ))}
              </div>
              <p
                className="font-sans font-light mt-4"
                style={{ fontSize: '0.72rem', color: 'var(--stone)', letterSpacing: '0.04em' }}
              >
                Solo mensajes · No llamadas
              </p>
            </div>

            {/* Email */}
            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--linen-mid)' }}>
              <p className="eyebrow mb-5" style={{ color: 'var(--leather)' }}>Email</p>
              <a
                href="mailto:casacalma7@gmail.com"
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '1.25rem',
                  color: 'var(--charcoal)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--leather)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--charcoal)')}
              >
                casacalma7@gmail.com
              </a>
            </div>

            {/* Horario */}
            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--linen-mid)' }}>
              <p className="eyebrow mb-5" style={{ color: 'var(--leather)' }}>Ubicación</p>
              <p
                className="font-sans font-light"
                style={{ fontSize: '0.85rem', color: 'var(--taupe)', lineHeight: 1.9 }}
              >
                Montevideo, Uruguay
                <br />
                Atención de lunes a viernes
              </p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
