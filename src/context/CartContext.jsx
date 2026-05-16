import { createContext, useContext, useReducer, useEffect, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'cc_cart_v1'

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find((i) => i.id === action.product.id)
      if (existing) {
        return state.map((i) =>
          i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...state, { ...action.product, qty: 1 }]
    }
    case 'REMOVE':
      return state.filter((i) => i.id !== action.id)
    case 'INC':
      return state.map((i) =>
        i.id === action.id ? { ...i, qty: i.qty + 1 } : i
      )
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

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [])
  const [toast, setToast] = useState(null) // { name, id } del producto recién agregado

  // Cargar desde localStorage al montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) dispatch({ type: 'LOAD', items: JSON.parse(saved) })
    } catch {
      // datos corruptos — ignorar
    }
  }, [])

  // Persistir en localStorage cada vez que cambia el carrito
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  // Auto-ocultar toast después de 3.5 s
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  const addItem = (product) => {
    dispatch({ type: 'ADD', product })
    setToast({ id: product.id, name: product.name })
  }

  const removeItem = (id)  => dispatch({ type: 'REMOVE', id })
  const inc        = (id)  => dispatch({ type: 'INC', id })
  const dec        = (id)  => dispatch({ type: 'DEC', id })
  const clear      = ()    => dispatch({ type: 'CLEAR' })
  const dismissToast = ()  => setToast(null)

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

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within <CartProvider>')
  return ctx
}
