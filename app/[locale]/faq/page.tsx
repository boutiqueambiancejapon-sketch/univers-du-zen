import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Questions fréquentes', description: 'Livraison, paiement, retours, suivi de commande — toutes les réponses.' };
const QA = [
  ['Quels sont les délais de livraison ?', 'Préparation sous 1 à 2 jours ouvrés, puis 3 à 5 jours ouvrés de transport. Livraison offerte dès 59 €.'],
  ['Quels moyens de paiement acceptez-vous ?', 'Bancontact, cartes Visa/Mastercard et PayPal, via un paiement 100% sécurisé.'],
  ['Puis-je retourner un article ?', 'Oui, vous disposez de 14 jours de rétractation. Voir notre page Retours.'],
  ['Livrez-vous en dehors de la Belgique ?', 'Oui, en France et au Luxembourg également.'],
];
export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl md:text-4xl text-zen-bark mb-8">Questions fréquentes</h1>
      <div className="space-y-4">
        {QA.map(([q, a]) => (
          <details key={q} className="border border-zen-sand rounded-xl overflow-hidden">
            <summary className="p-4 cursor-pointer text-sm font-medium text-zen-bark list-none">{q}</summary>
            <div className="px-4 pb-4 text-sm text-zen-muted leading-relaxed">{a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
