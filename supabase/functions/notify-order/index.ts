// supabase/functions/notify-order/index.ts
// Edge Function que notifica por Telegram cuando entra un pedido nuevo.
//
// Secrets requeridos (supabase secrets set):
//   TELEGRAM_BOT_TOKEN
//   TELEGRAM_CHAT_ID
//
// SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son inyectados automáticamente
// por el runtime de Supabase — no hacen falta como secrets manuales.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/* ── Secrets y vars de entorno ── */
const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!
const CHAT_ID   = Deno.env.get('TELEGRAM_CHAT_ID')!
const SUPA_URL  = Deno.env.get('SUPABASE_URL')!
const SUPA_SRK  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

/* ── CORS ── */
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/* ══════════════════════════════════════════════
   HANDLER
══════════════════════════════════════════════ */
Deno.serve(async (req) => {

  console.log('[notify-order] function started', { method: req.method, url: req.url })

  /* Pre-flight */
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  try {
    /* ── 1. Leer body ── */
    const body = await req.json()
    console.log('[notify-order] body received', JSON.stringify(body))

    const { order_id } = body
    console.log('[notify-order] order_id', order_id)

    if (!order_id) {
      console.error('[notify-order] order_id faltante en body')
      return new Response(
        JSON.stringify({ success: false, error: 'order_id requerido' }),
        { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } }
      )
    }

    /* ── 2. Verificar secrets ── */
    console.log('[notify-order] telegram chat id', CHAT_ID)
    console.log('[notify-order] BOT_TOKEN presente:', Boolean(BOT_TOKEN))
    console.log('[notify-order] SUPA_URL presente:', Boolean(SUPA_URL))
    console.log('[notify-order] SUPA_SRK presente:', Boolean(SUPA_SRK))

    /* ── 3. Cliente Supabase con service role (bypass RLS) ── */
    const supabase = createClient(SUPA_URL, SUPA_SRK)

    /* ── 4. Obtener pedido ── */
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single()

    if (orderErr || !order) {
      console.error('[notify-order] order not found', orderErr)
      throw new Error(`Pedido no encontrado: ${orderErr?.message ?? 'sin datos'}`)
    }
    console.log('[notify-order] order found', JSON.stringify(order))

    /* ── 5. Obtener productos ── */
    const { data: items, error: itemsErr } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order_id)

    if (itemsErr) {
      console.error('[notify-order] items error', itemsErr)
      throw new Error(`Error al obtener items: ${itemsErr.message}`)
    }
    console.log('[notify-order] items found', JSON.stringify(items))

    /* ── 6. Armar mensaje ── */
    const productLines = (items ?? [])
      .map((i: any) =>
        `  • ${i.product_name} x${i.quantity} — $${Number(i.subtotal).toLocaleString('es-UY')}`
      )
      .join('\n') || '  (sin productos)'

    const addressParts = [
      order.shipping_street,
      order.shipping_apartment,
      order.shipping_city,
      order.shipping_department,
      order.shipping_postal_code,
    ]
      .filter(Boolean)
      .join(', ')

    const notasLine = order.shipping_notes
      ? `\n\n📝 *Notas:*\n${order.shipping_notes}`
      : ''

    const shortId = String(order_id).slice(0, 8).toUpperCase()

    const message = [
      `🛍 *Nuevo pedido — Casa Calma*`,
      ``,
      `👤 *Cliente:* ${order.customer_name} ${order.customer_lastname}`,
      `📱 *Tel:* ${order.customer_phone}`,
      `✉️ *Email:* ${order.customer_email}`,
      ``,
      `🧺 *Productos:*`,
      productLines,
      ``,
      `💰 *Total:* $${Number(order.total).toLocaleString('es-UY')}`,
      ``,
      `📦 *Dirección:*`,
      addressParts,
      notasLine,
      ``,
      `📋 *Estado:* \`${order.status}\``,
      `🧾 *Comprobante:* Subido correctamente en Storage.`,
      ``,
      `🆔 \`${shortId}\``,
    ].join('\n')

    /* ── 7. Enviar a Telegram ── */
    const tgPayload = {
      chat_id:    CHAT_ID,
      text:       message,
      parse_mode: 'Markdown',
    }
    console.log('[notify-order] sending to telegram, chat_id:', CHAT_ID)

    const tgRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(tgPayload),
      }
    )

    const tgBody = await tgRes.json()
    console.log('[notify-order] telegram response', JSON.stringify(tgBody))

    if (!tgRes.ok) {
      console.error('[notify-order] telegram error', JSON.stringify(tgBody))
      throw new Error(`Telegram API error ${tgRes.status}: ${JSON.stringify(tgBody)}`)
    }

    console.log('[notify-order] success — mensaje enviado')
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...CORS, 'Content-Type': 'application/json' } }
    )

  } catch (err: any) {
    console.error('[notify-order] caught error:', err?.message ?? err)
    return new Response(
      JSON.stringify({ success: false, error: err?.message ?? 'Error desconocido' }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
    )
  }
})
