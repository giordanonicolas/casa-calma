import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

/* ══════════════════════════════════════════════
   CONSTANTES
══════════════════════════════════════════════ */
const WA_URL = 'https://wa.me/59891749718?text=Hola%20Casa%20Calma%2C%20quisiera%20consultar'

const NAV_CATEGORIES = [
  'Almohadones', 'Mantas', 'Caminos de mesa',
  'Fundas', 'Cuchas para perros', 'Accesorios',
]

/* ══════════════════════════════════════════════
   ÍCONOS
══════════════════════════════════════════════ */
function WaIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function ChevronIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 8 5" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M1 1l3 3 3-3" />
    </svg>
  )
}

function CartIcon({ style }) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" style={style}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
    </svg>
  )
}

function AccountIcon({ style }) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" style={style}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

/* ══════════════════════════════════════════════
   ESTILOS INLINE COMPARTIDOS
══════════════════════════════════════════════ */
const navLinkSt = {
  fontFamily: 'DM Sans, system-ui, sans-serif',
  fontSize: '0.62rem',
  fontWeight: 400,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--taupe)',
  textDecoration: 'none',
  transition: 'color 0.22s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '0.35rem',
}

const cartCountSt = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 17,
  height: 17,
  padding: '0 4px',
  borderRadius: 999,
  backgroundColor: 'var(--leather)',
  color: 'var(--ivory)',
  fontFamily: 'DM Sans, system-ui, sans-serif',
  fontSize: '0.5rem',
  fontWeight: 500,
  letterSpacing: 0,
  lineHeight: 1,
}

/* ══════════════════════════════════════════════
   HEADER
══════════════════════════════════════════════ */
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [colOpen, setColOpen]       = useState(false)
  const headerRef = useRef(null)
  const { totalQty } = useCart()
  const { user, profile } = useAuth()

  // Nombre corto para mostrar en el header
  const displayName = profile?.nombre || (user?.email?.split('@')[0]) || null

  // Sombra suave al hacer scroll
  useEffect(() => {
    const onScroll = () => {
      if (!headerRef.current) return
      headerRef.current.style.boxShadow =
        window.scrollY > 20 ? '0 1px 24px rgba(58,53,48,0.06)' : 'none'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMobile = () => {
    setMobileOpen(false)
    setColOpen(false)
  }

  return (
    <>
      {/* ── Top bar ── */}
      <div className="py-2 px-4 text-center" style={{ backgroundColor: '#6B5035' }}>
        <div
          className="max-w-7xl mx-auto flex items-center justify-center font-sans"
          style={{ fontSize: '0.56rem', letterSpacing: '0.22em', color: 'rgba(245,240,232,0.8)', textTransform: 'uppercase' }}
        >
          <span>Hecho a mano en Uruguay</span>
          <span className="topbar-dot">Materiales naturales</span>
          <span className="topbar-dot">Envío en 48&nbsp;hs</span>
        </div>
      </div>

      {/* ── Header principal ── */}
      <header
        ref={headerRef}
        className="sticky top-0 z-50 transition-all duration-300"
        style={{ backgroundColor: 'var(--ivory)', borderBottom: '1px solid var(--linen-mid)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center h-14 md:h-[60px]">

            {/* ── Nav izquierda — desktop ── */}
            <nav className="hidden md:flex items-center gap-7 flex-1">

              <a
                href="/"
                style={navLinkSt}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--charcoal)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--taupe)')}
              >
                Inicio
              </a>

              {/* Dropdown Colección */}
              <div className="relative group/dropdown">
                <button
                  className="nav-link flex items-center gap-1.5 py-1 bg-transparent border-none cursor-pointer"
                  aria-haspopup="true"
                >
                  Colección
                  <ChevronIcon className="w-2 h-2 transition-transform duration-300 group-hover/dropdown:rotate-180" />
                </button>
                <div className="mega-menu">
                  <div className="mega-menu-inner">
                    {NAV_CATEGORIES.map((cat) => (
                      <a key={cat} href="#categorias" className="mega-link">{cat}</a>
                    ))}
                  </div>
                </div>
              </div>

              <a
                href="#nosotros"
                style={navLinkSt}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--charcoal)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--taupe)')}
              >
                Nosotros
              </a>
            </nav>

            {/* ── Logo centrado ── */}
            <div className="flex-1 flex justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
              <Link to="/">
                <img
                  src="/images/logo.png"
                  alt="Casa Calma"
                  className="h-10 md:h-12 w-auto object-contain"
                />
              </Link>
            </div>

            {/* ── Nav derecha — desktop ── */}
            <nav className="hidden md:flex items-center gap-7 flex-1 justify-end">

              <a
                href="#contacto"
                style={navLinkSt}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--charcoal)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--taupe)')}
              >
                Contacto
              </a>

              {/* Mi cuenta / nombre si está logueado */}
              <Link
                to="/cuenta"
                style={{
                  ...navLinkSt,
                  color: user ? 'var(--charcoal)' : 'var(--taupe)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--charcoal)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = user ? 'var(--charcoal)' : 'var(--taupe)')}
              >
                <AccountIcon style={{ width: '0.85rem', height: '0.85rem' }} />
                {displayName ? displayName : 'Mi cuenta'}
              </Link>

              {/* Carrito — texto + ícono + contador */}
              <Link
                to="/carrito"
                style={{
                  ...navLinkSt,
                  color: totalQty > 0 ? 'var(--charcoal)' : 'var(--taupe)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--charcoal)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = totalQty > 0 ? 'var(--charcoal)' : 'var(--taupe)')}
                aria-label={`Carrito — ${totalQty} producto${totalQty !== 1 ? 's' : ''}`}
              >
                <CartIcon style={{ width: '0.95rem', height: '0.95rem' }} />
                Carrito
                {totalQty > 0 && <span style={cartCountSt}>{totalQty}</span>}
              </Link>
            </nav>

            {/* ── Mobile: carrito compacto + hamburger ── */}
            <div className="md:hidden ml-auto flex items-center gap-3">

              {/* Carrito mobile (top bar — acceso rápido) */}
              <Link
                to="/carrito"
                aria-label="Carrito"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  color: totalQty > 0 ? 'var(--charcoal)' : 'var(--taupe)',
                  textDecoration: 'none',
                }}
              >
                <CartIcon style={{ width: '1rem', height: '1rem' }} />
                {totalQty > 0 && <span style={cartCountSt}>{totalQty}</span>}
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="p-1 transition-colors duration-200"
                style={{ color: 'var(--taupe)' }}
                aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                {mobileOpen ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5M3.75 12h16.5M3.75 16.5h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile nav desplegable ── */}
        {mobileOpen && (
          <div
            className="md:hidden border-t px-6 py-4 font-sans"
            style={{ borderColor: 'var(--linen-mid)', backgroundColor: 'var(--cream)' }}
          >
            {/* Colección — acordeón */}
            <div className="border-b py-3" style={{ borderColor: 'var(--linen-mid)' }}>
              <button
                onClick={() => setColOpen((v) => !v)}
                className="w-full flex items-center justify-between"
                style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--taupe)' }}
              >
                Colección
                <ChevronIcon className={`w-2.5 h-2.5 transition-transform duration-200 ${colOpen ? 'rotate-180' : ''}`} />
              </button>
              {colOpen && (
                <div className="pt-3 pl-4 flex flex-col gap-2.5">
                  {NAV_CATEGORIES.map((cat) => (
                    <a
                      key={cat}
                      href="#categorias"
                      onClick={closeMobile}
                      style={{ display: 'block', fontSize: '0.56rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--stone)', textDecoration: 'none' }}
                    >
                      {cat}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Links del menú */}
            {[
              { label: 'Inicio',     href: '/',         isLink: true  },
              { label: 'Nosotros',   href: '#nosotros', isLink: false },
              { label: 'WhatsApp',   href: WA_URL,      isLink: false, external: true },
              { label: 'Contacto',   href: '#contacto', isLink: false },
              { label: displayName ? `Hola, ${displayName}` : 'Mi cuenta', href: '/cuenta', isLink: true },
            ].map(({ label, href, isLink, external }, i) => (
              <div key={label} className="border-b py-3" style={{ borderColor: 'var(--linen-mid)' }}>
                {isLink ? (
                  <Link
                    to={href}
                    onClick={closeMobile}
                    style={{ display: 'block', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--taupe)', textDecoration: 'none' }}
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    href={href}
                    onClick={closeMobile}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    style={{ display: 'block', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--taupe)', textDecoration: 'none' }}
                  >
                    {label}
                  </a>
                )}
              </div>
            ))}

            {/* Carrito — destacado al final del menú */}
            <div className="py-3">
              <Link
                to="/carrito"
                onClick={closeMobile}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.62rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: totalQty > 0 ? 'var(--charcoal)' : 'var(--taupe)',
                  textDecoration: 'none',
                  fontFamily: 'DM Sans, system-ui, sans-serif',
                }}
              >
                <CartIcon style={{ width: '0.9rem', height: '0.9rem' }} />
                Carrito
                {totalQty > 0
                  ? <span style={cartCountSt}>{totalQty}</span>
                  : <span style={{ color: 'var(--stone)' }}>(vacío)</span>
                }
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
