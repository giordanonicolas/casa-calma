export default function Hero() {
  return (
    <section className="relative grid md:grid-cols-2" style={{ minHeight: '88vh' }}>

      {/* ── Columna izquierda: texto ── */}
      <div
        className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16 md:py-24 order-2 md:order-1"
        style={{ backgroundColor: 'var(--cream)' }}
      >
        <span className="eyebrow mb-5 block fade-up fade-up-1">
          Textiles &amp; Decoración · Uruguay
        </span>

        <h1
          className="fade-up fade-up-2 font-serif leading-[1.05] mb-5 font-light"
          style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', color: 'var(--charcoal)' }}
        >
          Textiles<br />
          que respiran<br />
          <em style={{ color: 'var(--leather)' }}>calma</em>
        </h1>

        <div className="fade-up fade-up-2 flex items-center gap-3 mb-6">
          <div style={{ width: 32, height: 1, backgroundColor: 'var(--linen-warm)' }} />
          <span
            className="font-serif italic text-base md:text-lg font-light"
            style={{ color: 'var(--taupe)' }}
          >
            tu espacio, tu pausa
          </span>
        </div>

        <p
          className="fade-up fade-up-3 font-sans text-sm leading-relaxed mb-10 max-w-sm font-light"
          style={{ color: 'var(--warm-gray)' }}
        >
          Piezas artesanales de lino, algodón y fibras naturales que transforman el hogar en un refugio sereno.
        </p>

        <div className="fade-up fade-up-4 flex flex-col sm:flex-row gap-4">
          <a href="#coleccion" className="btn-primary">Ver colección</a>
          <a href="#nosotros" className="btn-ghost">Nuestra historia&nbsp;→</a>
        </div>

        {/* Trust metrics */}
        <div
          className="fade-up fade-up-4 mt-14 pt-10 border-t flex gap-8"
          style={{ borderColor: 'var(--linen-mid)' }}
        >
          {[
            { value: '100%', label: 'Natural' },
            { value: '+200', label: 'Hogares' },
            { value: '∞',    label: 'Cuidado' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="font-serif text-2xl md:text-3xl font-light" style={{ color: 'var(--charcoal)' }}>
                {value}
              </p>
              <p className="eyebrow mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Columna derecha: imagen ── */}
      <div
        className="relative order-1 md:order-2"
        style={{ backgroundColor: 'var(--linen-pale)', minHeight: '55vw' }}
      >
        <div className="texture-linen absolute inset-0" />
        <img
          src="/images/manta-nido.png"
          alt="Manta Nido — Casa Calma"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ mixBlendMode: 'multiply', opacity: 0.9 }}
          onError={(e) => { e.target.style.display = 'none' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom right, transparent 60%, rgba(58,53,48,0.08))' }}
        />

        {/* Badge flotante */}
        <div
          className="absolute bottom-8 right-8 hidden md:block"
          style={{
            backgroundColor: 'var(--ivory)',
            border: '1px solid var(--linen-mid)',
            padding: '1.25rem 1.5rem',
          }}
        >
          <p className="font-serif italic text-sm font-light" style={{ color: 'var(--charcoal)' }}>
            Materiales naturales<br />
            <span className="eyebrow not-italic mt-1 block">seleccionados a mano</span>
          </p>
        </div>
      </div>
    </section>
  )
}
