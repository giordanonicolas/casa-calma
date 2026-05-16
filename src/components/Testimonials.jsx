const testimonials = [
  {
    quote: 'Los almohadones de lino son increíbles. La calidad se siente desde que los abrís. El tono crudo queda perfecto.',
    author: 'Valentina M.',
    location: 'Montevideo',
  },
  {
    quote: 'La manta Nido es exactamente lo que buscaba. Suave, liviana y con esa estética minimalista que amo.',
    author: 'Sofía R.',
    location: 'Punta del Este',
  },
  {
    quote: 'El camino de mesa transformó por completo la estética del comedor. Atención al detalle impecable.',
    author: 'Laura B.',
    location: 'Buenos Aires',
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 px-6" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-14 reveal">
          <span className="eyebrow block mb-4">Testimonios</span>
          <h2 className="font-serif text-3xl md:text-4xl font-light" style={{ color: 'var(--charcoal)' }}>
            Lo que dicen quienes nos eligen
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(({ quote, author, location }, i) => (
            <blockquote
              key={author}
              className={`reveal reveal-delay-${i}`}
              style={{ borderTop: '2px solid var(--linen-warm)', paddingTop: '1.5rem' }}
            >
              <p
                className="font-serif italic leading-relaxed mb-6 font-light"
                style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--warm-gray)' }}
              >
                "{quote}"
              </p>
              <footer>
                <p className="eyebrow">
                  {author} — {location}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
