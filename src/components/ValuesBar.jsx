const values = [
  {
    label: 'Fibras naturales',
    desc: 'Lino, algodón y materiales que mejoran con el tiempo',
    icon: (
      <svg className="w-5 h-5 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--charcoal)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.7.7m12.16 12.16.7.7M1 12h2m18 0h2M4.92 19.08l.7-.7m12.16-12.16.7-.7" />
      </svg>
    ),
  },
  {
    label: 'Hecho a mano',
    desc: 'Cada pieza, un proceso artesanal con atención al detalle',
    icon: (
      <svg className="w-5 h-5 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--charcoal)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
      </svg>
    ),
  },
  {
    label: 'Diseño atemporal',
    desc: 'Estética minimalista que acompaña tu hogar por años',
    icon: (
      <svg className="w-5 h-5 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--charcoal)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
  {
    label: 'Con propósito',
    desc: 'Pensado para hogares que valoran la calma y la autenticidad',
    icon: (
      <svg className="w-5 h-5 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--charcoal)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
]

export default function ValuesBar() {
  return (
    <section
      style={{
        backgroundColor: 'var(--ivory)',
        borderTop: '1px solid var(--linen-mid)',
        borderBottom: '1px solid var(--linen-mid)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
        {values.map(({ label, desc, icon }, i) => (
          <div
            key={label}
            className={`flex flex-col items-center text-center reveal reveal-delay-${i} ${i < values.length - 1 ? 'md:border-r' : ''}`}
            style={{ borderColor: 'var(--linen-mid)' }}
          >
            {icon}
            <p className="eyebrow mb-1.5">{label}</p>
            <p
              className="font-sans text-xs leading-relaxed max-w-[140px] md:px-6 font-light"
              style={{ color: 'var(--warm-gray)' }}
            >
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
