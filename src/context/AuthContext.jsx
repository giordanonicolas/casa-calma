import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext(null)

/* ══════════════════════════════════════════════
   PROVIDER
══════════════════════════════════════════════ */
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  /* Carga el perfil extendido (nombre, apellido, teléfono).
     PGRST116 = sin filas — normal para usuarios nuevos, no es un error real. */
  const loadProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error && error.code !== 'PGRST116') {
        console.error('[auth] error al cargar perfil:', error.message)
      }
      setProfile(data ?? null)
    } catch (err) {
      console.error('[auth] excepción al cargar perfil:', err?.message ?? err)
      setProfile(null)
    }
  }

  useEffect(() => {
    let mounted = true

    /* Sesión existente al montar.
       setLoading(false) se ejecuta en finally — SIEMPRE, sin importar qué pase.
       loadProfile NO se awaita: carga en background para no bloquear la UI.
       /cuenta renderiza con user (puede haber profile=null si aún no cargó). */
    ;(async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (!mounted) return
        if (error) throw error
        const u = data?.session?.user ?? null
        setUser(u)
        if (u) loadProfile(u.id) // fire-and-forget: no bloquea setLoading
      } catch (err) {
        console.error('[auth] error al inicializar sesión:', err?.message ?? err)
        if (mounted) setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    /* Escuchar cambios de sesión (login / logout / token refresh).
       onAuthStateChange también dispara INITIAL_SESSION al montar;
       lo ignoramos porque getSession ya lo maneja arriba. */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return
        const u = session?.user ?? null
        setUser(u)
        if (u) {
          await loadProfile(u.id)
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  /* ── Operaciones de auth ── */

  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  /**
   * Registra un usuario con email/contraseña y guarda nombre, apellido y teléfono
   * en raw_user_meta_data. El trigger handle_new_user() en Supabase toma esos datos
   * y los inserta en la tabla profiles automáticamente.
   */
  const register = async ({ email, password, nombre, apellido, telefono }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre, apellido, telefono },
      },
    })
    if (error) throw error
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  /** Actualiza nombre, apellido y/o teléfono en la tabla profiles */
  const updateProfile = async (updates) => {
    if (!user) throw new Error('No hay sesión activa')
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    if (error) throw error
    setProfile(data)
    return data
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/* ══════════════════════════════════════════════
   HOOK
══════════════════════════════════════════════ */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
