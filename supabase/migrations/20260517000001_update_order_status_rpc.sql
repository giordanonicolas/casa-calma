-- ═══════════════════════════════════════════════════════════════════
-- Casa Calma — RPC: update_order_status
-- Gestiona transiciones de estado de pedidos con devolución de stock
-- segura y atómica cuando se cancela.
-- ═══════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────
-- 1. Columna updated_at en orders (si no existe)
-- ────────────────────────────────────────────────────────────────
alter table public.orders
  add column if not exists updated_at timestamptz;

-- ────────────────────────────────────────────────────────────────
-- 2. RPC: update_order_status
--
-- Transiciones permitidas:
--   pending_review    → payment_confirmed | cancelled
--   payment_confirmed → shipped           | cancelled
--   shipped           → completed         | cancelled
--   completed         → (ninguna)
--   cancelled         → (ninguna)
--
-- Si la transición es → cancelled:
--   restaura stock de todos los items del pedido
--   (solo si el estado anterior NO era ya cancelled)
--
-- Anti-duplicado:
--   FOR UPDATE bloquea la fila → dos llamadas simultáneas se serializan.
--   La segunda lee el estado ya actualizado y falla con INVALID_TRANSITION.
--
-- Seguridad:
--   security definer + validación de auth.uid() con role = 'admin'
--   → ni el anon ni un usuario normal puede llamarla efectivamente.
-- ────────────────────────────────────────────────────────────────
create or replace function public.update_order_status(
  p_order_id   uuid,
  p_new_status text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_status     text;
  v_item           record;
  v_valid_statuses text[] := array[
    'pending_review',
    'payment_confirmed',
    'shipped',
    'completed',
    'cancelled'
  ];
begin

  -- ── 1. Validar que el caller sea admin ───────────────────────
  if not exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ) then
    raise exception 'UNAUTHORIZED: se requiere rol admin';
  end if;

  -- ── 2. Validar que p_new_status sea un estado conocido ───────
  if p_new_status <> all(v_valid_statuses) then
    raise exception 'INVALID_STATUS:%', p_new_status;
  end if;

  -- ── 3. Leer estado actual con bloqueo exclusivo de fila ──────
  --   FOR UPDATE previene que dos transacciones concurrentes
  --   lean el mismo estado y ambas restauren stock.
  select status into v_old_status
    from public.orders
    where id = p_order_id
    for update;

  if not found then
    raise exception 'PEDIDO_NO_ENCONTRADO:%', p_order_id;
  end if;

  -- ── 4. Bloquear salidas desde estados terminales ─────────────
  if v_old_status = 'cancelled' then
    raise exception 'INVALID_TRANSITION:el pedido ya está cancelado y no puede cambiar de estado';
  end if;

  if v_old_status = 'completed' then
    raise exception 'INVALID_TRANSITION:un pedido completado no puede cambiar de estado';
  end if;

  -- ── 5. Validar que la transición específica esté permitida ───
  if not (
    (v_old_status = 'pending_review'    and p_new_status in ('payment_confirmed', 'cancelled')) or
    (v_old_status = 'payment_confirmed' and p_new_status in ('shipped',           'cancelled')) or
    (v_old_status = 'shipped'           and p_new_status in ('completed',          'cancelled'))
  ) then
    raise exception 'INVALID_TRANSITION:% → % no está permitida', v_old_status, p_new_status;
  end if;

  -- ── 6. Actualizar estado del pedido ──────────────────────────
  update public.orders
    set status     = p_new_status,
        updated_at = now()
    where id = p_order_id;

  -- ── 7. Si es cancelación: restaurar stock atómicamente ───────
  --   En este punto ya sabemos que v_old_status ≠ 'cancelled'
  --   (lo bloqueamos en paso 4), así que nunca restauramos dos veces.
  if p_new_status = 'cancelled' then

    for v_item in
      select oi.quantity,
             p.id as product_id
        from public.order_items oi
        -- products.id es uuid, product_id es text → necesita cast
        join public.products p on p.id::text = oi.product_id
       where oi.order_id = p_order_id
    loop
      update public.products
        set stock = stock + v_item.quantity
        where id = v_item.product_id;
    end loop;

    return jsonb_build_object(
      'success',        true,
      'old_status',     v_old_status,
      'new_status',     p_new_status,
      'stock_restored', true
    );

  end if;

  -- ── 8. Transición normal (sin cancelación) ───────────────────
  return jsonb_build_object(
    'success',        true,
    'old_status',     v_old_status,
    'new_status',     p_new_status,
    'stock_restored', false
  );

exception when others then
  -- Cualquier error (incluido los raise exception) revierte la transacción.
  -- Devolvemos el mensaje para que el frontend lo muestre.
  return jsonb_build_object(
    'success', false,
    'error',   sqlerrm
  );
end;
$$;

-- Solo usuarios autenticados pueden llamarla.
-- La validación de role = 'admin' ocurre adentro de la función.
grant execute on function public.update_order_status to authenticated;
