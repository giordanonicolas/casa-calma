import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../lib/products.js'
import ProductCard from './ProductCard.jsx'

export default function ProductGrid() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchProducts().then((data) => {
      // Mostrar los destacados (featured=true) o los primeros 4
      const featured = data.filter((p) => p.featured)
      setProducts(featured.length > 0 ? featured.slice(0, 4) : data.slice(0, 4))
    })
  }, [])

  return (
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
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} delay={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
