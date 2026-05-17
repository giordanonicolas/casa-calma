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

  /* Carga el perfil extendido (nombre, apellido, teléfono) */
  const loadProfile = async (userId) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      setProfile(data ?? null)
    } catch {
      setProfile(null)
    }
  }

  useEffect(() => {
    /* Sesión existente al montar — awaiteamos loadProfile antes de
       setLoading(false) para que Admin.jsx nunca vea profile=null
       con authLoading=false al mismo tiempo. */
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) await loadProfile(u.id)
      setLoading(false)
    })

    /* Escuchar cambios de sesión (login / logout / token refresh).
       onAuthStateChange también dispara INITIAL_SESSION al montar;
       lo ignoramos porque getSession ya lo maneja arriba. */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user ?? null
        setUser(u)
        if (u) {
          await loadProfile(u.id)
        } else {
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
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
