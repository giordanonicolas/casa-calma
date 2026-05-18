import { supabase } from './supabase.js'

/**
 * Registra un pedido en Supabase.
 * El comprobante es OPCIONAL: si se pasa `file`, se sube a Storage;
 * si no se pasa, `payment_receipt_path` queda null.
 * Telegram se notifica siempre, con o sin comprobante.
 *
 * @param {{ form, items, subtotal, file?, userId? }} param
 * @returns {{ orderId: string }}
 * @throws Error con mensaje legible para el usuario
 */
export async function submitOrder({ form, items, subtotal, file = null, userId = null }) {

  /* ── 1. Generar ID del pedido ── */
  const orderId = crypto.randomUUID()

  /* ── 2. Subir comprobante a Storage (opcional) ── */
  let receiptPath = null

  if (file) {
    const ext      = file.name.split('.').pop().toLowerCase()
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    receiptPath    = `receipts/${Date.now()}_${Math.random().toString(36).slice(2)}_${safeName}`

    const { error: uploadError } = await supabase.storage
      .from('payment-receipts')
      .upload(receiptPath, file, {
        contentType: file.type || `image/${ext}`,
        upsert: false,
      })

    if (uploadError) {
      throw new Error(
        `No se pudo subir el comprobante. Verificá tu conexión e intentá de nuevo. (${uploadError.message})`
      )
    }
  }

  /* ── 3. Insertar pedido en orders ── */
  const { error: orderError } = await supabase.from('orders').insert({
    id:                    orderId,
    user_id:               userId,
    customer_name:         form.nombre.trim(),
    customer_lastname:     form.apellido.trim(),
    customer_email:        form.email.trim().toLowerCase(),
    customer_phone:        form.telefono.trim(),
    shipping_street:       form.calle.trim(),
    shipping_apartment:    form.apartamento?.trim()  || null,
    shipping_city:         form.ciudad.trim(),
    shipping_department:   form.departamento,
    shipping_postal_code:  form.cp?.trim()           || null,
    shipping_notes:        form.comentarios?.trim()  || null,
    payment_method:        'bank_transfer',
    payment_receipt_path:  receiptPath,        // null si no se subió comprobante
    total:                 subtotal,
    status:                'pending_review',
  })

  if (orderError) {
    throw new Error(
      `No se pudo registrar el pedido. Intentá de nuevo. (${orderError.message})`
    )
  }

  /* ── 4. Insertar items en order_items ── */
  const orderItems = items.map((item) => ({
    order_id:      orderId,
    product_id:    String(item.id),
    product_name:  item.name,
    product_price: item.price,
    quantity:      item.qty,
    subtotal:      item.price * item.qty,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

  if (itemsError) {
    console.error('[checkout] error insertando order_items:', itemsError)
    // No bloqueamos el flujo — el pedido ya quedó registrado
  }

  console.log('[checkout] pedido registrado', orderId, '| comprobante:', receiptPath ?? 'sin archivo')

  /* ── 5. Notificar por Telegram (fire-and-forget) ── */
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
