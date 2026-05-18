import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { products, categories } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

/* ══════════════════════════════════════════════
   MAPA SLUG → FILTRO DE CATEGORÍA
══════════════════════════════════════════════ */
const CATEGORY_MAP = {
  'almohadones':     { label: 'Almohadones',    productCategory: 'Almohadones' },
  'mantas':          { label: 'Mantas',          productCategory: 'Mantas'      },
  'caminos-de-mesa': { label: 'Caminos de mesa', productCategory: 'Mesa'        },
  'fundas':          { label: 'Fundas',          productCategory: 'Fundas'      },
  'cuchas':          { label: 'Cuchas',          productCategory: 'Cuchas'      },
  'accesorios':      { label: 'Accesorios',      productCategory: 'Accesorios'  },
}

const CHIPS = [
  { label: 'Todos', slug: null },
  ...categories.map((c) => ({ label: c.name, slug: c.slug })),
]

/* ══════════════════════════════════════════════
   COMPONENTE
══════════════════════════════════════════════ */
export default function Coleccion() {
  const { categoria } = useParams()

  const catInfo = categoria ? CATEGORY_MAP[categoria] : null
  const isValidCategory = !categoria || Boolean(catInfo)

  // Solo productos activos; filtrar por categoría si corresponde
  const filtered = products.filter((p) => {
    if (!p.active) return false
    if (catInfo) return p.category === catInfo.productCategory
    return true
  })

  const pageTitle = catInfo ? catInfo.label : 'Colección'
  const pageDesc  = catInfo
    ? `Todos nuestros ${catInfo.label.toLowerCase()} — piezas cuidadas, materiales naturales.`
    : 'Textiles y decoración para el hogar. Cada pieza, hecha con intención.'

  /* Reveal on scroll — al cambiar categoría */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.06, rootMargin: '0px 0px -30px 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [categoria])

  /* ── Categoría inválida ── */
  if (!isValidCategory) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center py-24 px-6"
          style={{ backgroundColor: 'var(--ivory)' }}>
          <div className="text-center" style={{ maxWidth: 400 }}>
            <span className="eyebrow block mb-4">Colección</span>
            <h1 className="font-serif font-light mb-4" style={{ fontSize: '2rem', color: 'var(--charcoal)' }}>
              Categoría no encontrada
            </h1>
            <p className="font-sans font-light mb-8" style={{ fontSize: '0.82rem', color: 'var(--taupe)' }}>
              La categoría que buscás no existe o fue movida.
            </p>
            <Link to="/coleccion" className="btn-primary">Ver toda la colección</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh' }}>

        {/* Hero de sección */}
        <div className="px-6 pt-14 pb-10 md:pt-20 md:pb-14"
          style={{ borderBottom: '1px solid var(--linen-mid)' }}>
          <div className="max-w-7xl mx-auto">

            {/* Breadcrumb */}
            <div
              className="flex items-center gap-2 mb-8"
              style={{ fontFamily: 'DM Sans, system-ui, sans-serif', fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--stone)' }}
            >
              <Link to="/" style={{ color: 'var(--stone)', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--taupe)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--stone)')}
              >
                Inicio
              </Link>
              <span>/</span>
              {catInfo ? (
                <>
                  <Link to="/coleccion" style={{ color: 'var(--stone)', textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--taupe)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--stone)')}
                  >
                    Colección
                  </Link>
                  <span>/</span>
                  <span style={{ color: 'var(--taupe)' }}>{catInfo.label}</span>
                </>
              ) : (
                <span style={{ color: 'var(--taupe)' }}>Colección</span>
              )}
            </div>

            {/* Título */}
            <div className="mb-10 reveal">
              <span className="eyebrow block mb-3">{catInfo ? 'Categoría' : 'Tienda'}</span>
              <h1
                className="font-serif font-light mb-3"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--charcoal)', lineHeight: 1.1 }}
              >
                {pageTitle}
              </h1>
              <p className="font-sans font-light"
                style={{ fontSize: '0.82rem', color: 'var(--taupe)', maxWidth: 460, lineHeight: 1.9 }}>
                {pageDesc}
              </p>
            </div>

            {/* Chips de categorías */}
            <div className="flex flex-wrap gap-2">
              {CHIPS.map(({ label, slug }) => {
                const isActive = slug === (categoria ?? null)
                const to = slug ? `/coleccion/${slug}` : '/coleccion'
                return (
                  <Link key={label} to={to}
                    style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: '0.4rem 0.95rem',
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                      fontSize: '0.58rem', fontWeight: 400,
                      letterSpacing: '0.18em', textTransform: 'uppercase',
                      textDecoration: 'none',
                      border: `1px solid ${isActive ? 'var(--charcoal)' : 'var(--linen-mid)'}`,
                      backgroundColor: isActive ? 'var(--charcoal)' : 'transparent',
                      color: isActive ? 'var(--ivory)' : 'var(--taupe)',
                      transition: 'all 0.2s ease', whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.borderColor = 'var(--taupe)'; e.currentTarget.style.color = 'var(--charcoal)' } }}
                    onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.borderColor = 'var(--linen-mid)'; e.currentTarget.style.color = 'var(--taupe)' } }}
                  >
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Grid de productos */}
        <div className="px-6 py-14 md:py-20">
          <div className="max-w-7xl mx-auto">

            {filtered.length === 0 ? (
              <div className="text-center py-20 reveal">
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{ width: 52, height: 52, margin: '0 auto 1.5rem', color: 'var(--linen-warm)' }}>
                  <rect x="8" y="20" width="48" height="36" rx="2" />
                  <path d="M22 20v-4a10 10 0 0120 0v4" />
                </svg>
                <p className="font-serif font-light mb-2" style={{ fontSize: '1.4rem', color: 'var(--charcoal)' }}>
                  Sin productos por ahora
                </p>
                <p className="font-sans font-light mb-8"
                  style={{ fontSize: '0.78rem', color: 'var(--taupe)', lineHeight: 1.8 }}>
                  No hay productos disponibles en esta categoría por ahora.<br />
                  Estamos trabajando para traerte nuevas piezas.
                </p>
                <Link to="/coleccion" className="btn-outline">Volver a colección</Link>
              </div>
            ) : (
              <>
                <p className="mb-8"
                  style={{ fontFamily: 'DM Sans, system-ui, sans-serif', fontSize: '0.62rem', letterSpacing: '0.16em', color: 'var(--stone)', textTransform: 'uppercase' }}>
                  {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {filtered.map((product, i) => (
                    <ProductCard key={product.id} product={product} delay={i % 4} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
