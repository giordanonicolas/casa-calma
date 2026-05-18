import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../lib/supabase.js'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

/* ══════════════════════════════════════════════
   ESTILOS COMPARTIDOS
══════════════════════════════════════════════ */
const eyebrowSt = {
  fontFamily: 'DM Sans, system-ui, sans-serif',
  fontSize: '0.58rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--taupe)',
}

const labelSt = {
  ...{ fontFamily: 'DM Sans, system-ui, sans-serif' },
  fontSize: '0.55rem',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--stone)',
  marginBottom: '0.25rem',
  display: 'block',
}

const inputSt = (err) => ({
  width: '100%',
  padding: '0.45rem 0.6rem',
  fontFamily: 'DM Sans, system-ui, sans-serif',
  fontSize: '0.82rem',
  fontWeight: 300,
  color: 'var(--charcoal)',
  backgroundColor: 'var(--ivory)',
  border: `1px solid ${err ? 'var(--leather)' : 'var(--linen-mid)'}`,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease',
})

/* ══════════════════════════════════════════════
   TOGGLE SWITCH
══════════════════════════════════════════════ */
function Toggle({ checked, onChange, disabled, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
      <span style={labelSt}>{label}</span>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        aria-label={label}
        style={{
          width: 38, height: 22,
          borderRadius: 11,
          backgroundColor: checked ? 'var(--leather)' : 'var(--linen-mid)',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          position: 'relative',
          transition: 'background-color 0.22s ease',
          flexShrink: 0,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <span style={{
          position: 'absolute',
          top: 3,
          left: checked ? 19 : 3,
          width: 16, height: 16,
          borderRadius: '50%',
          backgroundColor: 'white',
          transition: 'left 0.22s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
        }} />
      </button>
    </div>
  )
}

/* ══════════════════════════════════════════════
   SPINNER
══════════════════════════════════════════════ */
function Spinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        style={{ width: 28, height: 28, color: 'var(--linen-warm)', animation: 'spin 0.9s linear infinite' }}>
        <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
        <path d="M12 2a10 10 0 0110 10" />
      </svg>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

/* ══════════════════════════════════════════════
   PANTALLAS DE ACCESO DENEGADO
══════════════════════════════════════════════ */
function AccessScreen({ title, subtitle, cta, to }) {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center py-24 px-6"
        style={{ backgroundColor: 'var(--ivory)' }}>
        <div className="text-center" style={{ maxWidth: 380 }}>
          <span style={eyebrowSt} className="block mb-4">Admin</span>
          <h1 className="font-serif font-light mb-4"
            style={{ fontSize: '2rem', color: 'var(--charcoal)' }}>
            {title}
          </h1>
          <p className="font-sans font-light mb-8"
            style={{ fontSize: '0.82rem', color: 'var(--taupe)', lineHeight: 1.8 }}>
            {subtitle}
          </p>
          <Link to={to} className="btn-primary">{cta}</Link>
        </div>
      </main>
      <Footer />
    </>
  )
}

/* ══════════════════════════════════════════════
   CARD DE PRODUCTO EDITABLE
══════════════════════════════════════════════ */
function ProductRow({ product, edit, onChange, onSave, saving, message }) {
  const isSaving = saving[product.id]
  const msg      = message[product.id]

  return (
    <div style={{
      backgroundColor: product.active ? 'var(--ivory)' : 'var(--linen-pale)',
      border: '1px solid var(--linen-mid)',
      padding: '1.25rem 1.5rem',
      opacity: product.active ? 1 : 0.75,
    }}>
      <div className="grid md:grid-cols-12 gap-4 items-start">

        {/* ── Info (solo lectura) ── */}
        <div className="md:col-span-4 flex gap-3 items-start">
          {/* Miniatura */}
          <div style={{
            width: 52, height: 64, flexShrink: 0,
            backgroundColor: 'var(--linen-pale)',
            overflow: 'hidden',
          }}>
            {product.image && (
              <img src={product.image} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            )}
          </div>
          {/* Texto */}
          <div style={{ minWidth: 0 }}>
            <p style={{ ...eyebrowSt, marginBottom: '0.2rem' }}>{product.category}</p>
            <p className="font-serif" style={{ fontSize: '0.95rem', color: 'var(--charcoal)', lineHeight: 1.25, marginBottom: '0.2rem' }}>
              {product.name}
            </p>
            <p style={{ fontFamily: 'DM Sans', fontSize: '0.62rem', color: 'var(--stone)' }}>
              id: {product.id} · {product.slug}
            </p>
          </div>
        </div>

        {/* ── Precio ── */}
        <div className="md:col-span-2">
          <label style={labelSt}>Precio (UYU)</label>
          <input
            type="number"
            min="0"
            value={edit?.price ?? product.price}
            onChange={(e) => onChange(product.id, 'price', e.target.value)}
            disabled={isSaving}
            style={inputSt(false)}
          />
        </div>

        {/* ── Stock ── */}
        <div className="md:col-span-2">
          <label style={labelSt}>Stock</label>
          <input
            type="number"
            min="0"
            value={edit?.stock ?? product.stock}
            onChange={(e) => onChange(product.id, 'stock', e.target.value)}
            disabled={isSaving}
            style={inputSt(false)}
          />
        </div>

        {/* ── Toggles ── */}
        <div className="md:col-span-2 flex gap-5 items-start pt-1">
          <Toggle
            label="Destacado"
            checked={edit?.featured ?? product.featured}
            onChange={(val) => onChange(product.id, 'featured', val)}
            disabled={isSaving}
          />
          <Toggle
            label="Activo"
            checked={edit?.active ?? product.active}
            onChange={(val) => onChange(product.id, 'active', val)}
            disabled={isSaving}
          />
        </div>

        {/* ── Acción ── */}
        <div className="md:col-span-2 flex flex-col items-start md:items-end gap-2 pt-1">
          <button
            onClick={() => onSave(product)}
            disabled={isSaving}
            style={{
              padding: '0.5rem 1.1rem',
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: '0.58rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              backgroundColor: isSaving ? 'var(--warm-gray)' : 'var(--charcoal)',
              color: 'var(--ivory)',
              border: 'none',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { if (!isSaving) e.currentTarget.style.backgroundColor = 'var(--leather)' }}
            onMouseLeave={(e) => { if (!isSaving) e.currentTarget.style.backgroundColor = 'var(--charcoal)' }}
          >
            {isSaving ? 'Guardando…' : 'Guardar'}
          </button>

          {/* Mensaje de resultado */}
          {msg && (
            <p style={{
              fontFamily: 'DM Sans',
              fontSize: '0.62rem',
              color: msg.type === 'success' ? 'var(--leather)' : 'var(--leather)',
              lineHeight: 1.5,
              maxWidth: 160,
              textAlign: 'right',
              fontStyle: msg.type === 'error' ? 'normal' : 'normal',
              fontWeight: msg.type === 'error' ? 400 : 300,
            }}>
              {msg.type === 'error' && '⚠ '}{msg.text}
            </p>
          )}
        </div>

      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   PÁGINA PRINCIPAL
══════════════════════════════════════════════ */
export default function AdminProductos() {
  const { user, profile, loading: authLoading } = useAuth()

  const [products, setProducts]       = useState([])
  const [loadingProducts, setLoading] = useState(true)
  const [loadError, setLoadError]     = useState(null)
  const [edits, setEdits]             = useState({})   // { [id]: { price, stock, featured, active } }
  const [saving, setSaving]           = useState({})   // { [id]: bool }
  const [messages, setMessages]       = useState({})   // { [id]: { type, text } }

  /* Timeout de seguridad: si auth sigue loading después de 3 s, salimos del spinner */
  const [authTimedOut, setAuthTimedOut] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setAuthTimedOut(true), 3000)
    return () => clearTimeout(t)
  }, [])

  const isAdmin = profile?.role === 'admin'

  console.log('[admin-productos]', {
    authLoading, authTimedOut,
    user: user?.email ?? null,
    profile: profile?.role ?? null,
    isAdmin,
  })

  /* Cargar todos los productos (admin ve activos e inactivos) */
  useEffect(() => {
    if (!isAdmin) return

    supabase.from('products').select('*').order('id')
      .then(({ data, error }) => {
        if (error) {
          console.error('[admin-productos] error cargando:', error)
          setLoadError(error.message)
          setLoading(false)
          return
        }
        const rows = data || []
        setProducts(rows)
        const initial = {}
        rows.forEach((p) => {
          initial[p.id] = { price: p.price, stock: p.stock, featured: p.featured, active: p.active }
        })
        setEdits(initial)
        setLoading(false)
      })
  }, [isAdmin])

  /* Cambiar un campo en el estado local */
  const handleChange = (id, field, value) => {
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
    setMessages((prev) => ({ ...prev, [id]: null }))
  }

  /* Guardar cambios en Supabase */
  const handleSave = async (product) => {
    const edit  = edits[product.id]
    const price = parseInt(edit.price, 10)
    const stock = parseInt(edit.stock, 10)

    if (isNaN(price) || price < 0) {
      setMessages((prev) => ({ ...prev, [product.id]: { type: 'error', text: 'El precio debe ser un número mayor o igual a 0.' } }))
      return
    }
    if (isNaN(stock) || stock < 0) {
      setMessages((prev) => ({ ...prev, [product.id]: { type: 'error', text: 'El stock debe ser un número mayor o igual a 0.' } }))
      return
    }

    setSaving((prev) => ({ ...prev, [product.id]: true }))
    setMessages((prev) => ({ ...prev, [product.id]: null }))

    const { error } = await supabase
      .from('products')
      .update({ price, stock, featured: edit.featured, active: edit.active })
      .eq('id', product.id)

    setSaving((prev) => ({ ...prev, [product.id]: false }))

    if (error) {
      const text = error.code === '42501'
        ? 'Sin permisos. Verificá que tu cuenta tenga rol admin.'
        : `Error al guardar: ${error.message}`
      setMessages((prev) => ({ ...prev, [product.id]: { type: 'error', text } }))
    } else {
      setProducts((prev) =>
        prev.map((p) => p.id === product.id
          ? { ...p, price, stock, featured: edit.featured, active: edit.active }
          : p
        )
      )
      setMessages((prev) => ({ ...prev, [product.id]: { type: 'success', text: 'Guardado correctamente.' } }))
      setTimeout(() => setMessages((prev) => ({ ...prev, [product.id]: null })), 3500)
    }
  }

  /* ── Guards de acceso ── */

  // Auth todavía cargando Y no venció el timeout → spinner
  if (authLoading && !authTimedOut) {
    return (
      <>
        <Header />
        <main className="min-h-screen" style={{ backgroundColor: 'var(--ivory)' }}>
          <Spinner />
        </main>
        <Footer />
      </>
    )
  }

  // Auth tardó demasiado → no pudimos verificar sesión
  if (authLoading && authTimedOut) {
    return (
      <AccessScreen
        title="No pudimos verificar la sesión"
        subtitle="La verificación tardó demasiado. Recargá la página o volvé a iniciar sesión."
        cta="Iniciar sesión"
        to="/cuenta"
      />
    )
  }

  // Auth resolvió, no hay usuario
  if (!user) {
    return (
      <AccessScreen
        title="Acceso restringido"
        subtitle="Esta sección es solo para administradores. Iniciá sesión con tu cuenta para continuar."
        cta="Iniciar sesión"
        to="/cuenta"
      />
    )
  }

  // Hay usuario pero profile todavía es null (loadProfile en background)
  // Esperamos máximo 3 s vía authTimedOut; si venció y sigue null, avisamos
  if (user && profile === null) {
    return (
      <AccessScreen
        title="Verificando permisos"
        subtitle="Tu sesión está activa, pero no pudimos verificar los permisos de administrador. Recargá la página para intentar de nuevo."
        cta="Recargar"
        to="/admin-productos"
      />
    )
  }

  // Hay usuario y profile, pero no es admin
  if (!isAdmin) {
    return (
      <AccessScreen
        title="Acceso no autorizado"
        subtitle="Tu cuenta no tiene permisos de administrador."
        cta="Volver al inicio"
        to="/"
      />
    )
  }

  /* ══════════════════════════════════════════════
     PANEL ADMIN
  ══════════════════════════════════════════════ */
  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <Header />
      <main style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh' }}>
        <div className="px-6 py-14 md:py-20">
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>

            {/* Título */}
            <div className="mb-10">
              <span style={eyebrowSt} className="block mb-3">Panel admin</span>
              <h1 className="font-serif font-light mb-2"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--charcoal)' }}>
                Gestión de productos
              </h1>
              <p style={{ fontFamily: 'DM Sans', fontSize: '0.78rem', color: 'var(--taupe)', fontWeight: 300, lineHeight: 1.8 }}>
                Editá precio, stock, destacado y visibilidad. Hacé clic en "Guardar" por cada producto.
              </p>
            </div>

            {/* Leyenda de campos */}
            <div
              className="hidden md:grid md:grid-cols-12 gap-4 pb-3 mb-4"
              style={{ borderBottom: '1px solid var(--linen-mid)' }}
            >
              <p style={{ ...eyebrowSt, gridColumn: 'span 4' }}>Producto</p>
              <p style={{ ...eyebrowSt, gridColumn: 'span 2' }}>Precio (UYU)</p>
              <p style={{ ...eyebrowSt, gridColumn: 'span 2' }}>Stock</p>
              <p style={{ ...eyebrowSt, gridColumn: 'span 2' }}>Toggles</p>
              <p style={{ ...eyebrowSt, gridColumn: 'span 2', textAlign: 'right' }}>Acción</p>
            </div>

            {/* Estado de carga */}
            {loadingProducts && <Spinner />}

            {/* Error de carga */}
            {loadError && !loadingProducts && (
              <div style={{
                padding: '1rem 1.25rem',
                backgroundColor: 'rgba(139,111,71,0.07)',
                border: '1px solid rgba(139,111,71,0.3)',
                fontFamily: 'DM Sans', fontSize: '0.76rem', color: 'var(--leather)',
              }}>
                Error al cargar productos: {loadError}
              </div>
            )}

            {/* Lista de productos */}
            {!loadingProducts && !loadError && (
              <div className="flex flex-col" style={{ gap: '0.75rem' }}>
                {products.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    edit={edits[product.id]}
                    onChange={handleChange}
                    onSave={handleSave}
                    saving={saving}
                    message={messages}
                  />
                ))}
                {products.length === 0 && (
                  <p style={{ fontFamily: 'DM Sans', fontSize: '0.82rem', color: 'var(--taupe)', padding: '2rem 0' }}>
                    No se encontraron productos en Supabase.
                  </p>
                )}
              </div>
            )}

            {/* Notas */}
            <div className="mt-10 pt-8" style={{ borderTop: '1px solid var(--linen-pale)' }}>
              <p style={{ fontFamily: 'DM Sans', fontSize: '0.62rem', color: 'var(--stone)', lineHeight: 1.9 }}>
                Productos con <strong>Activo</strong> desactivado no se muestran en la tienda pública.
                · Productos con <strong>Destacado</strong> activado aparecen en la sección de inicio.
                · Los cambios se aplican en la web al recargar la página.
              </p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
