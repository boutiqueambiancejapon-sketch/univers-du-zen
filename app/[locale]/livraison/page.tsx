import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Livraison', description: 'Délais, frais et zones de livraison — Belgique, France, Luxembourg. Livraison offerte dès 59 €.' };
export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-sm leading-relaxed text-zen-muted space-y-4">
      <h1 className="font-serif text-3xl md:text-4xl text-zen-bark mb-6">Livraison</h1>
      <p><strong className="text-zen-bark">Livraison offerte dès 59 €</strong> d&apos;achat en Belgique, France et Luxembourg. En dessous, les frais sont calculés au moment du paiement selon votre pays.</p>
      <p>Vos commandes sont préparées sous 1 à 2 jours ouvrés et expédiées depuis l&apos;Europe. Comptez en général <strong className="text-zen-bark">3 à 5 jours ouvrés</strong> pour la réception.</p>
      <p>Un e-mail de confirmation vous est envoyé dès l&apos;expédition, avec le numéro de suivi lorsqu&apos;il est disponible.</p>
    </div>
  );
}
