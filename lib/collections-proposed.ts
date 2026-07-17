/**
 * Sous-collections SEO RECOMMANDÉES — Univers du Zen
 * ---------------------------------------------------------------------------
 * Nouveaux rayons/pages détectés via analyse SERP FR + concurrents (juillet 2026),
 * ABSENTS de la taxonomie actuelle (`lib/collections.ts`). Chaque entrée est une
 * page de collection potentielle à fort potentiel SEO.
 *
 * Deux grandes logiques transversales dominent le marché bien-être FR :
 *   1. PAR BIENFAIT / BESOIN  (huiles-essentielles-sommeil, pierre-anti-stress…)
 *   2. PAR ENTITÉ NOMMÉE      (par plante, par pierre, par famille olfactive,
 *                              par senteur, par type d'instrument…)
 * → un même produit peut vivre dans plusieurs collections via des tags/filtres,
 *   ce qui multiplie les pages d'atterrissage SEO sans dupliquer le stock.
 *
 * `priority` : 'haute' = fort volume + faible concurrence relative → à créer en 1er.
 * ⚠️ N'ouvrir une page que si elle contient assez de produits (éviter le thin content).
 * ⚠️ Ton de voix : vouvoiement, pas de jargon, allégations encadrées, jamais de fournisseur.
 */

export type Priority = 'haute' | 'moyenne' | 'basse';

export interface ProposedSub {
  slug: string;
  label: string;
  primary: string;       // mot-clé principal FR
  keywords: string[];    // longue traîne associée
  priority: Priority;
  note?: string;
}

export interface ProposedAxis {
  /** slug de la collection parente (voir lib/collections.ts) */
  collection: string;
  /** axe de navigation transversal */
  axis: string;
  subs: ProposedSub[];
}

export const PROPOSED_SUBCOLLECTIONS: ProposedAxis[] = [
  // ─────────────────────────────── AROMATHÉRAPIE ──────────────────────────
  {
    collection: 'aromatherapie',
    axis: 'Par bienfait',
    subs: [
      { slug: 'huiles-essentielles-sommeil', label: 'Sommeil', primary: 'huile essentielle sommeil', keywords: ['huile essentielle pour dormir', 'huile essentielle anti-insomnie', 'lavande sommeil'], priority: 'haute' },
      { slug: 'huiles-essentielles-stress', label: 'Stress & détente', primary: 'huile essentielle stress', keywords: ['huile essentielle anti-stress', 'huile essentielle anxiété', 'huile essentielle relaxation'], priority: 'haute' },
      { slug: 'huiles-essentielles-respiration', label: 'Respiration & hiver', primary: 'huile essentielle nez bouché', keywords: ['huile essentielle respiratoire', 'huile essentielle rhume', 'huile essentielle inhalation'], priority: 'haute' },
      { slug: 'huiles-essentielles-tonus', label: 'Tonus & concentration', primary: 'huile essentielle fatigue', keywords: ['huile essentielle énergie', 'huile essentielle concentration'], priority: 'moyenne' },
      { slug: 'huiles-essentielles-purifiant', label: 'Purifier l\'air', primary: 'huile essentielle assainissante', keywords: ['purifier l\'air maison huiles essentielles', 'huile essentielle assainissant'], priority: 'moyenne' },
      { slug: 'huiles-essentielles-anti-moustique', label: 'Anti-moustique', primary: 'huile essentielle anti-moustique', keywords: ['répulsif naturel', 'huile essentielle citronnelle'], priority: 'moyenne', note: 'Saisonnier fort (été)' },
      { slug: 'huiles-essentielles-peau', label: 'Peau & cheveux', primary: 'huile essentielle peau', keywords: ['huile essentielle anti-imperfections', 'huile essentielle cheveux gras'], priority: 'moyenne' },
    ],
  },
  {
    collection: 'aromatherapie',
    axis: 'Par plante',
    subs: [
      { slug: 'huile-essentielle-lavande', label: 'Lavande', primary: 'huile essentielle lavande', keywords: ['huile essentielle lavande vraie', 'lavande bienfaits', 'lavande usage'], priority: 'haute' },
      { slug: 'huile-essentielle-tea-tree', label: 'Tea tree (arbre à thé)', primary: 'huile essentielle tea tree', keywords: ['huile essentielle arbre à thé', 'tea tree bouton acné', 'tea tree poux'], priority: 'haute' },
      { slug: 'huile-essentielle-eucalyptus', label: 'Eucalyptus', primary: 'huile essentielle eucalyptus radiata', keywords: ['eucalyptus globulus', 'eucalyptus rhume respiratoire'], priority: 'haute' },
      { slug: 'huile-essentielle-menthe-poivree', label: 'Menthe poivrée', primary: 'huile essentielle menthe poivrée', keywords: ['menthe poivrée mal de tête', 'menthe poivrée digestion'], priority: 'haute' },
      { slug: 'huile-essentielle-ravintsara', label: 'Ravintsara', primary: 'huile essentielle ravintsara', keywords: ['ravintsara immunité', 'ravintsara hiver'], priority: 'moyenne' },
      { slug: 'huile-essentielle-citron', label: 'Citron & agrumes', primary: 'huile essentielle citron', keywords: ['huile essentielle orange douce', 'agrumes diffusion'], priority: 'moyenne' },
    ],
  },
  {
    collection: 'aromatherapie',
    axis: 'Formats & cadeaux',
    subs: [
      { slug: 'coffrets-aromatherapie', label: 'Coffrets & kits', primary: 'coffret huiles essentielles', keywords: ['kit découverte huiles essentielles', 'coffret aromathérapie cadeau', 'coffret huiles essentielles débutant'], priority: 'moyenne', note: 'Saisonnier cadeau (Noël, fête des mères)' },
      { slug: 'inhalateurs-sels-inhalation', label: 'Inhalation & respiration', primary: 'sels d\'inhalation', keywords: ['inhalateur huiles essentielles', 'stick inhalateur nez bouché'], priority: 'basse' },
    ],
  },

  // ─────────────────────────── HUILES DE FRAGRANCE ────────────────────────
  {
    collection: 'huiles-fragrance',
    axis: 'Par famille olfactive',
    subs: [
      { slug: 'parfum-interieur-boise', label: 'Boisé', primary: 'parfum d\'ambiance boisé', keywords: ['senteur boisée cèdre santal', 'parfum d\'intérieur bois de santal'], priority: 'haute' },
      { slug: 'parfum-interieur-floral', label: 'Floral', primary: 'parfum d\'ambiance floral', keywords: ['senteur florale rose jasmin', 'parfum d\'intérieur fleur d\'oranger'], priority: 'haute' },
      { slug: 'parfum-interieur-gourmand', label: 'Gourmand', primary: 'parfum d\'ambiance gourmand', keywords: ['senteur vanille ambre', 'parfum gourmand cocooning'], priority: 'haute', note: 'Pic hiver/Noël' },
      { slug: 'parfum-interieur-frais', label: 'Frais', primary: 'parfum d\'ambiance frais', keywords: ['senteur fraîche linge propre coton', 'parfum d\'intérieur agrumes'], priority: 'haute' },
      { slug: 'parfum-interieur-oriental', label: 'Oriental', primary: 'parfum d\'ambiance oriental', keywords: ['senteur orientale ambre oudh', 'parfum d\'intérieur oud'], priority: 'moyenne' },
      { slug: 'parfum-interieur-fruite', label: 'Fruité', primary: 'parfum d\'ambiance fruité', keywords: ['parfum d\'intérieur figue', 'senteur fruits rouges'], priority: 'moyenne' },
    ],
  },
  {
    collection: 'huiles-fragrance',
    axis: 'Nouveaux formats',
    subs: [
      { slug: 'brume-oreiller', label: 'Brume d\'oreiller', primary: 'brume d\'oreiller', keywords: ['brume d\'oreiller lavande sommeil', 'spray oreiller détente'], priority: 'haute', note: 'Rester factuel, pas de promesse santé' },
      { slug: 'parfum-linge', label: 'Parfum du linge', primary: 'brume de linge', keywords: ['spray parfum textile', 'brume linge propre', 'spray parfumé draps'], priority: 'moyenne' },
      { slug: 'parfum-armoire', label: 'Parfum d\'armoire', primary: 'sachet parfumé armoire', keywords: ['sachet senteur placard', 'pochette parfumée tiroir', 'parfum d\'armoire lavande'], priority: 'moyenne' },
      { slug: 'galets-parfumes', label: 'Galets parfumés', primary: 'galet parfumé', keywords: ['galet céramique parfumé', 'galet parfumé à imbiber'], priority: 'moyenne' },
      { slug: 'diffuseur-voiture', label: 'Diffuseur voiture', primary: 'diffuseur de parfum voiture', keywords: ['parfum voiture naturel', 'désodorisant voiture naturel'], priority: 'moyenne' },
      { slug: 'brule-parfum', label: 'Brûle-parfums', primary: 'brûle-parfum', keywords: ['brûle-parfum céramique', 'brûleur de cire', 'brûle-parfum électrique'], priority: 'moyenne', note: 'Support des fondants → cross-sell' },
    ],
  },
  {
    collection: 'huiles-fragrance',
    axis: 'Transverses & cadeau',
    subs: [
      { slug: 'recharges-diffuseur', label: 'Recharges diffuseur', primary: 'recharge diffuseur de parfum', keywords: ['recharge diffuseur bâtonnets', 'recharge bouquet parfumé'], priority: 'haute', note: 'Réachat récurrent' },
      { slug: 'coffret-parfum-maison', label: 'Coffrets cadeau', primary: 'coffret cadeau parfum maison', keywords: ['coffret parfum d\'intérieur', 'idée cadeau senteur maison'], priority: 'moyenne' },
    ],
  },

  // ───────────────────────────── ENCENS & RITUELS ────────────────────────
  {
    collection: 'encens-rituels',
    axis: 'Par senteur / origine',
    subs: [
      { slug: 'encens-par-senteur', label: 'Par senteur', primary: 'encens santal', keywords: ['encens lavande', 'encens nag champa', 'encens patchouli', 'encens jasmin', 'encens vanille'], priority: 'haute' },
      { slug: 'encens-japonais', label: 'Encens japonais & sans fumée', primary: 'encens japonais', keywords: ['encens sans fumée', 'encens peu de fumée', 'encens quotidien'], priority: 'moyenne' },
      { slug: 'encens-tibetain', label: 'Encens tibétain roulé main', primary: 'encens tibétain', keywords: ['encens népalais', 'encens roulé à la main', 'encens himalayen'], priority: 'moyenne' },
    ],
  },
  {
    collection: 'encens-rituels',
    axis: 'Coffrets & purification',
    subs: [
      { slug: 'kit-purification-maison', label: 'Kits de purification', primary: 'kit purification maison', keywords: ['coffret sauge palo santo', 'fumigation maison', 'purifier la maison'], priority: 'haute', note: 'Panier élevé + cadeau' },
      { slug: 'fontaine-encens-backflow', label: 'Fontaines backflow', primary: 'fontaine à encens', keywords: ['porte encens cascade', 'encens fumée descendante', 'cascade de fumée'], priority: 'moyenne', note: 'Achat d\'impulsion (effet visuel)' },
      { slug: 'coffret-encens-decouverte', label: 'Coffrets découverte', primary: 'coffret encens', keywords: ['coffret encens découverte', 'assortiment encens', 'encens cadeau'], priority: 'moyenne' },
    ],
  },

  // ───────────────────────── CRISTAUX & LITHOTHÉRAPIE ─────────────────────
  {
    collection: 'cristaux-lithotherapie',
    axis: 'Par pierre (top 20)',
    subs: [
      { slug: 'pierre-amethyste', label: 'Améthyste', primary: 'améthyste vertus', keywords: ['améthyste signification', 'améthyste sommeil', 'améthyste calme'], priority: 'haute' },
      { slug: 'pierre-quartz-rose', label: 'Quartz rose', primary: 'quartz rose vertu', keywords: ['quartz rose amour', 'quartz rose signification'], priority: 'haute' },
      { slug: 'pierre-oeil-de-tigre', label: 'Œil de tigre', primary: 'œil de tigre vertu', keywords: ['œil de tigre protection', 'œil de tigre confiance'], priority: 'haute' },
      { slug: 'pierre-obsidienne', label: 'Obsidienne', primary: 'obsidienne vertu', keywords: ['obsidienne noire protection', 'obsidienne œil céleste'], priority: 'haute' },
      { slug: 'pierre-labradorite', label: 'Labradorite', primary: 'labradorite vertu', keywords: ['labradorite protection', 'labradorite intuition'], priority: 'haute' },
      { slug: 'pierre-de-lune', label: 'Pierre de lune', primary: 'pierre de lune vertu', keywords: ['pierre de lune féminité', 'pierre de lune intuition'], priority: 'haute' },
      { slug: 'pierre-citrine', label: 'Citrine', primary: 'citrine vertu', keywords: ['citrine abondance', 'citrine confiance'], priority: 'moyenne' },
      { slug: 'pierre-cornaline', label: 'Cornaline', primary: 'cornaline vertu', keywords: ['cornaline vitalité', 'cornaline confiance'], priority: 'moyenne' },
      { slug: 'pierre-aventurine', label: 'Aventurine verte', primary: 'aventurine verte vertu', keywords: ['aventurine chance', 'aventurine apaisement'], priority: 'moyenne' },
      { slug: 'pierre-lapis-lazuli', label: 'Lapis-lazuli', primary: 'lapis lazuli vertu', keywords: ['lapis lazuli communication'], priority: 'moyenne' },
      { slug: 'pierre-howlite', label: 'Howlite', primary: 'howlite vertu', keywords: ['howlite sommeil', 'howlite apaisement'], priority: 'moyenne' },
      { slug: 'pierre-tourmaline-noire', label: 'Tourmaline noire', primary: 'tourmaline noire vertu', keywords: ['tourmaline noire protection ondes', 'tourmaline noire ancrage'], priority: 'moyenne' },
      { slug: 'pierre-amazonite', label: 'Amazonite', primary: 'amazonite vertu', keywords: ['amazonite stress', 'amazonite apaisement'], priority: 'moyenne' },
      { slug: 'pierre-lepidolite', label: 'Lépidolite', primary: 'lépidolite vertu', keywords: ['lépidolite anxiété', 'lépidolite sommeil'], priority: 'basse' },
    ],
  },
  {
    collection: 'cristaux-lithotherapie',
    axis: 'Par besoin',
    subs: [
      { slug: 'pierre-anti-stress', label: 'Anti-stress & calme', primary: 'pierre anti-stress', keywords: ['quelle pierre pour le stress', 'pierre anxiété', 'améthyste amazonite howlite'], priority: 'haute' },
      { slug: 'pierre-sommeil', label: 'Sommeil', primary: 'pierre pour le sommeil', keywords: ['pierre pour dormir', 'pierre insomnie'], priority: 'haute' },
      { slug: 'pierre-de-protection', label: 'Protection', primary: 'pierre de protection', keywords: ['pierre contre ondes négatives', 'protection ondes électromagnétiques'], priority: 'haute' },
      { slug: 'pierre-confiance-en-soi', label: 'Confiance en soi', primary: 'pierre confiance en soi', keywords: ['pierre estime de soi', 'citrine œil de tigre cornaline'], priority: 'moyenne' },
      { slug: 'pierre-de-l-amour', label: 'Amour', primary: 'pierre de l\'amour', keywords: ['pierre pour attirer l\'amour', 'quartz rose rhodonite'], priority: 'moyenne' },
      { slug: 'pierre-d-ancrage', label: 'Ancrage', primary: 'pierre d\'ancrage', keywords: ['pierre chakra racine', 'hématite jaspe rouge'], priority: 'moyenne' },
      { slug: 'pierre-abondance-chance', label: 'Chance & abondance', primary: 'pierre abondance', keywords: ['pierre pour attirer l\'argent', 'citrine aventurine pyrite'], priority: 'moyenne' },
      { slug: 'pierres-7-chakras', label: '7 chakras', primary: 'pierres des 7 chakras', keywords: ['pierre par chakra', 'coffret 7 chakras'], priority: 'moyenne', note: 'Page hub reliant les 7 pierres' },
      { slug: 'purification-recharge-pierres', label: 'Purification & recharge', primary: 'comment purifier ses pierres', keywords: ['recharger ses pierres', 'purification pierres sélénite sauge'], priority: 'moyenne', note: 'Guide + cross-sell sélénite/encens' },
    ],
  },
  {
    collection: 'cristaux-lithotherapie',
    axis: 'Formats manquants',
    subs: [
      { slug: 'coffrets-lithotherapie', label: 'Coffrets découverte', primary: 'coffret lithothérapie', keywords: ['coffret pierres roulées', 'coffret découverte', 'idée cadeau pierres'], priority: 'haute' },
      { slug: 'pendentifs-pierre-naturelle', label: 'Pendentifs pierre', primary: 'pendentif pierre naturelle', keywords: ['collier pierre naturelle', 'pendentif améthyste'], priority: 'moyenne' },
      { slug: 'pierres-plates-inquietude', label: 'Pierres plates (worry stones)', primary: 'pierre plate', keywords: ['galet apaisant', 'pierre à pouce', 'worry stone'], priority: 'basse' },
      { slug: 'oeufs-de-yoni', label: 'Œufs de yoni', primary: 'œuf de yoni', keywords: ['œuf de yoni jade', 'œuf de yoni quartz rose', 'œuf de yoni débutant'], priority: 'basse', note: 'Rédaction prudente (tonus périnée, bien-être)' },
      { slug: 'bougies-cristaux', label: 'Bougies + pierre', primary: 'bougie cristaux', keywords: ['bougie avec pierre naturelle', 'bougie améthyste'], priority: 'basse', note: 'Cross-sell univers bougies' },
    ],
  },

  // ──────────────────────────── BOUGIES & LUMIÈRES ────────────────────────
  {
    collection: 'bougies-photophores',
    axis: 'Par senteur',
    subs: [
      { slug: 'bougie-vanille', label: 'Vanille', primary: 'bougie vanille', keywords: ['bougie parfumée vanille', 'bougie gourmande'], priority: 'haute' },
      { slug: 'bougie-fleur-de-coton', label: 'Fleur de coton', primary: 'bougie fleur de coton', keywords: ['bougie parfumée fleur de coton', 'bougie linge propre'], priority: 'haute' },
      { slug: 'bougie-lavande', label: 'Lavande', primary: 'bougie lavande', keywords: ['bougie parfumée lavande', 'bougie détente'], priority: 'moyenne' },
      { slug: 'bougie-bois-de-santal', label: 'Bois de santal', primary: 'bougie bois de santal', keywords: ['bougie senteur boisée', 'bougie santal'], priority: 'moyenne' },
      { slug: 'bougie-ambre', label: 'Ambre', primary: 'bougie ambrée', keywords: ['bougie ambre', 'bougie orientale'], priority: 'moyenne' },
    ],
  },
  {
    collection: 'bougies-photophores',
    axis: 'Formats & cadeau',
    subs: [
      { slug: 'coffret-bougie-cadeau', label: 'Coffrets cadeau', primary: 'coffret bougie cadeau', keywords: ['coffret bougie', 'bougie cadeau femme', 'idée cadeau bougie parfumée'], priority: 'haute', note: 'Fort Q4' },
      { slug: 'bougie-meche-bois', label: 'Mèche en bois (crépitante)', primary: 'bougie mèche en bois', keywords: ['bougie crépitante', 'bougie qui crépite', 'bougie feu de cheminée'], priority: 'haute' },
      { slug: 'bougie-de-massage', label: 'Bougies de massage', primary: 'bougie de massage', keywords: ['bougie massage huile', 'bougie de massage naturelle'], priority: 'moyenne', note: 'Pont avec soins du corps' },
      { slug: 'bougie-naturelle', label: 'Bougies naturelles (cire d\'abeille)', primary: 'bougie naturelle', keywords: ['bougie cire d\'abeille', 'bougie végétale', 'bougie sans paraffine'], priority: 'moyenne' },
      { slug: 'bougie-decorative', label: 'Bougies décoratives (torsadées)', primary: 'bougie décorative', keywords: ['bougie torsadée', 'bougie sculptée', 'bougie bubble', 'bougie design'], priority: 'moyenne', note: 'Tendance Pinterest' },
      { slug: 'bougie-flottante', label: 'Bougies flottantes', primary: 'bougie flottante', keywords: ['bougie flottante décoration', 'bougie flottante mariage'], priority: 'basse' },
      { slug: 'veilleuse-lumiere-ambiance', label: 'Veilleuses & LED', primary: 'bougie LED', keywords: ['veilleuse déco', 'bougie sans flamme', 'lampe d\'ambiance'], priority: 'basse' },
    ],
  },

  // ────────────────────────────── BIEN-ÊTRE CORPS ────────────────────────
  {
    collection: 'bien-etre-corps',
    axis: 'Transverses (tags)',
    subs: [
      { slug: 'cosmetique-solide-zero-dechet', label: 'Cosmétique solide & zéro déchet', primary: 'cosmétique solide', keywords: ['salle de bain zéro déchet', 'soin solide naturel', 'cosmétique sans plastique'], priority: 'haute' },
      { slug: 'coffrets-cadeau-bien-etre', label: 'Coffrets cadeau bien-être', primary: 'coffret bien-être', keywords: ['coffret cadeau spa', 'cadeau bien-être femme', 'box détente'], priority: 'haute', note: 'Marge + saisonnalité' },
      { slug: 'cosmetique-vegan-naturelle', label: 'Cosmétique vegan', primary: 'cosmétique vegan', keywords: ['soin vegan naturel', 'beauté cruelty-free'], priority: 'moyenne' },
    ],
  },
  {
    collection: 'bien-etre-corps',
    axis: 'Par besoin / cible',
    subs: [
      { slug: 'savon-par-type-de-peau', label: 'Savon par type de peau', primary: 'savon peau sensible', keywords: ['savon peau grasse', 'savon peau sèche', 'savon surgras'], priority: 'haute' },
      { slug: 'soin-homme-barbe', label: 'Soin homme & barbe', primary: 'soin barbe homme', keywords: ['huile à barbe naturelle', 'baume à barbe', 'savon homme'], priority: 'moyenne' },
      { slug: 'soin-des-pieds', label: 'Soin des pieds', primary: 'soin des pieds naturel', keywords: ['bain de pied relaxant', 'gommage pieds', 'baume talons secs'], priority: 'moyenne' },
      { slug: 'huiles-de-massage-corps', label: 'Huiles de massage', primary: 'huile de massage relaxante', keywords: ['huile de massage aux huiles essentielles', 'huile sensorielle corps'], priority: 'moyenne' },
    ],
  },

  // ─────────────────────────────── DÉCO & MAISON ─────────────────────────
  {
    collection: 'deco-maison-zen',
    axis: 'Par pièce',
    subs: [
      { slug: 'deco-zen-salon', label: 'Salon zen', primary: 'déco zen salon', keywords: ['idée déco salon zen', 'décoration salon nature'], priority: 'haute' },
      { slug: 'deco-zen-chambre', label: 'Chambre zen', primary: 'déco chambre zen', keywords: ['chambre zen apaisante', 'chambre zen adulte'], priority: 'haute' },
      { slug: 'deco-zen-salle-de-bain', label: 'Salle de bain zen', primary: 'salle de bain zen', keywords: ['déco salle de bain nature', 'salle de bain spa maison'], priority: 'haute' },
    ],
  },
  {
    collection: 'deco-maison-zen',
    axis: 'Thèmes & cadeau',
    subs: [
      { slug: 'coin-meditation', label: 'Coin méditation', primary: 'coin méditation', keywords: ['aménager un coin méditation', 'coussin de méditation zafu', 'autel méditation maison'], priority: 'haute', note: 'Différenciant, concurrence faible' },
      { slug: 'cadeaux-zen', label: 'Idées cadeaux zen', primary: 'idée cadeau zen', keywords: ['cadeau bien-être à offrir', 'cadeau détente femme', 'coffret cadeau zen'], priority: 'haute', note: 'Conversion + saisonnalité' },
      { slug: 'feng-shui', label: 'Feng Shui', primary: 'objet feng shui', keywords: ['déco feng shui maison', 'fontaine feng shui', 'symbole feng shui porte-bonheur'], priority: 'moyenne', note: 'Rester factuel/déco' },
      { slug: 'deco-boheme', label: 'Déco bohème', primary: 'déco bohème', keywords: ['décoration bohème chic', 'déco boho naturel', 'macramé bohème'], priority: 'moyenne' },
      { slug: 'miroirs', label: 'Miroirs', primary: 'miroir rotin', keywords: ['miroir soleil rotin', 'miroir bohème mural', 'miroir rond osier'], priority: 'moyenne' },
      { slug: 'cache-pots-suspensions', label: 'Cache-pots & suspensions', primary: 'cache-pot déco', keywords: ['suspension macramé plante', 'cache-pot suspendu', 'porte-plante macramé'], priority: 'moyenne', note: 'Contenants uniquement (pas de plantes vivantes)' },
      { slug: 'fontaines-interieur', label: 'Fontaines d\'intérieur', primary: 'fontaine d\'intérieur', keywords: ['fontaine zen feng shui', 'fontaine cascade intérieure'], priority: 'moyenne', note: 'Éclater hors "Déco intérieure"' },
    ],
  },

  // ─────────────────────────────── THÉ & TISANES ─────────────────────────
  {
    collection: 'the-tisanes',
    axis: 'Par type de thé',
    subs: [
      { slug: 'the-vert', label: 'Thé vert', primary: 'thé vert bio', keywords: ['thé vert en vrac', 'bienfaits thé vert'], priority: 'haute' },
      { slug: 'matcha', label: 'Matcha', primary: 'matcha bio', keywords: ['matcha poudre thé vert', 'matcha cérémonie', 'matcha latte', 'comment préparer le matcha'], priority: 'haute', note: 'Meilleur ROI SEO de l\'univers — à isoler' },
      { slug: 'rooibos', label: 'Rooibos', primary: 'rooibos bio', keywords: ['thé rouge sans théine', 'rooibos infusion'], priority: 'moyenne' },
      { slug: 'the-noir', label: 'Thé noir', primary: 'thé noir bio', keywords: ['thé noir earl grey', 'thé noir petit-déjeuner'], priority: 'moyenne' },
      { slug: 'the-blanc', label: 'Thé blanc', primary: 'thé blanc bio', keywords: ['thé blanc bienfaits'], priority: 'basse' },
    ],
  },
  {
    collection: 'the-tisanes',
    axis: 'Tisanes par bienfait',
    subs: [
      { slug: 'tisane-sommeil', label: 'Sommeil', primary: 'tisane sommeil', keywords: ['tisane pour dormir', 'infusion nuit sans théine', 'camomille tilleul verveine'], priority: 'haute', note: 'Allégations encadrées' },
      { slug: 'tisane-digestion', label: 'Digestion', primary: 'tisane digestion', keywords: ['infusion après repas', 'menthe fenouil gingembre'], priority: 'haute' },
      { slug: 'tisane-detox', label: 'Détox', primary: 'tisane détox', keywords: ['thé détox', 'infusion drainante', 'thé vert détox'], priority: 'haute', note: 'Angle honnête : aucune infusion ne fait maigrir seule' },
      { slug: 'tisane-relaxation', label: 'Relaxation', primary: 'tisane relaxation', keywords: ['infusion anti-stress', 'tisane apaisante', 'mélisse'], priority: 'moyenne' },
      { slug: 'tisane-energie', label: 'Énergie', primary: 'tisane énergie', keywords: ['infusion tonus vitalité', 'tisane gingembre'], priority: 'moyenne' },
    ],
  },
  {
    collection: 'the-tisanes',
    axis: 'Cadeau & accessoires',
    subs: [
      { slug: 'coffret-the', label: 'Coffrets thé', primary: 'coffret thé', keywords: ['coffret thé cadeau', 'coffret dégustation thé', 'idée cadeau thé'], priority: 'haute' },
      { slug: 'the-de-noel', label: 'Thé de Noël', primary: 'thé de Noël', keywords: ['thé épices cannelle orange', 'coffret thé Noël'], priority: 'haute', note: 'Saisonnier — créer dès septembre, conserver la page' },
      { slug: 'boite-a-the', label: 'Boîtes à thé', primary: 'boîte à thé', keywords: ['boîte à thé métal hermétique', 'rangement thé conservation'], priority: 'moyenne' },
    ],
  },

  // ─────────────────────── INSTRUMENTS & SONOTHÉRAPIE ────────────────────
  {
    collection: 'instruments-sonotherapie',
    axis: 'Par type d\'instrument',
    subs: [
      { slug: 'carillons-koshi-zaphir', label: 'Carillons Koshi & Zaphir', primary: 'carillon koshi', keywords: ['carillon zaphir', 'carillon relaxation', 'koshi terra aqua aria ignis'], priority: 'haute' },
      { slug: 'tongue-drum-handpan', label: 'Tongue drums & handpans', primary: 'tongue drum', keywords: ['handpan', 'steel tongue drum', 'happy drum', 'tongue drum débutant'], priority: 'haute', note: 'Récupère les steel tongue/happy drums' },
      { slug: 'tambour-ocean-baton-de-pluie', label: 'Tambours océan & bâtons de pluie', primary: 'tambour océan', keywords: ['bâton de pluie', 'bruit de vagues instrument', 'ocean drum'], priority: 'moyenne' },
      { slug: 'kalimba', label: 'Kalimbas', primary: 'kalimba', keywords: ['kalimba 17 notes', 'piano à pouces', 'kalimba débutant'], priority: 'moyenne' },
      { slug: 'flutes-relaxation', label: 'Flûtes de relaxation', primary: 'flûte amérindienne', keywords: ['flûte de méditation', 'flûte pentatonique', 'flûte 432 Hz'], priority: 'moyenne', note: 'Absorbe les flûtes/sifflets oiseaux' },
      { slug: 'diapasons-therapeutiques', label: 'Diapasons thérapeutiques', primary: 'diapason thérapeutique', keywords: ['diapason 128 Hz', 'diapason lesté', 'coffret diapasons'], priority: 'basse', note: 'Si stock — éviter allégations santé' },
    ],
  },

  // ─────────────────────── BIJOUX & CRISTAUX PORTÉS ──────────────────────
  {
    collection: 'bijoux-cristaux',
    axis: 'Par pierre',
    subs: [
      { slug: 'bracelet-oeil-de-tigre', label: 'Œil de tigre', primary: 'bracelet œil de tigre', keywords: ['œil de tigre vertus', 'œil de tigre protection', 'œil de tigre homme'], priority: 'haute' },
      { slug: 'bijoux-amethyste', label: 'Améthyste', primary: 'bracelet améthyste', keywords: ['améthyste vertus', 'collier améthyste', 'améthyste sommeil'], priority: 'haute' },
      { slug: 'bijoux-quartz-rose', label: 'Quartz rose', primary: 'bracelet quartz rose', keywords: ['quartz rose amour', 'collier quartz rose'], priority: 'haute' },
      { slug: 'bracelet-obsidienne', label: 'Obsidienne', primary: 'bracelet obsidienne', keywords: ['obsidienne noire protection', 'obsidienne œil céleste'], priority: 'moyenne' },
      { slug: 'bracelet-labradorite', label: 'Labradorite', primary: 'bracelet labradorite', keywords: ['labradorite protection', 'labradorite intuition'], priority: 'moyenne' },
      { slug: 'bijoux-pierre-de-lune', label: 'Pierre de lune', primary: 'bracelet pierre de lune', keywords: ['pierre de lune féminité', 'pierre de lune vertus'], priority: 'moyenne' },
    ],
  },
  {
    collection: 'bijoux-cristaux',
    axis: 'Par besoin',
    subs: [
      { slug: 'bijoux-protection', label: 'Protection', primary: 'bracelet protection', keywords: ['œil de tigre obsidienne tourmaline', 'bracelet contre ondes négatives'], priority: 'haute' },
      { slug: 'bijoux-anti-stress', label: 'Anti-stress', primary: 'bracelet anti-stress', keywords: ['améthyste howlite amazonite', 'bracelet calme'], priority: 'haute' },
      { slug: 'bijoux-amour', label: 'Amour', primary: 'bracelet amour', keywords: ['quartz rose rhodonite', 'bracelet couple'], priority: 'moyenne' },
      { slug: 'bijoux-confiance-en-soi', label: 'Confiance en soi', primary: 'bracelet confiance en soi', keywords: ['œil de tigre cornaline citrine'], priority: 'moyenne' },
      { slug: 'bijoux-ancrage', label: 'Ancrage', primary: 'bracelet ancrage', keywords: ['hématite jaspe rouge onyx'], priority: 'moyenne' },
    ],
  },
  {
    collection: 'bijoux-cristaux',
    axis: 'Par thème / cadeau',
    subs: [
      { slug: 'bijoux-arbre-de-vie', label: 'Arbre de vie', primary: 'bijoux arbre de vie', keywords: ['collier arbre de vie pierre naturelle', 'pendentif arbre de vie'], priority: 'haute', note: 'Gros volume, transversal' },
      { slug: 'bijoux-7-chakras', label: '7 chakras', primary: 'bijoux 7 chakras', keywords: ['bracelet 7 chakras', 'collier 7 chakras'], priority: 'haute' },
      { slug: 'coffret-bijoux-lithotherapie', label: 'Coffrets cadeau', primary: 'coffret bijoux pierre naturelle', keywords: ['coffret bijoux lithothérapie', 'idée cadeau bijou pierre'], priority: 'haute', note: 'Noël, fête des mères' },
      { slug: 'bijoux-homme-pierre', label: 'Bijoux homme', primary: 'bijoux homme pierre naturelle', keywords: ['bracelet homme œil de tigre', 'bracelet homme onyx'], priority: 'moyenne', note: 'Segment en croissance' },
      { slug: 'bracelet-diffuseur-huile-essentielle', label: 'Bracelet diffuseur (pierre de lave)', primary: 'bracelet diffuseur huile essentielle', keywords: ['bracelet pierre de lave aromathérapie'], priority: 'moyenne', note: 'Croise l\'univers Aromathérapie' },
      { slug: 'bracelet-couple-distance', label: 'Bracelet couple / distance', primary: 'bracelet couple distance', keywords: ['bracelet couple aimant', 'bracelet distance amoureux'], priority: 'basse', note: 'Saisonnier St-Valentin' },
    ],
  },
];

/** Retourne les axes/sous-collections proposés pour une collection parente. */
export function getProposedForCollection(collectionSlug: string): ProposedAxis[] {
  return PROPOSED_SUBCOLLECTIONS.filter(a => a.collection === collectionSlug);
}

/** Nombre total de nouvelles sous-collections proposées. */
export const PROPOSED_COUNT = PROPOSED_SUBCOLLECTIONS.reduce((n, a) => n + a.subs.length, 0);
