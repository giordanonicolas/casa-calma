import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function CartToast() {
  const { toast, dismissToast } = useCart()

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        pointerEvents: toast ? 'auto' : 'none',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--charcoal)',
          color: 'var(--ivory)',
          padding: '1rem 1.25rem',
          minWidth: 260,
          maxWidth: 320,
          boxShadow: '0 8px 32px rgba(58,53,48,0.18)',
          transform: toast ? 'translateY(0)' : 'translateY(120%)',
          opacity: toast ? 1 : 0,
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease',
        }}
      >
        {/* Encabezado */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2" style={{ flexShrink: 1, minWidth: 0 }}>
            {/* Check icon */}
            <svg
              viewBox="0 0 16 16" fill="none" stroke="currentColor"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              style={{ width: 14, height: 14, color: 'var(--linen-warm)', flexShrink: 0 }}
            >
              <circle cx="8" cy="8" r="6.5" />
              <path d="M5 8l2 2 4-4" />
            </svg>
            <p
              style={{
                fontFamily: 'DM Sans, system-ui, sans-serif',
                fontSize: '0.68rem',
                fontWeight: 400,
                color: 'var(--linen-warm)',
                letterSpacing: '0.06em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Agregado al carrito
            </p>
          </div>

          {/* Cerrar */}
          <button
            onClick={dismissToast}
            aria-label="Cerrar"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(250,250,247,0.4)',
              lineHeight: 1,
              padding: 0,
              flexShrink: 0,
              fontSize: '1rem',
            }}
          >
            ×
          </button>
        </div>

        {/* Nombre del producto */}
        {toast && (
          <p
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '0.95rem',
              fontWeight: 400,
              color: 'var(--ivory)',
              marginBottom: '0.9rem',
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {toast.name}
          </p>
        )}

        {/* Botón Ver carrito */}
        <Link
          to="/carrito"
          onClick={dismissToast}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '0.55rem 0',
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: '0.58rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            backgroundColor: 'var(--leather)',
            color: 'var(--ivory)',
            textDecoration: 'none',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--leather-light)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--leather)')}
        >
          Ver carrito →
        </Link>
      </div>
    </div>
  )
}
