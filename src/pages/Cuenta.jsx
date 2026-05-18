import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
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

const btnPrimary = {
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

const errorSt = {
  fontFamily: 'DM Sans, system-ui, sans-serif',
  fontSize: '0.65rem',
  color: 'var(--leather)',
  marginTop: '0.3rem',
}

function Field({ label, error, children }) {
  return (
    <div>
      <label style={labelSt}>{label}</label>
      {children}
      {error && <p style={errorSt}>{error}</p>}
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
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
   TRADUCIR ERRORES DE SUPABASE
══════════════════════════════════════════════ */
function authError(msg = '') {
  if (msg.includes('Invalid login credentials'))    return 'Email o contraseña incorrectos.'
  if (msg.includes('Email not confirmed'))           return 'Confirmá tu email antes de iniciar sesión.'
  if (msg.includes('User already registered'))       return 'Ya existe una cuenta con ese email.'
  if (msg.includes('Password should be at least'))   return 'La contraseña debe tener al menos 6 caracteres.'
  if (msg.includes('Unable to validate email'))      return 'Ingresá un email válido.'
  return msg
}

/* ══════════════════════════════════════════════
   VISTA: USUARIO LOGUEADO
══════════════════════════════════════════════ */
function ProfileView({ user, profile, logout, updateProfile }) {
  const navigate = useNavigate()
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({
    nombre:   profile?.nombre   || '',
    apellido: profile?.apellido || '',
    telefono: profile?.telefono || '',
  })
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState(null)
  const [loggingOut, setLoggingOut] = useState(false)

  const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await updateProfile(form)
      setSaved(true)
      setEdit(false)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    navigate('/')
  }

  const nombre = profile?.nombre || user.email.split('@')[0]

  return (
    <div>
      {/* Saludo */}
      <div className="text-center mb-8">
        <div
          style={{
            width: 56, height: 56, borderRadius: '50%',
            backgroundColor: 'var(--linen-pale)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"
            style={{ width: 24, height: 24, color: 'var(--taupe)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p style={{ fontFamily: 'DM Sans', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: '0.3rem' }}>
          Bienvenida/o
        </p>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--charcoal)' }}>
          {nombre}
        </p>
        <p style={{ fontFamily: 'DM Sans', fontSize: '0.72rem', color: 'var(--stone)', marginTop: '0.25rem' }}>
          {user.email}
        </p>
      </div>

      {saved && (
        <div
          className="mb-5 text-center py-2"
          style={{ backgroundColor: 'rgba(139,111,71,0.08)', border: '1px solid rgba(139,111,71,0.25)' }}
        >
          <p style={{ fontFamily: 'DM Sans', fontSize: '0.68rem', color: 'var(--leather)' }}>
            ✓ Perfil actualizado correctamente
          </p>
        </div>
      )}

      {/* Datos del perfil */}
      {!edit ? (
        <div style={{ backgroundColor: 'var(--cream)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="flex justify-between items-center mb-4">
            <p style={{ fontFamily: 'DM Sans', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--charcoal)' }}>
              Mis datos
            </p>
            <button
              onClick={() => {
                setForm({
                  nombre:   profile?.nombre   || '',
                  apellido: profile?.apellido || '',
                  telefono: profile?.telefono || '',
                })
                setEdit(true)
              }}
              style={{ fontFamily: 'DM Sans', fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--leather)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Editar
            </button>
          </div>

          {[
            ['Nombre',    profile?.nombre   || '—'],
            ['Apellido',  profile?.apellido || '—'],
            ['Email',     user.email],
            ['Teléfono',  profile?.telefono || '—'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between items-baseline py-2" style={{ borderBottom: '1px solid var(--linen-pale)' }}>
              <span style={{ fontFamily: 'DM Sans', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--taupe)' }}>{k}</span>
              <span style={{ fontFamily: 'DM Sans', fontSize: '0.78rem', color: 'var(--charcoal)', fontWeight: 300 }}>{v}</span>
            </div>
          ))}
        </div>
      ) : (
        /* Formulario de edición */
        <form onSubmit={handleSave} className="flex flex-col gap-4 mb-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nombre">
              <input name="nombre" value={form.nombre} onChange={handle} style={inputSt()} disabled={saving} />
            </Field>
            <Field label="Apellido">
              <input name="apellido" value={form.apellido} onChange={handle} style={inputSt()} disabled={saving} />
            </Field>
          </div>
          <Field label="Teléfono / WhatsApp">
            <input name="telefono" type="tel" value={form.telefono} onChange={handle} style={inputSt()} placeholder="09X XXX XXX" disabled={saving} />
          </Field>
          {error && <p style={errorSt}>{error}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setEdit(false); setError(null) }}
              style={{ ...btnPrimary, flex: 1, backgroundColor: 'transparent', color: 'var(--taupe)', border: '1px solid var(--linen-mid)' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{ ...btnPrimary, flex: 2, backgroundColor: saving ? 'var(--warm-gray)' : 'var(--charcoal)' }}
              onMouseEnter={(e) => { if (!saving) e.currentTarget.style.backgroundColor = 'var(--leather)' }}
              onMouseLeave={(e) => { if (!saving) e.currentTarget.style.backgroundColor = 'var(--charcoal)' }}
            >
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      )}

      {/* Acciones */}
      <div className="flex flex-col gap-3">
        <Link
          to="/carrito"
          style={{
            ...btnPrimary,
            textDecoration: 'none',
            backgroundColor: 'transparent',
            color: 'var(--charcoal)',
            border: '1px solid var(--linen-mid)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--cream)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Ir al carrito
        </Link>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            ...btnPrimary,
            backgroundColor: 'transparent',
            color: 'var(--stone)',
            border: '1px solid var(--linen-pale)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--leather)'; e.currentTarget.style.borderColor = 'var(--leather)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--stone)'; e.currentTarget.style.borderColor = 'var(--linen-pale)' }}
        >
          {loggingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   FORMULARIO: INICIAR SESIÓN
══════════════════════════════════════════════ */
function LoginForm({ onSuccess }) {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const handle = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setError(null)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Completá email y contraseña.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await login(form)
      onSuccess?.()
    } catch (err) {
      setError(authError(err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Field label="Email" error={null}>
        <input
          name="email" type="email" value={form.email} onChange={handle}
          style={inputSt()} placeholder="tu@email.com" autoComplete="email"
          disabled={loading}
        />
      </Field>
      <Field label="Contraseña" error={null}>
        <input
          name="password" type="password" value={form.password} onChange={handle}
          style={inputSt()} placeholder="••••••••" autoComplete="current-password"
          disabled={loading}
        />
      </Field>

      {error && (
        <div style={{ padding: '0.6rem 0.8rem', backgroundColor: 'rgba(139,111,71,0.07)', border: '1px solid rgba(139,111,71,0.25)' }}>
          <p style={{ fontFamily: 'DM Sans', fontSize: '0.7rem', color: 'var(--leather)' }}>{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{ ...btnPrimary, backgroundColor: loading ? 'var(--warm-gray)' : 'var(--charcoal)', cursor: loading ? 'not-allowed' : 'pointer' }}
        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = 'var(--leather)' }}
        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = loading ? 'var(--warm-gray)' : 'var(--charcoal)' }}
      >
        {loading ? 'Ingresando…' : 'Iniciar sesión'}
      </button>
    </form>
  )
}

/* ══════════════════════════════════════════════
   FORMULARIO: CREAR CUENTA
══════════════════════════════════════════════ */
function RegisterForm({ onSuccess }) {
  const { register } = useAuth()
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', telefono: '', password: '', confirm: '',
  })
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [needsConfirm, setNeedsConfirm] = useState(false)

  const handle = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setError(null)
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if (!form.nombre.trim() || !form.apellido.trim()) { setError('Nombre y apellido son requeridos.'); return }
    if (!form.email.trim()) { setError('El email es requerido.'); return }
    if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }
    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden.'); return }

    setLoading(true)
    setError(null)
    try {
      const { session } = await register({
        email: form.email.trim(),
        password: form.password,
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        telefono: form.telefono.trim(),
      })
      // Si no hay sesión activa, Supabase requiere confirmación de email
      if (!session) {
        setNeedsConfirm(true)
      } else {
        onSuccess?.()
      }
    } catch (err) {
      setError(authError(err.message))
    } finally {
      setLoading(false)
    }
  }

  if (needsConfirm) {
    return (
      <div className="text-center py-6">
        <div style={{ color: 'var(--linen-warm)', marginBottom: '1rem' }}>
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
            style={{ width: 48, height: 48, margin: '0 auto' }}>
            <rect x="4" y="12" width="40" height="28" rx="3" />
            <path d="M4 16l20 14 20-14" />
          </svg>
        </div>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--charcoal)', marginBottom: '0.5rem' }}>
          Revisá tu email
        </p>
        <p style={{ fontFamily: 'DM Sans', fontSize: '0.75rem', color: 'var(--taupe)', lineHeight: 1.8 }}>
          Te enviamos un link de confirmación a <strong>{form.email}</strong>.<br />
          Hacé clic en el link para activar tu cuenta.
        </p>
        <p style={{ fontFamily: 'DM Sans', fontSize: '0.65rem', color: 'var(--stone)', marginTop: '1rem' }}>
          ¿No llegó? Revisá la carpeta de spam.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nombre">
          <input name="nombre" value={form.nombre} onChange={handle} style={inputSt()} autoComplete="given-name" disabled={loading} />
        </Field>
        <Field label="Apellido">
          <input name="apellido" value={form.apellido} onChange={handle} style={inputSt()} autoComplete="family-name" disabled={loading} />
        </Field>
      </div>
      <Field label="Email">
        <input name="email" type="email" value={form.email} onChange={handle} style={inputSt()} placeholder="tu@email.com" autoComplete="email" disabled={loading} />
      </Field>
      <Field label="Teléfono / WhatsApp">
        <input name="telefono" type="tel" value={form.telefono} onChange={handle} style={inputSt()} placeholder="09X XXX XXX" autoComplete="tel" disabled={loading} />
      </Field>
      <Field label="Contraseña">
        <input name="password" type="password" value={form.password} onChange={handle} style={inputSt()} placeholder="Mínimo 6 caracteres" autoComplete="new-password" disabled={loading} />
      </Field>
      <Field label="Confirmar contraseña">
        <input name="confirm" type="password" value={form.confirm} onChange={handle} style={inputSt()} placeholder="Repetí tu contraseña" autoComplete="new-password" disabled={loading} />
      </Field>

      {error && (
        <div style={{ padding: '0.6rem 0.8rem', backgroundColor: 'rgba(139,111,71,0.07)', border: '1px solid rgba(139,111,71,0.25)' }}>
          <p style={{ fontFamily: 'DM Sans', fontSize: '0.7rem', color: 'var(--leather)' }}>{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{ ...btnPrimary, backgroundColor: loading ? 'var(--warm-gray)' : 'var(--charcoal)', cursor: loading ? 'not-allowed' : 'pointer' }}
        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = 'var(--leather)' }}
        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = loading ? 'var(--warm-gray)' : 'var(--charcoal)' }}
      >
        {loading ? 'Creando cuenta…' : 'Crear cuenta'}
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
  const { user, profile, loading, logout, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')

  /* Timeout de seguridad: si loading sigue true después de 3 s,
     renderizamos igual para que nunca quede en spinner infinito. */
  const [timedOut, setTimedOut] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 3000)
    return () => clearTimeout(t)
  }, [])

  console.log('[cuenta]', { loading, timedOut, user: user?.email ?? null, profile: profile?.role ?? null })

  /* Mostrar spinner solo mientras loading=true Y no llegó el timeout */
  const showSpinner = loading && !timedOut

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
            <h1 className="font-serif font-light" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--charcoal)' }}>
              Mi cuenta
            </h1>
          </div>

          {/* Contenido según estado de auth */}
          {showSpinner ? (
            <Spinner />
          ) : user ? (
            /* ── Usuario logueado ── */
            <ProfileView
              user={user}
              profile={profile}
              logout={logout}
              updateProfile={updateProfile}
            />
          ) : (
            /* ── No logueado ── */
            <>
              {/* Aviso compra sin cuenta */}
              <div
                className="mb-8 px-4 py-3 text-center"
                style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--linen-mid)' }}
              >
                <p style={{ fontFamily: 'DM Sans', fontSize: '0.68rem', color: 'var(--taupe)', lineHeight: 1.7 }}>
                  ¿Querés comprar sin crear cuenta?{' '}
                  <Link to="/carrito" style={{ color: 'var(--leather)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                    Ir al carrito
                  </Link>
                  {' '}— el checkout funciona sin registro.
                </p>
              </div>

              {/* Tabs */}
              <div className="flex mb-8" style={{ borderBottom: '1px solid var(--linen-mid)' }}>
                <button style={tabSt(tab === 'login')}    onClick={() => setTab('login')}>Iniciar sesión</button>
                <button style={tabSt(tab === 'register')} onClick={() => setTab('register')}>Crear cuenta</button>
              </div>

              {/* Formulario activo */}
              {tab === 'login'
                ? <LoginForm    onSuccess={() => navigate('/')} />
                : <RegisterForm onSuccess={() => navigate('/')} />
              }

              {/* Footer info */}
              <div className="mt-10 pt-8 text-center" style={{ borderTop: '1px solid var(--linen-pale)' }}>
                <p style={{ fontFamily: 'DM Sans', fontSize: '0.62rem', color: 'var(--stone)', lineHeight: 1.7 }}>
                  ¿Problemas con tu cuenta?{' '}
                  <a href="https://wa.me/59891749718" target="_blank" rel="noopener noreferrer"
                    style={{ color: 'var(--leather)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                    Contactanos por WhatsApp
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
