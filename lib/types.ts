export type Locale = 'fr-BE' | 'fr-FR' | 'nl-BE' | 'nl-NL';

export type CountryCode = 'BE' | 'FR' | 'LU' | 'NL' | 'DE' | 'IT' | 'ES' | string;

export interface Product {
  id: string;
  sku: string;
  slug: string;
  nameFr: string;
  nameNl: string;
  descriptionFr: string;
  descriptionNl: string;
  metaDescriptionFr: string;
  metaDescriptionNl: string;
  category: string;
  subcategory?: string;
  images: string[];
  wholesalePriceGbp: number;
  retailPriceEur: number;
  compareAtPriceEur?: number;
  stockStatus: 'Normal' | 'Low' | 'VeryLow' | 'OutOfStock';
  stockQty: number;
  countryOfOrigin?: string;
  isVegan?: boolean;
  isOrganic?: boolean;
  isCrueltyFree?: boolean;
  cpnpNumber?: string;
  tags: string[];
  isBestSeller?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  reference: string;
  customerId: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  countryCode: CountryCode;
  subtotalEur: number;
  vatRate: number;
  vatAmountEur: number;
  shippingEur: number;
  totalEur: number;
  molliePaymentId?: string;
  status: OrderStatus;
  awOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  sku: string;
  nameFr: string;
  quantity: number;
  unitPriceEur: number;
  totalEur: number;
}

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface Address {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  countryCode: CountryCode;
  phone?: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  memberSince: string;
}

export type LoyaltyTier = 'Cercle Jade' | 'Cercle Bambou' | 'Cercle Lotus' | 'Cercle Or';

export const LOYALTY_TIERS: { tier: LoyaltyTier; minPoints: number; perks: string[] }[] = [
  {
    tier: 'Cercle Jade',
    minPoints: 0,
    perks: ['Accès aux ventes privées'],
  },
  {
    tier: 'Cercle Bambou',
    minPoints: 500,
    perks: ['Accès aux ventes privées', 'Livraison offerte'],
  },
  {
    tier: 'Cercle Lotus',
    minPoints: 1500,
    perks: ['Accès aux ventes privées', 'Livraison toujours offerte', '1 cadeau tous les 3 mois'],
  },
  {
    tier: 'Cercle Or',
    minPoints: 3000,
    perks: ['Accès aux ventes privées', 'Livraison toujours offerte', '1 cadeau tous les 3 mois', 'Accès aux séries limitées'],
  },
];

// OSS TVA
export interface VatTransaction {
  orderId: string;
  countryCode: CountryCode;
  quarter: string; // ex: '2026-Q1'
  amountExclVat: number;
  vatRate: number;
  vatAmount: number;
  isCrossBorder: boolean;
  createdAt: string;
}
