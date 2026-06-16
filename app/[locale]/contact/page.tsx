import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Contact', description: 'Une question ? Contactez le service client Univers du Zen.' };
export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-sm leading-relaxed text-zen-muted space-y-4">
      <h1 className="font-serif text-3xl md:text-4xl text-zen-bark mb-6">Contact</h1>
      <p>Une question sur une commande, un produit ou un retour ? Notre équipe vous répond avec plaisir.</p>
      <p>Écrivez-nous à <a className="text-zen-terracotta" href="mailto:boutiqueambiancejapon@gmail.com">boutiqueambiancejapon@gmail.com</a> — nous répondons généralement sous 24 à 48 heures ouvrées.</p>
    </div>
  );
}
