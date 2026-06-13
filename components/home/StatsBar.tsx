export default function StatsBar() {
  const stats = [
    { value: '347',   suffix: '+', label: 'clients satisfaits' },
    { value: '4,8',   suffix: '/5', label: 'note moyenne' },
    { value: '100%',  suffix: '',   label: 'naturel & éthique' },
    { value: '48h',   suffix: '',   label: "délai d'expédition" },
  ];

  return (
    <section className="sr" style={{ background: '#2C2420' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map(({ value, suffix, label }) => (
          <div key={label} className="text-center">
            <p
              className="font-serif font-bold leading-none mb-2"
              style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', color: '#F2ECE0', letterSpacing: '-0.01em' }}
            >
              {value}<span style={{ color: '#C1714A', fontSize: '0.7em' }}>{suffix}</span>
            </p>
            <p
              className="uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: 11, color: 'rgba(242,236,224,.5)', letterSpacing: '0.08em' }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
