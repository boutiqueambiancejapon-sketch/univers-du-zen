import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'À propos', description: 'Univers du Zen — bien-être corps, esprit & maison. Une sélection éthique expédiée depuis l’Europe.' };
export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-sm leading-relaxed text-zen-muted space-y-4">
      <h1 className="font-serif text-3xl md:text-4xl text-zen-bark mb-6">À propos</h1>
      <p>Univers du Zen est une boutique de bien-être dédiée au corps, à l&apos;esprit et à la maison. Nous sélectionnons des produits naturels et éthiques — aromathérapie, encens, cristaux, bougies, soin et décoration — pour créer chez vous des moments de calme.</p>
      <p>Tous nos articles sont expédiés depuis l&apos;Europe, avec une attention particulière portée à la qualité, à l&apos;honnêteté des descriptions et au respect des animaux (cruelty-free).</p>
    </div>
  );
}
