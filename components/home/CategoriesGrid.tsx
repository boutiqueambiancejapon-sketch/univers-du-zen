import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';

const CATEGORIES = [
  {
    slug: 'aromatherapie',
    label: 'Aromathérapie',
    desc: 'Huiles essentielles pures',
    image: '/images/udz-cat-aromatherapie.jpeg',
    span: 'md:col-span-2',
  },
  {
    slug: 'bougies',
    label: 'Bougies',
    desc: 'Cire naturelle & parfums doux',
    image: '/images/udz-cat-bougies.jpeg',
    span: '',
  },
  {
    slug: 'encens',
    label: 'Encens',
    desc: 'Résines, bâtonnets & cônes',
    image: '/images/udz-cat-encens.jpeg',
    span: '',
  },
  {
    slug: 'pierres-cristaux',
    label: 'Pierres & Cristaux',
    desc: 'Quartz, améthyste & plus',
    image: '/images/udz-cat-cristaux.jpeg',
    span: '',
  },
  {
    slug: 'maison-deco',
    label: 'Maison & Déco',
    desc: "Objets qui apaisent l'espace",
    image: '/images/udz-cat-maison.jpeg',
    span: 'md:col-span-2',
  },
  {
    slug: 'thes-artisanaux',
    label: 'Thés Artisanaux',
    desc: 'Saveurs du monde entier',
    image: '/images/udz-cat-thes.jpeg',
    span: '',
  },
];

export default function CategoriesGrid() {
  const locale = useLocale();

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-10">
        <h2 className="font-serif text-3xl md:text-4xl text-zen-bark">Nos univers</h2>
        <p className="text-zen-muted mt-2">Explorez notre sélection par famille de produits</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CATEGORIES.map(({ slug, label, desc, image, span }) => (
          <Link
            key={slug}
            href={`/${locale}/boutique/${slug}`}
            className={`group relative rounded-xl overflow-hidden aspect-[4/3] ${span}`}
          >
            <Image
              src={image}
              alt={label}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zen-bark/80 via-zen-bark/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5">
              <p className="text-white font-serif text-xl leading-tight">{label}</p>
              <p className="text-white/70 text-xs mt-1 font-sans">{desc}</p>
            </div>
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/0 group-hover:bg-white/20 flex items-center justify-center transition-all duration-300">
              <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
