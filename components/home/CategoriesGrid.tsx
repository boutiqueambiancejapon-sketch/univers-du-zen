import Image from 'next/image';
import Link from 'next/link';
import { getLocale } from 'next-intl/server';

/*
  Bento 3 colonnes — hauteurs fixes, pas d'aspect-ratio variable :

  [  Aromathérapie (×2)   ] [   Bougies   ]   ← h-52
  [ Encens ] [ Pierres ] [  Maison & Déco  ]   ← h-40
  [       Thés Artisanaux (full width)     ]   ← h-36
*/

const ROWS = [
  [
    {
      slug: 'aromatherapie',
      label: 'Aromathérapie',
      desc: 'Huiles essentielles pures',
      image: '/images/udz-cat-aromatherapie.jpeg',
      cls: 'col-span-2 h-52',
    },
    {
      slug: 'bougies',
      label: 'Bougies',
      desc: 'Cire naturelle & parfums doux',
      image: '/images/udz-cat-bougies.jpeg',
      cls: 'col-span-1 h-52',
    },
  ],
  [
    {
      slug: 'encens',
      label: 'Encens',
      desc: 'Résines, bâtonnets & cônes',
      image: '/images/udz-cat-encens.jpeg',
      cls: 'col-span-1 h-40',
    },
    {
      slug: 'pierres-cristaux',
      label: 'Pierres & Cristaux',
      desc: 'Quartz, améthyste & plus',
      image: '/images/udz-cat-cristaux.jpeg',
      cls: 'col-span-1 h-40',
    },
    {
      slug: 'maison-deco',
      label: 'Maison & Déco',
      desc: "Objets qui apaisent l'espace",
      image: '/images/udz-cat-maison.jpeg',
      cls: 'col-span-1 h-40',
    },
  ],
  [
    {
      slug: 'thes-artisanaux',
      label: 'Thés Artisanaux',
      desc: 'Saveurs du monde entier',
      image: '/images/udz-cat-thes.jpeg',
      cls: 'col-span-3 h-36',
    },
  ],
];

export default async function CategoriesGrid() {
  const locale = await getLocale();

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="font-serif text-3xl md:text-4xl text-zen-bark">Nos univers</h2>
        <p className="text-zen-muted mt-1 text-sm">Explorez notre sélection par famille de produits</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {ROWS.flat().map(({ slug, label, desc, image, cls }) => (
          <Link
            key={slug}
            href={`/${locale}/boutique/${slug}`}
            className={`group relative rounded-xl overflow-hidden ${cls}`}
          >
            <Image
              src={image}
              alt={label}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zen-bark/75 via-zen-bark/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <p className="text-white font-serif text-base leading-tight">{label}</p>
              <p className="text-white/65 text-[11px] mt-0.5 font-sans">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
