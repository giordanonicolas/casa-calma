import { categories } from '../data/products.js'

export default function Categories() {
  return (
    <section id="categorias" className="py-20 md:py-28 px-6" style={{ backgroundColor: 'var(--ivory)' }}>
      <div className="max-w-7xl mx-auto">

        {/* Encabezado */}
        <div className="text-center mb-14 reveal">
          <span className="eyebrow block mb-4">Explorar</span>
          <h2 className="font-serif text-4xl md:text-5xl font-light" style={{ color: 'var(--charcoal)' }}>
            Nuestra colección
          </h2>
        </div>

        {/* Grid 3×2 */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {categories.map((cat, i) => (
            <a
              key={cat.id}
              href={`#coleccion`}
              className={`cat-card reveal reveal-delay-${i % 3} ${cat.span}`}
              style={{ aspectRatio: cat.span ? '4/3' : '4/5', display: 'block' }}
            >
              {/* Fondo placeholder */}
              <div className={`${cat.ph} w-full h-full relative overflow-hidden`}>
                {/* Imagen real si existe */}
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                )}

                {/* Label overlay */}
                <div className="cat-card-label">
                  <p className="eyebrow" style={{ color: 'rgba(250,250,247,0.6)' }}>{cat.eyebrow}</p>
                  <p className="font-serif text-lg md:text-xl font-light" style={{ color: '#FAFAF7' }}>
                    {cat.name}
                  </p>
                  <p
                    className="font-sans text-xs mt-1.5 opacity-70"
                    style={{ color: '#FAFAF7', letterSpacing: '0.15em' }}
                  >
                    Ver colección →
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
