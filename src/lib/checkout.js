import { supabase } from './supabase.js'

/**
 * Sube el comprobante y llama al RPC place_order que:
 *  1. Verifica stock con FOR UPDATE (evita race conditions)
 *  2. Crea el pedido y los items
 *  3. Descuenta stock atómicamente
 *
 * Si falla el stock o cualquier operación, la transacción se revierte sola.
 *
 * @param {{ form, items, subtotal, file, userId? }} param
 * @returns {{ orderId: string }}
 * @throws Error con mensaje legible
 */
export async function submitOrder({ form, items, subtotal, file, userId = null }) {

  /* ── 1. Generar ID del pedido en el cliente ── */
  const orderId = crypto.randomUUID()

  /* ── 2. Subir comprobante a Storage ── */
  const ext      = file.name.split('.').pop().toLowerCase()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path     = `receipts/${Date.now()}_${Math.random().toString(36).slice(2)}_${safeName}`

  const { error: uploadError } = await supabase.storage
    .from('payment-receipts')
    .upload(path, file, {
      contentType: file.type || `image/${ext}`,
      upsert: false,
    })

  if (uploadError) {
    throw new Error(
      `No se pudo subir el comprobante. Verificá tu conexión e intentá de nuevo. (${uploadError.message})`
    )
  }

  /* ── 3. Construir el array de items para el RPC ──
     Usamos `slug` como identificador — el RPC lo resuelve a UUID internamente.
     Si el item viene del fallback local (sin slug), usamos el id como slug temporal. */
  const rpcItems = items.map((item) => ({
    product_slug:  item.slug  || String(item.id),
    product_name:  item.name,
    product_price: item.price,
    quantity:      item.qty,
  }))

  /* ── 4. Llamar al RPC atómico ── */
  console.log('[checkout] llamando place_order RPC', orderId)

  const { data: rpcResult, error: rpcError } = await supabase.rpc('place_order', {
    p_order_id:             orderId,
    p_user_id:              userId,
    p_customer_name:        form.nombre.trim(),
    p_customer_lastname:    form.apellido.trim(),
    p_customer_email:       form.email.trim().toLowerCase(),
    p_customer_phone:       form.telefono.trim(),
    p_shipping_street:      form.calle.trim(),
    p_shipping_apartment:   form.apartamento?.trim() || null,
    p_shipping_city:        form.ciudad.trim(),
    p_shipping_department:  form.departamento,
    p_shipping_postal_code: form.cp?.trim()          || null,
    p_shipping_notes:       form.comentarios?.trim() || null,
    p_payment_receipt_path: path,
    p_total:                subtotal,
    p_items:                rpcItems,
  })

  if (rpcError) {
    console.error('[checkout] error RPC:', rpcError)
    throw new Error(
      `No se pudo registrar el pedido. Intentá de nuevo. (${rpcError.message})`
    )
  }

  // El RPC devuelve { success, order_id } o { success: false, error }
  if (rpcResult && rpcResult.success === false) {
    const msg = rpcResult.error || 'Error desconocido'
    console.error('[checkout] place_order falló:', msg)

    // Mensajes de error legibles
    if (msg.includes('SIN_STOCK:')) {
      const parts = msg.split(':')
      const productName = parts[1] || 'un producto'
      const available   = parts[3] || '0'
      throw new Error(
        `"${productName}" se quedó sin stock antes de confirmar tu compra. ` +
        `Stock disponible: ${available}. Por favor ajustá tu carrito.`
      )
    }
    if (msg.includes('PRODUCTO_NO_ENCONTRADO:')) {
      throw new Error(
        `Uno de los productos no está disponible. Actualizá la página e intentá de nuevo.`
      )
    }
    throw new Error(`No se pudo procesar el pedido. ${msg}`)
  }

  console.log('[checkout] place_order exitoso', rpcResult)

  /* ── 5. Notificar por Telegram (fire-and-forget) ── */
  console.log('[checkout] calling notify-order', orderId)

  supabase.functions
    .invoke('notify-order', { body: { order_id: orderId } })
    .then(({ data, error }) => {
      if (error) console.error('[checkout] notify-order error', error)
      else       console.log('[checkout] notify-order success', data)
    })
    .catch((err) => {
      console.error('[checkout] notify-order exception', err?.message ?? err)
    })

  return { orderId }
}
