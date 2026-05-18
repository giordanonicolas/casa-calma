import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext(null)

/* Tiempo máximo que esperamos a getSession antes de desistir */
const GET_SESSION_TIMEOUT_MS = 3000

/* ══════════════════════════════════════════════
   PROVIDER
══════════════════════════════════════════════ */
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  /* Carga el perfil extendido en background.
     PGRST116 = sin filas — normal para usuarios nuevos.
     Nunca bloquea el loading principal. */
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
      console.log('[auth] profile loaded', data?.role ?? 'sin role')
      setProfile(data ?? null)
    } catch (err) {
      console.error('[auth] excepción al cargar perfil:', err?.message ?? err)
      setProfile(null)
    }
  }

  useEffect(() => {
    let mounted = true

    /* getSession con timeout de seguridad.
       Si tarda más de GET_SESSION_TIMEOUT_MS (3 s), rechazamos y
       llamamos setLoading(false) de todos modos para no bloquear la UI.
       Causa más común del cuelgue: token expirado + Supabase tarda en
       responder al refresh request → la promesa queda pendiente. */
    ;(async () => {
      console.log('[auth] getSession start')
      try {
        const result = await Promise.race([
          supabase.auth.getSession(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('getSession timeout')), GET_SESSION_TIMEOUT_MS)
          ),
        ])

        if (!mounted) return

        const { data, error } = result
        if (error) throw error

        const u = data?.session?.user ?? null
        setUser(u)
        console.log('[auth] getSession done', u ? u.email : 'sin sesión')

        // loadProfile corre en background, no bloquea setLoading
        if (u) loadProfile(u.id)

      } catch (err) {
        console.warn('[auth] getSession error/timeout:', err?.message ?? err)
        if (mounted) setUser(null)
      } finally {
        if (mounted) {
          console.log('[auth] loading false')
          setLoading(false)
        }
      }
    })()

    /* Escuchar cambios de sesión (login / logout / token refresh).
       onAuthStateChange dispara INITIAL_SESSION al montar;
       lo ignoramos porque getSession ya lo maneja arriba. */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return
        const u = session?.user ?? null
        setUser(u)
        if (u) {
          loadProfile(u.id) // fire-and-forget
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

  const register = async ({ email, password, nombre, apellido, telefono }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre, apellido, telefono } },
    })
    if (error) throw error
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

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
