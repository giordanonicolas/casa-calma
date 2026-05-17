import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function ProductCard({ product, delay = 0 }) {
  const { category, name, description, price, image, stock } = product
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  // stock === undefined → producto del fallback local (no mostramos info de stock)
  // stock === 0         → sin stock
  // stock > 0           → disponible
  const outOfStock = typeof stock === 'number' && stock === 0
  const showStockBadge = typeof stock === 'number'

  const handleAdd = () => {
    if (outOfStock) return
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <article className={`product-card reveal reveal-delay-${delay}`}>
      {/* Imagen */}
      <div className="product-img-container aspect-[3/4] mb-4" style={{ position: 'relative' }}>
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.parentElement.style.backgroundColor = 'var(--linen-pale)' }}
        />
        {/* Badge "Sin stock" sobre la imagen */}
        {outOfStock && (
          <div
            style={{
              position: 'absolute',
              top: '0.6rem',
              left: '0.6rem',
              padding: '0.2rem 0.55rem',
              backgroundColor: 'rgba(255,255,255,0.92)',
              border: '1px solid var(--linen-mid)',
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: '0.52rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--taupe)',
            }}
          >
            Sin stock
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <p className="eyebrow mb-1.5">{category}</p>
        <h3
          className="font-serif text-lg md:text-xl mb-1 font-normal"
          style={{ color: 'var(--charcoal)' }}
        >
          {name}
        </h3>
        <p className="font-sans text-xs mb-2.5 font-light" style={{ color: 'var(--taupe)' }}>
          {description}
        </p>
        <p className="font-serif text-base mb-3" style={{ color: 'var(--leather)' }}>
          ${price.toLocaleString('es-UY')}
        </p>

        {/* Stock disponible (solo si tenemos el dato y hay stock) */}
        {showStockBadge && !outOfStock && stock <= 5 && (
          <p
            style={{
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: '0.55rem',
              letterSpacing: '0.14em',
              color: 'var(--leather)',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
            }}
          >
            Últimas {stock} {stock === 1 ? 'unidad' : 'unidades'}
          </p>
        )}

        {/* Botón agregar */}
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          style={{
            width: '100%',
            padding: '0.55rem 0',
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: '0.58rem',
            fontWeight: 400,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            backgroundColor: outOfStock
              ? 'var(--linen-pale)'
              : added
                ? 'var(--leather)'
                : 'transparent',
            color: outOfStock
              ? 'var(--stone)'
              : added
                ? 'var(--ivory)'
                : 'var(--taupe)',
            border: `1px solid ${outOfStock ? 'var(--linen-mid)' : added ? 'var(--leather)' : 'var(--linen-mid)'}`,
            transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
            cursor: outOfStock ? 'not-allowed' : 'pointer',
          }}
        >
          {outOfStock ? 'Sin stock' : added ? '✓ Agregado' : 'Agregar al carrito'}
        </button>

        {/* "Ver carrito" aparece cuando el producto fue agregado */}
        <div
          style={{
            overflow: 'hidden',
            maxHeight: added ? 32 : 0,
            opacity: added ? 1 : 0,
            transition: 'max-height 0.3s ease, opacity 0.3s ease',
            marginTop: added ? '0.5rem' : 0,
          }}
        >
          <Link
            to="/carrito"
            style={{
              display: 'block',
              textAlign: 'center',
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: '0.58rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--leather)',
              textDecoration: 'none',
              paddingTop: '0.1rem',
            }}
          >
            Ver carrito →
          </Link>
        </div>
      </div>
    </article>
  )
}
