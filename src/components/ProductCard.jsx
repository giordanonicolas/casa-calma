import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function ProductCard({ product, delay = 0 }) {
  const { category, name, description, price, image } = product
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <article className={`product-card reveal reveal-delay-${delay}`}>
      {/* Imagen */}
      <div className="product-img-container aspect-[3/4] mb-4">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.parentElement.style.backgroundColor = 'var(--linen-pale)' }}
        />
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

        {/* Botón agregar */}
        <button
          onClick={handleAdd}
          style={{
            width: '100%',
            padding: '0.55rem 0',
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: '0.58rem',
            fontWeight: 400,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            backgroundColor: added ? 'var(--leather)' : 'transparent',
            color: added ? 'var(--ivory)' : 'var(--taupe)',
            border: `1px solid ${added ? 'var(--leather)' : 'var(--linen-mid)'}`,
            transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
            cursor: 'pointer',
          }}
        >
          {added ? '✓ Agregado' : 'Agregar al carrito'}
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
