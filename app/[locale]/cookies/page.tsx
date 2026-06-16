import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Politique cookies', description: 'Utilisation des cookies sur Univers du Zen.' };
export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-sm leading-relaxed text-zen-muted space-y-4">
      <h1 className="font-serif text-3xl md:text-4xl text-zen-bark mb-6">Politique cookies</h1>
      <p>Nous utilisons des cookies pour assurer le bon fonctionnement du site (panier, préférences de langue) et, le cas échéant, pour mesurer l&apos;audience.</p>
      <p>Vous pouvez à tout moment configurer votre navigateur pour refuser les cookies non essentiels.</p>
    </div>
  );
}
