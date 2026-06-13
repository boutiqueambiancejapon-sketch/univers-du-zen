import Image from 'next/image';
import Link from 'next/link';
import { getLocale } from 'next-intl/server';

const AVATARS = [
  { initials: 'SL', bg: '#4A7C59' },
  { initials: 'MA', bg: '#8B4B2A' },
  { initials: 'CJ', bg: '#2B4F6B' },
  { initials: 'PD', bg: '#6B4A8B' },
];

export default async function Hero() {
  const locale = await getLocale();

  return (
    <section className="relative overflow-hidden" style={{ minHeight: 'min(90vh, 700px)' }}>
      {/* Background image */}
      <Image
        src="/images/udz-hero-homepage.jpeg"
        alt="Ambiance zen — bougies et aromathérapie"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Gradient overlay — more nuanced than before */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(105deg, rgba(44,36,32,.78) 0%, rgba(44,36,32,.45) 50%, rgba(44,36,32,.1) 100%)',
      }} />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-10 flex items-center" style={{ minHeight: 'inherit' }}>
        <div style={{ maxWidth: 560, paddingTop: 80, paddingBottom: 80 }}>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', backdropFilter: 'blur(8px)' }}>
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#5C9E70' }} />
            <span className="text-white text-xs font-sans font-medium tracking-wide">Sélection 100% naturelle & éthique</span>
          </div>

          {/* H1 */}
          <h1 className="font-serif text-white mb-5 leading-[0.95]"
            style={{ fontSize: 'clamp(44px, 6.5vw, 80px)', letterSpacing: '-0.012em' }}>
            Votre parenthèse<br />
            <span style={{ color: '#E8C5A0' }}>zen</span> au quotidien
          </h1>

          {/* Lead */}
          <p className="mb-8 leading-relaxed font-sans" style={{ color: 'rgba(255,255,255,.78)', fontSize: 'clamp(15px, 1.4vw, 18px)', maxWidth: 440 }}>
            Aromathérapie, bougies, cristaux et déco — une sélection éthique livrée depuis l&apos;Europe en 3 à 5 jours.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Link href={`/${locale}/boutique`}
              className="text-center font-sans font-semibold px-7 py-4 rounded-xl transition-all text-sm"
              style={{ background: '#C1714A', color: '#fff', boxShadow: '0 10px 28px rgba(193,113,74,.35)' }}>
              Découvrir la boutique
            </Link>
            <Link href={`/${locale}/boutique/bougies`}
              className="text-center font-sans font-medium px-7 py-4 rounded-xl transition-all text-sm"
              style={{ border: '1.5px solid rgba(255,255,255,.35)', color: '#fff', backdropFilter: 'blur(6px)', background: 'rgba(255,255,255,.08)' }}>
              Nos best-sellers →
            </Link>
          </div>

          {/* Social proof row */}
          <div className="flex items-center gap-3">
            {/* Avatar stack */}
            <div className="flex">
              {AVATARS.map((a, i) => (
                <div key={i}
                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-white font-sans flex-shrink-0"
                  style={{ background: a.bg, marginLeft: i === 0 ? 0 : -10, zIndex: AVATARS.length - i }}>
                  {a.initials}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-3 h-3" fill="#F59E0B" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-xs font-sans" style={{ color: 'rgba(255,255,255,.65)' }}>
                <strong className="text-white">4,8/5</strong> · 347+ clients satisfaits
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating trust card — bottom right */}
      <div className="absolute bottom-8 right-8 hidden lg:block"
        style={{ animation: 'floaty 5.5s ease-in-out infinite' }}>
        <div className="rounded-2xl px-5 py-4 flex items-center gap-3"
          style={{ background: 'rgba(252,250,244,.92)', backdropFilter: 'blur(12px)', boxShadow: '0 16px 40px rgba(44,36,32,.18)', border: '1px solid rgba(255,255,255,.6)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EDF5F0' }}>
            <svg className="w-5 h-5" fill="none" stroke="#3D7A58" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-sans font-semibold" style={{ color: '#2C2420' }}>Livraison offerte</p>
            <p className="text-xs font-sans" style={{ color: '#9a8878' }}>dès 59 € · expédié sous 48h</p>
          </div>
        </div>
      </div>
    </section>
  );
}
