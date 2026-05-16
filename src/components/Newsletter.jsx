import { useState } from 'react'

export default function Newsletter() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      e.target.reset()
    }, 3000)
  }

  return (
    <section className="py-20 px-6" style={{ backgroundColor: 'var(--charcoal)' }}>
      <div className="max-w-xl mx-auto text-center">

        <span className="eyebrow block mb-4" style={{ color: 'var(--linen-warm)' }}>
          Newsletter
        </span>

        <h2
          className="font-serif text-3xl md:text-4xl mb-4 font-light"
          style={{ color: 'var(--ivory)' }}
        >
          Suscribite a la calma
        </h2>

        <p
          className="font-sans text-sm leading-relaxed mb-10 font-light"
          style={{ color: 'var(--stone)' }}
        >
          Novedades, inspiración y acceso anticipado a nuevas colecciones.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0">
          <input
            type="email"
            placeholder="tu@email.com"
            required
            className="flex-1 font-sans text-xs px-5 py-4 outline-none"
            style={{
              backgroundColor: 'rgba(250,250,247,0.08)',
              color: 'var(--ivory)',
              border: '1px solid rgba(250,250,247,0.15)',
              borderRight: 'none',
              letterSpacing: '0.05em',
            }}
          />
          <button
            type="submit"
            disabled={submitted}
            className="font-sans whitespace-nowrap transition-all duration-300"
            style={{
              backgroundColor: submitted ? 'var(--leather-light)' : 'var(--leather)',
              color: 'var(--ivory)',
              border: '1px solid var(--leather)',
              fontSize: '0.56rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              padding: '0 1.5rem',
              minWidth: '120px',
            }}
          >
            {submitted ? '¡Gracias!' : 'Suscribirse'}
          </button>
        </form>

        <p className="font-sans text-xs mt-4 font-light" style={{ color: 'var(--taupe)' }}>
          Sin spam · Podés cancelar en cualquier momento
        </p>
      </div>
    </section>
  )
}
