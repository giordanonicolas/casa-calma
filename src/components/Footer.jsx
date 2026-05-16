import { Link } from 'react-router-dom'

const coleccion = [
  { label: 'Almohadones',       to: '/coleccion/almohadones' },
  { label: 'Mantas',            to: '/coleccion/mantas' },
  { label: 'Caminos de mesa',   to: '/coleccion/caminos-de-mesa' },
  { label: 'Fundas',            to: '/coleccion/fundas' },
  { label: 'Cuchas para perros',to: '/coleccion/cuchas' },
  { label: 'Accesorios',        to: '/coleccion/accesorios' },
]
const empresa = [
  { label: 'Nosotros',             to: '/nosotros' },
  { label: 'Cuidado del textil',   to: '/cuidado-del-textil' },
  { label: 'Envíos y devoluciones',to: '/envios-y-devoluciones' },
  { label: 'Contacto',             to: '/contacto' },
]

function WaIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function FooterLink({ href, to, children, external }) {
  const cls = "font-sans text-xs font-light transition-colors duration-200 hover:text-ivory"
  if (to) {
    return (
      <Link to={to} className={cls} style={{ color: 'var(--taupe)' }}>
        {children}
      </Link>
    )
  }
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={cls}
      style={{ color: 'var(--taupe)' }}
    >
      {children}
    </a>
  )
}

export default function Footer() {
  return (
    <footer id="contacto" className="py-16 md:py-20 px-6" style={{ backgroundColor: 'var(--charcoal)' }}>
      <div className="max-w-7xl mx-auto">

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">

          {/* Marca */}
          <div className="col-span-2 md:col-span-1">
            <img
              src="/images/logo.png"
              alt="Casa Calma"
              className="h-10 mb-5 opacity-70"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <p className="font-serif italic text-base mb-1 font-light" style={{ color: 'var(--linen-warm)' }}>
              tu espacio, tu pausa
            </p>
            <p className="font-sans text-xs leading-relaxed mt-4 mb-6 font-light" style={{ color: 'var(--taupe)', maxWidth: 200 }}>
              Textiles artesanales para el hogar. Montevideo, Uruguay.
            </p>

            {/* Redes sociales */}
            <div className="flex gap-4">
              {/* Instagram */}
              <a href="#" aria-label="Instagram" className="transition-colors duration-200 hover:text-linen-warm" style={{ color: 'var(--taupe)' }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* Pinterest */}
              <a href="#" aria-label="Pinterest" className="transition-colors duration-200 hover:text-linen-warm" style={{ color: 'var(--taupe)' }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Colección */}
          <div>
            <p className="eyebrow block mb-5" style={{ color: 'var(--linen-warm)' }}>Colección</p>
            <nav className="flex flex-col gap-3">
              {coleccion.map(({ label, to }) => (
                <FooterLink key={label} to={to}>{label}</FooterLink>
              ))}
            </nav>
          </div>

          {/* Empresa */}
          <div>
            <p className="eyebrow block mb-5" style={{ color: 'var(--linen-warm)' }}>Empresa</p>
            <nav className="flex flex-col gap-3">
              {empresa.map(({ label, to }) => (
                <FooterLink key={label} to={to}>{label}</FooterLink>
              ))}
            </nav>
          </div>

          {/* Contacto */}
          <div>
            <p className="eyebrow block mb-5" style={{ color: 'var(--linen-warm)' }}>Contacto</p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:casacalma7@gmail.com"
                className="font-sans text-xs font-light transition-colors duration-200 hover:text-ivory"
                style={{ color: 'var(--taupe)' }}
              >
                casacalma7@gmail.com
              </a>
              <p className="font-sans text-xs font-light" style={{ color: 'var(--taupe)' }}>
                Solo mensajes · No llamadas
              </p>
              <div className="flex flex-col gap-2 mt-1">
                {[
                  { number: '091 749 718', wa: '59891749718' },
                  { number: '091 742 782', wa: '59891742782' },
                ].map(({ number, wa }) => (
                  <a
                    key={wa}
                    href={`https://wa.me/${wa}?text=Hola%20Casa%20Calma%2C%20quisiera%20consultar`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-sans text-xs font-light transition-colors duration-200 hover:text-ivory"
                    style={{ color: 'var(--linen-warm)' }}
                  >
                    <WaIcon />
                    {number}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="mb-8" style={{ height: 1, backgroundColor: 'rgba(200,184,154,0.15)' }} />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-sans text-xs font-light" style={{ color: 'var(--taupe)' }}>
            © 2025 Casa Calma · Todos los derechos reservados
          </p>
          <div className="flex gap-6">
            <FooterLink href="#">Privacidad</FooterLink>
            <FooterLink href="#">Términos</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
