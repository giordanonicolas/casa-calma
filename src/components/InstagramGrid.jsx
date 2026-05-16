const PLACEHOLDERS = ['ph-almohadones', 'ph-mantas', 'ph-caminos', 'ph-fundas', 'ph-cuchas', 'ph-accesorios']

export default function InstagramGrid() {
  return (
    <section className="py-16 px-6" style={{ backgroundColor: 'var(--ivory)' }}>
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-10 reveal">
          <span className="eyebrow block mb-2">Seguinos</span>
          <a
            href="https://instagram.com/casacalma"
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif text-2xl font-light transition-colors duration-200 hover:text-leather"
            style={{ color: 'var(--charcoal)' }}
          >
            @casacalma
          </a>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
          {PLACEHOLDERS.map((ph) => (
            <div
              key={ph}
              className={`aspect-square ${ph} cursor-pointer opacity-80 hover:opacity-100 transition-opacity duration-300`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
