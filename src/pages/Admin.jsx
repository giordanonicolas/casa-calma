import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

/* ══════════════════════════════════════════════
   CONSTANTES
══════════════════════════════════════════════ */
const ORDER_STATUSES = [
  { value: 'pending_review',    label: 'Pendiente de revisión' },
  { value: 'payment_confirmed', label: 'Pago confirmado'       },
  { value: 'shipped',           label: 'Enviado'               },
  { value: 'completed',         label: 'Completado'            },
  { value: 'cancelled',         label: 'Cancelado'             },
]

const STATUS_COLORS = {
  pending_review:    { bg: 'rgba(139,111,71,0.08)', color: 'var(--leather)' },
  payment_confirmed: { bg: 'rgba(100,130,90,0.10)', color: '#4a7c54'        },
  shipped:           { bg: 'rgba(70,100,160,0.10)', color: '#3a5a9a'        },
  completed:         { bg: 'rgba(60,120,80,0.10)',  color: '#2a6a40'        },
  cancelled:         { bg: 'rgba(160,60,60,0.08)',  color: '#8a2020'        },
}

// Transiciones permitidas por estado actual
const ALLOWED_TRANSITIONS = {
  pending_review:    ['payment_confirmed', 'cancelled'],
  payment_confirmed: ['shipped',           'cancelled'],
  shipped:           ['completed',         'cancelled'],
  completed:         [],
  cancelled:         [],
}

function getAllowedNext(currentStatus) {
  return ALLOWED_TRANSITIONS[currentStatus] ?? []
}

/* ══════════════════════════════════════════════
   ESTILOS COMPARTIDOS
══════════════════════════════════════════════ */
const eyebrow = {
  fontFamily: 'DM Sans, system-ui, sans-serif',
  fontSize: '0.58rem',
  fontWeight: 400,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: 'var(--leather)',
}

const inputSt = {
  fontFamily: 'DM Sans, system-ui, sans-serif',
  fontSize: '0.8rem',
  fontWeight: 300,
  color: 'var(--charcoal)',
  backgroundColor: 'var(--ivory)',
  border: '1px solid var(--linen-mid)',
  padding: '0.4rem 0.6rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

/* ══════════════════════════════════════════════
   COMPONENTES AUXILIARES
══════════════════════════════════════════════ */

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      style={{
        width: 36, height: 20,
        borderRadius: 10,
        border: 'none',
        backgroundColor: checked ? 'var(--leather)' : 'var(--linen-mid)',
        position: 'relative',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.2s',
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute',
        top: 3, left: checked ? 18 : 3,
        width: 14, height: 14,
        borderRadius: '50%',
        backgroundColor: '#fff',
        transition: 'left 0.2s',
      }} />
    </button>
  )
}

function StatusBadge({ status }) {
  const s = STATUS_STATUSES_MAP[status] || { label: status }
  const c = STATUS_COLORS[status] || { bg: 'var(--linen-pale)', color: 'var(--taupe)' }
  return (
    <span style={{
      padding: '0.2rem 0.6rem',
      borderRadius: 2,
      fontSize: '0.6rem',
      fontFamily: 'DM Sans, system-ui, sans-serif',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      backgroundColor: c.bg,
      color: c.color,
      whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  )
}

const STATUS_STATUSES_MAP = Object.fromEntries(
  ORDER_STATUSES.map((s) => [s.value, s])
)

/* ══════════════════════════════════════════════
   SECCIÓN: PRODUCTOS
══════════════════════════════════════════════ */
function ProductsSection() {
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState({})   // { [id]: boolean }
  const [edits, setEdits]         = useState({})   // { [id]: { field: value } }
  const [feedback, setFeedback]   = useState({})   // { [id]: 'saved' | 'error' }

  const loadProducts = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('category')
      .order('name')
    console.log('[admin] products data', data, 'error', error)
    if (!error) setProducts(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { loadProducts() }, [loadProducts])

  const setEdit = (id, field, value) => {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }))
  }

  const getField = (product, field) => {
    if (edits[product.id]?.[field] !== undefined) return edits[product.id][field]
    return product[field]
  }

  const saveProduct = async (product) => {
    const changes = edits[product.id]
    if (!changes || Object.keys(changes).length === 0) return

    setSaving((s) => ({ ...s, [product.id]: true }))

    const { error } = await supabase
      .from('products')
      .update(changes)
      .eq('id', product.id)

    setSaving((s) => ({ ...s, [product.id]: false }))

    if (error) {
      setFeedback((f) => ({ ...f, [product.id]: 'error' }))
    } else {
      setEdits((e) => { const n = { ...e }; delete n[product.id]; return n })
      setFeedback((f) => ({ ...f, [product.id]: 'saved' }))
      // Actualizar estado local
      setProducts((prev) =>
        prev.map((p) => p.id === product.id ? { ...p, ...changes } : p)
      )
    }
    setTimeout(() => setFeedback((f) => { const n = { ...f }; delete n[product.id]; return n }), 2500)
  }

  const hasChanges = (id) => edits[id] && Object.keys(edits[id]).length > 0

  if (loading) {
    return (
      <p style={{ fontFamily: 'DM Sans', fontSize: '0.8rem', color: 'var(--taupe)', padding: '2rem 0' }}>
        Cargando productos…
      </p>
    )
  }

  return (
    <div>
      <p style={{ ...eyebrow, marginBottom: '1.5rem' }}>Productos ({products.length})</p>

      {/* Desktop table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', fontFamily: 'DM Sans, system-ui, sans-serif' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--linen-mid)' }}>
              {['Producto', 'Categoría', 'Precio ($)', 'Stock', 'Activo', 'Destacado', ''].map((h) => (
                <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.55rem', color: 'var(--stone)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                style={{
                  borderBottom: '1px solid var(--linen-pale)',
                  backgroundColor: hasChanges(product.id) ? 'rgba(139,111,71,0.03)' : 'transparent',
                  transition: 'background-color 0.2s',
                }}
              >
                {/* Nombre */}
                <td style={{ padding: '0.75rem', minWidth: 160 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {product.image && (
                      <img src={product.image} alt={product.name}
                        style={{ width: 32, height: 40, objectFit: 'cover', backgroundColor: 'var(--linen-pale)', flexShrink: 0 }}
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    )}
                    <span style={{ color: 'var(--charcoal)', fontWeight: 400, lineHeight: 1.3 }}>
                      {product.name}
                    </span>
                  </div>
                </td>

                {/* Categoría */}
                <td style={{ padding: '0.75rem', color: 'var(--taupe)' }}>
                  {product.category}
                </td>

                {/* Precio */}
                <td style={{ padding: '0.75rem', minWidth: 100 }}>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={getField(product, 'price')}
                    onChange={(e) => setEdit(product.id, 'price', parseFloat(e.target.value) || 0)}
                    style={{ ...inputSt, width: 90 }}
                  />
                </td>

                {/* Stock */}
                <td style={{ padding: '0.75rem', minWidth: 80 }}>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={getField(product, 'stock')}
                    onChange={(e) => setEdit(product.id, 'stock', parseInt(e.target.value, 10) || 0)}
                    style={{ ...inputSt, width: 70 }}
                  />
                </td>

                {/* Activo */}
                <td style={{ padding: '0.75rem' }}>
                  <Toggle
                    checked={getField(product, 'active')}
                    onChange={(v) => setEdit(product.id, 'active', v)}
                  />
                </td>

                {/* Destacado */}
                <td style={{ padding: '0.75rem' }}>
                  <Toggle
                    checked={getField(product, 'featured')}
                    onChange={(v) => setEdit(product.id, 'featured', v)}
                  />
                </td>

                {/* Guardar */}
                <td style={{ padding: '0.75rem', minWidth: 90 }}>
                  {feedback[product.id] === 'saved' ? (
                    <span style={{ color: '#4a7c54', fontSize: '0.62rem', letterSpacing: '0.1em' }}>✓ Guardado</span>
                  ) : feedback[product.id] === 'error' ? (
                    <span style={{ color: 'var(--leather)', fontSize: '0.62rem' }}>Error</span>
                  ) : (
                    <button
                      onClick={() => saveProduct(product)}
                      disabled={!hasChanges(product.id) || saving[product.id]}
                      style={{
                        fontFamily: 'DM Sans, system-ui, sans-serif',
                        fontSize: '0.58rem',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        padding: '0.35rem 0.8rem',
                        backgroundColor: hasChanges(product.id) ? 'var(--charcoal)' : 'transparent',
                        color: hasChanges(product.id) ? 'var(--ivory)' : 'var(--stone)',
                        border: `1px solid ${hasChanges(product.id) ? 'var(--charcoal)' : 'var(--linen-mid)'}`,
                        cursor: hasChanges(product.id) ? 'pointer' : 'default',
                        transition: 'all 0.2s',
                        opacity: saving[product.id] ? 0.6 : 1,
                      }}
                    >
                      {saving[product.id] ? '…' : 'Guardar'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   SECCIÓN: PEDIDOS
══════════════════════════════════════════════ */
function OrdersSection() {
  const [orders, setOrders]             = useState([])
  const [loading, setLoading]           = useState(true)
  const [expanded, setExpanded]         = useState(null)
  const [orderItems, setOrderItems]     = useState({})   // { [orderId]: items[] }
  const [savingStatus, setSavingStatus] = useState({})   // { [orderId]: boolean }
  const [statusError, setStatusError]   = useState({})   // { [orderId]: string }
  const [stockRestored, setStockRestored] = useState({}) // { [orderId]: boolean }

  const loadOrders = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    console.log('[admin] orders data', data, 'error', error)
    if (!error) setOrders(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { loadOrders() }, [loadOrders])

  const toggleExpand = async (orderId) => {
    if (expanded === orderId) {
      setExpanded(null)
      return
    }
    setExpanded(orderId)
    if (!orderItems[orderId]) {
      const { data } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId)
      setOrderItems((prev) => ({ ...prev, [orderId]: data || [] }))
    }
  }

  const updateStatus = async (orderId, newStatus) => {
    // Limpiar estado previo de error / stock para este pedido
    setStatusError((e)     => { const n = { ...e }; delete n[orderId]; return n })
    setStockRestored((s)   => { const n = { ...s }; delete n[orderId]; return n })
    setSavingStatus((s)    => ({ ...s, [orderId]: true }))

    const { data: result, error: rpcError } = await supabase.rpc('update_order_status', {
      p_order_id:   orderId,
      p_new_status: newStatus,
    })

    setSavingStatus((s) => ({ ...s, [orderId]: false }))

    // Error de red o de Supabase
    if (rpcError) {
      setStatusError((e) => ({ ...e, [orderId]: 'Error de red. Intentá de nuevo.' }))
      return
    }

    // Error devuelto por la función (transición inválida, no autorizado, etc.)
    if (!result?.success) {
      const msg = result?.error ?? 'Error desconocido'
      let display = 'No se pudo actualizar el estado.'
      if (msg.includes('INVALID_TRANSITION')) display = 'Transición no permitida para este estado.'
      if (msg.includes('UNAUTHORIZED'))       display = 'Sin permisos de administrador.'
      if (msg.includes('INVALID_STATUS'))     display = 'Estado inválido.'
      setStatusError((e) => ({ ...e, [orderId]: display }))
      return
    }

    // Éxito: actualizar lista local
    setOrders((prev) =>
      prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o)
    )

    // Si se restauró stock, mostrar badge 3 segundos
    if (result.stock_restored) {
      setStockRestored((s) => ({ ...s, [orderId]: true }))
      setTimeout(
        () => setStockRestored((s) => { const n = { ...s }; delete n[orderId]; return n }),
        3000
      )
    }
  }

  const formatDate = (ts) => {
    if (!ts) return '—'
    return new Date(ts).toLocaleDateString('es-UY', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <p style={{ fontFamily: 'DM Sans', fontSize: '0.8rem', color: 'var(--taupe)', padding: '2rem 0' }}>
        Cargando pedidos…
      </p>
    )
  }

  if (orders.length === 0) {
    return (
      <p style={{ fontFamily: 'DM Sans', fontSize: '0.8rem', color: 'var(--taupe)', padding: '2rem 0' }}>
        No hay pedidos todavía.
      </p>
    )
  }

  return (
    <div>
      <p style={{ ...eyebrow, marginBottom: '1.5rem' }}>Pedidos recientes ({orders.length})</p>

      <div className="flex flex-col" style={{ gap: '0.75rem' }}>
        {orders.map((order) => {
          const isExp = expanded === order.id
          const items = orderItems[order.id] || []

          return (
            <div key={order.id}
              style={{
                border: '1px solid var(--linen-mid)',
                backgroundColor: isExp ? 'var(--cream)' : 'transparent',
                transition: 'background-color 0.2s',
              }}
            >
              {/* Fila principal */}
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: '1fr auto auto auto',
                  alignItems: 'center',
                  padding: '0.9rem 1rem',
                  cursor: 'pointer',
                  gap: '0.75rem',
                }}
                onClick={() => toggleExpand(order.id)}
              >
                {/* Info cliente */}
                <div>
                  <p style={{ fontFamily: 'DM Sans', fontSize: '0.78rem', color: 'var(--charcoal)', fontWeight: 400, marginBottom: 2 }}>
                    {order.customer_name} {order.customer_lastname}
                  </p>
                  <p style={{ fontFamily: 'DM Sans', fontSize: '0.65rem', color: 'var(--taupe)', fontWeight: 300 }}>
                    {order.customer_email} · {order.customer_phone}
                  </p>
                  <p style={{ fontFamily: 'DM Sans', fontSize: '0.6rem', color: 'var(--stone)', marginTop: 2 }}>
                    {formatDate(order.created_at)}
                  </p>
                </div>

                {/* Total */}
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: 'var(--leather)', flexShrink: 0 }}>
                  ${Number(order.total).toLocaleString('es-UY')}
                </span>

                {/* Estado */}
                <StatusBadge status={order.status} />

                {/* Chevron */}
                <span style={{ color: 'var(--taupe)', fontSize: '0.7rem', transform: isExp ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                  ▼
                </span>
              </div>

              {/* Detalle expandido */}
              {isExp && (
                <div style={{ padding: '0 1rem 1.2rem', borderTop: '1px solid var(--linen-pale)' }}>

                  {/* Dirección */}
                  <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                    <p style={{ fontFamily: 'DM Sans', fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: '0.4rem' }}>
                      Envío
                    </p>
                    <p style={{ fontFamily: 'DM Sans', fontSize: '0.75rem', color: 'var(--taupe)', lineHeight: 1.7 }}>
                      {order.shipping_street}
                      {order.shipping_apartment ? `, ${order.shipping_apartment}` : ''}
                      <br />
                      {order.shipping_city}, {order.shipping_department}
                      {order.shipping_postal_code ? ` (${order.shipping_postal_code})` : ''}
                    </p>
                    {order.shipping_notes && (
                      <p style={{ fontFamily: 'DM Sans', fontSize: '0.68rem', color: 'var(--stone)', fontStyle: 'italic', marginTop: '0.3rem' }}>
                        Nota: {order.shipping_notes}
                      </p>
                    )}
                  </div>

                  {/* Items */}
                  {items.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ fontFamily: 'DM Sans', fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: '0.4rem' }}>
                        Productos
                      </p>
                      {items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center"
                          style={{ padding: '0.4rem 0', borderBottom: '1px solid var(--linen-pale)' }}>
                          <span style={{ fontFamily: 'DM Sans', fontSize: '0.73rem', color: 'var(--charcoal)' }}>
                            {item.product_name} <span style={{ color: 'var(--taupe)' }}>× {item.quantity}</span>
                          </span>
                          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.85rem', color: 'var(--leather)' }}>
                            ${Number(item.subtotal).toLocaleString('es-UY')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Cambiar estado */}
                  {(() => {
                    const allowedNext   = getAllowedNext(order.status)
                    const isTerminal    = allowedNext.length === 0
                    const isSaving      = savingStatus[order.id]
                    const errMsg        = statusError[order.id]
                    const didRestoreStk = stockRestored[order.id]
                    return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div className="flex items-center gap-3" style={{ flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'DM Sans', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--stone)' }}>
                        Estado:
                      </span>

                      {isTerminal ? (
                        /* Estado terminal: solo mostrar badge, sin select */
                        <StatusBadge status={order.status} />
                      ) : (
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          disabled={isSaving}
                          style={{
                            fontFamily: 'DM Sans, system-ui, sans-serif',
                            fontSize: '0.72rem',
                            color: 'var(--charcoal)',
                            backgroundColor: 'var(--ivory)',
                            border: '1px solid var(--linen-mid)',
                            padding: '0.35rem 0.6rem',
                            outline: 'none',
                            cursor: isSaving ? 'wait' : 'pointer',
                            opacity: isSaving ? 0.6 : 1,
                          }}
                        >
                          {/* Opción actual (no seleccionable como destino) */}
                          <option value={order.status} disabled>
                            {ORDER_STATUSES.find((s) => s.value === order.status)?.label ?? order.status}
                          </option>
                          {/* Solo los próximos estados permitidos */}
                          {allowedNext.map((val) => {
                            const s = ORDER_STATUSES.find((s) => s.value === val)
                            return <option key={val} value={val}>{s?.label ?? val}</option>
                          })}
                        </select>
                      )}

                      {isSaving && (
                        <span style={{ fontFamily: 'DM Sans', fontSize: '0.62rem', color: 'var(--stone)' }}>Guardando…</span>
                      )}
                      {didRestoreStk && (
                        <span style={{ fontFamily: 'DM Sans', fontSize: '0.62rem', color: '#4a7c54', letterSpacing: '0.06em' }}>
                          ✓ Stock devuelto
                        </span>
                      )}
                    </div>

                    {errMsg && (
                      <p style={{ fontFamily: 'DM Sans', fontSize: '0.62rem', color: 'var(--leather)', margin: 0 }}>
                        ⚠ {errMsg}
                      </p>
                    )}
                  </div>
                    )
                  })()}

                  {/* Comprobante */}
                  {order.payment_receipt_path && (
                    <a
                      href={`https://zcmvjouuunxyejhzxsbc.supabase.co/storage/v1/object/public/payment-receipts/${order.payment_receipt_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: 'DM Sans', fontSize: '0.6rem', letterSpacing: '0.12em',
                        textTransform: 'uppercase', color: 'var(--leather)', textDecoration: 'underline',
                        display: 'block', marginTop: '0.5rem',
                      }}
                    >
                      Ver comprobante
                    </a>
                  )}

                  {/* ID del pedido */}
                  <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'var(--stone)', marginTop: '0.75rem' }}>
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   COMPONENTE PRINCIPAL: Admin
══════════════════════════════════════════════ */
export default function Admin() {
  const { user, profile, loading: authLoading } = useAuth()
  const [tab, setTab] = useState('products')  // 'products' | 'orders'

  /* ── Debug logs (temporales) ── */
  console.log('[admin] authLoading', authLoading)
  console.log('[admin] user', user?.email ?? null)
  console.log('[admin] profile', profile)
  console.log('[admin] isAdmin', profile?.role === 'admin')

  /* ── Auth guards ── */

  // Mientras carga la sesión O mientras se está cargando el perfil
  // (user existe pero profile todavía no llegó) mostramos loading.
  // Esto evita el flash de "Acceso no autorizado" durante la carga del perfil.
  if (authLoading || (user && profile === null)) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ivory)' }}>
          <p style={{ fontFamily: 'DM Sans', fontSize: '0.8rem', color: 'var(--taupe)' }}>Verificando sesión…</p>
        </main>
        <Footer />
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center py-24 px-6" style={{ backgroundColor: 'var(--ivory)' }}>
          <div className="text-center" style={{ maxWidth: 400 }}>
            <span className="eyebrow block mb-4">Admin</span>
            <h1 className="font-serif font-light mb-4" style={{ fontSize: '2rem', color: 'var(--charcoal)' }}>
              Acceso restringido
            </h1>
            <p className="font-sans font-light mb-8" style={{ fontSize: '0.82rem', color: 'var(--taupe)', lineHeight: 1.8 }}>
              Necesitás iniciar sesión para acceder al panel de administración.
            </p>
            <Link to="/cuenta" className="btn-primary">Iniciar sesión</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (profile?.role !== 'admin') {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center py-24 px-6" style={{ backgroundColor: 'var(--ivory)' }}>
          <div className="text-center" style={{ maxWidth: 400 }}>
            <span className="eyebrow block mb-4">Admin</span>
            <h1 className="font-serif font-light mb-4" style={{ fontSize: '2rem', color: 'var(--charcoal)' }}>
              Acceso no autorizado
            </h1>
            <p className="font-sans font-light mb-8" style={{ fontSize: '0.82rem', color: 'var(--taupe)', lineHeight: 1.8 }}>
              Tu cuenta no tiene permisos de administrador.
              {profile && (
                <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--stone)' }}>
                  Role actual: {profile.role ?? 'sin role'}
                </span>
              )}
            </p>
            <Link to="/" className="btn-outline">Volver al inicio</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  /* ── Panel admin ── */
  return (
    <>
      <Header />
      <main style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh' }}>

        {/* Hero */}
        <div className="px-6 pt-14 pb-10 md:pt-20 md:pb-14"
          style={{ borderBottom: '1px solid var(--linen-mid)' }}>
          <div className="max-w-6xl mx-auto">
            <span style={eyebrow} className="block mb-3">Panel de administración</span>
            <h1 className="font-serif font-light"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--charcoal)', lineHeight: 1.1 }}>
              Casa Calma Admin
            </h1>
            <p className="font-sans font-light mt-2"
              style={{ fontSize: '0.78rem', color: 'var(--stone)' }}>
              Sesión: {profile?.nombre || user.email}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '1px solid var(--linen-mid)', backgroundColor: 'var(--ivory)' }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex gap-0">
              {[
                { key: 'products', label: 'Productos' },
                { key: 'orders',   label: 'Pedidos'   },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  style={{
                    fontFamily: 'DM Sans, system-ui, sans-serif',
                    fontSize: '0.68rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    padding: '1rem 1.5rem',
                    border: 'none',
                    borderBottom: tab === key ? '2px solid var(--leather)' : '2px solid transparent',
                    backgroundColor: 'transparent',
                    color: tab === key ? 'var(--leather)' : 'var(--taupe)',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    marginBottom: -1,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-6 py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            {tab === 'products' && <ProductsSection />}
            {tab === 'orders'   && <OrdersSection />}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
