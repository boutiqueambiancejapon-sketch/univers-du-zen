import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer() {
  return (
    <footer className="bg-zen-bark text-white/80 mt-24">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="md:col-span-1">
          <span className="font-serif text-xl text-white">Univers du Zen</span>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            Bien-être corps, esprit & maison.
            Sélection éthique expédiée depuis l&apos;Europe.
          </p>
          <p className="mt-4 text-xs text-white/40">
            Livraison France · Belgique · Luxembourg
          </p>
        </div>

        {/* Boutique */}
        <div>
          <h3 className="font-serif text-white text-sm mb-4">Boutique</h3>
          <ul className="space-y-2 text-sm">
            {[
              ['Aromathérapie', '/boutique/aromatherapie'],
              ['Bougies', '/boutique/bougies'],
              ['Encens', '/boutique/encens'],
              ['Pierres & Cristaux', '/boutique/pierres-cristaux'],
              ['Maison & Déco', '/boutique/maison-deco'],
              ['Thés Artisanaux', '/boutique/thes-artisanaux'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Aide */}
        <div>
          <h3 className="font-serif text-white text-sm mb-4">Aide</h3>
          <ul className="space-y-2 text-sm">
            {[
              ['Livraison', '/livraison'],
              ['Retours', '/retours'],
              ['FAQ', '/faq'],
              ['Contact', '/contact'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Légal */}
        <div>
          <h3 className="font-serif text-white text-sm mb-4">Informations</h3>
          <ul className="space-y-2 text-sm">
            {[
              ['À propos', '/a-propos'],
              ['CGV', '/cgv'],
              ['Mentions légales', '/mentions-legales'],
              ['Politique de confidentialité', '/confidentialite'],
              ['Cookies', '/cookies'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <span>© {new Date().getFullYear()} Univers du Zen. Tous droits réservés.</span>
          <span>Paiement sécurisé · Bancontact · Carte · PayPal</span>
        </div>
      </div>
    </footer>
  );
}
