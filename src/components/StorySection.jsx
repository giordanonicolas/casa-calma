export default function StorySection() {
  return (
    <section id="nosotros" className="grid md:grid-cols-2" style={{ minHeight: '70vh' }}>

      {/* Imagen / cita */}
      <div
        className="relative flex items-center justify-center"
        style={{ backgroundColor: 'var(--linen-pale)', minHeight: '50vw' }}
      >
        <div className="texture-linen absolute inset-0 opacity-60" />

        {/* Cita central */}
        <div className="relative z-10 text-center p-10 md:p-16">
          <p
            className="font-serif leading-none mb-2"
            style={{ fontSize: '5rem', color: 'var(--linen-mid)', fontWeight: 300, fontStyle: 'italic' }}
          >
            "
          </p>
          <p
            className="font-serif text-xl md:text-2xl lg:text-3xl leading-snug max-w-xs font-light"
            style={{ color: 'var(--charcoal)', fontStyle: 'italic' }}
          >
            El hogar como refugio.<br />El textil como gesto.
          </p>
          <div
            className="mx-auto mt-6"
            style={{ width: 32, height: 1, backgroundColor: 'var(--linen-warm)' }}
          />
        </div>

        {/* Número decorativo */}
        <div className="absolute bottom-8 left-8">
          <p
            className="font-serif font-light leading-none"
            style={{ fontSize: '6rem', color: 'var(--linen-mid)' }}
          >
            01
          </p>
        </div>
      </div>

      {/* Texto */}
      <div
        className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16 md:py-24"
        style={{ backgroundColor: 'var(--ivory)' }}
      >
        <span className="eyebrow block mb-5 reveal">Quiénes somos</span>

        <h2
          className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-8 font-light reveal"
          style={{ color: 'var(--charcoal)' }}
        >
          Nacimos<br />de una pausa
        </h2>

        <p
          className="font-sans text-sm leading-loose mb-5 font-light reveal"
          style={{ color: 'var(--warm-gray)', maxWidth: 420 }}
        >
          Casa Calma nació de la convicción de que el hogar merece cuidado. Que elegir un textil es también elegir cómo querés vivir.
        </p>

        <p
          className="font-sans text-sm leading-loose mb-10 font-light reveal reveal-delay-1"
          style={{ color: 'var(--warm-gray)', maxWidth: 420 }}
        >
          Trabajamos con materiales naturales seleccionados, procesos artesanales y un diseño que prioriza lo esencial. Sin excesos. Con intención.
        </p>

        <div className="reveal reveal-delay-2">
          <a href="#coleccion" className="btn-outline">Explorar colección</a>
        </div>

        {/* Firma */}
        <div
          className="mt-14 pt-10 border-t reveal reveal-delay-3"
          style={{ borderColor: 'var(--linen-mid)' }}
        >
          <p className="font-serif italic text-sm font-light" style={{ color: 'var(--taupe)' }}>
            Con amor por el hogar — Casa Calma
          </p>
        </div>
      </div>
    </section>
  )
}
