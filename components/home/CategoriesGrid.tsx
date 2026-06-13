import Image from 'next/image';
import Link from 'next/link';
import { getLocale } from 'next-intl/server';

/*
  2 bentos de 3 catégories — layout alterné :

  Bento A  (featured à gauche)        Bento B  (featured à droite)
  ┌──────────────┬──────┐             ┌──────┬──────────────┐
  │              │  B   │             │  D   │              │
  │      A       ├──────┤             ├──────┤      F       │
  │              │  C   │             │  E   │              │
  └──────────────┴──────┘             └──────┴──────────────┘
  A = Aromathérapie (grande)          F = Maison & Déco (grande)
  B = Bougies                         D = Pierres & Cristaux
  C = Encens                          E = Thés Artisanaux
*/

const BENTO_A = [
  {
    slug: 'aromatherapie',
    label: 'Aromathérapie',
    desc: 'Huiles essentielles pures',
    image: '/images/udz-cat-aromatherapie.jpeg',
  },
  {
    slug: 'bougies',
    label: 'Bougies',
    desc: 'Cire naturelle & parfums doux',
    image: '/images/udz-cat-bougies.jpeg',
  },
  {
    slug: 'encens',
    label: 'Encens',
    desc: 'Résines, bâtonnets & cônes',
    image: '/images/udz-cat-encens.jpeg',
  },
];

const BENTO_B = [
  {
    slug: 'pierres-cristaux',
    label: 'Pierres & Cristaux',
    desc: 'Quartz, améthyste & plus',
    image: '/images/udz-cat-cristaux.jpeg',
  },
  {
    slug: 'thes-artisanaux',
    label: 'Thés Artisanaux',
    desc: 'Saveurs du monde entier',
    image: '/images/udz-cat-thes.jpeg',
  },
  {
    slug: 'maison-deco',
    label: 'Maison & Déco',
    desc: "Objets qui apaisent l'espace",
    image: '/images/udz-cat-maison.jpeg',
  },
];

function CardOverlay({ label, desc }: { label: string; desc: string }) {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-t from-zen-bark/80 via-zen-bark/10 to-transparent" />
      <div className="absolute bottom-0 left-0 p-5">
        <p className="text-white font-serif text-lg leading-tight">{label}</p>
        <p className="text-white/65 text-xs mt-0.5 font-sans">{desc}</p>
      </div>
    </>
  );
}

export default async function CategoriesGrid() {
  const locale = await getLocale();

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 space-y-3">
      <div className="mb-8">
        <h2 className="font-serif text-3xl md:text-4xl text-zen-bark">Nos univers</h2>
        <p className="text-zen-muted mt-1 text-sm">
          Explorez notre sélection par famille de produits
        </p>
      </div>

      {/* Bento A — featured LEFT */}
      <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[480px]">
        {/* Featured — grande image */}
        <Link
          href={`/${locale}/boutique/${BENTO_A[0].slug}`}
          className="group relative col-start-1 col-end-3 row-start-1 row-end-3 rounded-2xl overflow-hidden"
        >
          <Image
            src={BENTO_A[0].image}
            alt={BENTO_A[0].label}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <CardOverlay label={BENTO_A[0].label} desc={BENTO_A[0].desc} />
        </Link>

        {/* Small top-right */}
        <Link
          href={`/${locale}/boutique/${BENTO_A[1].slug}`}
          className="group relative col-start-3 col-end-4 row-start-1 row-end-2 rounded-2xl overflow-hidden"
        >
          <Image
            src={BENTO_A[1].image}
            alt={BENTO_A[1].label}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <CardOverlay label={BENTO_A[1].label} desc={BENTO_A[1].desc} />
        </Link>

        {/* Small bottom-right */}
        <Link
          href={`/${locale}/boutique/${BENTO_A[2].slug}`}
          className="group relative col-start-3 col-end-4 row-start-2 row-end-3 rounded-2xl overflow-hidden"
        >
          <Image
            src={BENTO_A[2].image}
            alt={BENTO_A[2].label}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <CardOverlay label={BENTO_A[2].label} desc={BENTO_A[2].desc} />
        </Link>
      </div>

      {/* Bento B — featured RIGHT (layout inversé) */}
      <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[480px]">
        {/* Small top-left */}
        <Link
          href={`/${locale}/boutique/${BENTO_B[0].slug}`}
          className="group relative col-start-1 col-end-2 row-start-1 row-end-2 rounded-2xl overflow-hidden"
        >
          <Image
            src={BENTO_B[0].image}
            alt={BENTO_B[0].label}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <CardOverlay label={BENTO_B[0].label} desc={BENTO_B[0].desc} />
        </Link>

        {/* Small bottom-left */}
        <Link
          href={`/${locale}/boutique/${BENTO_B[1].slug}`}
          className="group relative col-start-1 col-end-2 row-start-2 row-end-3 rounded-2xl overflow-hidden"
        >
          <Image
            src={BENTO_B[1].image}
            alt={BENTO_B[1].label}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <CardOverlay label={BENTO_B[1].label} desc={BENTO_B[1].desc} />
        </Link>

        {/* Featured — grande image à droite */}
        <Link
          href={`/${locale}/boutique/${BENTO_B[2].slug}`}
          className="group relative col-start-2 col-end-4 row-start-1 row-end-3 rounded-2xl overflow-hidden"
        >
          <Image
            src={BENTO_B[2].image}
            alt={BENTO_B[2].label}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <CardOverlay label={BENTO_B[2].label} desc={BENTO_B[2].desc} />
        </Link>
      </div>
    </section>
  );
}
