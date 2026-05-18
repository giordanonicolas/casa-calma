import { supabase } from './supabase.js'
import { products as localProducts } from '../data/products.js'

/**
 * Lee productos desde Supabase.
 * Fallback seguro a src/data/products.js si:
 *   - Supabase falla o no responde
 *   - La tabla no existe
 *   - La respuesta llega vacía
 * Siempre devuelve un array (nunca null ni undefined).
 */
export async function fetchProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id')

    if (error || !data || data.length === 0) {
      console.warn('[products] usando fallback local:', error?.message ?? 'respuesta vacía')
      return localProducts
    }

    return data
  } catch (err) {
    console.warn('[products] excepción, usando fallback local:', err?.message ?? err)
    return localProducts
  }
}
