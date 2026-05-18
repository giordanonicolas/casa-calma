import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

function EmptyBagIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 64, height: 64, margin: '0 auto 1.5rem' }}
    >
      <path d="M42 26v-4a10 10 0 00-20 0v4" />
      <rect x="10" y="26" width="44" height="32" rx="2" />
    </svg>
  )
}

function QtyButton({ onClick, children, disabled }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        width: 30,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'DM Sans, system-ui, sans-serif',
        fontSize: '1rem',
        color: disabled ? 'var(--linen-warm)' : 'var(--taupe)',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'color 0.2s ease',
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.color = 'var(--charcoal)' }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.color = 'var(--taupe)' }}
    >
      {children}
    </button>
  )
}

export default function Carrito() {
  const { items, removeItem, inc, dec, clear, subtotal, totalQty } = useCart()

  return (
    <>
      <Header />
      <main
        className="min-h-screen py-16 px-6"
        style={{ backgroundColor: 'var(--ivory)' }}
      >
        <div className="max-w-5xl mx-auto">

          {/* Título */}
          <div className="mb-12">
            <span className="eyebrow block mb-3">Tienda</span>
            <h1
              className="font-serif font-light"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--charcoal)' }}
            >
              Tu carrito
              {totalQty > 0 && (
                <span
                  className="font-sans font-light"
                  style={{ fontSize: '1rem', color: 'var(--stone)', marginLeft: '0.75rem' }}
                >
                  ({totalQty} {totalQty === 1 ? 'producto' : 'productos'})
                </span>
              )}
            </h1>
          </div>

          {/* ── Carrito vacío ── */}
          {items.length === 0 ? (
            <div className="text-center py-24">
              <div style={{ color: 'var(--linen-warm)' }}>
                <EmptyBagIcon />
              </div>
              <p
                className="font-serif font-light mb-2"
                style={{ fontSize: '1.5rem', color: 'var(--charcoal)' }}
              >
                Tu carrito está vacío
              </p>
              <p
                className="font-sans font-light mb-10"
                style={{ fontSize: '0.8rem', color: 'var(--taupe)', letterSpacing: '0.03em' }}
              >
                Descubrí nuestra colección de textiles artesanales
              </p>
              <Link to="/" className="btn-primary">
                Ver colección
              </Link>
            </div>
          ) : (

            /* ── Carrito con productos ── */
            <div className="grid md:grid-cols-3 gap-12 lg:gap-16 items-start">

              {/* ── Lista de items — 2 columnas ── */}
              <div className="md:col-span-2">

                {/* Encabezado tabla */}
                <div
                  className="grid grid-cols-12 pb-3 mb-6"
                  style={{ borderBottom: '1px solid var(--linen-mid)' }}
                >
                  <p className="eyebrow col-span-7">Producto</p>
                  <p className="eyebrow col-span-3 text-center">Cantidad</p>
                  <p className="eyebrow col-span-2 text-right">Subtotal</p>
                </div>

                {/* Items */}
                <div className="flex flex-col" style={{ gap: '2rem' }}>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-4 items-start"
                      style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--linen-pale)' }}
                    >
                      {/* Imagen + Info */}
                      <div className="col-span-7 flex gap-4">
                        {/* Imagen */}
                        <div
                          className="flex-shrink-0 overflow-hidden"
                          style={{ width: 72, height: 90, backgroundColor: 'var(--linen-pale)' }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        </div>

                        {/* Info */}
                        <div>
                          <p className="eyebrow mb-1">{item.category}</p>
                          <p
                            className="font-serif font-normal mb-1"
                            style={{ fontSize: '1rem', color: 'var(--charcoal)', lineHeight: 1.3 }}
                          >
                            {item.name}
                          </p>
                          <p
                            className="font-sans font-light mb-3"
                            style={{ fontSize: '0.75rem', color: 'var(--taupe)' }}
                          >
                            ${item.price.toLocaleString('es-UY')}
                          </p>
                          {/* Eliminar */}
                          <button
                            onClick={() => removeItem(item.id)}
                            style={{
                              fontFamily: 'DM Sans, system-ui, sans-serif',
                              fontSize: '0.58rem',
                              letterSpacing: '0.18em',
                              textTransform: 'uppercase',
                              color: 'var(--stone)',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: 0,
                              transition: 'color 0.2s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--leather)')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--stone)')}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>

                      {/* Cantidad */}
                      <div className="col-span-3 flex flex-col items-center gap-1">
                        <div
                          style={{
                            border: '1px solid var(--linen-mid)',
                            width: 'fit-content',
                            display: 'flex', alignItems: 'center',
                          }}
                        >
                          <QtyButton onClick={() => dec(item.id)}>−</QtyButton>
                          <span
                            className="font-sans"
                            style={{
                              minWidth: 28,
                              textAlign: 'center',
                              fontSize: '0.8rem',
                              color: 'var(--charcoal)',
                            }}
                          >
                            {item.qty}
                          </span>
                          <QtyButton
                            onClick={() => inc(item.id)}
                            disabled={item.stock !== undefined && item.qty >= item.stock}
                          >+</QtyButton>
                        </div>
                        {/* Aviso límite de stock */}
                        {item.stock !== undefined && item.qty >= item.stock && (
                          <p style={{
                            fontFamily: 'DM Sans, system-ui, sans-serif',
                            fontSize: '0.52rem', letterSpacing: '0.1em',
                            color: 'var(--stone)', textAlign: 'center',
                          }}>
                            Máx. disponible: {item.stock}
                          </p>
                        )}
                      </div>

                      {/* Subtotal item */}
                      <p
                        className="col-span-2 font-serif text-right"
                        style={{ fontSize: '1rem', color: 'var(--leather)' }}
                      >
                        ${(item.price * item.qty).toLocaleString('es-UY')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Acciones */}
                <div
                  className="flex items-center justify-between pt-6 mt-2"
                >
                  <Link to="/" className="btn-ghost">
                    ← Seguir comprando
                  </Link>
                  <button
                    onClick={clear}
                    style={{
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                      fontSize: '0.58rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--stone)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--charcoal)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--stone)')}
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>

              {/* ── Resumen — 1 columna ── */}
              <div className="md:col-span-1">
                <div
                  style={{ backgroundColor: 'var(--cream)', padding: '2rem' }}
                >
                  <p className="eyebrow block mb-6">Resumen del pedido</p>

                  {/* Subtotal */}
                  <div className="flex justify-between items-baseline mb-4">
                    <span
                      className="font-sans font-light"
                      style={{ fontSize: '0.75rem', color: 'var(--taupe)' }}
                    >
                      Subtotal ({totalQty} {totalQty === 1 ? 'art.' : 'arts.'})
                    </span>
                    <span
                      className="font-serif"
                      style={{ fontSize: '1rem', color: 'var(--charcoal)' }}
                    >
                      ${subtotal.toLocaleString('es-UY')}
                    </span>
                  </div>

                  {/* Envío */}
                  <div
                    className="flex justify-between items-baseline pb-6 mb-6"
                    style={{ borderBottom: '1px solid var(--linen-mid)' }}
                  >
                    <span
                      className="font-sans font-light"
                      style={{ fontSize: '0.75rem', color: 'var(--taupe)' }}
                    >
                      Envío
                    </span>
                    <span
                      className="font-sans font-light"
                      style={{ fontSize: '0.7rem', color: 'var(--stone)', fontStyle: 'italic' }}
                    >
                      A calcular
                    </span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-baseline mb-8">
                    <span className="eyebrow">Total</span>
                    <span
                      className="font-serif"
                      style={{ fontSize: '1.35rem', color: 'var(--charcoal)' }}
                    >
                      ${subtotal.toLocaleString('es-UY')}
                    </span>
                  </div>

                  {/* Finalizar */}
                  <Link
                    to="/checkout"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      padding: '0.85rem 0',
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                      fontSize: '0.62rem',
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      backgroundColor: 'var(--charcoal)',
                      color: 'var(--ivory)',
                      transition: 'background-color 0.3s ease',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--leather)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--charcoal)')}
                  >
                    Finalizar compra
                  </Link>

                  {/* Nota de pago */}
                  <p
                    className="font-sans font-light text-center mt-4"
                    style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--stone)' }}
                  >
                    Pago por transferencia bancaria
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
