import type { Metadata } from 'next';
import CheckoutClient from '@/components/shop/CheckoutClient';

export const metadata: Metadata = {
  title: 'Paiement sécurisé | Univers du Zen',
  description: 'Finalisez votre commande en toute sécurité. Paiement par Bancontact, carte bancaire, PayPal et plus.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
