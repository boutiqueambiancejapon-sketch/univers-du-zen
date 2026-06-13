import { defineRouting } from 'next-intl/routing';

export type Locale = 'fr-BE' | 'fr-FR' | 'nl-BE' | 'nl-NL';

export const routing = defineRouting({
  locales: ['fr-BE', 'fr-FR', 'nl-BE', 'nl-NL'] as const,
  defaultLocale: 'fr-BE',
  localePrefix: 'always',
  // Mapping des chemins traduits
  pathnames: {
    '/':                           '/',
    '/boutique':                   {
      'fr-BE': '/boutique',
      'fr-FR': '/boutique',
      'nl-BE': '/winkel',
      'nl-NL': '/winkel',
    },
    '/boutique/[category]':       {
      'fr-BE': '/boutique/[category]',
      'fr-FR': '/boutique/[category]',
      'nl-BE': '/winkel/[category]',
      'nl-NL': '/winkel/[category]',
    },
    '/produits/[slug]':           {
      'fr-BE': '/produits/[slug]',
      'fr-FR': '/produits/[slug]',
      'nl-BE': '/producten/[slug]',
      'nl-NL': '/producten/[slug]',
    },
    '/panier':                    {
      'fr-BE': '/panier',
      'fr-FR': '/panier',
      'nl-BE': '/winkelwagen',
      'nl-NL': '/winkelwagen',
    },
    '/checkout':                  '/checkout',
    '/compte':                    {
      'fr-BE': '/compte',
      'fr-FR': '/compte',
      'nl-BE': '/account',
      'nl-NL': '/account',
    },
    '/compte/commandes':          {
      'fr-BE': '/compte/commandes',
      'fr-FR': '/compte/commandes',
      'nl-BE': '/account/bestellingen',
      'nl-NL': '/account/bestellingen',
    },
  },
});
