/* ══════════════════════════════════════════════════════
   ETAPA 1 — Tabla products + RLS segura
   Casa Calma — 2026-05-18

   QUÉ HACE:
   - Asegura que profiles.role existe
   - Marca usuario admin por email
   - Crea tabla products (idempotente: if not exists)
   - Activa RLS con policies seguras:
       SELECT: anon/authenticated ven active=true; admin ve todo
       UPDATE: solo admin, con USING + WITH CHECK
   - Trigger updated_at automático
   - Upsert de los 7 productos desde products.js

   NO TOCA:
   - checkout.js / orders / order_items
   - Telegram / notify-order
   - CartContext / AuthContext
   - Ningún RPC
══════════════════════════════════════════════════════ */


/* ── 0. profiles.role — agregar si no existe ── */

alter table public.profiles
  add column if not exists role text not null default 'customer';

update public.profiles
set role = 'admin'
where id = (
  select id from auth.users
  where email = 'pnicolasgiordano@gmail.com'
);


/* ── 1. Tabla products ── */

create table if not exists public.products (
  id          integer      primary key,
  name        text         not null,
  slug        text         not null unique,
  category    text         not null,
  price       integer      not null check (price >= 0),
  stock       integer      not null default 0 check (stock >= 0),
  featured    boolean      not null default false,
  active      boolean      not null default true,
  image       text,
  description text,
  tags        text[],
  created_at  timestamptz  not null default now(),
  updated_at  timestamptz  not null default now()
);


/* ── 2. RLS ── */

alter table public.products enable row level security;

/* SELECT:
   - anon y authenticated ven solo active = true
   - admin ve todos (activos e inactivos) */
drop policy if exists "products_select" on public.products;
create policy "products_select"
  on public.products for select
  using (
    active = true
    or (
      auth.uid() is not null
      and (select role from public.profiles where id = auth.uid()) = 'admin'
    )
  );

/* UPDATE: solo admin, con USING y WITH CHECK
   - USING:      qué filas puede modificar (todas si es admin)
   - WITH CHECK: valida que el resultado no tenga datos inválidos */
drop policy if exists "products_update_admin" on public.products;
create policy "products_update_admin"
  on public.products for update
  to authenticated
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  )
  with check (
    (select role from public.profiles where id = auth.uid()) = 'admin'
    and price >= 0
    and stock >= 0
  );


/* ── 3. Trigger updated_at automático ── */

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();


/* ── 4. Upsert de los 7 productos actuales ── */

insert into public.products
  (id, name, slug, category, price, stock, featured, active, image, description, tags)
values
  (1, 'Almohadón Lino Calma',  'almoadon-lino-calma',    'Almohadones', 3200, 5, true,  true, '/images/almoadon-lino-calma.png',    'Lino natural · 50×50 cm',          array['lino','almohadón','textil','natural']),
  (2, 'Manta Nido',             'manta-nido',             'Mantas',       5800, 5, true,  true, '/images/manta-nido.png',             'Algodón tejido · 130×170 cm',      array['manta','algodón','tejido','descanso']),
  (3, 'Almohadón Arena',        'almoadon-arena',         'Almohadones', 2900, 5, false, true, '/images/almoadon-arena.png',         'Lino lavado · 45×45 cm',           array['lino','almohadón','arena','natural']),
  (4, 'Camino de Mesa Lino',    'camino-mesa-lino',       'Mesa',         2100, 5, true,  true, '/images/camino-mesa-lino.png',       'Lino crudo · 40×180 cm',           array['lino','mesa','camino','comedor']),
  (5, 'Cama Donut Sherpa',      'cucha-donut-sherpa',     'Cuchas',       4200, 5, true,  true, '/images/cucha-donut-sherpa.png',     'Sherpa bouclé · Ø 60 cm · Beige',  array['cucha','mascota','sherpa','perro','gato']),
  (6, 'Cueva Sherpa para Gato', 'cucha-cueva-gato',       'Cuchas',       3800, 5, false, true, '/images/cucha-cueva-gato.png',       'Sherpa bouclé · Ø 45 cm · Beige',  array['cucha','gato','sherpa','mascota']),
  (7, 'Cama Rectangular Lino',  'cucha-rectangular-lino', 'Cuchas',       5500, 5, false, true, '/images/cucha-rectangular-lino.png', 'Lino natural · 80×60 cm · Arena',  array['cucha','lino','mascota','perro','natural'])
on conflict (id) do update set
  name        = excluded.name,
  slug        = excluded.slug,
  category    = excluded.category,
  price       = excluded.price,
  stock       = excluded.stock,
  featured    = excluded.featured,
  active      = excluded.active,
  image       = excluded.image,
  description = excluded.description,
  tags        = excluded.tags;
