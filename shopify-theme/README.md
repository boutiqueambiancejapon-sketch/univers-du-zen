# Thème Shopify — Univers du Zen

Thème Online Store 2.0 reproduisant le design du site Next.js (palette beige/terracotta/sauge/bark, typographies Fraunces + DM Sans).

## Installation

### Option A — Via l'admin Shopify
1. Zipper le contenu de ce dossier (`shopify-theme.zip` à la racine du repo est déjà prêt).
2. Admin Shopify → **Boutique en ligne → Thèmes → Ajouter un thème → Importer un fichier zip**.

### Option B — Via Shopify CLI
```bash
cd shopify-theme
shopify theme push --store univers-zen-2 --unpublished --theme "Univers du Zen"
```

## Après installation
1. **Menus** : créer le menu `main-menu` (Boutique, Huiles & Fragrance, Aromathérapie, Encens, Cristaux, Bougies…) et un menu `footer` (Livraison, Retours, FAQ, Contact, CGV…) dans Navigation.
2. **Collections** : associer les collections aux blocs de la grille « Univers (bento) » et aux sections « Collection en vedette » / « Grille de produits » via l'éditeur de thème.
3. **Images** : les images d'ambiance (héro + 6 univers) sont incluses dans les assets du thème et utilisées par défaut ; remplaçables dans l'éditeur.
4. **Tags produits** : le badge « Best-seller » s'affiche pour les produits tagués `best-seller`, le badge « Nouveau » pour le tag `nouveau`. Le badge `-X%` s'affiche automatiquement si un prix barré (compare at price) est renseigné.
5. **Livraison offerte** : seuil configurable dans Paramètres du thème → Livraison (59 € par défaut).

## Structure
- `sections/` — héro, bandeau défilant, bento des univers, collection en vedette, chiffres, avis, engagement, produit, collection, panier (drawer)
- `snippets/product-card.liquid` — carte produit (badges, ajout rapide AJAX)
- `assets/base.css` — design system complet
- `assets/global.js` — drawer panier AJAX, quick-add, galerie produit, menu mobile
