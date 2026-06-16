import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Conditions générales de vente', description: 'CGV de la boutique Univers du Zen.' };
export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-sm leading-relaxed text-zen-muted space-y-4">
      <h1 className="font-serif text-3xl md:text-4xl text-zen-bark mb-6">Conditions générales de vente</h1>
      <p>Les présentes conditions régissent les ventes conclues sur Univers du Zen. Toute commande implique l&apos;acceptation pleine et entière des présentes CGV.</p>
      <p><strong className="text-zen-bark">Prix.</strong> Les prix sont indiqués en euros, TVA comprise. Les frais de livraison éventuels sont précisés avant la validation de la commande.</p>
      <p><strong className="text-zen-bark">Commande &amp; paiement.</strong> Le paiement s&apos;effectue de façon sécurisée par Bancontact, carte bancaire ou PayPal. La commande est confirmée par e-mail.</p>
      <p><strong className="text-zen-bark">Rétractation.</strong> Vous disposez d&apos;un délai de 14 jours pour exercer votre droit de rétractation (voir la page Retours).</p>
      <p><strong className="text-zen-bark">Garanties.</strong> Les produits bénéficient des garanties légales de conformité et contre les vices cachés.</p>
    </div>
  );
}
