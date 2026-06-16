import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Mentions légales', description: 'Mentions légales du site Univers du Zen.' };
export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-sm leading-relaxed text-zen-muted space-y-4">
      <h1 className="font-serif text-3xl md:text-4xl text-zen-bark mb-6">Mentions légales</h1>
      <p><strong className="text-zen-bark">Éditeur du site.</strong> Univers du Zen. Contact : <a className="text-zen-terracotta" href="mailto:boutiqueambiancejapon@gmail.com">boutiqueambiancejapon@gmail.com</a>.</p>
      <p><strong className="text-zen-bark">Hébergement.</strong> Le site est hébergé par Vercel Inc.</p>
      <p>Les informations légales complètes (raison sociale, numéro d&apos;entreprise, adresse) seront précisées ici.</p>
    </div>
  );
}
