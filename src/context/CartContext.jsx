import { createContext, useContext, useReducer, useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthContext.jsx'

const CartContext = createContext(null)

/* ══════════════════════════════════════════════
   CLAVES DE LOCALSTORAGE
   - Invitado:  casaCalma_cart_guest
   - Logueado:  casaCalma_cart_user_<uid>
══════════════════════════════════════════════ */
const GUEST_KEY  = 'casaCalma_cart_guest'
const userKey    = (id) => `casaCalma_cart_user_${id}`
const storageKey = (userId) => (userId ? userKey(userId) : GUEST_KEY)

function loadFromStorage(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    return raw ? JSON.parse(raw) : []
  } catch {
    return [] // datos corruptos — ignorar
  }
}

/* ══════════════════════════════════════════════
   REDUCER
══════════════════════════════════════════════ */
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find((i) => i.id === action.product.id)
      // Bloquear si stock === 0 (seguridad extra)
      if (action.product.stock === 0) return state
      if (existing) {
        // No superar el stock disponible
        if (action.product.stock !== undefined && existing.qty >= action.product.stock) return state
        return state.map((i) =>
          i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...state, { ...action.product, qty: 1 }]
    }
    case 'REMOVE':
      return state.filter((i) => i.id !== action.id)
    case 'INC':
      return state.map((i) => {
        if (i.id !== action.id) return i
        // No superar el stock disponible
        if (i.stock !== undefined && i.qty >= i.stock) return i
        return { ...i, qty: i.qty + 1 }
      })
    case 'DEC':
      return state.map((i) =>
        i.id === action.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i
      )
    case 'CLEAR':
      return []
    case 'LOAD':
      return action.items
    default:
      return state
  }
}

/* ══════════════════════════════════════════════
   PROVIDER
══════════════════════════════════════════════ */
export function CartProvider({ children }) {
  // useAuth() funciona porque CartProvider es hijo de AuthProvider en App.jsx
  const { user, loading: authLoading } = useAuth()

  const [items, dispatch] = useReducer(cartReducer, [])
  const [toast, setToast] = useState(null)

  /**
   * activeKeyRef — clave de localStorage actualmente en uso.
   * Se actualiza ANTES de dispatch para que el efecto de persistencia
   * siempre escriba en la clave correcta, sin condiciones de carrera.
   */
  const activeKeyRef = useRef(null)

  /**
   * readyRef — se pone en true una vez que auth resolvió y se hizo
   * el primer LOAD. Impide que el efecto de persistencia escriba
   * antes de haber leído.
   */
  const readyRef = useRef(false)

  /* ──────────────────────────────────────────────
     Efecto principal: cambio de usuario (login / logout / mount)
     Espera a que auth deje de cargar para evitar cargar el carrito
     de invitado y luego pisarlo con el del usuario.
  ────────────────────────────────────────────── */
  useEffect(() => {
    if (authLoading) return // auth todavía resolviendo — no hacer nada

    const uid = user?.id ?? null
    const key = storageKey(uid)

    // Actualizar clave activa ANTES del dispatch
    activeKeyRef.current = key
    readyRef.current     = true

    // Cargar el carrito correspondiente (usuario o invitado)
    dispatch({ type: 'LOAD', items: loadFromStorage(uid) })
  }, [user, authLoading])

  /* ──────────────────────────────────────────────
     Persistir en la clave activa cada vez que cambian los items.
     readyRef garantiza que no se escriba en localStorage antes del
     primer load (evita sobreescribir datos guardados con [] vacío).
  ────────────────────────────────────────────── */
  useEffect(() => {
    if (!readyRef.current || !activeKeyRef.current) return
    localStorage.setItem(activeKeyRef.current, JSON.stringify(items))
  }, [items])

  /* ── Toast: auto-ocultar después de 3.5 s ── */
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  /* ══════════════════════════════════════════════
     ACCIONES
  ══════════════════════════════════════════════ */
  const addItem = (product) => {
    dispatch({ type: 'ADD', product })
    setToast({ id: product.id, name: product.name })
  }

  const removeItem   = (id) => dispatch({ type: 'REMOVE', id })
  const inc          = (id) => dispatch({ type: 'INC',    id })
  const dec          = (id) => dispatch({ type: 'DEC',    id })
  const dismissToast = ()   => setToast(null)

  /**
   * clear — vacía el carrito y borra la clave de localStorage del
   * usuario/invitado actual. Se llama tras compra exitosa.
   */
  const clear = () => {
    dispatch({ type: 'CLEAR' })
    if (activeKeyRef.current) {
      localStorage.removeItem(activeKeyRef.current)
    }
  }

  const totalQty = items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal  = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider
      value={{
        items, addItem, removeItem, inc, dec, clear,
        totalQty, subtotal,
        toast, dismissToast,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

/* ══════════════════════════════════════════════
   HOOK
══════════════════════════════════════════════ */
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within <CartProvider>')
  return ctx
}
