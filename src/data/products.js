/* ══════════════════════════════════════════════════════
   CATÁLOGO DE PRODUCTOS — Casa Calma
   ──────────────────────────────────────────────────────
   CAMPOS:
     id              → número único, no repetir
     name            → nombre visible en la tienda
     slug            → URL amigable (sin espacios ni tildes)
     category        → debe coincidir con CATEGORY_MAP en Coleccion.jsx
                       Valores válidos: Almohadones | Mantas | Mesa |
                                        Fundas | Cuchas | Accesorios
     price           → precio en UYU (número entero)
     stock           → unidades disponibles
                       0 = Sin stock (botón deshabilitado)
                       1 = "Última unidad disponible"
                       2-3 = "Quedan X unidades"
                       >3 = sin aviso de stock
     featured        → true = aparece en Destacados de la Home
     active          → false = oculto en toda la tienda
     image           → ruta desde /public/images/
     description     → descripción corta visible en la card
     tags            → palabras clave opcionales para futuras búsquedas
══════════════════════════════════════════════════════ */

export const products = [
  {
    id: 1,
    name: 'Almohadón Lino Calma',
    slug: 'almoadon-lino-calma',
    category: 'Almohadones',
    price: 3200,
    stock: 5,
    featured: true,
    active: true,
    image: '/images/almoadon-lino-calma.png',
    description: 'Lino natural · 50×50 cm',
    tags: ['lino', 'almohadón', 'textil', 'natural'],
  },
  {
    id: 2,
    name: 'Manta Nido',
    slug: 'manta-nido',
    category: 'Mantas',
    price: 5800,
    stock: 3,
    featured: true,
    active: true,
    image: '/images/manta-nido.png',
    description: 'Algodón tejido · 130×170 cm',
    tags: ['manta', 'algodón', 'tejido', 'descanso'],
  },
  {
    id: 3,
    name: 'Almohadón Arena',
    slug: 'almoadon-arena',
    category: 'Almohadones',
    price: 2900,
    stock: 0,
    featured: false,
    active: true,
    image: '/images/almoadon-arena.png',
    description: 'Lino lavado · 45×45 cm',
    tags: ['lino', 'almohadón', 'arena', 'natural'],
  },
  {
    id: 4,
    name: 'Camino de Mesa Lino',
    slug: 'camino-mesa-lino',
    category: 'Mesa',
    price: 2100,
    stock: 8,
    featured: true,
    active: true,
    image: '/images/camino-mesa-lino.png',
    description: 'Lino crudo · 40×180 cm',
    tags: ['lino', 'mesa', 'camino', 'comedor'],
  },
  {
    id: 5,
    name: 'Cama Donut Sherpa',
    slug: 'cucha-donut-sherpa',
    category: 'Cuchas',
    price: 4200,
    stock: 2,
    featured: true,
    active: true,
    image: '/images/cucha-donut-sherpa.png',
    description: 'Sherpa bouclé · Ø 60 cm · Beige',
    tags: ['cucha', 'mascota', 'sherpa', 'perro', 'gato'],
  },
  {
    id: 6,
    name: 'Cueva Sherpa para Gato',
    slug: 'cucha-cueva-gato',
    category: 'Cuchas',
    price: 3800,
    stock: 1,
    featured: false,
    active: true,
    image: '/images/cucha-cueva-gato.png',
    description: 'Sherpa bouclé · Ø 45 cm · Beige',
    tags: ['cucha', 'gato', 'sherpa', 'mascota'],
  },
  {
    id: 7,
    name: 'Cama Rectangular Lino',
    slug: 'cucha-rectangular-lino',
    category: 'Cuchas',
    price: 5500,
    stock: 4,
    featured: false,
    active: true,
    image: '/images/cucha-rectangular-lino.png',
    description: 'Lino natural · 80×60 cm · Arena',
    tags: ['cucha', 'lino', 'mascota', 'perro', 'natural'],
  },
]

export const categories = [
  {
    id: 'almohadones',
    slug: 'almohadones',
    name: 'Almohadones',
    eyebrow: 'Textiles',
    ph: 'ph-almohadones',
    image: '/images/almoadon-lino-calma.png',
    span: '',
  },
  {
    id: 'mantas',
    slug: 'mantas',
    name: 'Mantas',
    eyebrow: 'Para el descanso',
    ph: 'ph-mantas',
    image: '/images/manta-nido.png',
    span: '',
  },
  {
    id: 'caminos',
    slug: 'caminos-de-mesa',
    name: 'Caminos de mesa',
    eyebrow: 'Mesa & comedor',
    ph: 'ph-caminos',
    image: '/images/camino-mesa-lino.png',
    span: 'col-span-2 lg:col-span-1',
  },
  {
    id: 'fundas',
    slug: 'fundas',
    name: 'Fundas',
    eyebrow: 'Almohadones',
    ph: 'ph-fundas',
    image: '/images/almoadon-arena.png',
    span: '',
  },
  {
    id: 'cuchas',
    slug: 'cuchas',
    name: 'Cuchas',
    eyebrow: 'Para tu mascota',
    ph: 'ph-cuchas',
    image: '/images/cucha-donut-sherpa.png',
    span: '',
  },
  {
    id: 'accesorios',
    slug: 'accesorios',
    name: 'Accesorios',
    eyebrow: 'Complementos',
    ph: 'ph-accesorios',
    image: null,
    span: '',
  },
]
