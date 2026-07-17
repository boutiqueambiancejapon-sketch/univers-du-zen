/**
 * Mots-clés SEO FR par nœud de la taxonomie — Univers du Zen
 * ---------------------------------------------------------------------------
 * Issu de l'analyse SERP France (juillet 2026) + benchmark concurrents FR
 * (Aroma-Zone, Nature & Découvertes, France Minéraux, Maison Berger, Palais
 *  des Thés, My Jolie Candle, Pick et Boch, etc.).
 *
 * Clé (`path`) :
 *   - niveau 1 : "aromatherapie"
 *   - niveau 2 : "aromatherapie/huiles-essentielles"
 * Correspond aux slugs de `lib/collections.ts`.
 *
 * Champs :
 *   primary    : mot-clé principal FR (le plus recherché) → H1 / cible page
 *   secondary  : secondaires + longue traîne à répartir dans le contenu
 *   metaTitle  : balise <title> proposée (≤ ~60 caractères)
 *   intent     : intention de recherche dominante
 *
 * ⚠️ Ton de voix : vouvoiement, pas de jargon ("chakra", "vibrations",
 *   "rituel"), allégations bien-être encadrées ("réputée pour",
 *   "traditionnellement associée à"), jamais de mention fournisseur.
 */

export type SearchIntent = 'commercial' | 'informational' | 'gift' | 'mixed';

export interface KeywordEntry {
  primary: string;
  secondary: string[];
  metaTitle?: string;
  intent: SearchIntent;
}

export const COLLECTION_KEYWORDS: Record<string, KeywordEntry> = {
  // ═══════════════════════════════ AROMATHÉRAPIE ═══════════════════════════
  'aromatherapie': {
    primary: 'huiles essentielles',
    secondary: ['aromathérapie', 'huiles essentielles bio', 'aromathérapie bien-être', 'huiles essentielles et diffuseurs', 'boutique aromathérapie', 'huiles essentielles naturelles'],
    metaTitle: 'Aromathérapie & Huiles Essentielles Bio | Univers du Zen',
    intent: 'commercial',
  },
  'aromatherapie/huiles-essentielles': {
    primary: 'huile essentielle bio',
    secondary: ['huile essentielle bio 10ml', 'huiles essentielles pures et naturelles', 'huile essentielle 100% bio', 'acheter huile essentielle bio', 'huiles essentielles France', 'huiles essentielles HEBBD HECT'],
    intent: 'commercial',
  },
  'aromatherapie/huiles-vegetales': {
    primary: 'huile végétale bio',
    secondary: ['huile végétale pour diluer huiles essentielles', 'huile végétale visage', 'macérât huileux bio', 'huile de jojoba bio', 'huile d\'amande douce bio', 'huile d\'argan bio', 'huile végétale pression à froid'],
    intent: 'commercial',
  },
  'aromatherapie/synergies-melanges': {
    primary: 'synergie huiles essentielles',
    secondary: ['mélange huiles essentielles à diffuser', 'synergie prête à l\'emploi', 'mélange huiles essentielles sommeil', 'roll-on huiles essentielles anti-stress', 'complexe huiles essentielles respiratoire', 'sels d\'inhalation nez bouché'],
    intent: 'commercial',
  },
  'aromatherapie/huiles-massage': {
    primary: 'huile de massage bio',
    secondary: ['huile de massage relaxante bio', 'huile de massage aux huiles essentielles', 'huile de massage professionnelle', 'huile de massage corps détente', 'huile de massage musculaire', 'huile de massage neutre'],
    intent: 'commercial',
  },
  'aromatherapie/diffuseurs-brule-parfums': {
    primary: 'diffuseur huiles essentielles',
    secondary: ['diffuseur huiles essentielles ultrasonique', 'diffuseur électrique', 'diffuseur par nébulisation', 'diffuseur bois et céramique', 'brûle-parfum céramique', 'diffuseur nomade USB voiture', 'meilleur diffuseur huiles essentielles'],
    intent: 'commercial',
  },
  'aromatherapie/eaux-florales': {
    primary: 'hydrolat bio',
    secondary: ['eau florale', 'hydrolat de rose bio', 'eau florale fleur d\'oranger', 'hydrolat visage peau', 'eau florale bleuet yeux', 'hydrolat lavande', 'hydrolat camomille'],
    intent: 'commercial',
  },
  'aromatherapie/accessoires-aroma': {
    primary: 'accessoires aromathérapie',
    secondary: ['coussin lavande relaxant', 'bouillotte sèche graines', 'bougie d\'oreille', 'flacon vide huiles essentielles', 'pipette compte-gouttes', 'galet à diffusion'],
    intent: 'commercial',
  },

  // ═══════════════════════════ HUILES DE FRAGRANCE ═════════════════════════
  'huiles-fragrance': {
    primary: 'parfum d\'intérieur',
    secondary: ['parfum maison', 'parfum d\'ambiance', 'senteurs pour la maison', 'parfum d\'intérieur naturel', 'parfumer sa maison', 'diffuseur de parfum maison', 'parfum d\'intérieur longue durée'],
    metaTitle: 'Parfum d\'intérieur & senteurs maison naturels | Univers du Zen',
    intent: 'commercial',
  },
  'huiles-fragrance/huiles-parfumees': {
    primary: 'huile parfumée',
    secondary: ['concentré de parfum', 'huile parfumée pour brûle-parfum', 'concentré de parfum pour diffuseur', 'huile parfumée maison 10ml', 'huile parfumée pour pot-pourri', 'huile parfumée vrac professionnel'],
    intent: 'commercial',
  },
  'huiles-fragrance/sprays-diffuseurs-roseau': {
    primary: 'diffuseur de parfum à bâtonnets',
    secondary: ['diffuseur bâtonnets rotin', 'bouquet parfumé', 'diffuseur de parfum sans flamme', 'spray parfum d\'ambiance maison', 'brume d\'ambiance', 'recharge diffuseur parfum', 'diffuseur parfum oriental oudh'],
    intent: 'commercial',
  },
  'huiles-fragrance/fondants-granules': {
    primary: 'fondant parfumé',
    secondary: ['fondant de cire parfumée', 'wax melt', 'fondant parfumé pour brûle-parfum', 'fondant de cire naturelle soja', 'fondant parfumé longue durée', 'coffret fondants parfumés', 'granulés parfumés pour brûle-parfum'],
    intent: 'commercial',
  },
  'huiles-fragrance/accessoires-parfum': {
    primary: 'bâtonnets pour diffuseur',
    secondary: ['bâtonnets de rechange pour diffuseur', 'bâtonnets rotin 24 cm', 'bâtonnets rotin 30 cm', 'fleurs en sola parfumées', 'accessoires diffuseur de parfum', 'bâtonnets diffuseur biodégradables'],
    intent: 'commercial',
  },

  // ═══════════════════════════ ENCENS & RITUELS ════════════════════════════
  'encens-rituels': {
    primary: 'encens naturel',
    secondary: ['encens', 'bâton d\'encens', 'bâtonnet d\'encens', 'acheter encens', 'encens purification', 'encens méditation', 'encens du monde'],
    metaTitle: 'Encens naturel : bâtonnets, cônes & résines | Univers du Zen',
    intent: 'mixed',
  },
  'encens-rituels/batonnets-encens': {
    primary: 'bâton d\'encens',
    secondary: ['bâtonnet d\'encens', 'encens nag champa satya', 'encens bois de santal', 'encens indien naturel', 'encens tibétain bâtonnet', 'encens palo santo bâtonnet', 'meilleur encens naturel'],
    intent: 'commercial',
  },
  'encens-rituels/cones-encens': {
    primary: 'cône d\'encens',
    secondary: ['encens en cône', 'cône d\'encens backflow', 'cône d\'encens naturel', 'encens cône santal', 'cône d\'encens sans fumée', 'différence cône classique et backflow'],
    intent: 'commercial',
  },
  'encens-rituels/resines-poudres': {
    primary: 'résine d\'encens',
    secondary: ['encens en résine', 'encens en grains', 'encens oliban', 'encens myrrhe', 'encens benjoin', 'charbon pour encens', 'comment brûler de la résine', 'encens copal'],
    intent: 'mixed',
  },
  'encens-rituels/smudge-bois-sacres': {
    primary: 'sauge blanche à brûler',
    secondary: ['palo santo', 'fagot de purification', 'sauge blanche purification', 'palo santo bienfaits', 'fagot de sauge de Californie', 'comment brûler de la sauge', 'corde d\'encens'],
    intent: 'mixed',
  },
  'encens-rituels/porte-encens-bruleurs': {
    primary: 'porte encens',
    secondary: ['porte-encens', 'brûle encens', 'porte encens backflow cascade', 'fontaine à encens', 'porte encens tibétain laiton', 'porte encens bois', 'encensoir', 'coupelle porte encens'],
    intent: 'commercial',
  },

  // ═════════════════════════ CRISTAUX & LITHOTHÉRAPIE ══════════════════════
  'cristaux-lithotherapie': {
    primary: 'lithothérapie',
    secondary: ['pierres de lithothérapie', 'pierres naturelles', 'cristaux et minéraux', 'pierres et vertus', 'vertus des pierres', 'signification des pierres', 'pierres semi-précieuses bien-être'],
    metaTitle: 'Lithothérapie : Pierres Naturelles & Cristaux | Univers du Zen',
    intent: 'mixed',
  },
  'cristaux-lithotherapie/pierres-roulees': {
    primary: 'pierres roulées',
    secondary: ['pierres roulées lithothérapie', 'grosse pierre roulée', 'chips de pierres naturelles', 'mélange pierres roulées', 'lot de pierres roulées', 'pierre roulée améthyste'],
    intent: 'commercial',
  },
  'cristaux-lithotherapie/cristaux-bruts-geodes': {
    primary: 'géode améthyste',
    secondary: ['pierres brutes', 'géode améthyste décoration', 'amas de cristal', 'pierre brute naturelle', 'shiva lingam', 'géode de calcite', 'prix géode améthyste'],
    intent: 'commercial',
  },
  'cristaux-lithotherapie/selenite': {
    primary: 'sélénite',
    secondary: ['lampe sélénite', 'tour de sélénite', 'plaque de sélénite', 'sélénite recharge pierres', 'bâton de sélénite', 'sélénite vertus', 'comment recharger ses pierres avec la sélénite'],
    intent: 'mixed',
  },
  'cristaux-lithotherapie/pointes-spheres-figures': {
    primary: 'sphère en pierre',
    secondary: ['pointe de cristal', 'sphère améthyste', 'pointe de quartz', 'obélisque pierre', 'figurine pierre naturelle', 'boule de cristal pierre', 'sphère quartz rose'],
    intent: 'commercial',
  },
  'cristaux-lithotherapie/arbres-cristaux': {
    primary: 'arbre de vie en pierre',
    secondary: ['arbre de vie pierres naturelles', 'arbre de vie feng shui', 'arbre de vie citrine', 'arbre de vie améthyste', 'arbre porte-bonheur cristaux', 'gomati chakra'],
    intent: 'gift',
  },
  'cristaux-lithotherapie/baguettes-pendules-esoteric': {
    primary: 'outils lithothérapie',
    secondary: ['baguette de soin pierre', 'baguette de massage pierre', 'baguette cristal de roche', 'pendule de soin', 'outils de purification', 'accessoires ésotériques'],
    intent: 'commercial',
  },
  'cristaux-lithotherapie/orgonite': {
    primary: 'orgonite',
    secondary: ['pyramide orgonite', 'pyramide orgonite protection ondes', 'orgonite véritable', 'pyramide 7 chakras', 'orgonite améthyste', 'orgonite bienfaits'],
    intent: 'commercial',
  },
  'cristaux-lithotherapie/runes-divination': {
    primary: 'runes divinatoires',
    secondary: ['runes vikings', 'jeu de runes pierre', 'runes futhark', 'runes divinatoires signification', 'comment tirer les runes', 'pierre de divination'],
    intent: 'mixed',
  },
  'cristaux-lithotherapie/tarot-oracle': {
    primary: 'oracle divinatoire',
    secondary: ['jeu de tarot', 'oracle pour débutant', 'tarot divinatoire', 'jeu d\'oracle', 'cartes de guidance', 'meilleur oracle débutant', 'tarot de Marseille'],
    intent: 'gift',
  },
  'cristaux-lithotherapie/bols-chantants': {
    primary: 'bol chantant tibétain',
    secondary: ['bol tibétain 7 métaux', 'bol chantant méditation', 'coffret bol tibétain', 'tingsha cymbales tibétaines', 'gong tibétain', 'cloche tibétaine', 'bol chantant débutant'],
    intent: 'commercial',
  },

  // ═══════════════════════════ BOUGIES & LUMIÈRES ══════════════════════════
  'bougies-photophores': {
    primary: 'bougie parfumée naturelle',
    secondary: ['bougie parfumée cire végétale', 'bougie cire de soja', 'bougie naturelle fabriquée main', 'bougie parfumée maison', 'photophore et bougeoir', 'bougie parfumée sans paraffine'],
    metaTitle: 'Bougies parfumées naturelles & photophores | Univers du Zen',
    intent: 'commercial',
  },
  'bougies-photophores/bougies-soja': {
    primary: 'bougie cire de soja',
    secondary: ['bougie parfumée cire de soja', 'bougie cire de soja naturelle', 'bougie soja mèche coton', 'bougie végétale sans paraffine', 'bougie cire de soja France', 'bougie soja combustion longue'],
    intent: 'commercial',
  },
  'bougies-photophores/bougies-pilier-diner': {
    primary: 'bougie pilier',
    secondary: ['bougie chauffe-plat', 'bougie pilier décorative', 'bougie colonne', 'bougie flambeau dîner', 'bougie tapée', 'tea light naturelle', 'bougie chauffe-plat cire végétale'],
    intent: 'commercial',
  },
  'bougies-photophores/photophores-bougeoirs': {
    primary: 'photophore',
    secondary: ['bougeoir', 'photophore verre', 'photophore en bois', 'bougeoir design', 'bougeoir en pierre', 'porte-bougie', 'bougeoir vintage métal', 'lanterne bougie'],
    intent: 'commercial',
  },

  // ═══════════════════════════════ BIEN-ÊTRE CORPS ═════════════════════════
  'bien-etre-corps': {
    primary: 'soins du corps naturels',
    secondary: ['cosmétique naturelle corps', 'produits de bain naturels', 'cosmétique naturelle et bio', 'salle de bain zéro déchet', 'soins corps & bain'],
    metaTitle: 'Soins du corps & bain naturels | Univers du Zen',
    intent: 'commercial',
  },
  'bien-etre-corps/bombes-bain': {
    primary: 'bombe de bain',
    secondary: ['boule de bain effervescente', 'bombe de bain naturelle', 'bombe de bain vegan', 'bombe de bain coffret cadeau', 'bombe de bain aux fleurs', 'grosse bombe de bain'],
    intent: 'commercial',
  },
  'bien-etre-corps/sels-bains-floraux': {
    primary: 'sel de bain',
    secondary: ['sel de bain relaxant', 'sel de bain de l\'Himalaya', 'sel de bain aux fleurs séchées', 'sel d\'Epsom bain', 'bain floral', 'sel de bain aux huiles essentielles'],
    intent: 'commercial',
  },
  'bien-etre-corps/soins-corps': {
    primary: 'soin du corps naturel',
    secondary: ['crème corps hydratante naturelle', 'beurre corporel karité', 'gommage corps naturel', 'huile corps bio', 'lait corps peau sèche', 'gommage corps sucre'],
    intent: 'commercial',
  },
  'bien-etre-corps/savons-artisanaux': {
    primary: 'savon artisanal',
    secondary: ['savon saponifié à froid', 'savon surgras peau sensible', 'savon naturel bio', 'savon artisanal peau sèche', 'savon au charbon peau grasse', 'savon sur corde', 'savon exfoliant'],
    intent: 'commercial',
  },
  'bien-etre-corps/fleurs-savon': {
    primary: 'fleur de savon',
    secondary: ['bouquet de fleurs de savon', 'fleur de savon cadeau', 'bouquet fleurs de savon parfumé', 'coffret fleur de savon', 'fleur de savon Saint-Valentin', 'fleur de savon fête des mères'],
    intent: 'gift',
  },
  'bien-etre-corps/soins-visage': {
    primary: 'soin visage naturel',
    secondary: ['masque argile visage', 'sérum visage bio', 'baume à lèvres naturel', 'masque argile verte peau grasse', 'masque argile blanche peau sensible', 'tonique visage naturel'],
    intent: 'mixed',
  },
  'bien-etre-corps/soins-cheveux': {
    primary: 'shampoing solide',
    secondary: ['shampoing solide cheveux gras', 'shampoing solide cheveux secs', 'shampoing solide zéro déchet', 'shampoing solide sans sulfate', 'sérum capillaire naturel', 'après-shampoing solide'],
    intent: 'commercial',
  },
  'bien-etre-corps/accessoires-bain': {
    primary: 'accessoire de bain',
    secondary: ['éponge konjac visage', 'rouleau de massage pierre', 'loofah naturel', 'gant exfoliant naturel', 'pierre ponce pieds', 'brosse corps sèche'],
    intent: 'commercial',
  },
  'bien-etre-corps/steamers-douche': {
    primary: 'galet de douche',
    secondary: ['galet de douche aromathérapie', 'galet de douche eucalyptus', 'galet de douche effervescent', 'vapeur de douche menthe eucalyptus', 'galet de douche relaxant', 'pastille de douche huiles essentielles'],
    intent: 'commercial',
  },
  'bien-etre-corps/porte-savons': {
    primary: 'porte-savon',
    secondary: ['porte-savon bois', 'porte-savon pierre', 'porte-savon design naturel', 'porte-savon zéro déchet', 'support savon salle de bain'],
    intent: 'commercial',
  },

  // ═══════════════════════════ DÉCO & MAISON ZEN ═══════════════════════════
  'deco-maison-zen': {
    primary: 'décoration zen',
    secondary: ['déco zen maison', 'objet déco zen', 'ambiance zen intérieur', 'déco nature et zen', 'intérieur apaisant', 'boutique déco zen', 'accessoires déco zen'],
    metaTitle: 'Décoration Zen & Maison — Objets Déco Nature | Univers du Zen',
    intent: 'commercial',
  },
  'deco-maison-zen/statues-collectibles': {
    primary: 'statue bouddha',
    secondary: ['statue bouddha décoration intérieur', 'statue bouddha bois', 'statue bouddha pierre', 'tête de bouddha déco', 'figurine feng shui laiton', 'statue bouddha extérieur jardin', 'chat porte-bonheur maneki-neko'],
    intent: 'commercial',
  },
  'deco-maison-zen/attrape-reves-mobiles': {
    primary: 'attrape rêve',
    secondary: ['attrape rêve macramé', 'attrape rêve géant', 'grand attrape rêve mural', 'attrape rêve arbre de vie', 'attrape rêve plumes blanches', 'attrape rêve bohème chambre'],
    intent: 'commercial',
  },
  'deco-maison-zen/lampes-eclairages': {
    primary: 'lampe de sel',
    secondary: ['lampe sel himalaya', 'lampe de sel himalaya bienfaits', 'lampe sel de l\'himalaya véritable', 'lampe de sel naturelle', 'lampe déco bohème rotin', 'abat-jour fibres naturelles', 'veilleuse sel himalaya'],
    intent: 'mixed',
  },
  'deco-maison-zen/deco-murale': {
    primary: 'macramé mural',
    secondary: ['tenture murale', 'tenture murale macramé', 'tenture murale mandala', 'tapisserie murale bohème', 'macramé mural tête de lit', 'panneau mural pierres', 'décoration murale nature'],
    intent: 'commercial',
  },
  'deco-maison-zen/deco-interieure': {
    primary: 'fontaine d\'intérieur',
    secondary: ['fontaine zen', 'fontaine intérieur zen feng shui', 'fontaine bouddha led', 'fontaine cascade intérieure', 'vase céramique déco nature', 'tête de bouddha déco', 'objet feng shui maison'],
    intent: 'commercial',
  },
  'deco-maison-zen/textiles-coussins': {
    primary: 'coussin déco',
    secondary: ['plaid et coussin naturel', 'housse de coussin bohème', 'coussin déco lin naturel', 'plaid cocooning canapé', 'couvre-lit bohème', 'tapis kilim berbère', 'tapis jute jonc de mer', 'coussin de sol méditation'],
    intent: 'commercial',
  },
  'deco-maison-zen/jardin-exterieur': {
    primary: 'carillon à vent',
    secondary: ['déco jardin zen', 'carillon à vent extérieur', 'carillon à vent bambou', 'carillon à vent métal', 'bouddha de jardin', 'statue zen extérieur pierre', 'carillon apaisant sonore'],
    intent: 'commercial',
  },
  'deco-maison-zen/rangement-boites': {
    primary: 'boîte en bois déco',
    secondary: ['panier rangement naturel', 'boîte bois sculpté artisanale', 'coffret bois déco', 'panier osier rotin rangement', 'corbeille jonc de mer', 'boîte à bijoux bois'],
    intent: 'commercial',
  },
  'deco-maison-zen/art-table': {
    primary: 'plateau bois',
    secondary: ['art de la table naturel', 'plateau bois de manguier', 'bol bois teck', 'planche à découper bois naturel', 'mortier pilon pierre', 'set de table naturel jonc', 'dessous de plat bois'],
    intent: 'commercial',
  },
  'deco-maison-zen/papeterie-carnets': {
    primary: 'carnet artisanal',
    secondary: ['carnet cuir', 'carnet en cuir à offrir', 'carnet papier lokta népal', 'journal de gratitude', 'carnet bien-être intentions', 'carnet artisanal rechargeable', 'petit cadeau papeterie zen'],
    intent: 'gift',
  },

  // ═══════════════════════════════ THÉ & TISANES ══════════════════════════
  'the-tisanes': {
    primary: 'thé et tisane bio',
    secondary: ['thé bio en ligne', 'tisane bien-être', 'infusion bio', 'thé et infusion', 'thé naturel', 'matcha bio'],
    metaTitle: 'Thé & Tisane Bio — Infusions Bien-être | Univers du Zen',
    intent: 'commercial',
  },
  'the-tisanes/thes-artisanaux': {
    primary: 'thé bio en vrac',
    secondary: ['matcha bio poudre', 'thé vert bio en vrac', 'thé en vrac au poids', 'thé bio boîte 50g', 'thé vrac grand format 1 kg', 'acheter thé artisanal en ligne'],
    intent: 'commercial',
  },
  'the-tisanes/theieres-infuseurs': {
    primary: 'théière en verre',
    secondary: ['théière en verre avec infuseur', 'infuseur à thé inox', 'bouteille infuseur thé nomade', 'passoire à thé', 'filtre à thé', 'théière verre borosilicate', 'comment choisir sa théière'],
    intent: 'commercial',
  },

  // ══════════════════════ INSTRUMENTS & SONOTHÉRAPIE ═══════════════════════
  'instruments-sonotherapie': {
    primary: 'instruments de sonothérapie',
    secondary: ['instruments de relaxation', 'instruments de méditation', 'instruments bien-être', 'instruments de musique relaxation', 'voyage sonore', 'percussions de méditation'],
    metaTitle: 'Instruments de sonothérapie & relaxation | Univers du Zen',
    intent: 'commercial',
  },
  'instruments-sonotherapie/tambours-chamaniques': {
    primary: 'tambour chamanique',
    secondary: ['tambour chamanique peau de buffle', 'tambour chamanique artisanal', 'tambour médecine', 'tambour chamanique pour méditation', 'tambour chamanique avec mailloche', 'djembé débutant'],
    intent: 'commercial',
  },
  'instruments-sonotherapie/instruments-decoratifs': {
    primary: 'sifflet d\'oiseau',
    secondary: ['appeau oiseau', 'sifflet oiseau en terre', 'flûte oiseau à eau', 'petit instrument décoratif sonore', 'cadeau instrument nature', 'objet sonore décoratif maison'],
    intent: 'gift',
  },
  'instruments-sonotherapie/ukuleles': {
    primary: 'ukulélé',
    secondary: ['ukulélé débutant', 'ukulélé soprano débutant', 'ukulélé en bois acajou', 'ukulélé artisanal fait main', 'ukulélé facile à apprendre', 'ukulélé cadeau adulte', 'meilleur ukulélé pour commencer'],
    intent: 'commercial',
  },

  // ═══════════════════════ BIJOUX & CRISTAUX PORTÉS ═══════════════════════
  'bijoux-cristaux': {
    primary: 'bijoux en pierres naturelles',
    secondary: ['bijoux lithothérapie', 'bijoux en pierres semi-précieuses', 'bijoux pierres naturelles femme', 'bijoux cristaux', 'bijoux minéraux naturels'],
    metaTitle: 'Bijoux en Pierres Naturelles & Lithothérapie | Univers du Zen',
    intent: 'commercial',
  },
  'bijoux-cristaux/bracelets-pierres': {
    primary: 'bracelet en pierre naturelle',
    secondary: ['bracelet pierre naturelle femme', 'bracelet lithothérapie', 'bracelet en pierres semi-précieuses', 'bracelet perles naturelles 8 mm', 'bracelet 7 chakras', 'bracelet pierre de lave', 'bracelet mala tibétain', 'bracelet pierre naturelle homme'],
    intent: 'commercial',
  },
  'bijoux-cristaux/colliers-pendentifs': {
    primary: 'collier en pierre naturelle',
    secondary: ['pendentif pierre naturelle', 'collier lithothérapie', 'collier arbre de vie pierre naturelle', 'pendentif pierre brute', 'pendentif orgonite', 'pendentif sélénite', 'collier pierre turquoise'],
    intent: 'commercial',
  },
  'bijoux-cristaux/bagues-pierres': {
    primary: 'bague en pierre naturelle',
    secondary: ['bague pierre naturelle femme', 'bague lithothérapie', 'bague argent pierre naturelle', 'bague pierre semi-précieuse', 'bague pierre gemme réglable', 'bague anti-stress pierre'],
    intent: 'commercial',
  },
  'bijoux-cristaux/boucles-oreilles': {
    primary: 'boucles d\'oreilles pierre naturelle',
    secondary: ['boucles d\'oreilles pierre semi-précieuse', 'boucles d\'oreilles pierre naturelle femme', 'boucles d\'oreilles minérales', 'puces pierre naturelle', 'boucles d\'oreilles naturelles bohème'],
    intent: 'commercial',
  },
  'bijoux-cristaux/sets-bijoux': {
    primary: 'parure bijoux pierre naturelle',
    secondary: ['coffret bijoux pierre naturelle', 'set bracelet collier pierre naturelle', 'parure lithothérapie', 'bijoux fleurs pressées', 'bijoux argent 925 pierre', 'bijoux plaqué or pierre naturelle', 'médaillon pierre'],
    intent: 'gift',
  },
};

/** Retourne les mots-clés d'un nœud par son chemin (ex: "aromatherapie/huiles-essentielles"). */
export function getKeywords(path: string): KeywordEntry | undefined {
  return COLLECTION_KEYWORDS[path];
}

/** Chaîne `keywords` prête pour la balise meta (primary + secondary), ou undefined. */
export function getMetaKeywords(path: string): string | undefined {
  const entry = COLLECTION_KEYWORDS[path];
  if (!entry) return undefined;
  return [entry.primary, ...entry.secondary].join(', ');
}
