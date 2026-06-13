import Link from 'next/link';
import type { Metadata } from 'next';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Commande confirmée ! | Univers du Zen',
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { id?: string };
}) {
  const paymentId = searchParams.id;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full text-center space-y-8">

        {/* Icône succès */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center">
            <CheckCircle size={48} className="text-green-500" />
          </div>
        </div>

        {/* Titre */}
        <div>
          <h1 className="font-serif text-3xl text-zen-bark mb-3">Merci pour votre commande !</h1>
          <p className="text-zen-muted font-sans text-sm leading-relaxed">
            Votre paiement a bien été reçu. Vous recevrez un email de confirmation sous peu avec le récapitulatif et les informations de suivi.
          </p>
          {paymentId && (
            <p className="mt-3 text-[11px] font-sans text-zen-muted/60">
              Référence : <span className="font-mono">{paymentId}</span>
            </p>
          )}
        </div>

        {/* Infos livraison */}
        <div className="bg-zen-beige rounded-2xl p-5 space-y-3 text-left">
          <div className="flex items-start gap-3">
            <Package size={18} className="text-zen-sage flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-sans font-semibold text-zen-bark">Expédition sous 24h ouvrées</p>
              <p className="text-xs text-zen-muted mt-0.5">Vous recevrez un numéro de suivi par email dès l'expédition.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={18} className="text-zen-sage flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-sans font-semibold text-zen-bark">Email de confirmation</p>
              <p className="text-xs text-zen-muted mt-0.5">Vérifiez vos spams si vous ne le recevez pas sous 5 minutes.</p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/${params.locale}/boutique`}
            className="inline-flex items-center justify-center gap-2 bg-zen-bark text-white font-sans font-medium px-6 py-3 rounded-xl hover:bg-zen-terracotta transition-colors text-sm"
          >
            Continuer mes achats <ArrowRight size={14} />
          </Link>
          <Link
            href={`/${params.locale}`}
            className="inline-flex items-center justify-center gap-2 border border-zen-sand text-zen-bark font-sans font-medium px-6 py-3 rounded-xl hover:bg-zen-beige transition-colors text-sm"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
