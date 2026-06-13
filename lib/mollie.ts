import { Client } from 'mollie-api-typescript';

const isProduction = process.env.NODE_ENV === 'production';

export const mollie = new Client({
  security: {
    apiKey: isProduction
      ? process.env.MOLLIE_API_KEY!
      : process.env.MOLLIE_API_KEY_TEST!,
  },
});

// Méthodes de paiement activées par locale
export const PAYMENT_METHODS_BY_LOCALE: Record<string, string[]> = {
  'fr-BE': ['bancontact', 'creditcard', 'paypal'],
  'fr-FR': ['creditcard', 'paypal'],
  'nl-BE': ['bancontact', 'creditcard', 'paypal', 'ideal'],
  'nl-NL': ['ideal', 'creditcard', 'paypal'],
};
