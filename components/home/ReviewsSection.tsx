const REVIEWS = [
  {
    initials: 'SL', name: 'Sophie L.', city: 'Bruxelles', rating: 5,
    text: '« Les bougies sont absolument magnifiques. Le parfum dure longtemps et l\'emballage est soigné. Je suis conquise, je recommande ! »',
    since: '2025',
  },
  {
    initials: 'MA', name: 'Marc A.', city: 'Paris', rating: 5,
    text: '« Huile essentielle de lavande top qualité. Livraison rapide depuis l\'Europe, colis bien protégé. Mon rituel du soir a changé. »',
    since: '2024',
  },
  {
    initials: 'CJ', name: 'Clara J.', city: 'Amsterdam', rating: 5,
    text: '« Les cristaux sont splendides et correspondent exactement à la description. Service client réactif. Je reviendrai. »',
    since: '2025',
  },
  {
    initials: 'PD', name: 'Pierre D.', city: 'Lyon', rating: 4,
    text: '« Très belle sélection de produits. Le thé artisanal est une révélation. Un peu de patience pour la livraison mais ça vaut l\'attente. »',
    since: '2025',
  },
];

const AVATAR_COLORS = ['#4A7C59', '#8B4B2A', '#2B4F6B', '#6B4A8B'];

export default function ReviewsSection() {
  return (
    <section className="sr" style={{ background: '#F5F3EF' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest font-sans mb-3" style={{ color: '#C4714A', letterSpacing: '0.1em' }}>
              Ils nous font confiance
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl" style={{ color: '#3B2A1F', lineHeight: 1.1 }}>
              Ce que disent<br />nos clients
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-5 h-5" fill="#C4714A" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="font-serif text-2xl font-bold" style={{ color: '#3B2A1F' }}>4,8</span>
            <span className="text-sm font-sans" style={{ color: '#675A4E' }}>sur 5 · 347+ avis</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className="sr rounded-2xl p-6"
              style={{ background: '#FCFAF4', border: '1px solid rgba(55,44,32,.08)' }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className="w-3.5 h-3.5" fill={s <= r.rating ? '#C4714A' : '#DDD'} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Text */}
              <p className="text-sm leading-relaxed mb-5 italic font-serif" style={{ color: '#4A4138', lineHeight: 1.6 }}>
                {r.text}
              </p>

              {/* Author */}
              <div className="flex items-center gap-2.5 mt-auto">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                  style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                >
                  {r.initials}
                </div>
                <div>
                  <p className="text-xs font-semibold font-sans" style={{ color: '#3B2A1F' }}>{r.name}</p>
                  <p className="text-[12px] font-sans" style={{ color: '#675A4E', letterSpacing: '0.03em' }}>
                    {r.city} · depuis {r.since}
                  </p>
                </div>
                <span className="ml-auto text-[12px] font-sans px-2 py-0.5 rounded-full" style={{ background: '#EDF5F0', color: '#3D7A58' }}>
                  ✓ vérifié
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
