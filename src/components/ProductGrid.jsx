import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../lib/products.js'
import ProductCard from './ProductCard.jsx'

/* Placeholder sutil mientras carga */
function SkeletonCard() {
  return (
    <div style={{
      aspectRatio: '3 / 4',
      backgroundColor: 'var(--linen-pale)',
      animation: 'skeletonPulse 1.6s ease-in-out infinite',
    }} />
  )
}

export default function ProductGrid() {
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    fetchProducts().then((data) => {
      setAllProducts(data)
      setLoading(false)
    })
  }, [])

  // Solo active=true y featured=true
  const featured = allProducts.filter((p) => p.active && p.featured)

  return (
    <>
      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>

      <section id="coleccion" className="py-20 md:py-28 px-6" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="max-w-7xl mx-auto">

          {/* Encabezado */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="reveal">
              <span className="eyebrow block mb-3">Productos destacados</span>
              <h2 className="font-serif text-4xl md:text-5xl font-light" style={{ color: 'var(--charcoal)' }}>
                Piezas de temporada
              </h2>
            </div>
            <Link to="/coleccion" className="btn-ghost self-start md:self-auto reveal">
              Ver todo →
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {loading
              ? [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)
              : featured.map((product, i) => (
                  <ProductCard key={product.id} product={product} delay={i} />
                ))
            }
          </div>

        </div>
      </section>
    </>
  )
}
