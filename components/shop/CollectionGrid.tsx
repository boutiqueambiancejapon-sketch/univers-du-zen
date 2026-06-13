/**
 * CollectionGrid — Server Component
 * Grille visuelle de 10 collections avec image produit + dégradé zen.
 * Utilisé sur /boutique pour remplacer les chips de navigation plates.
 */
import Link from 'next/link';
import Image from 'next/image';
import { Check } from 'lucide-react';

/* Couleurs de secours par collection (si aucun produit publié encore) */
const FALLBACK: Record<string, { bg: string; accent: string }> = {
  'huiles-fragrance':         { bg: '#E8D5A3', accent: '#C4962A' },
  'aromatherapie':            { bg: '#C5D5BE', accent: '#3A6B2A' },
  'encens-rituels':           { bg: '#D4BED4', accent: '#6B3A8C' },
  'cristaux-lithotherapie':   { bg: '#C3CCE8', accent: '#2A3A8C' },
  'bougies-photophores':      { bg: '#F0D5BF', accent: '#B05A20' },
  'bien-etre-corps':          { bg: '#F5D0D0', accent: '#8C2A3A' },
  'deco-maison-zen':          { bg: '#D4C5B0', accent: '#6B4A28' },
  'the-tisanes':              { bg: '#B8D4B8', accent: '#2A6B3A' },
  'instruments-sonotherapie': { bg: '#BCC5D4', accent: '#2A3A6B' },
  'bijoux-cristaux':          { bg: '#E8C8D8', accent: '#8C2A5A' },
};

interface Props {
  categories: { slug: string; label: string }[];
  /** Première image de produit par slug de collection, calculée côté serveur. */
  categoryImages: Record<string, string>;
  locale: string;
  activeCategory?: string | null;
}

export default function CollectionGrid({
  categories,
  categoryImages,
  locale,
  activeCategory,
}: Props) {
  return (
    <section className="bg-[#FAF8F3] border-b border-zen-sand">
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-10">
        <h2 className="font-serif text-xl text-zen-bark mb-6">
          Explorer par univers
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {categories.map(cat => {
            const img      = categoryImages[cat.slug];
            const isActive = activeCategory === cat.slug;
            const fb       = FALLBACK[cat.slug] ?? { bg: '#E8D5A3', accent: '#C4962A' };

            return (
              <Link
                key={cat.slug}
                href={`/${locale}/boutique/${cat.slug}`}
                className={`group relative overflow-hidden rounded-2xl aspect-square block transition-all duration-200 ${
                  isActive
                    ? 'ring-2 ring-zen-bark ring-offset-2'
                    : 'hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                {/* ── Image ou couleur de secours ── */}
                {img ? (
                  <Image
                    src={img}
                    alt={cat.label}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized={img.startsWith('https://raw.github')}
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, ${fb.bg} 0%, ${fb.accent}22 100%)` }}
                  />
                )}

                {/* ── Dégradé bas → haut ── */}
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    isActive ? 'opacity-90' : 'opacity-80 group-hover:opacity-90'
                  }`}
                  style={{
                    background: isActive
                      ? 'linear-gradient(to top, rgba(44,36,32,.85) 0%, rgba(44,36,32,.35) 55%, rgba(44,36,32,.05) 100%)'
                      : 'linear-gradient(to top, rgba(44,36,32,.75) 0%, rgba(44,36,32,.15) 55%, rgba(44,36,32,0) 100%)',
                  }}
                />

                {/* ── Label ── */}
                <div className="absolute bottom-0 left-0 right-0 p-3.5">
                  <p
                    className="font-serif text-white leading-snug"
                    style={{ fontSize: 'clamp(11px, 1.2vw, 14px)', textShadow: '0 1px 4px rgba(0,0,0,.5)' }}
                  >
                    {cat.label}
                  </p>
                </div>

                {/* ── Badge actif ── */}
                {isActive && (
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
                    <Check size={12} className="text-zen-bark" strokeWidth={3} />
                  </div>
                )}

                {/* ── Pill "Tout voir" au hover ── */}
                {!isActive && (
                  <div className="absolute top-2.5 left-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-[10px] font-sans font-semibold text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                      Voir →
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
