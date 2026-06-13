/**
 * Taxonomie complète Univers du Zen — 3 niveaux
 * Basée sur l'analyse des 6 500 produits CSV (Department → Subdepartment → Family)
 *
 * Collection (slug UDZ) → SubCollection (sous-rayon) → SubSubCollection (famille produit)
 *
 * csvDepartment  : valeur exacte de la colonne "Department" dans le CSV
 * dbDepartment   : valeur stockée dans supplier_catalog.department (French, via UDZ_DEPTS mapping)
 * csvSubdepartment: valeur exacte de la colonne "Subdepartment" dans le CSV
 * csvFamilies    : valeurs exactes de la colonne "Family" dans le CSV
 */

export interface SubSubCollection {
  slug: string;
  label: string;
  csvFamilies?: string[];
}

export interface SubCollection {
  slug: string;
  label: string;
  csvSubdepartment?: string;
  subs?: SubSubCollection[];
}

export interface Collection {
  slug: string;
  label: string;
  description: string;
  csvDepartment: string;
  dbDepartment: string;
  subs: SubCollection[];
}

export const COLLECTIONS: Collection[] = [
  {
    slug: 'aromatherapie',
    label: 'Aromathérapie',
    description: "Huiles essentielles pures, huiles végétales, synergies et diffuseurs pour une pratique aromathérapeutique complète à la maison.",
    csvDepartment: 'Aromatherapy',
    dbDepartment: 'Aromathérapie',
    subs: [
      {
        slug: 'huiles-essentielles',
        label: 'Huiles essentielles pures',
        csvSubdepartment: 'Essential Oils',
        subs: [
          { slug: 'he-10ml',    label: 'Flacons 10ml',               csvFamilies: ['Aromatherapy Essential Oils - 10ml'] },
          { slug: 'he-bio',     label: 'Biologiques & naturelles',    csvFamilies: ['Organic Essential Oils', 'Bulk Organic Essential Oils', '50ml Organic Essential Oils for Professionals', 'Professional 50ml Essential Oil'] },
          { slug: 'he-coffrets',label: 'Coffrets & starter packs',   csvFamilies: ['Aromatherapy Essential Oil Set - Starter Pack'] },
        ],
      },
      {
        slug: 'huiles-vegetales',
        label: 'Huiles végétales de base',
        csvSubdepartment: 'Carrier Oils',
        subs: [
          { slug: 'hv-50ml',  label: 'Flacons 50ml ambrés',    csvFamilies: ['Base Oils - 50ml Amber Bottle', 'Base Oils'] },
          { slug: 'hv-100ml', label: 'Bio 100ml',               csvFamilies: ['Organic Base Oils - 100ml'] },
          { slug: 'hv-1l',    label: 'Professionnel 1 litre',   csvFamilies: ['Base Oils - 1 Litre', 'Bulk Organic Carrier Oils'] },
        ],
      },
      {
        slug: 'synergies-melanges',
        label: 'Synergies & mélanges',
        csvSubdepartment: 'Essential Oil Blends',
        subs: [
          { slug: 'synergies-premium',  label: 'Synergies premium',        csvFamilies: ['Premium Essential Oil Blends', 'Agnes + Cat Essential Oil Blends'] },
          { slug: 'roll-on-aroma',      label: 'Roll-ons aromathérapie',   csvFamilies: ['Roll-On Essential Oil Blends', 'Agnes + Cat Essential Oil Roll-On Blends', 'Hop Hare Essential Oil Gemstone Roll-Ons 10ML'] },
          { slug: 'eaux-rituelles',     label: 'Eaux rituelles',           csvFamilies: ['Ancient Witch Ritual Waters'] },
          { slug: 'sels-inhalation',    label: 'Sels d\'inhalation',       csvFamilies: ['Aromatherapy Smelling Salts'] },
        ],
      },
      {
        slug: 'huiles-massage',
        label: 'Huiles de massage',
        csvSubdepartment: 'Massage Oils',
        subs: [
          { slug: 'massage-50ml',  label: 'Massage & bain 50ml',   csvFamilies: ['Massage and Bath Oils - 50ml'] },
          { slug: 'massage-100ml', label: 'Massage & bain 100ml',  csvFamilies: ['Massage & Bath Oils - 100ml'] },
          { slug: 'massage-1kg',   label: 'Professionnel 1kg',     csvFamilies: ['Massage and Bath Oils 1KG'] },
        ],
      },
      {
        slug: 'diffuseurs-brule-parfums',
        label: 'Diffuseurs & brûle-parfums',
        csvSubdepartment: 'Aroma Lamps & Diffusers',
        subs: [
          { slug: 'diffuseurs-electriques',  label: 'Diffuseurs électriques',    csvFamilies: ['Aroma Diffusers', 'Aromatherapy Car Diffuser Kit'] },
          { slug: 'brule-ceramique',         label: 'Brûle-parfums céramique',   csvFamilies: ['Ceramic Zen Oil Burners', 'Classic White Oil Burners', 'Various Shaped Ceramic Oil Burners', 'Cool Designs Oil Burners', 'Floral & Cauldron Oil Burners'] },
          { slug: 'brule-bouddha',           label: 'Bouddha & zen',             csvFamilies: ['Classic Buddha Oil Burner', 'Home Oil Burner'] },
          { slug: 'brule-bois',              label: 'Bois de manguier',          csvFamilies: ['Mango Wood Oil Burners', 'Sandstone Oil Burner', 'Soapstone Oil Burners'] },
          { slug: 'brule-yin-yang',          label: 'Yin-Yang & Tree of Life',   csvFamilies: ['Yin-Yang Oil Burners', 'Tree of Life Oil Burners', 'Oil Burners Mixed Designs'] },
        ],
      },
      {
        slug: 'eaux-florales',
        label: 'Eaux florales & hydrolats',
        csvSubdepartment: 'Botanicals & Floral Waters',
        subs: [
          { slug: 'hydrolats',   label: 'Hydrolats purs', csvFamilies: ['Hydrolat Floral Waters', 'Pure Floral'] },
        ],
      },
      {
        slug: 'accessoires-aroma',
        label: 'Accessoires & bien-être',
        csvSubdepartment: 'Massagers & Ritual Items',
        subs: [
          { slug: 'oreillers-relaxation', label: 'Oreillers & sacs lavande',  csvFamilies: ['Agnes + Cat Eye Pillows', 'Lavender Wheat Bags', 'Eye Pillow With Gift Box'] },
          { slug: 'bougies-oreille',      label: 'Bougies d\'oreille',        csvFamilies: ['Ear Candles'] },
          { slug: 'masseurs',             label: 'Masseurs',                  csvFamilies: ['Massagers'] },
        ],
      },
    ],
  },
  {
    slug: 'huiles-fragrance',
    label: 'Huiles de Fragrance',
    description: "Huiles parfumées haute concentration pour diffuseur, brûle-parfum et créations DIY. Sans alcool, longue tenue, pour tous les usages.",
    csvDepartment: 'Fragrance',
    dbDepartment: 'Huiles de fragrance',
    subs: [
      {
        slug: 'huiles-parfumees',
        label: 'Huiles parfumées pures',
        csvSubdepartment: 'Fragrance Oils',
        subs: [
          { slug: 'huiles-10ml',     label: 'Flacons 10ml',              csvFamilies: ['Ancient Wisdom Fragrance Oils', 'Banjara Indian Fragrance Oils', 'Plant Based Fragrance Oils'] },
          { slug: 'huiles-zodiac',   label: 'Collection zodiac',         csvFamilies: ['Zodiac Fragrance Oils'] },
          { slug: 'huiles-noel',     label: 'Édition Noël',              csvFamilies: ['Christmas Fragrance Oils Sets'] },
          { slug: 'huiles-vrac',     label: 'Vrac professionnel 250–500g',csvFamilies: ['Pure Fragrance Oils 250g', 'Pure Fragrance Oils - 500g NO dilution'] },
        ],
      },
      {
        slug: 'sprays-diffuseurs-roseau',
        label: 'Sprays d\'ambiance & diffuseurs roseau',
        csvSubdepartment: 'Room Sprays & Reed Diffusers',
        subs: [
          { slug: 'sprays-100ml',     label: 'Sprays 100ml',             csvFamilies: ['Premium Room Sprays - 100ml', 'Home Fresh Room Sprays', 'Essential Oil Mists - 100ml', 'Summer Room Sprays'] },
          { slug: 'diffuseurs-120ml', label: 'Diffuseurs roseau 120ml',  csvFamilies: ['Reed Diffusers Home Fragrance Reed Diffusers - 120ml', 'Pure Essential Oils Reed Diffusers', 'Agnes + Cat Reed Diffuser Refills'] },
          { slug: 'sprays-oud',       label: 'Collection Oudh & Orient', csvFamilies: ['The Experience Oudh Room Sprays'] },
          { slug: 'sprays-noel',      label: 'Noël & hiver',             csvFamilies: ['Christmas Room & Pillow Sprays'] },
        ],
      },
      {
        slug: 'fondants-granules',
        label: 'Fondants & granules parfumés',
        csvSubdepartment: 'Soy Wax Melts & Simmering Granules',
        subs: [
          { slug: 'fondants-cire',    label: 'Fondants de cire',          csvFamilies: ['Aroma Wax Melts', 'Soy Wax Melts in Jars', 'Melt Eaze Crystal Wax Melts', 'Agnes + Cat Soy Wax Melts'] },
          { slug: 'granules-bruleur', label: 'Granules pour brûle-parfum',csvFamilies: ['Home Comforts Scented Salt Granules for Oil Burners', 'Tropical Paradise Simmering Granules'] },
          { slug: 'fondants-coffrets',label: 'Coffrets fondants',         csvFamilies: ['Luxury Wax Melts in Gift Boxes'] },
        ],
      },
      {
        slug: 'accessoires-parfum',
        label: 'Accessoires parfum maison',
        csvSubdepartment: 'Home Fragrance Accessories',
        subs: [
          { slug: 'reeds-fleurs', label: 'Reeds & fleurs décoratives', csvFamilies: ['Bulk Reed Diffuser Reeds', 'Natural Diffuser Flowers'] },
        ],
      },
    ],
  },
  {
    slug: 'encens-rituels',
    label: 'Encens & Rituels',
    description: "Bâtonnets, cônes, résines et smudge pour purifier votre espace. Marques premium Satya, Stamford, Banjara, Golden Nag et bien d'autres.",
    csvDepartment: 'Incense and Burners',
    dbDepartment: 'Encens & Rituel',
    subs: [
      {
        slug: 'batonnets-encens',
        label: 'Bâtonnets d\'encens',
        csvSubdepartment: 'Incense Sticks',
        subs: [
          { slug: 'nag-champa',         label: 'Nag Champa & classiques indiens',csvFamilies: ['Nag Champa Incense', 'Vedic Masala Incense Sticks', 'Mandala Namaste Masala Incense', 'Indian Bulk Incense (approx 450 sticks)', 'Plant Based Masala Incense Sticks', 'Botanical Natural Masala Incense Sticks'] },
          { slug: 'satya',              label: 'Satya Premium',                  csvFamilies: ['Satya Incense Sticks'] },
          { slug: 'stamford',           label: 'Stamford',                       csvFamilies: ['Stamford Black Incense Sticks', 'Stamford Premium Hex', 'Stamford Plant Based Incense Sticks', 'Stamford Angel Incense Sticks', 'Stamford Incense Gift Set'] },
          { slug: 'golden-palo-santo',  label: 'Golden Nag & Palo Santo',        csvFamilies: ['Golden Nag', 'Golden Palo Santo Incense Sticks', 'Premium Noor Oud Incense', 'Indus Treasures Incense Sticks'] },
          { slug: 'encens-tibetains',   label: 'Encens tibétains',               csvFamilies: ['Premium Tibetan Incense Sticks', 'Tales of India Incense'] },
          { slug: 'encens-zodiac',      label: 'Zodiac & cristaux',              csvFamilies: ['Zodiac Crystal Scents Incense', 'Crystal Scents Smudge Incense', 'Aromatika Premium Incense'] },
          { slug: 'encens-rituels-sorts',label: 'Rituels & magie',               csvFamilies: ['Ancient Witch Spell Incense', 'Banjara Buddha Incense', 'Banjara Tribal Smudge Incense Sticks'] },
        ],
      },
      {
        slug: 'cones-encens',
        label: 'Cônes d\'encens',
        csvSubdepartment: 'Incense Cones',
        subs: [
          { slug: 'cones-backflow', label: 'Cônes backflow',         csvFamilies: ['Aromatika Backflow Incense Cones', 'Biofresh Backflow Incense Cones', 'Jumbo Golden Nag - Backflow Incense Cones', 'Tribal Soul Premium Backflow Incense Cones', 'Masala Backflow Incense Pack of 10', 'Stamford Premium Plant Based Backflow Incense Cones', 'Back Flow Incense Cones 500g'] },
          { slug: 'cones-premium',  label: 'Cônes premium & plantes',csvFamilies: ['Stamford Premium Incense Cones', 'Plant Based Incense Cones - Californian White Sage', 'Indian Bulk Incense Cones'] },
        ],
      },
      {
        slug: 'resines-poudres',
        label: 'Résines & poudres sacrées',
        csvSubdepartment: 'Resins & Powders',
        subs: [
          { slug: 'resines-naturelles', label: 'Résines naturelles',  csvFamilies: ['Banjara Tree Resin Incense', 'Tree Resin', 'Bulk Aromatic Resin', 'Natural Incense Resin Bricks Set'] },
          { slug: 'poudres-encens',     label: 'Poudres d\'encens',   csvFamilies: ['Healing Incense Powder', 'Incense Resin 50g Tubs'] },
          { slug: 'coupes-resine',      label: 'Coupes à résine',      csvFamilies: ['Banjara Resin Cups', 'Resin Cups'] },
        ],
      },
      {
        slug: 'smudge-bois-sacres',
        label: 'Smudge & bois sacrés',
        csvSubdepartment: 'Incense Smudge Sticks',
        subs: [
          { slug: 'sauge-smudge',    label: 'Sauge & fagots de purification', csvFamilies: ['Banjara Smudge Sticks', 'Smudge Sticks', 'Smudge Sticks - individually wrapped', 'Earth Inspired Smudge Incense Sticks', 'Ishom Smudge Incense', 'Soul Spiritual Tribal Incense Sticks & Ceramic Holder'] },
          { slug: 'palo-santo',      label: 'Palo Santo',                     csvFamilies: ['Banjara Palo Santo Smudge Sticks', 'Palo Santo Large Incense Sticks', 'Green Tree Palo Santo'] },
          { slug: 'cordes-encens',   label: 'Cordes d\'encens',               csvFamilies: ['Pure Herbs Incense Ropes', 'Rope Incense Sets with Holders'] },
          { slug: 'resines-baton',   label: 'Résines sur bâton',              csvFamilies: ['Ritual Resins on Stick', 'Golden Smudging Resin Sticks'] },
          { slug: 'perles-smudge',   label: 'Perles de smudge',               csvFamilies: ['Banjara Smudge Beads'] },
        ],
      },
      {
        slug: 'porte-encens-bruleurs',
        label: 'Porte-encens & brûleurs',
        csvSubdepartment: 'Holders & Burners',
        subs: [
          { slug: 'porte-bois-sculpte', label: 'Bois sculpté & tibétain',  csvFamilies: ['Wooden Carved Incense Burners', 'Antique Tibetan Incense Holders', 'Tibetan Decor Incense Holders', 'White Washed Incense Holders'] },
          { slug: 'bruleurs-backflow',  label: 'Brûleurs backflow',         csvFamilies: ['Backflow Incense Burners', 'Mango Wood Backflow Burner'] },
          { slug: 'bols-chaudrons',     label: 'Bols rituels & chaudrons',  csvFamilies: ['Ritual Bowls and Cauldrons', 'Wooden Smudge and Ritual Offering Bowls', 'Enamel Incense Bowls Collection', 'Chakra Charcoal Incense Jar'] },
          { slug: 'porte-pierre',       label: 'Pierre & soapstone',        csvFamilies: ['Stone Incense Burners', 'Soapstone Incense Holder', 'Ceramic Palo Santo Stick & Smudge Holder', 'Healing Incense Plate'] },
          { slug: 'porte-laiton',       label: 'Laiton traditionnel',       csvFamilies: ['Traditional Brass Incense Burners', 'Brass Resin Incense Warmers', 'Palo Santo Heaters', 'Handcrafted Aluminium Incense Holders'] },
        ],
      },
    ],
  },
  {
    slug: 'cristaux-lithotherapie',
    label: 'Cristaux & Lithothérapie',
    description: "Pierres roulées, cristaux bruts, pointes, arbres de gemmes, bols chantants et accessoires ésotériques pour votre pratique de la lithothérapie.",
    csvDepartment: 'Crystals & Esoterics',
    dbDepartment: 'Cristaux & Pierres',
    subs: [
      {
        slug: 'pierres-roulees',
        label: 'Pierres roulées & chips',
        csvSubdepartment: 'Tumbled Stones & Chip Stones',
        subs: [
          { slug: 'roulees-grandes',  label: 'Grandes pierres africaines', csvFamilies: ['Large African Tumble Stones', 'Medium African Tumble Stones'] },
          { slug: 'roulees-petites',  label: 'Petites pierres roulées',    csvFamilies: ['Small African Tumble Stones', 'Large Tumble Stones'] },
          { slug: 'melange-gemmes',   label: 'Mélanges & assortiments',    csvFamilies: ['Mixed Gemstones'] },
        ],
      },
      {
        slug: 'cristaux-bruts-geodes',
        label: 'Cristaux bruts & géodes',
        csvSubdepartment: 'Raw Crystals, Selenite & Geodes',
        subs: [
          { slug: 'cristaux-bruts',   label: 'Cristaux bruts',                 csvFamilies: ['Raw Crystals', 'Rare Mineral Specimens', 'Guohua Picture Stones', 'Madagascar Labradorite Stones'] },
          { slug: 'geodes-calcite',   label: 'Géodes calcite',                 csvFamilies: ['Calcite Geodes', 'Coloured Calcite Geodes'] },
          { slug: 'shiva-lingam',     label: 'Shiva lingam',                   csvFamilies: ['Shiva Lingam Stones'] },
          { slug: 'lampes-cristaux',  label: 'Lampes cristaux enchantées',     csvFamilies: ['Gemstone Enchantment Lights'] },
        ],
      },
      {
        slug: 'selenite',
        label: 'Sélénitee & lumière blanche',
        csvSubdepartment: 'Raw Crystals, Selenite & Geodes',
        subs: [
          { slug: 'lampes-selenite',       label: 'Lampes tours sélénitee',      csvFamilies: ['Natural Selenite Tower Lamps', 'Selenite Block Lamp'] },
          { slug: 'bols-plaques-selenite', label: 'Bols, plaques & photophores', csvFamilies: ['Selenite Bowls', 'Selenite plates', 'Selenite Candle Holders'] },
          { slug: 'tours-couteaux',        label: 'Tours & couteaux cérémoniels',csvFamilies: ['Selenite Towers', 'Selenite Ceremonial Knives'] },
        ],
      },
      {
        slug: 'pointes-spheres-figures',
        label: 'Pointes, sphères & figures',
        csvSubdepartment: 'Crystal Points, Spheres & Figures',
        subs: [
          { slug: 'pointes-obelisques', label: 'Pointes & obélisques',         csvFamilies: ['Gemstone Points', 'Gemstone Obelisk Points'] },
          { slug: 'spheres-boules',     label: 'Sphères de guérison',          csvFamilies: ['Gemstone Faceted Healing Balls & Stand'] },
          { slug: 'figurines-pierre',   label: 'Figurines en pierre',          csvFamilies: ['Gemstone Figures', 'Gemstone Planets on a Goldstone Stand', 'Four Gemstone Shapes Sets'] },
        ],
      },
      {
        slug: 'arbres-cristaux',
        label: 'Arbres de cristaux',
        csvSubdepartment: 'Gemstone Trees',
        subs: [
          { slug: 'arbres-voeux',    label: 'Arbres de vœux',        csvFamilies: ['Gemstone Wishing Trees', 'Indian Gemstone Trees'] },
          { slug: 'arbres-orgonite', label: 'Base orgonite',         csvFamilies: ['Gemstone Trees With Orgonite Base'] },
          { slug: 'arbres-mini',     label: 'Mini arbres & jardins', csvFamilies: ['Mini Gemstone Trees', 'Gemstone Tree Gardens'] },
          { slug: 'arbres-gomati',   label: 'Gomati chakra',         csvFamilies: ['Gomati Chakra Stone Trees'] },
        ],
      },
      {
        slug: 'baguettes-pendules-esoteric',
        label: 'Baguettes & outils ésotériques',
        csvSubdepartment: 'Healing Wands & Esoteric Accessories',
        subs: [
          { slug: 'baguettes-guerison', label: 'Baguettes de guérison',  csvFamilies: ['Crystal Healing Wands', 'Gemstone Shiva Lingam Magic Wands', 'Selenite Wands'] },
          { slug: 'pendules-gemmes',    label: 'Pendules en gemme',       csvFamilies: ['Gemstone Magic Pendulums', 'Special Gemstone Pendulums', 'Sphere Pendulums'] },
          { slug: 'outils-rituel',      label: 'Outils rituels & autels', csvFamilies: ['Esoteric Altar Cloth', 'Gemstone Witch Spoon Sets', 'Natural Riverstone Grounding Pot', 'Ancient Witch Pendulum Divination Clothes'] },
        ],
      },
      {
        slug: 'orgonite',
        label: 'Orgonite & pyramides',
        csvSubdepartment: 'Orgonite Power Items',
        subs: [
          { slug: 'pyramides-orgonite',       label: 'Pyramides orgonite',       csvFamilies: ['Orgonite Ojbects and Pyramids', 'Orgonite Desk Power Packs'] },
          { slug: 'pendules-chakra-orgonite', label: 'Pendules chakra orgonite', csvFamilies: ['Orgonite Power Chakra Pendulums'] },
          { slug: 'porte-cles-orgonite',      label: 'Porte-clés orgonite',      csvFamilies: ['Orgonite Power Keyrings'] },
        ],
      },
      {
        slug: 'runes-divination',
        label: 'Runes & divination',
        csvSubdepartment: 'Rune Sets & Pendulums',
        subs: [
          { slug: 'sets-runes',    label: 'Sets de runes',    csvFamilies: ['Indian Rune Sets in Pouches', 'Esoteric Pouch Sets'] },
          { slug: 'rouleaux-gemme',label: 'Rouleaux & billes',csvFamilies: ['Gemstone Roller Bottles and Balls'] },
        ],
      },
      {
        slug: 'tarot-oracle',
        label: 'Tarot & cartes oracle',
        csvSubdepartment: 'Tarot, Oracle & Playing Cards',
        subs: [
          { slug: 'jeux-tarot',     label: 'Jeux de tarot',           csvFamilies: ['Tarot Cards & Reading Cloths', 'Tarot Card Storage & Reading Boxes'] },
          { slug: 'cartes-oracle',  label: 'Cartes oracle',           csvFamilies: ['Oracle Cards', 'Playing & Oracle Cards'] },
        ],
      },
      {
        slug: 'bols-chantants',
        label: 'Bols chantants tibétains',
        csvSubdepartment: 'Tibetan Singing Bowls and Tingsha Bells',
        subs: [
          { slug: 'bols-chantants-sets', label: 'Bols chantants & coffrets',    csvFamilies: ['Tibetan Singing Bowls', 'Tibetan Singing Bowl Sets'] },
          { slug: 'tingsha-cloches',     label: 'Tingsha & cloches tibétaines', csvFamilies: ['Tibetan Bells and Tingsha Bells', 'Altar Brass Bells'] },
          { slug: 'gong-guerison',       label: 'Gong de guérison',             csvFamilies: ['Handmade Healing Gong'] },
          { slug: 'accessoires-bols',    label: 'Accessoires pour bols',        csvFamilies: ['Accessories for Singing Bowls & Gongs'] },
        ],
      },
    ],
  },
  {
    slug: 'bougies-photophores',
    label: 'Bougies & Lumières',
    description: "Bougies en cire de soja naturelle, bougies pilier, chauffe-plats et photophores artisanaux pour une ambiance apaisante.",
    csvDepartment: 'Candles & Holders',
    dbDepartment: 'Bougies & Photophores',
    subs: [
      {
        slug: 'bougies-soja',
        label: 'Bougies cire de soja',
        csvSubdepartment: 'Soy Wax Candles',
        subs: [
          { slug: 'soja-aromatherapie', label: 'Aromathérapie',          csvFamilies: ['Aromatherapy Soy Wax Candles - 200g', 'Agnes + Cat Aromatherapy Candles', 'Agnes + Cat Soy Wax Votive Candles 200g'] },
          { slug: 'soja-botaniques',    label: 'Botaniques & naturelles', csvFamilies: ['Agnes + Cat Botanical Soy Wax Candles', '3xBotanical Wooden Wick Soy Candle', 'Concrete Wooden Wick Candles'] },
          { slug: 'soja-rituelles',     label: 'Rituelles & sortilèges', csvFamilies: ['Ancient Witch Ritual Candles', 'Magic Spell Candles', 'Greenman Rituals Woodwick Soy Candles', 'Magic Candles for Manifestation'] },
          { slug: 'soja-zodiac',        label: 'Collection zodiac',      csvFamilies: ['Zodiac Crystal Candles with Gemstone Bracelet'] },
          { slug: 'soja-chakra',        label: 'Chakra & cristaux',      csvFamilies: ['Chakra Crystal Candle - Root Chakra', 'Hop Hare Crystal Magic Flower Candles'] },
          { slug: 'soja-pots-coffrets', label: 'Pots & coffrets',        csvFamilies: ['Soy Wax Candle Pots', 'Soy Wax Jar Candle', 'Agnes + Cat Soy Wax Kilner Jar Candles 400ml', 'Art Tin Candles'] },
        ],
      },
      {
        slug: 'bougies-pilier-diner',
        label: 'Pilier, dîner & chauffe-plats',
        csvSubdepartment: 'Dinner Candles, Pillar Candles & Tea Lights',
        subs: [
          { slug: 'pilier',               label: 'Bougies pilier',            csvFamilies: ['Pillar Candle', 'Church Candles', 'Pure Olive Wax Candles'] },
          { slug: 'diner-taper',          label: 'Dîner & tapées',            csvFamilies: ['Dinner Candles', 'Taper Candles', 'Natural Wax Dinner Candle'] },
          { slug: 'chauffe-plats-lights', label: 'Chauffe-plats & tea lights',csvFamilies: ['Tea Lights', 'Bulk Tea Lights', 'Set of 6 Scented Tealights', 'Floating Candles'] },
        ],
      },
      {
        slug: 'photophores-bougeoirs',
        label: 'Photophores & bougeoirs',
        csvSubdepartment: 'Candle Holders',
        subs: [
          { slug: 'photophores-verre',   label: 'Verre & naturel',       csvFamilies: ['Glass Candle Holders & Jar Sets', 'Natural Floral Glass Candle Holders'] },
          { slug: 'bougeoirs-bois',      label: 'Bois artisanal',         csvFamilies: ['Wooden Candle Holders', 'Petrified Wood Candle Holders'] },
          { slug: 'bougeoirs-pierre',    label: 'Pierre & rivière',       csvFamilies: ['Riverside Stone Candle Holders'] },
          { slug: 'bougeoirs-vintage',   label: 'Vintage & métal forgé',  csvFamilies: ['Vintage Candle Stands', 'Centerpiece Iron Votive Candle Holders'] },
        ],
      },
    ],
  },
  {
    slug: 'bien-etre-corps',
    label: 'Bien-être Corps',
    description: "Bombes de bain, savons artisanaux, sels himalayens, soins visage et accessoires bain naturels pour une routine bien-être consciente.",
    csvDepartment: 'Bath & Body',
    dbDepartment: 'Bien-être Corps',
    subs: [
      {
        slug: 'bombes-bain',
        label: 'Bombes de bain',
        csvSubdepartment: 'Bath Bombs',
        subs: [
          { slug: 'bombes-gemmes',   label: 'Aux pierres gemmes',    csvFamilies: ['Gemstone Bath Bombs', 'Gemstone Bath Bombs - 180g', 'Elemental Crystal Bath Bombs', 'Gemstone Bracelet Bath Bomb'] },
          { slug: 'bombes-aroma',    label: 'Aromathérapie',         csvFamilies: ['Essential Oils Bath Bombs', 'Aromatherapy Bath Potion Bath Bombs'] },
          { slug: 'bombes-chakra',   label: 'Chakra & zodiac',       csvFamilies: ['Chakra Bath Fizzers Sets', 'Zodiac Bath Fizzers with Horoscope'] },
          { slug: 'bombes-coffrets', label: 'Coffrets cadeaux',      csvFamilies: ['Heart Bath Bomb Gift Sets', 'Agnes + Cat Bath Fizzers', 'Christmas Bath Bomb Gift Pack', 'Magnificent Floral Fizzes'] },
          { slug: 'bombes-formes',   label: 'Formes & fun',          csvFamilies: ['Shaped Bath Bombs for Kids', 'Donut Bath Fizzers', 'Love Heart Bath Bomb 70 g', 'Cocktail Bath Bombs'] },
        ],
      },
      {
        slug: 'sels-bains-floraux',
        label: 'Sels de bain & bains floraux',
        csvSubdepartment: 'Bath Salts & Floral Soak',
        subs: [
          { slug: 'sel-himalaya',  label: 'Sel de l\'Himalaya',    csvFamilies: ['Himalayan Bath Salt', 'Himalayan Bath Salt Blends - 500g'] },
          { slug: 'bains-floraux', label: 'Bains floraux',          csvFamilies: ['Floral Bath Soak & Facial Steam Blend', 'Bath Salts in Vials - Gift Pack of 7'] },
          { slug: 'rituels-bain',  label: 'Potions rituelles',      csvFamilies: ['Ancient Witch Bath Spell Potions', 'Greenman Rituals Bath Salts', 'Aromatherapy Bath Potion 350g'] },
        ],
      },
      {
        slug: 'soins-corps',
        label: 'Soins du corps',
        csvSubdepartment: 'Body Care',
        subs: [
          { slug: 'cremes-lotions',  label: 'Crèmes & lotions',      csvFamilies: ['Aromatherapy Hand & Body Lotion', 'Fragranced Hand & Body Lotions', 'Agnes + Cat Hand and Body Creams'] },
          { slug: 'beurres-corpo',   label: 'Beurres corporels',     csvFamilies: ['Aromatherapy Shea Body Butter 90g', 'Pure Body Butter 90 g', 'Shea Body Butter - 180g', 'Scented Shea Body Butter - 90g'] },
          { slug: 'gommages',        label: 'Gommages & scrubs',     csvFamilies: ['Fragranced Sugar Body Scrub'] },
          { slug: 'huiles-corps',    label: 'Huiles corps bio',      csvFamilies: ['Organic Body Oils 50ml'] },
        ],
      },
      {
        slug: 'savons-artisanaux',
        label: 'Savons artisanaux',
        csvSubdepartment: 'Whipped Soaps & Bars',
        subs: [
          { slug: 'savons-tranches',         label: 'Tranches artisanales',  csvFamilies: ['Natural Loofah Soap Loaves and Slices', 'Aromatherapy Soap Loaves 1.3 kg and Slices', 'Artisan Olive Oil Soaps 1.25kg and Slices 110g', 'Double Butter Luxury Soap 1kg Loaves and 100g Slices', 'Tropical Paradise Soap Loaves 1.3kg and Slices'] },
          { slug: 'savons-corde',            label: 'Savons sur corde',      csvFamilies: ['Soap on a Rope', 'Greenman Soaps'] },
          { slug: 'savons-argile-cristaux',  label: 'Argile & cristaux',     csvFamilies: ['Natural Clay Soaps', 'Crystal Element Soaps', 'Charcoal Soap Bar - 85g'] },
          { slug: 'savons-massage',          label: 'Savons de massage',     csvFamilies: ['Massage Soaps', 'Boxed Single Massage Soaps'] },
        ],
      },
      {
        slug: 'fleurs-savon',
        label: 'Fleurs de savon',
        csvSubdepartment: 'Soap Flowers & Bouquets',
        subs: [
          { slug: 'bouquets-savon', label: 'Bouquets & compositions',  csvFamilies: ['Gift Soap Flower Bouquet', 'Soap Flower Bouquets', 'Petite Soap Flower Bouquets', 'Luxury Soap Flowers'] },
          { slug: 'coffrets-savon', label: 'Coffrets cadeaux',         csvFamilies: ['Soap Flowers Gift Boxes', 'Ready to Retail Soap Flowers', 'Craft Soap Flowers (10pcs)'] },
        ],
      },
      {
        slug: 'soins-visage',
        label: 'Soins visage naturels',
        csvSubdepartment: 'Facial Care',
        subs: [
          { slug: 'masques-argile', label: 'Masques à l\'argile',     csvFamilies: ['Agnes + Cat Clay Face Masks', 'Clay Face Mask Powders'] },
          { slug: 'serums-visage',  label: 'Sérums & toniques',       csvFamilies: ['Facial Serum - 30ml', 'Facial Toner Mist'] },
          { slug: 'baumes-levres',  label: 'Baumes à lèvres',         csvFamilies: ['Agnes + Cat Natural Lip Balms 12g'] },
          { slug: 'huiles-barbe',   label: 'Huiles barbe naturelles', csvFamilies: ['Pure and Natural Beard Oils', 'Pure and Natural Beard Oils - 1 Litre'] },
        ],
      },
      {
        slug: 'soins-cheveux',
        label: 'Soins cheveux naturels',
        csvSubdepartment: 'Hair Care',
        subs: [
          { slug: 'shampoings-solides', label: 'Shampoings solides',     csvFamilies: ['Solid Shampoos and Conditioners', 'Agnes + Cat Solid Shampoos', 'Wild Hare Solid Shampoo - 60g'] },
          { slug: 'serums-capillaires', label: 'Sérums capillaires bio', csvFamilies: ['Organic Hair Serums 30ml- 6 Unique Formulas'] },
        ],
      },
      {
        slug: 'accessoires-bain',
        label: 'Accessoires bain & spa',
        csvSubdepartment: 'Facial & Bath Accessories',
        subs: [
          { slug: 'rouleaux-pierre',    label: 'Rouleaux en pierre gemme',    csvFamilies: ['Gemstone Face Roller'] },
          { slug: 'eponges-konjac',     label: 'Éponges konjac naturelles',   csvFamilies: ['Natural Japan Style Konjac Sponges', 'Teardrop Konjac Sponge'] },
          { slug: 'pierres-volcaniques',label: 'Pierres & loofahs naturels',  csvFamilies: ['Volcanic Lava Foot Stones', 'Natural Loofah Body Scrubs', 'Luxury Scrubs & Sponges', 'Sisal Sponges and Scrubs'] },
        ],
      },
      {
        slug: 'steamers-douche',
        label: 'Steamers & rituels douche',
        csvSubdepartment: 'Shower Steamers',
        subs: [
          { slug: 'steamers', label: 'Steamers aromathérapie', csvFamilies: ['Aromatherapy Shower Steamers', 'Zen Shower Steamers Wellness Gift Set'] },
        ],
      },
      {
        slug: 'porte-savons',
        label: 'Porte-savons & accessoires',
        csvSubdepartment: 'Soap Dishes & Dispensers',
        subs: [
          { slug: 'porte-savons-bois',  label: 'Bois naturel',   csvFamilies: ['Classic Mahogany Soap Dishes', 'Wooden Soap Dishes', 'Natural Teakwood Soap Dispensers'] },
          { slug: 'porte-savons-pierre',label: 'Pierre naturelle',csvFamilies: ['Stone Soap Dishes'] },
        ],
      },
    ],
  },
  {
    slug: 'deco-maison-zen',
    label: 'Déco & Maison Zen',
    description: "Statues Bouddha, lampes himalaya, attrape-rêves, textiles et objets décoratifs pour transformer votre intérieur en espace de sérénité.",
    csvDepartment: 'Home & Garden',
    dbDepartment: 'Déco & Maison',
    subs: [
      {
        slug: 'statues-collectibles',
        label: 'Statues & figures spirituelles',
        csvSubdepartment: 'Collectables & Statues',
        subs: [
          { slug: 'statues-bouddha',   label: 'Statues Bouddha',         csvFamilies: ['Buddha Antique Statues', 'Hand Carved Buddha Statue', 'Resin Buddha Statue - Hand Painted', 'Vintage Hand Carved Buddha Statues'] },
          { slug: 'figurines-yoga',    label: 'Figurines yoga & zen',    csvFamilies: ['Hand Carved Yoga Cat', 'Yoga Lady Figures', 'Wooden Yoga Lady'] },
          { slug: 'feng-shui-laiton',  label: 'Feng Shui en laiton',     csvFamilies: ['Brass Buddha Figures', 'Brass Fengshui Objects', 'Brass Miniature Gods'] },
          { slug: 'anges-lucky-cat',   label: 'Anges & Lucky Cat',       csvFamilies: ['Hati-Hati Angels', 'Hati-Hati Macrame Angel in Gift Box', 'Lucky Waving Chinese Cat'] },
        ],
      },
      {
        slug: 'attrape-reves-mobiles',
        label: 'Attrape-rêves & mobiles',
        csvSubdepartment: 'Dream Catchers & Mobiles',
        subs: [
          { slug: 'attrape-bali',    label: 'Attrape-rêves Bali',        csvFamilies: ['Bali Dream Catcher', 'Bali Natural Dream Catchers - Vegan Friendly', 'Bali Style Wall Decor', 'Protection Dream Catcher', 'Rainbow Dreamcatchers'] },
          { slug: 'attrape-macrame', label: 'Macramé & arbre de vie',    csvFamilies: ['Macrame Dreamcatcher Tree of Life', 'Pastel Macramé Dream Catchers'] },
          { slug: 'mobiles-feutre',  label: 'Mobiles en feutre & carillons',csvFamilies: ['Felt Wall Hangings', 'Handmade Felt Mobiles', 'Indian Chimes'] },
        ],
      },
      {
        slug: 'lampes-eclairages',
        label: 'Lampes & éclairages',
        csvSubdepartment: 'Lamps and Shades',
        subs: [
          { slug: 'lampes-sel',      label: 'Lampes en sel de l\'Himalaya',csvFamilies: ['Himalayan Salt Lamps & Candle Holders', 'Salt Rock Brazier Lamps'] },
          { slug: 'lampes-boho',     label: 'Lampes boho & naturelles',   csvFamilies: ['Boho Seashell Lamps', 'DriftGlow Lamps', 'Buddha Glow Lamps', 'New Wave Lamps', 'Touch Table Lamps'] },
          { slug: 'abat-jours',      label: 'Abat-jours naturels',        csvFamilies: ['Natural Banana Leaf & Hitam Raffia Lamp Shades', 'Rattan Table Lamps', 'Natural Coconut Leaf Lamps'] },
        ],
      },
      {
        slug: 'deco-murale',
        label: 'Décoration murale',
        csvSubdepartment: 'Wall Decor & Art',
        subs: [
          { slug: 'tapisseries',       label: 'Tapisseries & tentures',    csvFamilies: ['Cotton Bedspreads/Wall Hangings', 'Bali Wax Batik Wall Hangings', 'Handbrushed Cotton Wall Hangings', 'Wall Hanging /Beach Spread'] },
          { slug: 'macrame-mural',     label: 'Macramé mural & étagères', csvFamilies: ['Macrame Wall Hanging', 'Macrame Hanging Shelves'] },
          { slug: 'tableaux-panneaux', label: 'Tableaux & panneaux',       csvFamilies: ['Decorative Wooden Panels', 'Mango Wood Wall Plaques & Shelves', 'Buddha Painting', 'Natural Seagrass Wall Art'] },
          { slug: 'tableaux-gemmes',   label: 'Tableaux en pierres',       csvFamilies: ['Gemstone Pictures', 'Pebble-Shaped Wooden Mirror Sets'] },
        ],
      },
      {
        slug: 'deco-interieure',
        label: 'Déco intérieure',
        csvSubdepartment: 'Home Décor',
        subs: [
          { slug: 'fontaines',        label: 'Fontaines d\'intérieur',    csvFamilies: ['Tabletop Water Features'] },
          { slug: 'vases-ceramiques', label: 'Vases & céramiques',        csvFamilies: ['Ceramic Vases from Lombok', 'Molten Glass on Wood', 'Glass Terrariums'] },
          { slug: 'champignons-deco', label: 'Champignons & forêt',       csvFamilies: ['Wooden Mushroom Decorations', 'Lost in the Forest – Wooden Decorations & Bowls'] },
          { slug: 'bouddha-deco',     label: 'Têtes Bouddha & Feng Shui', csvFamilies: ['Home Decoration Buddha Heads', 'Feng Shui Buddha Set'] },
        ],
      },
      {
        slug: 'textiles-coussins',
        label: 'Textiles & coussins',
        csvSubdepartment: 'Rugs & Soft Furnishings',
        subs: [
          { slug: 'couvre-lits-plaids', label: 'Couvre-lits & plaids',     csvFamilies: ['Boho Comfort Throws', 'Black and White Double Cotton Bedspread', 'Handmade Indigo Throws'] },
          { slug: 'housses-coussin',    label: 'Housses de coussin',        csvFamilies: ['Classic Indian Cushion Covers', 'Kilim Cushion Covers', 'Linen Cushion Coverings', 'Poem Cotton Cushion Cover', 'Rag Rug Cushion Covers'] },
          { slug: 'tapis',              label: 'Tapis naturels & kilim',    csvFamilies: ['Indian Cotton Rug', 'Indian Rag Rugs', 'Kilim Rug', 'Round Jute and Recycled Cotton Rugs', 'Round Seagrass Rug'] },
        ],
      },
      {
        slug: 'jardin-exterieur',
        label: 'Jardin & plein air',
        csvSubdepartment: 'Garden & Outdoor',
        subs: [
          { slug: 'carillons',      label: 'Carillons & mobiles jardin', csvFamilies: ['Bamboo Mountain Wind Chimes', 'Wild Bamboo Wind Chimes', 'Coconut Leaf Wind Chimes', 'Recycled Glass Wind Chimes', 'Driftwood Chime', 'Coconut Dragon Mobiles'] },
          { slug: 'bouddha-jardin', label: 'Bouddhas & garden art',      csvFamilies: ['Extra Large Buddha Statues', 'Seagrass Bird Houses'] },
        ],
      },
      {
        slug: 'rangement-boites',
        label: 'Rangement & boîtes artisanales',
        csvSubdepartment: 'Storage & Organisation',
        subs: [
          { slug: 'boites-bois',     label: 'Boîtes en bois sculpté',     csvFamilies: ['Hand-Carved Wooden Boxes', 'Wooden Boxes and Trays with Hamsa & Buddha', 'Vintage Style Boxes', 'Bali Magic Boxes', 'Vintage Deco Boxes', 'Ceramic Glazed Wooden Boxes'] },
          { slug: 'paniers-naturels',label: 'Paniers & corbeilles',       csvFamilies: ['Banana Leaf & Seagrass Square Basket', 'Seagrass Basket Set', 'Seagrass Vase & Bins Set', 'Natural Jute Baskets'] },
        ],
      },
      {
        slug: 'art-table',
        label: 'Art de la table naturel',
        csvSubdepartment: 'Tableware & Kitchen Décor',
        subs: [
          { slug: 'bols-bois',     label: 'Bols & plateaux manguier/teck', csvFamilies: ['Mango Wood Bowls, Trays and Coasters', 'Teak Wood Bowls', 'Coconut Leaf Fruit Bowl Sets'] },
          { slug: 'sel-cuisine',   label: 'Sel de l\'Himalaya en cuisine', csvFamilies: ['Himalayan Salt Cooking Plate', 'Himalayan Salt Shot Glasses & Wood Serving Tray'] },
          { slug: 'mortiers-tapis',label: 'Mortiers, planches & coasters', csvFamilies: ['Marble Pestle & Mortar', 'Ergo Teak Pestal & Morter', 'Teak Chopping Boards', 'Natural Coasters and Placemats', 'Natural Place Mats'] },
        ],
      },
      {
        slug: 'papeterie-carnets',
        label: 'Papeterie & carnets artisanaux',
        csvSubdepartment: 'Stationery',
        subs: [
          { slug: 'carnets-cuir',      label: 'Carnets en cuir vintage',    csvFamilies: ['Leather Notebooks – Vintage Style Journals', 'Vegetable Tanned Leather Notebooks', 'Leather Message Journals'] },
          { slug: 'carnets-lokta',     label: 'Papier lokta artisanal',     csvFamilies: ['Lokta Paper Notebooks', 'Handmade Lokta Paper Sheets'] },
          { slug: 'carnets-bien-etre', label: 'Gratitude & bien-être',      csvFamilies: ['Wellness & Gratitude Notebooks', 'Cotton Bound Notebooks', 'Designer Notebooks'] },
        ],
      },
    ],
  },
  {
    slug: 'the-tisanes',
    label: 'Thé & Tisanes',
    description: "Thés artisanaux et matcha sélectionnés pour leurs propriétés bien-être. Théières en verre, infuseurs cristal et accessoires pour un rituel thé complet.",
    csvDepartment: 'Artisan Tea',
    dbDepartment: 'Thé & Tisanes',
    subs: [
      {
        slug: 'thes-artisanaux',
        label: 'Thés & matcha artisanaux',
        csvSubdepartment: 'Artisan Tea',
        subs: [
          { slug: 'thes-50g', label: 'Boîtes 50g & tins', csvFamilies: ['Artisan Tea Blends 50g', 'Artisan Tea & Matcha In Tins'] },
          { slug: 'thes-1kg', label: 'Vrac professionnel 1kg', csvFamilies: ['Artisan Tea Blends 1kg'] },
        ],
      },
      {
        slug: 'theieres-infuseurs',
        label: 'Théières & infuseurs',
        csvSubdepartment: 'Teapots',
        subs: [
          { slug: 'theieres-verre',    label: 'Théières en verre',          csvFamilies: ['Glass Infuser Teapot', 'Herbal Teapot Set'] },
          { slug: 'bouteilles-cristal',label: 'Bouteilles infuseur cristal', csvFamilies: ['Crystal Glass Tea Infuser Bottles'] },
          { slug: 'passoires-gemme',   label: 'Passoires en pierre gemme',  csvFamilies: ['Raw Crystal Gemstone Tea Strainer'] },
        ],
      },
    ],
  },
  {
    slug: 'instruments-sonotherapie',
    label: 'Instruments & Sonothérapie',
    description: "Tambours chamaniques, steel tongue drums, ukulélés artisanaux et instruments décoratifs pour explorer la sonothérapie et la musique naturelle.",
    csvDepartment: 'Musical Instruments',
    dbDepartment: 'Instruments',
    subs: [
      {
        slug: 'tambours-chamaniques',
        label: 'Tambours chamaniques',
        csvSubdepartment: 'Drums',
        subs: [
          { slug: 'djembe',      label: 'Djembés & rituels chamaniques', csvFamilies: ['Djembe & Shamanic Drums'] },
          { slug: 'tongue-drum', label: 'Steel tongue happy drums',      csvFamilies: ['Steel Tongue Happy Drums'] },
        ],
      },
      {
        slug: 'instruments-decoratifs',
        label: 'Instruments décoratifs',
        csvSubdepartment: 'Decorative Music Instruments',
        subs: [
          { slug: 'sifflets-oiseaux', label: 'Sifflets & flûtes', csvFamilies: ['Bird Whistles'] },
          { slug: 'deco-musicale',    label: 'Déco musicale',     csvFamilies: ['Decorative Musical Instruments'] },
        ],
      },
      {
        slug: 'ukuleles',
        label: 'Ukulélés artisanaux',
        csvSubdepartment: 'Ukulele',
        subs: [
          { slug: 'ukuleles-artisanaux', label: 'Faits main', csvFamilies: ['Artisan Made Ukuleles'] },
        ],
      },
    ],
  },
  {
    slug: 'bijoux-cristaux',
    label: 'Bijoux & Cristaux Portés',
    description: "Bracelets en pierres semi-précieuses, pendentifs chakra, colliers et bagues artisanaux pour porter l'énergie des cristaux au quotidien.",
    csvDepartment: 'Jewellery',
    dbDepartment: 'Bijoux',
    subs: [
      {
        slug: 'bracelets-pierres',
        label: 'Bracelets en pierres',
        csvSubdepartment: 'Bracelets',
        subs: [
          { slug: 'bracelets-chakra',      label: 'Chakra & manifestation',     csvFamilies: ['Chakra String Bracelets', 'Power Bracelets', 'Double Power Bracelets', 'Gemstone Bracelets for Manifestation'] },
          { slug: 'bracelets-naturels',    label: 'Pierres naturelles',          csvFamilies: ['Faceted Gemstone Bracelets', 'Chipstones Bracelets', 'Gemstones String Bracelets', 'Boho Bling Gemstones Bracelets'] },
          { slug: 'bracelets-lave',        label: 'Pierre de lave aromathérapie',csvFamilies: ['Lava Stone Bracelets'] },
          { slug: 'bracelets-tibetains',   label: 'Tibétains & mantras',         csvFamilies: ['Tibetan Mantra Bracelet', 'Multi-Bead Bangle and Budha Bracelets', 'Temple String Bracelet'] },
          { slug: 'bracelets-magnetiques', label: 'Magnétiques & hématite',      csvFamilies: ['Magnetic Gemstone Bracelets', 'Magnetic Hematite Shamballa Bracelet'] },
          { slug: 'bracelets-hommes',      label: 'Pour homme',                  csvFamilies: ["Men's Bracelet Sets"] },
        ],
      },
      {
        slug: 'colliers-pendentifs',
        label: 'Colliers & pendentifs',
        csvSubdepartment: 'Necklaces',
        subs: [
          { slug: 'pendentifs-gemme',   label: 'Pendentifs en gemme',     csvFamilies: ['Cord Necklace Gemstone Pendants', 'Laced Gemstone Pendants', 'Gemstone Pendants', 'Longstone Gemstone Necklace'] },
          { slug: 'arbre-vie-collier',  label: 'Arbre de Vie',            csvFamilies: ['Gemstone Pendants - Tree of Life', 'Tree of Life 925 Silver Jewellery'] },
          { slug: 'colliers-indiens',   label: 'Colliers indiens artisanaux',csvFamilies: ['Indian Gemstone Necklaces', 'Indian Gemstone Pendant Jewellery', 'Indian Devotional Pendants'] },
          { slug: 'orgonite-pendentifs',label: 'Orgonite énergétique',    csvFamilies: ['Orgonite Power Pendants'] },
          { slug: 'selenite-pendentifs',label: 'Sélénitee',               csvFamilies: ['Selenite Pendants'] },
        ],
      },
      {
        slug: 'bagues-pierres',
        label: 'Bagues en pierres gemmes',
        csvSubdepartment: 'Rings',
        subs: [
          { slug: 'bagues-nature',   label: 'Nature & minéral',      csvFamilies: ['Nymph Nature Inspired Gemstone Ring Sets', 'Perfume Flower Rings'] },
        ],
      },
      {
        slug: 'boucles-oreilles',
        label: 'Boucles d\'oreilles',
        csvSubdepartment: 'Earrings',
        subs: [
          { slug: 'boucles-verre',  label: 'Verre & coquillage', csvFamilies: ['Nymph Aurora Glass Earrings', 'Shell & Silver Earrings'] },
        ],
      },
      {
        slug: 'sets-bijoux',
        label: 'Sets & bijoux uniques',
        csvSubdepartment: 'Sets & Mixed',
        subs: [
          { slug: 'bijoux-fleurs',  label: 'Fleurs pressées & feuilles', csvFamilies: ['Pressed Real Flowers Jewellery', 'Real Leaf Jewellery'] },
          { slug: 'bijoux-argent',  label: 'Argent 925 & doré',         csvFamilies: ['Silver & Gold Jewellery - Gift boxed', '925 Silver Angel Bells'] },
          { slug: 'malas-medellas', label: 'Malas & médaillons',        csvFamilies: ['Rudraksha Buddah Bangle Mala', 'Gemstone Mala Beads'] },
        ],
      },
    ],
  },
];

/** Flat list of top-level slugs → label (for nav, CategoriesGrid, etc.) */
export const COLLECTION_SLUGS = COLLECTIONS.map(c => ({ slug: c.slug, label: c.label }));

/** Find a collection by slug */
export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find(c => c.slug === slug);
}

/** Find a sub-collection by parent slug + sub slug */
export function getSubCollection(collectionSlug: string, subSlug: string): SubCollection | undefined {
  return getCollection(collectionSlug)?.subs.find(s => s.slug === subSlug);
}
