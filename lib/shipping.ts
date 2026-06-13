// Frais de livraison AW Dropship Europe par pays
// Source : https://www.aw-dropship.eu/shipping

export interface ShippingRate {
  countryCode: string;
  countryName: string;
  zone: number;
  baseRate: number;      // 0-1kg
  freeFrom: number;      // seuil livraison gratuite (paramétrable)
  estimatedDays: string; // ex: '3-4'
}

export const SHIPPING_RATES: ShippingRate[] = [
  { countryCode: 'BE', countryName: 'Belgique',    zone: 12, baseRate: 6.00,  freeFrom: 59, estimatedDays: '3-4' },
  { countryCode: 'FR', countryName: 'France',      zone: 7,  baseRate: 7.50,  freeFrom: 59, estimatedDays: '3'   },
  { countryCode: 'LU', countryName: 'Luxembourg',  zone: 13, baseRate: 6.70,  freeFrom: 59, estimatedDays: '3-4' },
  { countryCode: 'NL', countryName: 'Pays-Bas',    zone: 14, baseRate: 6.70,  freeFrom: 59, estimatedDays: '4'   },
  { countryCode: 'DE', countryName: 'Allemagne',   zone: 6,  baseRate: 5.85,  freeFrom: 59, estimatedDays: '2-3' },
  { countryCode: 'IT', countryName: 'Italie',      zone: 24, baseRate: 7.80,  freeFrom: 79, estimatedDays: '4'   },
  { countryCode: 'ES', countryName: 'Espagne',     zone: 11, baseRate: 7.85,  freeFrom: 79, estimatedDays: '3-4' },
  { countryCode: 'AT', countryName: 'Autriche',    zone: 3,  baseRate: 5.10,  freeFrom: 59, estimatedDays: '2-3' },
  { countryCode: 'PL', countryName: 'Pologne',     zone: 4,  baseRate: 4.40,  freeFrom: 59, estimatedDays: '1-2' },
  { countryCode: 'PT', countryName: 'Portugal',    zone: 23, baseRate: 7.80,  freeFrom: 79, estimatedDays: '6-8' },
];

export function getShippingRate(countryCode: string): ShippingRate | undefined {
  return SHIPPING_RATES.find(r => r.countryCode === countryCode.toUpperCase());
}

export function computeShipping(countryCode: string, orderTotalEur: number): number {
  const rate = getShippingRate(countryCode);
  if (!rate) return 9.99; // fallback
  if (orderTotalEur >= rate.freeFrom) return 0;
  return rate.baseRate;
}

export function estimatedDeliveryDate(countryCode: string): Date {
  const rate = getShippingRate(countryCode);
  const days = rate ? parseInt(rate.estimatedDays.split('-')[1] ?? rate.estimatedDays) : 7;
  // +2 jours dispatch
  const total = days + 2;
  const date = new Date();
  // Skip weekends
  let added = 0;
  while (added < total) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0 && date.getDay() !== 6) added++;
  }
  return date;
}
