import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Politique de confidentialité', description: 'Protection des données personnelles (RGPD) — Univers du Zen.' };
export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-sm leading-relaxed text-zen-muted space-y-4">
      <h1 className="font-serif text-3xl md:text-4xl text-zen-bark mb-6">Politique de confidentialité</h1>
      <p>Nous attachons une grande importance à la protection de vos données personnelles, conformément au Règlement général sur la protection des données (RGPD).</p>
      <p><strong className="text-zen-bark">Données collectées.</strong> Nous collectons les informations nécessaires au traitement de vos commandes (nom, adresse, e-mail) et ne les utilisons qu&apos;à cette fin.</p>
      <p><strong className="text-zen-bark">Vos droits.</strong> Vous pouvez accéder, rectifier ou supprimer vos données en nous écrivant à <a className="text-zen-terracotta" href="mailto:boutiqueambiancejapon@gmail.com">boutiqueambiancejapon@gmail.com</a>.</p>
      <p>Nous ne revendons jamais vos données à des tiers.</p>
    </div>
  );
}
