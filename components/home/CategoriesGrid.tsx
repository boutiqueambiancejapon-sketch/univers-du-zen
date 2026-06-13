import Image from 'next/image';
import Link from 'next/link';
import { getLocale } from 'next-intl/server';

const BENTO_A = [
  { slug: 'aromatherapie',  label: 'Aromathérapie',    desc: 'Huiles essentielles pures',       image: '/images/udz-cat-aromatherapie.jpeg', badge: 'Best-seller' },
  { slug: 'bougies',        label: 'Bougies',           desc: 'Cire naturelle & parfums doux',   image: '/images/udz-cat-bougies.jpeg' },
  { slug: 'encens',         label: 'Encens',            desc: 'Résines, bâtonnets & cônes',      image: '/images/udz-cat-encens.jpeg' },
];

const BENTO_B = [
  { slug: 'pierres-cristaux', label: 'Pierres & Cristaux', desc: 'Quartz, améthyste & plus',         image: '/images/udz-cat-cristaux.jpeg' },
  { slug: 'thes-artisanaux',  label: 'Thés Artisanaux',   desc: 'Saveurs du monde entier',          image: '/images/udz-cat-thes.jpeg', badge: 'Nouveau' },
  { slug: 'maison-deco',      label: 'Maison & Déco',     desc: "Objets qui apaisent l'espace",     image: '/images/udz-cat-maison.jpeg' },
];

interface Cat { slug: string; label: string; desc: string; image: string; badge?: string }

function BentoCard({ cat, locale, className }: { cat: Cat; locale: string; className: string }) {
  return (
    <Link href={`/${locale}/boutique/${cat.slug}`}
      className={`group lift relative overflow-hidden rounded-2xl ${className}`}
      style={{ border: '1px solid rgba(44,36,32,.08)' }}>
      <Image
        src={cat.image}
        alt={cat.label}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 transition-opacity duration-300"
        style={{ background: 'linear-gradient(to top, rgba(44,36,32,.82) 0%, rgba(44,36,32,.15) 50%, transparent 100%)' }} />

      {/* Badge top-left */}
      {cat.badge && (
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-sans font-semibold px-2.5 py-1 rounded-full"
            style={{ background: '#C1714A', color: '#fff', letterSpacing: '0.04em' }}>
            {cat.badge}
          </span>
        </div>
      )}

      {/* CTA chip — appears on hover */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="text-[10px] font-sans font-medium px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(252,250,244,.9)', color: '#2C2420' }}>
          Découvrir →
        </span>
      </div>

      {/* Text bottom */}
      <div className="absolute bottom-0 left-0 p-5">
        <p className="font-serif text-white leading-tight mb-0.5" style={{ fontSize: 'clamp(15px, 1.4vw, 19px)' }}>
          {cat.label}
        </p>
        <p className="font-sans text-xs" style={{ color: 'rgba(255,255,255,.6)' }}>{cat.desc}</p>
      </div>
    </Link>
  );
}

export default async function CategoriesGrid() {
  const locale = await getLocale();

  return (
    <section className="sr max-w-7xl mx-auto px-6 lg:px-10 py-14 space-y-3">
      <div className="mb-10">
        <p className="text-xs font-sans uppercase tracking-widest mb-2" style={{ color: '#C1714A', letterSpacing: '0.1em' }}>
          Nos univers
        </p>
        <h2 className="font-serif text-3xl md:text-4xl" style={{ color: '#2C2420', lineHeight: 1.05 }}>
          Explorez la collection
        </h2>
      </div>

      {/* Bento A — featured LEFT */}
      <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[440px] md:h-[500px]">
        <BentoCard cat={BENTO_A[0]} locale={locale} className="col-start-1 col-end-3 row-start-1 row-end-3" />
        <BentoCard cat={BENTO_A[1]} locale={locale} className="col-start-3 col-end-4 row-start-1 row-end-2" />
        <BentoCard cat={BENTO_A[2]} locale={locale} className="col-start-3 col-end-4 row-start-2 row-end-3" />
      </div>

      {/* Bento B — featured RIGHT */}
      <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[440px] md:h-[500px]">
        <BentoCard cat={BENTO_B[0]} locale={locale} className="col-start-1 col-end-2 row-start-1 row-end-2" />
        <BentoCard cat={BENTO_B[1]} locale={locale} className="col-start-1 col-end-2 row-start-2 row-end-3" />
        <BentoCard cat={BENTO_B[2]} locale={locale} className="col-start-2 col-end-4 row-start-1 row-end-3" />
      </div>
    </section>
  );
}
