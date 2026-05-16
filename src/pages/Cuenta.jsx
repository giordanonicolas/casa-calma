import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

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

const inputSt = {
  width: '100%',
  padding: '0.65rem 0.8rem',
  fontFamily: 'DM Sans, system-ui, sans-serif',
  fontSize: '0.8rem',
  fontWeight: 300,
  color: 'var(--charcoal)',
  backgroundColor: 'var(--ivory)',
  border: '1px solid var(--linen-mid)',
  outline: 'none',
  transition: 'border-color 0.2s ease',
  boxSizing: 'border-box',
}

const submitSt = {
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
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
}

function Field({ label, children }) {
  return (
    <div>
      <label style={labelSt}>{label}</label>
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════════
   FORMULARIO: INICIAR SESIÓN
══════════════════════════════════════════════ */
function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitted, setSubmitted] = useState(false)

  const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    // Próximamente: conectar con Supabase Auth
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <p
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.2rem',
            color: 'var(--charcoal)',
            marginBottom: '0.5rem',
          }}
        >
          Autenticación próximamente
        </p>
        <p style={{ fontFamily: 'DM Sans', fontSize: '0.75rem', color: 'var(--taupe)', lineHeight: 1.7 }}>
          Estamos integrando el sistema de cuentas. Por ahora podés comprar como invitado sin necesidad de crear una cuenta.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          style={{ ...submitSt, marginTop: '1.5rem', backgroundColor: 'transparent', color: 'var(--taupe)', border: '1px solid var(--linen-mid)' }}
        >
          Volver
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Field label="Email">
        <input
          name="email" type="email" value={form.email} onChange={handle}
          style={inputSt} placeholder="tu@email.com" autoComplete="email"
        />
      </Field>
      <Field label="Contraseña">
        <input
          name="password" type="password" value={form.password} onChange={handle}
          style={inputSt} placeholder="••••••••" autoComplete="current-password"
        />
      </Field>

      <button
        type="submit"
        style={submitSt}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--leather)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--charcoal)')}
      >
        Iniciar sesión
      </button>

      <p style={{ fontFamily: 'DM Sans', fontSize: '0.65rem', color: 'var(--stone)', textAlign: 'center' }}>
        ¿Olvidaste tu contraseña?{' '}
        <span style={{ color: 'var(--leather)', cursor: 'pointer' }}>Recuperar acceso</span>
      </p>
    </form>
  )
}

/* ══════════════════════════════════════════════
   FORMULARIO: CREAR CUENTA
══════════════════════════════════════════════ */
function RegisterForm() {
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', telefono: '', password: '', confirm: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    // Próximamente: conectar con Supabase Auth
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div style={{ color: 'var(--linen-warm)', marginBottom: '1.25rem' }}>
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
            style={{ width: 48, height: 48, margin: '0 auto' }}>
            <circle cx="24" cy="24" r="20" />
            <path d="M14 24l7 7 13-13" />
          </svg>
        </div>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--charcoal)', marginBottom: '0.5rem' }}>
          Registro próximamente
        </p>
        <p style={{ fontFamily: 'DM Sans', fontSize: '0.75rem', color: 'var(--taupe)', lineHeight: 1.7 }}>
          Estamos integrando el sistema de cuentas. Por ahora podés comprar sin necesidad de registrarte — el checkout funciona como invitado.
        </p>
        <Link
          to="/"
          style={{ ...submitSt, display: 'inline-flex', marginTop: '1.5rem', padding: '0.75rem 2rem', width: 'auto', textDecoration: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--leather)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--charcoal)')}
        >
          Ver colección
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nombre">
          <input name="nombre" value={form.nombre} onChange={handle} style={inputSt} autoComplete="given-name" />
        </Field>
        <Field label="Apellido">
          <input name="apellido" value={form.apellido} onChange={handle} style={inputSt} autoComplete="family-name" />
        </Field>
      </div>
      <Field label="Email">
        <input name="email" type="email" value={form.email} onChange={handle} style={inputSt} placeholder="tu@email.com" autoComplete="email" />
      </Field>
      <Field label="Teléfono / WhatsApp">
        <input name="telefono" type="tel" value={form.telefono} onChange={handle} style={inputSt} placeholder="09X XXX XXX" autoComplete="tel" />
      </Field>
      <Field label="Contraseña">
        <input name="password" type="password" value={form.password} onChange={handle} style={inputSt} placeholder="Mínimo 8 caracteres" autoComplete="new-password" />
      </Field>
      <Field label="Confirmar contraseña">
        <input name="confirm" type="password" value={form.confirm} onChange={handle} style={inputSt} placeholder="Repetí tu contraseña" autoComplete="new-password" />
      </Field>

      <button
        type="submit"
        style={submitSt}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--leather)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--charcoal)')}
      >
        Crear cuenta
      </button>

      <p style={{ fontFamily: 'DM Sans', fontSize: '0.62rem', color: 'var(--stone)', textAlign: 'center', lineHeight: 1.6 }}>
        Al crear una cuenta aceptás nuestros términos y condiciones.
      </p>
    </form>
  )
}

/* ══════════════════════════════════════════════
   PÁGINA PRINCIPAL
══════════════════════════════════════════════ */
export default function Cuenta() {
  const [tab, setTab] = useState('login') // 'login' | 'register'

  const tabSt = (active) => ({
    flex: 1,
    padding: '0.75rem 0',
    fontFamily: 'DM Sans, system-ui, sans-serif',
    fontSize: '0.6rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    background: 'none',
    border: 'none',
    borderBottom: active ? '2px solid var(--charcoal)' : '2px solid transparent',
    color: active ? 'var(--charcoal)' : 'var(--stone)',
    cursor: 'pointer',
    transition: 'color 0.2s ease, border-color 0.2s ease',
  })

  return (
    <>
      <Header />
      <main
        className="min-h-screen py-16 px-6 flex items-start justify-center"
        style={{ backgroundColor: 'var(--ivory)' }}
      >
        <div style={{ width: '100%', maxWidth: 440, paddingTop: '2rem' }}>

          {/* Título */}
          <div className="text-center mb-10">
            <span className="eyebrow block mb-3">Casa Calma</span>
            <h1
              className="font-serif font-light"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--charcoal)' }}
            >
              Mi cuenta
            </h1>
          </div>

          {/* Aviso compra como invitado */}
          <div
            className="mb-8 px-4 py-3 text-center"
            style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--linen-mid)' }}
          >
            <p style={{ fontFamily: 'DM Sans', fontSize: '0.68rem', color: 'var(--taupe)', lineHeight: 1.7 }}>
              ¿Querés comprar sin crear cuenta?{' '}
              <Link
                to="/carrito"
                style={{ color: 'var(--leather)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
              >
                Ir al carrito
              </Link>
              {' '}— el checkout funciona sin registro.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex mb-8" style={{ borderBottom: '1px solid var(--linen-mid)' }}>
            <button style={tabSt(tab === 'login')}    onClick={() => setTab('login')}>
              Iniciar sesión
            </button>
            <button style={tabSt(tab === 'register')} onClick={() => setTab('register')}>
              Crear cuenta
            </button>
          </div>

          {/* Formulario activo */}
          {tab === 'login' ? <LoginForm /> : <RegisterForm />}

          {/* Separador / info */}
          <div
            className="mt-10 pt-8 text-center"
            style={{ borderTop: '1px solid var(--linen-pale)' }}
          >
            <p style={{ fontFamily: 'DM Sans', fontSize: '0.62rem', color: 'var(--stone)', lineHeight: 1.7 }}>
              Sistema de cuentas en desarrollo.{' '}
              <a
                href="https://wa.me/59891749718"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--leather)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
              >
                Contactanos por WhatsApp
              </a>
              {' '}si necesitás ayuda con tu pedido.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
