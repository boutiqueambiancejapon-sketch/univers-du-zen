import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Retours & remboursements', description: 'Droit de rétractation de 14 jours et politique de retour. Satisfait ou remboursé.' };
export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-sm leading-relaxed text-zen-muted space-y-4">
      <h1 className="font-serif text-3xl md:text-4xl text-zen-bark mb-6">Retours &amp; remboursements</h1>
      <p>Conformément à la réglementation européenne, vous disposez d&apos;un <strong className="text-zen-bark">droit de rétractation de 14 jours</strong> à compter de la réception de votre commande, sans avoir à vous justifier.</p>
      <p>Les articles doivent être retournés neufs, non utilisés et dans leur emballage d&apos;origine. Certains produits d&apos;hygiène descellés ne peuvent être repris pour des raisons sanitaires.</p>
      <p>Pour initier un retour, écrivez-nous à <a className="text-zen-terracotta" href="mailto:boutiqueambiancejapon@gmail.com">boutiqueambiancejapon@gmail.com</a>. Le remboursement est effectué sous 14 jours après réception du retour.</p>
    </div>
  );
}
