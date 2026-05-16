import { supabase } from './supabase.js'

/**
 * Sube el comprobante a Storage y guarda el pedido + items en la base de datos.
 *
 * @param {{ form: object, items: Array, subtotal: number, file: File }} param
 * @returns {{ orderId: string }}
 * @throws Error con mensaje legible si algo falla
 */
export async function submitOrder({ form, items, subtotal, file }) {

  /* ── 1. Subir comprobante a Storage ── */
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

  /* ── 2. Insertar pedido en orders ── */
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name:        form.nombre.trim(),
      customer_lastname:    form.apellido.trim(),
      customer_email:       form.email.trim().toLowerCase(),
      customer_phone:       form.telefono.trim(),
      shipping_street:      form.calle.trim(),
      shipping_apartment:   form.apartamento?.trim() || null,
      shipping_city:        form.ciudad.trim(),
      shipping_department:  form.departamento,
      shipping_postal_code: form.cp?.trim()          || null,
      shipping_notes:       form.comentarios?.trim() || null,
      payment_method:       'bank_transfer',
      payment_receipt_path: path,
      total:                subtotal,
      status:               'pending_review',
    })
    .select('id')
    .single()

  if (orderError) {
    throw new Error(
      `No se pudo registrar el pedido. Intentá de nuevo en unos segundos. (${orderError.message})`
    )
  }

  /* ── 3. Insertar items del pedido en order_items ── */
  const orderItems = items.map((item) => ({
    order_id:      order.id,
    product_id:    item.id,
    product_name:  item.name,
    product_price: item.price,
    quantity:      item.qty,
    subtotal:      item.price * item.qty,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    // El pedido ya existe; situación recuperable — logueamos pero no abortamos
    console.error('[checkout] Error guardando items:', itemsError.message)
    throw new Error(
      `El pedido se registró pero hubo un problema guardando los productos. Contactanos por WhatsApp con tu nombre y email. (${itemsError.message})`
    )
  }

  return { orderId: order.id }
}
