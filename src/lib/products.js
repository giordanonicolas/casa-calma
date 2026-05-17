/**
 * src/lib/products.js
 * Carga productos desde Supabase con fallback a products.js local.
 */
import { supabase } from './supabase.js'
import { products as fallbackProducts } from '../data/products.js'

/**
 * Trae productos desde Supabase.
 * - adminMode=false → solo productos activos (anon/auth)
 * - adminMode=true  → todos los productos (requiere rol admin en RLS)
 */
export async function fetchProducts({ adminMode = false } = {}) {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .order('category')
      .order('name')

    // Sin adminMode pedimos solo activos (la policy RLS ya lo filtra,
    // pero el eq() evita que lleguen inactivos si hubiera un error de config)
    if (!adminMode) {
      query = query.eq('active', true)
    }

    const { data, error } = await query

    if (error) throw error

    if (!data || data.length === 0) {
      console.warn('[products] Supabase devolvió vacío — usando fallback local')
      return normalizeFallback(fallbackProducts)
    }

    return data
  } catch (err) {
    console.warn('[products] Error de Supabase, usando fallback local:', err.message)
    return normalizeFallback(fallbackProducts)
  }
}

/**
 * Convierte los productos de products.js al mismo shape que los de Supabase
 * (agrega campos faltantes con valores por defecto).
 */
function normalizeFallback(list) {
  return list.map((p) => ({
    ...p,
    stock:    undefined,   // undefined → la UI no muestra badge de stock
    active:   true,
    featured: false,
  }))
}
