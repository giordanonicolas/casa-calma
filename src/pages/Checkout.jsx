import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { submitOrder } from '../lib/checkout.js'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

/* ══════════════════════════════════════════════
   CONSTANTES
══════════════════════════════════════════════ */
const WA_URL =
  'https://wa.me/59891749718?text=Hola%20Casa%20Calma%2C%20realic%C3%A9%20un%20pedido%20y%20quiero%20coordinar%20el%20env%C3%ADo'

const DEPARTAMENTOS = [
  'Artigas', 'Canelones', 'Cerro Largo', 'Colonia', 'Durazno',
  'Flores', 'Florida', 'Lavalleja', 'Maldonado', 'Montevideo',
  'Paysandú', 'Río Negro', 'Rivera', 'Rocha', 'Salto',
  'San José', 'Soriano', 'Tacuarembó', 'Treinta y Tres',
]

const INITIAL = {
  nombre: '', apellido: '', email: '', telefono: '',
  calle: '', apartamento: '', ciudad: '', departamento: '', cp: '', comentarios: '',
}

const BANCO = [
  ['Banco',    'A definir'],
  ['Titular',  'Casa Calma'],
  ['Cuenta',   'A definir'],
  ['Moneda',   'Pesos uruguayos (UYU)'],
  ['Concepto', 'N.° de pedido / Nombre del cliente'],
]

/* ══════════════════════════════════════════════
   ESTILOS COMPARTIDOS
══════════════════════════════════════════════ */
const labelSt = {
  display: 'block',
  fontFamily: 'DM Sans, system-ui, sans-serif',
  fontSize: '0.58rem',
  fontWeight: 400,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--taupe)',
  marginBottom: '0.4rem',
}

const errorSt = {
  fontFamily: 'DM Sans, system-ui, sans-serif',
  fontSize: '0.6rem',
  color: 'var(--leather)',
  marginTop: '0.3rem',
  letterSpacing: '0.04em',
}

const inputSt = (err) => ({
  width: '100%',
  padding: '0.65rem 0.8rem',
  fontFamily: 'DM Sans, system-ui, sans-serif',
  fontSize: '0.8rem',
  fontWeight: 300,
  color: 'var(--charcoal)',
  backgroundColor: 'var(--ivory)',
  border: `1px solid ${err ? 'var(--leather)' : 'var(--linen-mid)'}`,
  outline: 'none',
  transition: 'border-color 0.2s ease',
  boxSizing: 'border-box',
})

/* ══════════════════════════════════════════════
   COMPONENTES AUXILIARES
══════════════════════════════════════════════ */
function SectionTitle({ children }) {
  return (
    <p
      style={{
        fontFamily: 'DM Sans, system-ui, sans-serif',
        fontSize: '0.62rem',
        fontWeight: 400,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'var(--charcoal)',
        marginBottom: '1.25rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--linen-pale)',
      }}
    >
      {children}
    </p>
  )
}

function Field({ label, required, error, wide, children }) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <label style={labelSt}>
        {label}
        {required && <span style={{ color: 'var(--leather)' }}> *</span>}
      </label>
      {children}
      {error && <p style={errorSt}>{error}</p>}
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, backgroundColor: 'var(--linen-mid)' }} />
}

function SubmitBtn({ loading }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        width: '100%',
        padding: '0.9rem 0',
        fontFamily: 'DM Sans, system-ui, sans-serif',
        fontSize: '0.62rem',
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        backgroundColor: loading ? 'var(--warm-gray)' : 'var(--charcoal)',
        color: 'var(--ivory)',
        border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.3s ease',
      }}
      onMouseEnter={(e) => {
        if (!loading) e.currentTarget.style.backgroundColor = 'var(--leather)'
      }}
      onMouseLeave={(e) => {
        if (!loading) e.currentTarget.style.backgroundColor = 'var(--charcoal)'
      }}
    >
      {loading && (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            width: 14, height: 14,
            animation: 'spin 0.9s linear infinite',
            flexShrink: 0,
          }}
        >
          <circle cx="10" cy="10" r="8" strokeOpacity="0.25" />
          <path d="M10 2a8 8 0 018 8" />
        </svg>
      )}
      {loading ? 'Procesando…' : 'Confirmar compra'}
    </button>
  )
}

/* ══════════════════════════════════════════════
   PANTALLA: CARRITO VACÍO
══════════════════════════════════════════════ */
function EmptyCart() {
  return (
    <>
      <Header />
      <main
        className="min-h-screen flex items-center justify-center py-24 px-6"
        style={{ backgroundColor: 'var(--ivory)' }}
      >
        <div className="text-center" style={{ maxWidth: 400 }}>
          <span className="eyebrow block mb-4">Checkout</span>
          <h1 className="font-serif font-light mb-4" style={{ fontSize: '2rem', color: 'var(--charcoal)' }}>
            Tu carrito está vacío
          </h1>
          <p className="font-sans font-light mb-8" style={{ fontSize: '0.82rem', color: 'var(--taupe)' }}>
            Agregá productos para continuar con tu compra.
          </p>
          <Link to="/" className="btn-primary">Ver colección</Link>
        </div>
      </main>
      <Footer />
    </>
  )
}

/* ══════════════════════════════════════════════
   PANTALLA: CONFIRMACIÓN
══════════════════════════════════════════════ */
function Confirmed({ orderId }) {
  return (
    <>
      <Header />
      <main
        className="min-h-screen flex items-center justify-center py-24 px-6"
        style={{ backgroundColor: 'var(--ivory)' }}
      >
        <div className="text-center" style={{ maxWidth: 500 }}>
          {/* Check */}
          <div style={{ color: 'var(--linen-warm)', marginBottom: '2rem' }}>
            <svg
              viewBox="0 0 72 72" fill="none" stroke="currentColor"
              strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
              style={{ width: 68, height: 68, margin: '0 auto' }}
            >
              <circle cx="36" cy="36" r="30" />
              <path d="M22 36l10 10 18-18" />
            </svg>
          </div>

          <span className="eyebrow block mb-4">Pedido recibido</span>

          <h1
            className="font-serif font-light mb-5"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--charcoal)' }}
          >
            Muchas gracias por tu compra.
          </h1>

          <p
            className="font-sans font-light mb-3"
            style={{
              fontSize: '0.85rem', color: 'var(--taupe)',
              lineHeight: 1.9, maxWidth: 400, margin: '0 auto 0.75rem',
            }}
          >
            Recibimos tu solicitud y nos comunicaremos contigo por WhatsApp para coordinar el envío.
          </p>

          {orderId && (
            <p
              className="font-sans font-light mb-3"
              style={{ fontSize: '0.65rem', color: 'var(--stone)', letterSpacing: '0.08em' }}
            >
              N.° de pedido: <span style={{ color: 'var(--taupe)', fontFamily: 'monospace' }}>{orderId.slice(0, 8).toUpperCase()}</span>
            </p>
          )}

          <p
            className="font-sans font-light mb-12"
            style={{ fontSize: '0.72rem', color: 'var(--stone)' }}
          >
            Revisá tu WhatsApp en las próximas horas.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn-outline">Volver al inicio</Link>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

/* ══════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════ */
export default function Checkout() {
  const { items, subtotal, totalQty, clear } = useCart()
  const { user, profile } = useAuth()

  const [form, setForm]           = useState(INITIAL)
  const [file, setFile]           = useState(null)
  const [errors, setErrors]       = useState({})
  const [loading, setLoading]     = useState(false)
  const [serverError, setServerError] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [orderId, setOrderId]     = useState(null)

  const fileRef = useRef(null)

  // Autocompletar con datos del usuario logueado
  useEffect(() => {
    if (user || profile) {
      setForm((prev) => ({
        ...prev,
        nombre:   profile?.nombre   || prev.nombre,
        apellido: profile?.apellido || prev.apellido,
        email:    user?.email       || prev.email,
        telefono: profile?.telefono || prev.telefono,
      }))
    }
  }, [user, profile])

  /* ── Handlers ── */
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleFile = (e) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      if (errors.file) setErrors((prev) => ({ ...prev, file: undefined }))
    }
  }

  const validate = () => {
    const errs = {}
    if (!form.nombre.trim())    errs.nombre      = 'Este campo es requerido'
    if (!form.apellido.trim())  errs.apellido    = 'Este campo es requerido'
    if (!form.email.trim())     errs.email       = 'Este campo es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                errs.email       = 'Ingresá un email válido'
    if (!form.telefono.trim())  errs.telefono    = 'Este campo es requerido'
    if (!form.calle.trim())     errs.calle       = 'Este campo es requerido'
    if (!form.ciudad.trim())    errs.ciudad      = 'Este campo es requerido'
    if (!form.departamento)     errs.departamento = 'Seleccioná un departamento'
    if (!file)                  errs.file        = 'El comprobante de pago es requerido'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validación del lado cliente
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Validar productos inactivos en el carrito
    const inactivos = items.filter((i) => i.active === false)
    if (inactivos.length > 0) {
      const nombres = inactivos.map((i) => i.name).join(', ')
      setServerError(`Los siguientes productos ya no están disponibles: ${nombres}. Por favor retiralos del carrito.`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Validar stock antes de confirmar
    const sinStock = items.filter((i) => i.stock !== undefined && i.qty > i.stock)
    if (sinStock.length > 0) {
      const detalle = sinStock
        .map((i) => `No hay stock suficiente de ${i.name}. Stock disponible: ${i.stock}.`)
        .join(' ')
      setServerError(detalle)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setLoading(true)
    setServerError(null)

    try {
      const { orderId: newId } = await submitOrder({ form, items, subtotal, file, userId: user?.id || null })

      // Todo OK: vaciamos el carrito y mostramos confirmación
      clear()
      setOrderId(newId)
      setConfirmed(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })

    } catch (err) {
      setServerError(err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setLoading(false)
    }
  }

  /* ── Early returns ── */
  if (items.length === 0 && !confirmed) return <EmptyCart />
  if (confirmed) return <Confirmed orderId={orderId} />

  /* ══════════════════════════════════════════════
     RENDER PRINCIPAL
  ══════════════════════════════════════════════ */
  return (
    <>
      {/* Spinner CSS global */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <Header />
      <main className="py-16 px-6" style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh' }}>
        <div className="max-w-5xl mx-auto">

          {/* Título */}
          <div className="mb-12">
            <span className="eyebrow block mb-3">Tienda</span>
            <h1
              className="font-serif font-light"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--charcoal)' }}
            >
              Finalizar compra
            </h1>
          </div>

          {/* Banner de error de servidor */}
          {serverError && (
            <div
              className="mb-8 flex gap-3 items-start"
              style={{
                padding: '1rem 1.25rem',
                backgroundColor: 'rgba(139,111,71,0.07)',
                border: '1px solid rgba(139,111,71,0.3)',
              }}
            >
              {/* Ícono alerta */}
              <svg
                viewBox="0 0 20 20" fill="none" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ width: 18, height: 18, color: 'var(--leather)', flexShrink: 0, marginTop: 1 }}
              >
                <path d="M10 3L2 17h16L10 3z" />
                <path d="M10 10v3M10 15.5v.5" />
              </svg>
              <div>
                <p
                  style={{
                    fontFamily: 'DM Sans',
                    fontSize: '0.76rem',
                    color: 'var(--leather)',
                    fontWeight: 400,
                    marginBottom: '0.2rem',
                  }}
                >
                  Hubo un problema al procesar tu compra
                </p>
                <p style={{ fontFamily: 'DM Sans', fontSize: '0.68rem', color: 'var(--warm-gray)', lineHeight: 1.6 }}>
                  {serverError}
                </p>
                <p style={{ fontFamily: 'DM Sans', fontSize: '0.65rem', color: 'var(--taupe)', marginTop: '0.4rem' }}>
                  Tu carrito no fue vaciado. Podés intentarlo de nuevo o{' '}
                  <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--leather)', textDecoration: 'underline' }}>
                    contactarnos por WhatsApp
                  </a>
                  .
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid md:grid-cols-3 gap-12 lg:gap-16 items-start">

              {/* ══════════════════════════════
                  COLUMNA IZQUIERDA — Formulario
              ══════════════════════════════ */}
              <div className="md:col-span-2 flex flex-col gap-10">

                {/* ── 1. Datos personales ── */}
                <div>
                  <SectionTitle>Datos personales</SectionTitle>
                  <div className="grid sm:grid-cols-2 gap-x-4 gap-y-5">
                    <Field label="Nombre" required error={errors.nombre}>
                      <input
                        name="nombre" value={form.nombre} onChange={handleChange}
                        style={inputSt(errors.nombre)} autoComplete="given-name"
                        disabled={loading}
                      />
                    </Field>
                    <Field label="Apellido" required error={errors.apellido}>
                      <input
                        name="apellido" value={form.apellido} onChange={handleChange}
                        style={inputSt(errors.apellido)} autoComplete="family-name"
                        disabled={loading}
                      />
                    </Field>
                    <Field label="Email" required error={errors.email}>
                      <input
                        name="email" type="email" value={form.email} onChange={handleChange}
                        style={inputSt(errors.email)} autoComplete="email"
                        placeholder="tu@email.com" disabled={loading}
                      />
                    </Field>
                    <Field label="Teléfono / WhatsApp" required error={errors.telefono}>
                      <input
                        name="telefono" type="tel" value={form.telefono} onChange={handleChange}
                        style={inputSt(errors.telefono)} autoComplete="tel"
                        placeholder="09X XXX XXX" disabled={loading}
                      />
                    </Field>
                  </div>
                </div>

                <Divider />

                {/* ── 2. Dirección de envío ── */}
                <div>
                  <SectionTitle>Dirección de envío</SectionTitle>
                  <div className="grid sm:grid-cols-2 gap-x-4 gap-y-5">
                    <Field label="Calle y número" required error={errors.calle} wide>
                      <input
                        name="calle" value={form.calle} onChange={handleChange}
                        style={inputSt(errors.calle)} autoComplete="street-address"
                        placeholder="Ej: Av. 18 de Julio 1234" disabled={loading}
                      />
                    </Field>
                    <Field label="Apartamento / aclaración" wide>
                      <input
                        name="apartamento" value={form.apartamento} onChange={handleChange}
                        style={inputSt(false)} placeholder="Apto, piso, timbre, referencias... (Opcional)"
                        disabled={loading}
                      />
                    </Field>
                    <Field label="Ciudad" required error={errors.ciudad}>
                      <input
                        name="ciudad" value={form.ciudad} onChange={handleChange}
                        style={inputSt(errors.ciudad)} autoComplete="address-level2"
                        disabled={loading}
                      />
                    </Field>
                    <Field label="Departamento" required error={errors.departamento}>
                      <select
                        name="departamento" value={form.departamento} onChange={handleChange}
                        style={{ ...inputSt(errors.departamento), cursor: loading ? 'not-allowed' : 'pointer' }}
                        disabled={loading}
                      >
                        <option value="">Seleccioná...</option>
                        {DEPARTAMENTOS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Código postal">
                      <input
                        name="cp" value={form.cp} onChange={handleChange}
                        style={inputSt(false)} placeholder="Opcional" disabled={loading}
                      />
                    </Field>
                    <Field label="Comentarios para el envío" wide>
                      <textarea
                        name="comentarios" value={form.comentarios} onChange={handleChange}
                        rows={3}
                        placeholder="Instrucciones especiales, horarios de entrega... (Opcional)"
                        style={{ ...inputSt(false), resize: 'vertical', lineHeight: 1.7, minHeight: 80 }}
                        disabled={loading}
                      />
                    </Field>
                  </div>
                </div>

                <Divider />

                {/* ── 3. Método de pago ── */}
                <div>
                  <SectionTitle>Método de pago</SectionTitle>

                  {/* Radio única opción */}
                  <div
                    className="flex items-center gap-3 p-4 mb-5"
                    style={{ border: '1px solid var(--linen-mid)', backgroundColor: 'var(--cream)' }}
                  >
                    <div
                      style={{
                        width: 18, height: 18, borderRadius: '50%',
                        border: '1.5px solid var(--leather)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <div style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: 'var(--leather)' }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: 'DM Sans', fontSize: '0.78rem', color: 'var(--charcoal)', fontWeight: 400, lineHeight: 1.2 }}>
                        Transferencia bancaria
                      </p>
                      <p style={{ fontFamily: 'DM Sans', fontSize: '0.65rem', color: 'var(--taupe)', fontWeight: 300 }}>
                        Pesos uruguayos (UYU)
                      </p>
                    </div>
                  </div>

                  {/* Datos bancarios */}
                  <div style={{ padding: '1.5rem', backgroundColor: 'var(--linen-pale)', border: '1px solid var(--linen-mid)' }}>
                    <p style={{ fontFamily: 'DM Sans', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '1.1rem' }}>
                      Datos para la transferencia
                    </p>
                    <div className="flex flex-col" style={{ gap: '0.6rem' }}>
                      {BANCO.map(([k, v], i) => (
                        <div
                          key={k}
                          className="flex justify-between items-start gap-4"
                          style={{
                            paddingBottom: '0.6rem',
                            borderBottom: i < BANCO.length - 1 ? '1px solid rgba(200,184,154,0.35)' : 'none',
                          }}
                        >
                          <span style={{ fontFamily: 'DM Sans', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--taupe)', flexShrink: 0 }}>
                            {k}
                          </span>
                          <span style={{ fontFamily: 'DM Sans', fontSize: '0.76rem', color: 'var(--charcoal)', fontWeight: 300, textAlign: 'right' }}>
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontFamily: 'DM Sans', fontSize: '0.65rem', color: 'var(--stone)', fontWeight: 300, lineHeight: 1.8, marginTop: '1rem', fontStyle: 'italic' }}>
                      Realizá la transferencia por el monto exacto y luego subí el comprobante a continuación.
                    </p>
                  </div>
                </div>

                <Divider />

                {/* ── 4. Comprobante ── */}
                <div>
                  <SectionTitle>Comprobante de pago</SectionTitle>
                  <p style={{ fontFamily: 'DM Sans', fontSize: '0.76rem', color: 'var(--taupe)', fontWeight: 300, lineHeight: 1.8, marginBottom: '1rem' }}>
                    Subí una captura de pantalla o PDF que confirme la transferencia realizada.
                  </p>

                  {/* Área de upload */}
                  <div
                    onClick={() => !loading && fileRef.current?.click()}
                    style={{
                      border: `1.5px dashed ${errors.file ? 'var(--leather)' : file ? 'var(--leather-light)' : 'var(--linen-mid)'}`,
                      backgroundColor: file ? 'rgba(139,111,71,0.04)' : errors.file ? 'rgba(139,111,71,0.02)' : 'var(--cream)',
                      padding: '2rem 1.5rem',
                      textAlign: 'center',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'border-color 0.25s ease, background-color 0.25s ease',
                      opacity: loading ? 0.65 : 1,
                    }}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFile}
                      style={{ display: 'none' }}
                      disabled={loading}
                    />

                    {file ? (
                      <>
                        <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
                          style={{ width: 36, height: 36, margin: '0 auto 0.75rem', color: 'var(--leather)' }}>
                          <circle cx="20" cy="20" r="16" /><path d="M13 20l5 5 9-9" />
                        </svg>
                        <p style={{ fontFamily: 'DM Sans', fontSize: '0.76rem', color: 'var(--leather)', fontWeight: 400, marginBottom: '0.2rem', wordBreak: 'break-all' }}>
                          {file.name}
                        </p>
                        <p style={{ fontFamily: 'DM Sans', fontSize: '0.62rem', color: 'var(--taupe)' }}>
                          {(file.size / 1024).toFixed(0)} KB · Hacé clic para cambiar
                        </p>
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
                          style={{ width: 36, height: 36, margin: '0 auto 0.75rem', color: 'var(--linen-warm)' }}>
                          <path d="M8 30v2a2 2 0 002 2h20a2 2 0 002-2v-2" /><path d="M20 6v20M13 13l7-7 7 7" />
                        </svg>
                        <p style={{ fontFamily: 'DM Sans', fontSize: '0.76rem', color: 'var(--taupe)', fontWeight: 400, marginBottom: '0.25rem' }}>
                          Hacé clic para subir el comprobante
                        </p>
                        <p style={{ fontFamily: 'DM Sans', fontSize: '0.62rem', color: 'var(--stone)' }}>
                          JPG, PNG o PDF · Máx. 10 MB
                        </p>
                      </>
                    )}
                  </div>
                  {errors.file && <p style={{ ...errorSt, marginTop: '0.5rem' }}>{errors.file}</p>}
                </div>

                {/* Botón confirmar — solo mobile */}
                <div className="md:hidden flex flex-col gap-2">
                  <SubmitBtn loading={loading} />
                  {Object.keys(errors).length > 0 && !loading && (
                    <p style={{ fontFamily: 'DM Sans', fontSize: '0.65rem', color: 'var(--leather)', textAlign: 'center' }}>
                      Por favor corregí los campos marcados en rojo.
                    </p>
                  )}
                </div>
              </div>

              {/* ══════════════════════════════
                  COLUMNA DERECHA — Resumen
              ══════════════════════════════ */}
              <div className="md:col-span-1">
                <div style={{ position: 'sticky', top: 90 }}>
                  <div style={{ backgroundColor: 'var(--cream)', padding: '2rem' }}>
                    <p style={{ fontFamily: 'DM Sans', fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--charcoal)', display: 'block', marginBottom: '1.5rem' }}>
                      Tu pedido ({totalQty} {totalQty === 1 ? 'art.' : 'arts.'})
                    </p>

                    {/* Items */}
                    <div className="flex flex-col" style={{ gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--linen-mid)' }}>
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-3 items-start">
                          <div style={{ width: 44, height: 54, flexShrink: 0, backgroundColor: 'var(--linen-pale)', overflow: 'hidden' }}>
                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none' }} />
                          </div>
                          <div className="flex-1" style={{ minWidth: 0 }}>
                            <p style={{ fontFamily: 'DM Sans', fontSize: '0.72rem', color: 'var(--charcoal)', lineHeight: 1.35, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.name}
                            </p>
                            <p style={{ fontFamily: 'DM Sans', fontSize: '0.62rem', color: 'var(--taupe)', fontWeight: 300 }}>
                              Cant. {item.qty}
                            </p>
                          </div>
                          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.9rem', color: 'var(--leather)', flexShrink: 0 }}>
                            ${(item.price * item.qty).toLocaleString('es-UY')}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Totales */}
                    <div className="flex justify-between items-baseline mb-3">
                      <span style={{ fontFamily: 'DM Sans', fontSize: '0.72rem', color: 'var(--taupe)', fontWeight: 300 }}>Subtotal</span>
                      <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: 'var(--charcoal)' }}>${subtotal.toLocaleString('es-UY')}</span>
                    </div>
                    <div className="flex justify-between items-baseline" style={{ paddingBottom: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--linen-mid)' }}>
                      <span style={{ fontFamily: 'DM Sans', fontSize: '0.72rem', color: 'var(--taupe)', fontWeight: 300 }}>Envío</span>
                      <span style={{ fontFamily: 'DM Sans', fontSize: '0.68rem', color: 'var(--stone)', fontStyle: 'italic' }}>A calcular</span>
                    </div>
                    <div className="flex justify-between items-baseline" style={{ marginBottom: '1.5rem' }}>
                      <span className="eyebrow">Total</span>
                      <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'var(--charcoal)' }}>
                        ${subtotal.toLocaleString('es-UY')}
                      </span>
                    </div>

                    {/* Botón confirmar — desktop */}
                    <div className="hidden md:block flex flex-col gap-2">
                      <SubmitBtn loading={loading} />
                      {Object.keys(errors).length > 0 && !loading && (
                        <p style={{ fontFamily: 'DM Sans', fontSize: '0.6rem', color: 'var(--leather)', textAlign: 'center', marginTop: '0.6rem', lineHeight: 1.5 }}>
                          Hay campos incompletos. Revisá el formulario.
                        </p>
                      )}
                    </div>

                    {/* Volver al carrito */}
                    <div className="text-center" style={{ marginTop: '1rem' }}>
                      <Link
                        to="/carrito"
                        style={{ fontFamily: 'DM Sans', fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--stone)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--charcoal)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--stone)')}
                      >
                        ← Volver al carrito
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
