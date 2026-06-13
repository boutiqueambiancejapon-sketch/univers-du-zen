import { Leaf, Shield, Globe, Heart } from 'lucide-react';

const ITEMS = [
  {
    icon: Leaf,
    title: 'Sélection éthique',
    desc: 'Sans test sur animaux, matières durables',
  },
  {
    icon: Globe,
    title: 'Expédié depuis l'Europe',
    desc: 'Stocks en Slovaquie · Livraison 3–5 jours',
  },
  {
    icon: Shield,
    title: 'Paiement sécurisé',
    desc: 'Bancontact, carte, PayPal',
  },
  {
    icon: Heart,
    title: 'Retours 30 jours',
    desc: 'Satisfait ou remboursé, sans question',
  },
];

export default function EthicsBar() {
  return (
    <section className="bg-zen-beige border-y border-zen-sand">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {ITEMS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3">
            <Icon size={20} className="text-zen-sage mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-zen-bark">{title}</p>
              <p className="text-xs text-zen-muted mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
