-- ═══════════════════════════════════════════════════════════════════
-- Casa Calma — migración: stock, admin role, panel admin
-- ORDEN CORRECTO: profiles.role se crea ANTES de cualquier policy
-- que lo referencie. Todas las operaciones son idempotentes.
-- ═══════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────
-- 1. PROFILES: columna role
--    Debe ir PRIMERO porque las policies de products la referencian.
-- ────────────────────────────────────────────────────────────────
alter table public.profiles
  add column if not exists role text not null default 'customer';

-- Marcar al dueño como admin (idempotente)
update public.profiles
  set role = 'admin'
  where id = (select id from auth.users where email = 'pnicolasgiordano@gmail.com')
    and role <> 'admin';

-- ────────────────────────────────────────────────────────────────
-- 2. TABLA products
-- ────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text,
  category    text not null,
  price       numeric(10,2) not null,
  image       text,
  images      text[],
  stock       integer not null default 0,
  active      boolean not null default true,
  featured    boolean not null default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Trigger updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ────────────────────────────────────────────────────────────────
-- 3. DATOS INICIALES: 7 productos (idempotente vía on conflict)
-- ────────────────────────────────────────────────────────────────
insert into public.products (slug, name, description, category, price, image, stock, active, featured)
values
  ('almoadon-lino-calma',    'Almohadón Lino Calma',    'Lino natural · 50×50 cm',           'Almohadones', 3200, '/images/almoadon-lino-calma.png',    10, true, true),
  ('manta-nido',             'Manta Nido',               'Algodón tejido · 130×170 cm',       'Mantas',      5800, '/images/manta-nido.png',             10, true, true),
  ('almoadon-arena',         'Almohadón Arena',          'Lino lavado · 45×45 cm',            'Almohadones', 2900, '/images/almoadon-arena.png',         10, true, false),
  ('camino-mesa-lino',       'Camino de Mesa Lino',      'Lino crudo · 40×180 cm',            'Mesa',        2100, '/images/camino-mesa-lino.png',       10, true, false),
  ('cucha-donut-sherpa',     'Cama Donut Sherpa',        'Sherpa bouclé · Ø 60 cm · Beige',   'Cuchas',      4200, '/images/cucha-donut-sherpa.png',     10, true, true),
  ('cucha-cueva-gato',       'Cueva Sherpa para Gato',   'Sherpa bouclé · Ø 45 cm · Beige',   'Cuchas',      3800, '/images/cucha-cueva-gato.png',       10, true, false),
  ('cucha-rectangular-lino', 'Cama Rectangular Lino',    'Lino natural · 80×60 cm · Arena',   'Cuchas',      5500, '/images/cucha-rectangular-lino.png', 10, true, false)
on conflict (slug) do nothing;

-- ────────────────────────────────────────────────────────────────
-- 4. RLS en products
--    profiles.role ya existe (paso 1) → estas policies son seguras.
-- ────────────────────────────────────────────────────────────────
alter table public.products enable row level security;

drop policy if exists "cc_products_public_read"  on public.products;
drop policy if exists "cc_products_admin_read"   on public.products;
drop policy if exists "cc_products_admin_write"  on public.products;

-- Cualquier visitante (anon / auth) puede leer productos activos
create policy "cc_products_public_read"
  on public.products for select
  to anon, authenticated
  using (active = true);

-- Admin ve TODOS (activos e inactivos)
create policy "cc_products_admin_read"
  on public.products for select
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Admin puede insertar, actualizar, eliminar
create policy "cc_products_admin_write"
  on public.products for all
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ────────────────────────────────────────────────────────────────
-- 5. PROFILES: policy anti-escalada de rol
--    (la columna ya existe desde el paso 1)
-- ────────────────────────────────────────────────────────────────
drop policy if exists "cc_profiles_no_role_change" on public.profiles;
create policy "cc_profiles_no_role_change"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (
    role = (select role from public.profiles where id = auth.uid())
  );

-- ────────────────────────────────────────────────────────────────
-- 6. POLICIES en orders y order_items para admin
-- ────────────────────────────────────────────────────────────────

-- Admin lee todos los pedidos
drop policy if exists "cc_orders_admin_read" on public.orders;
create policy "cc_orders_admin_read"
  on public.orders for select
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Admin puede actualizar el estado de pedidos
drop policy if exists "cc_orders_admin_update" on public.orders;
create policy "cc_orders_admin_update"
  on public.orders for update
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Admin lee todos los order_items
drop policy if exists "cc_order_items_admin_read" on public.order_items;
create policy "cc_order_items_admin_read"
  on public.order_items for select
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ────────────────────────────────────────────────────────────────
-- 7. order_items.product_id → text (soporta UUID nuevo + int legacy)
-- ────────────────────────────────────────────────────────────────
do $$
begin
  if (
    select data_type
    from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'order_items'
      and column_name  = 'product_id'
  ) <> 'text' then
    alter table public.order_items
      alter column product_id type text using product_id::text;
  end if;
end $$;

-- ────────────────────────────────────────────────────────────────
-- 8. RPC: place_order — atómica: valida stock, crea pedido, descuenta
-- ────────────────────────────────────────────────────────────────
create or replace function public.place_order(
  p_order_id             uuid,
  p_user_id              uuid,
  p_customer_name        text,
  p_customer_lastname    text,
  p_customer_email       text,
  p_customer_phone       text,
  p_shipping_street      text,
  p_shipping_apartment   text,
  p_shipping_city        text,
  p_shipping_department  text,
  p_shipping_postal_code text,
  p_shipping_notes       text,
  p_payment_receipt_path text,
  p_total                numeric,
  p_items                jsonb
  -- Cada elemento de p_items: { product_slug, product_name, product_price, quantity }
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item       jsonb;
  v_product    record;
  v_product_id uuid;
  v_qty        integer;
  v_subtotal   numeric;
begin

  -- ── PASO 1: verificar stock con bloqueo de fila ──────────────
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'quantity')::integer;

    select id, stock, name into v_product
      from public.products
      where slug = v_item->>'product_slug'
      for update;  -- bloquea la fila contra escritura concurrente

    if not found then
      raise exception 'PRODUCTO_NO_ENCONTRADO:%', v_item->>'product_slug';
    end if;

    if v_product.stock < v_qty then
      raise exception 'SIN_STOCK:%:disponible:%', v_product.name, v_product.stock;
    end if;
  end loop;

  -- ── PASO 2: crear el pedido ──────────────────────────────────
  insert into public.orders (
    id, user_id,
    customer_name, customer_lastname, customer_email, customer_phone,
    shipping_street, shipping_apartment, shipping_city, shipping_department,
    shipping_postal_code, shipping_notes,
    payment_method, payment_receipt_path, total, status
  ) values (
    p_order_id, p_user_id,
    p_customer_name, p_customer_lastname, p_customer_email, p_customer_phone,
    p_shipping_street, p_shipping_apartment, p_shipping_city, p_shipping_department,
    p_shipping_postal_code, p_shipping_notes,
    'bank_transfer', p_payment_receipt_path, p_total, 'pending_review'
  );

  -- ── PASO 3: insertar items y descontar stock ─────────────────
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'quantity')::integer;

    select id into v_product_id
      from public.products
      where slug = v_item->>'product_slug';

    v_subtotal := (v_item->>'product_price')::numeric * v_qty;

    insert into public.order_items (
      order_id, product_id, product_name, product_price, quantity, subtotal
    ) values (
      p_order_id,
      v_product_id::text,
      v_item->>'product_name',
      (v_item->>'product_price')::numeric,
      v_qty,
      v_subtotal
    );

    update public.products
      set stock = stock - v_qty
      where id = v_product_id;
  end loop;

  return jsonb_build_object('success', true, 'order_id', p_order_id);

exception when others then
  -- La transacción se revierte sola → no queda nada a medias
  return jsonb_build_object('success', false, 'error', sqlerrm);
end;
$$;

-- Permitir llamada desde clientes anon y autenticados
grant execute on function public.place_order to anon, authenticated;
