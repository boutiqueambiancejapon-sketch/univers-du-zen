# Univers du Zen — Briefing Claude

## Concept
Boutique e-commerce bien-être **corps, esprit & maison**. Concurrent direct de Nature & Découvertes, 100% en ligne. Marché cible : France, Belgique, Luxembourg (+ NL phase 2).

## Fournisseur
**Ancient Wisdom** (AW Dropship Europe) — `https://www.aw-dropship.eu`
Feed CSV public : `https://www.aw-dropship.eu/data-feed.csv`
Catégories : Aromatherapy, Bath & Body, Candles, Gemstones, Incense, Home & Garden, Fragrance, Music, Bags, Jewellery, Clothing, Artisan Tea.

**IMPORTANT** : Ne jamais mentionner Ancient Wisdom / AW dans le contenu client.

## Stack
Next.js 14 (App Router) + TypeScript + Tailwind + Supabase + Mollie + next-intl

## Locales
- `fr-BE` — Français Belgique (défaut)
- `fr-FR` — Français France
- `nl-BE` — Néerlandais Belgique
- `nl-NL` — Néerlandais Pays-Bas

Géolocalisation via header Vercel `x-vercel-ip-country` dans `middleware.ts`.

## Ton de voix
- Simple, chaleureux, sincère
- Pas de jargon bien-être (pas de "chakra", "vibrations", "rituel")
- Vouvoiement
- Descriptions honnêtes basées sur les données produit réelles

## Design
- Palette : beige `#F5EFE6`, terracotta `#C4714A`, vert sauge `#7A9E7E`, bark `#3B2A1F`
- Typo : Fraunces (serif, titres) + DM Sans (corps)
- Style : naturel, chaud, N&D-inspired

## TVA & OSS
- Pays d'établissement : Belgique (BE 21%)
- Seuil OSS : 10 000 € cross-border UE total/an
- Taux par pays dans `lib/vat.ts`
- Tracking dans table `vat_transactions` + vues SQL `oss_quarterly_report` et `oss_threshold_tracker`

## Livraison
- Gratuite dès 59 € (FR/BE/LU), 79 € autres pays
- Frais et délais par pays dans `lib/shipping.ts`
- Source : AW zones de livraison

## Prix
- Wholesale GBP × 3.0 × taux GBP/EUR → arrondi au ,99 supérieur
- Helper : `lib/vat.ts → computeRetailPrice()`

## Programme fidélité
- Cercle Jade (0 pts), Cercle Bambou (500), Cercle Lotus (1500), Cercle Or (3000)
- Défini dans `lib/types.ts → LOYALTY_TIERS`

## Variables d'environnement
Voir `.env.example`

## Commandes
```bash
npm run dev               # :3000
npm run pipeline:ingest   # CSV AW → Supabase
npm run pipeline:publish  # Supabase → pages
npm run pipeline:sync-stock
```
