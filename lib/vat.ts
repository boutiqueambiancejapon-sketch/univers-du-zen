// TVA par pays — taux standards UE
export const VAT_RATES: Record<string, number> = {
  BE: 0.21,
  FR: 0.20,
  LU: 0.17,
  NL: 0.21,
  DE: 0.19,
  IT: 0.22,
  ES: 0.21,
  PT: 0.23,
  AT: 0.20,
  PL: 0.23,
  SE: 0.25,
  DK: 0.25,
  FI: 0.255,
  IE: 0.23,
  GR: 0.24,
  CZ: 0.21,
  HU: 0.27,
  RO: 0.19,
  BG: 0.20,
  HR: 0.25,
  SK: 0.20,
  SI: 0.22,
  EE: 0.22,
  LV: 0.21,
  LT: 0.21,
};

// Seuil OSS cross-border total UE
export const OSS_THRESHOLD = 10_000;

// Pays d'établissement (Belgique)
export const HOME_COUNTRY = 'BE';

export function getVatRate(countryCode: string): number {
  return VAT_RATES[countryCode.toUpperCase()] ?? VAT_RATES.BE;
}

export function isCrossBorder(countryCode: string): boolean {
  return countryCode.toUpperCase() !== HOME_COUNTRY;
}

/**
 * Calcule les montants TTC, HT et TVA pour un panier
 * @param amountInclVat  - montant TTC affiché au client
 * @param countryCode    - pays de livraison ISO2
 */
export function computeVat(amountInclVat: number, countryCode: string) {
  const rate = getVatRate(countryCode);
  const amountExclVat = amountInclVat / (1 + rate);
  const vatAmount = amountInclVat - amountExclVat;
  return {
    amountInclVat: Math.round(amountInclVat * 100) / 100,
    amountExclVat: Math.round(amountExclVat * 100) / 100,
    vatAmount:     Math.round(vatAmount * 100) / 100,
    vatRate:       rate,
    countryCode:   countryCode.toUpperCase(),
    isCrossBorder: isCrossBorder(countryCode),
  };
}

/**
 * Prix affiché (TTC arrondi au ,99 supérieur)
 * Base : prix grossiste GBP × marge × taux GBP→EUR
 */
export function computeRetailPrice(
  wholesaleGbp: number,
  margin = 3.0,
  gbpEurRate = 1.17
): number {
  const raw = wholesaleGbp * margin * gbpEurRate;
  const floored = Math.floor(raw);
  return floored + 0.99;
}
