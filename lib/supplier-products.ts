/**
 * Produits importés via Nano Banana (push fournisseur).
 * Contenu rédigé par Claude — ne pas remplacer par un outil AI tiers.
 * Image URL : raw GitHub du dossier products/<slug>/image-1.jpg
 *
 * NOTE QUANTITÉS :
 * Les huiles parfumées 10ml sont vendues en PACK de 10 flacons (10 × 10 ml).
 * 1 unité commandée = 10 flacons individuels de 10 ml chacun.
 */
import type { DemoProduct } from '@/lib/demo-products';

const RAW =
  'https://raw.githubusercontent.com/boutiqueambiancejapon-sketch/univers-du-zen/main/products';

export const SUPPLIER_PRODUCTS: DemoProduct[] = [
  // ─── Spray d'ambiance ────────────────────────────────────────────────────────
  {
    id: '220425',
    slug: 'spray-ambiance-bois-santal-apaisant',
    nameFr: "Spray d'Ambiance Bois de Santal — 100 ml",
    shortDescriptionFr:
      "Transformez votre intérieur en sanctuaire zen avec ce spray parfumé au bois de santal. Une fragrance chaude et enveloppante pour une atmosphère apaisante instantanée.",
    descriptionFr:
      "Ce spray d'ambiance diffuse en quelques secondes une fragrance boisée, chaude et méditative inspirée du bois de santal sacré. Flacon aluminium 100 ml, formule longue tenue.",
    longDescriptionFr:
      "Le bois de santal est l'un des parfums les plus anciens et les plus universellement appréciés de l'humanité. Utilisé depuis des millénaires dans les temples et les cérémonies méditatives en Asie, il possède une chaleur boisée légèrement musquée, profondément apaisante pour le système nerveux.\n\nNotre spray d'ambiance capture cette essence avec une formule équilibrée, conçue pour une diffusion instantanée et une tenue prolongée. Quelques pulvérisations suffisent pour infuser votre salon, votre chambre ou votre espace de méditation d'une aura de sérénité et de raffinement. Il aide à réduire le stress, favorise la concentration et crée naturellement une atmosphère propice à la détente.\n\nLe flacon en aluminium est recyclable et résistant aux chocs. Son format 100 ml est parfait pour la maison comme pour les déplacements.",
    benefitsFr: [
      "Fragrance boisée apaisante — esprit calmé en quelques secondes",
      "Diffusion instantanée et longue tenue",
      "Flacon aluminium recyclé et réutilisable",
      "Idéal méditation, yoga, bureau ou chambre",
    ],
    usageFr:
      "Agitez avant utilisation. Vaporisez 2–3 fois dans la pièce, en direction du plafond ou des murs (évitez le contact direct sur les textiles délicats). Laissez le parfum se diffuser naturellement. Conservez à température ambiante, à l'abri de la chaleur et de la lumière directe.",
    faqFr: [
      {
        question: "Ce spray convient-il à toutes les pièces ?",
        answer:
          "Oui — salon, chambre, bureau, salle de bain, hall d'entrée. Évitez les espaces très confinés sans ventilation. Particulièrement adapté à l'espace de méditation ou de yoga.",
      },
      {
        question: "Peut-on vaporiser sur les textiles ?",
        answer:
          "Testez sur une zone discrète au préalable. Nous recommandons de vaporiser dans l'air plutôt que directement sur les tissus, notamment les soieries et matières délicates.",
      },
      {
        question: "La fragrance bois de santal est-elle naturelle ?",
        answer:
          "Le parfum est une composition aromatique de haute qualité inspirée du bois de santal authentique. La formule ne contient pas de phtalates ni de substances CMR classées.",
      },
    ],
    characteristics: [
      { label: 'Parfum', value: 'Bois de Santal' },
      { label: 'Volume', value: '100 ml' },
      { label: 'Flacon', value: 'Aluminium recyclé' },
      { label: 'Sans phtalates', value: 'Oui' },
      { label: 'Usage', value: 'Intérieur' },
    ],
    category: 'maison-deco',
    retailPriceEur: 12.99,
    compareAtPriceEur: 17,
    stockStatus: 'Normal',
    stockQty: 40,
    isBestSeller: false,
    isVegan: true,
    isCrueltyFree: true,
    tags: ['spray', 'santal', 'ambiance', 'parfum-interieur'],
    images: [`${RAW}/spray-ambiance-bois-santal-apaisant/image-1.jpg`],
  },

  // ─── Huiles parfumées — Pack 10 × 10 ml — Aromathérapie ─────────────────────
  // 1 unité commandée = 10 flacons individuels de 10 ml
  {
    id: '187398',
    slug: 'huile-parfumee-concentree-camomille-apaisante',
    nameFr: 'Huile Parfumée Camomille — Pack 10 × 10 ml',
    shortDescriptionFr:
      "Un coffret de 10 flacons de 10 ml d'huile parfumée à la camomille douce. Idéal pour la diffusion, la création de bougies artisanales ou l'aromathérapie DIY. Parfum familier, apaisant et réconfortant.",
    descriptionFr:
      "Pack de 10 flacons de 10 ml d'huile parfumée concentrée à la camomille. Compatible diffuseur électrique, bougies artisanales, savons et potpourris. Parfum floral herbacé doux.",
    longDescriptionFr:
      "La camomille est l'une des plantes médicinales les plus anciennes et les plus appréciées d'Europe. Son parfum — légèrement floral, avec une note douce de foin et une chaleur herbacée — évoque instantanément la quiétude d'une tisane du soir, la chaleur d'une couverture, le calme retrouvé après une journée chargée. Ce pack de 10 flacons vous permet d'en profiter durablement.\n\nQuelques gouttes dans votre diffuseur électrique suffisent à métamorphoser une pièce en cocon sensoriel. Utilisée en candle-making ou dans vos créations DIY (savons, sels de bain, sachets odorants), elle imprime une identité olfactive douce et naturelle à vos projets. Les 10 flacons individuels sont pratiques à stocker, partager ou offrir en lot.\n\nChaque flacon de 10 ml contient une formulation hautement concentrée : quelques gouttes seulement suffisent pour une diffusion longue durée. La fragrance est stable à la chaleur, compatible avec les cires naturelles et les supports savonniers.",
    benefitsFr: [
      "Pack économique — 10 flacons de 10 ml pour un usage longue durée",
      "Parfum doux de camomille — apaisant et immédiatement familier",
      "Compatible DIY : bougies, savons, sels de bain, potpourri",
      "Flacons individuels pratiques à stocker, utiliser et offrir",
    ],
    usageFr:
      "En diffuseur électrique : 3 à 6 gouttes d'un flacon dans de l'eau. Pour bougies artisanales : dosage recommandé 6–10 % du poids de cire. Pour savons à froid : jusqu'à 3 %. Pour potpourri : quelques gouttes sur les fleurs séchées. Conservez les flacons fermés, à l'abri de la lumière et de la chaleur.",
    faqFr: [
      {
        question: "Le pack contient combien de flacons ?",
        answer:
          "Ce pack contient 10 flacons individuels de 10 ml chacun, soit 100 ml d'huile parfumée au total. Les flacons sont conditionnés ensemble et livrés en une seule expédition.",
      },
      {
        question: "Peut-on utiliser cette huile directement sur la peau ?",
        answer:
          "Non, cette huile est conçue pour la diffusion et les créations DIY (bougies, savons, sprays d'ambiance), pas pour une application cutanée directe non diluée. Pour un usage sur la peau, incorporez-la à un support adapté en respectant les taux de dilution.",
      },
      {
        question: "Cette fragrance est-elle compatible avec toutes les cires ?",
        answer:
          "Oui — cire de soja, cire d'abeille, cire de coco et mélanges paraffine. Testez à petite échelle pour valider le comportement à la solidification.",
      },
    ],
    characteristics: [
      { label: 'Parfum', value: 'Camomille Douce' },
      { label: 'Contenu', value: '10 flacons × 10 ml' },
      { label: 'Volume total', value: '100 ml' },
      { label: 'Type', value: 'Huile parfumée concentrée' },
      { label: 'Usage principal', value: 'Diffusion & DIY' },
      { label: 'Famille olfactive', value: 'Florale herbacée' },
    ],
    category: 'aromatherapie',
    retailPriceEur: 24.90,
    compareAtPriceEur: 32,
    stockStatus: 'Normal',
    stockQty: 50,
    isBestSeller: false,
    isVegan: true,
    isCrueltyFree: true,
    tags: ['huile-parfumee', 'camomille', 'aromatherapie', 'diy', 'bougies', 'pack'],
    images: [`${RAW}/huile-parfumee-concentree-camomille-apaisante/image-1.jpg`],
  },

  {
    id: '187428',
    slug: 'huile-parfumee-lavande-blanche-apaisante-10ml',
    nameFr: 'Huile Parfumée Lavande Blanche — Pack 10 × 10 ml',
    shortDescriptionFr:
      "Un coffret de 10 flacons de 10 ml d'huile parfumée à la lavande blanche. Plus douce et plus florale que la lavande classique — parfaite pour les rituels du soir, les bougies de chambre et les sprays d'oreillers DIY.",
    descriptionFr:
      "Pack de 10 flacons de 10 ml d'huile parfumée concentrée à la lavande blanche. Note florale délicate et légèrement poudrée. Compatible diffuseur, bougies, spray oreillers DIY.",
    longDescriptionFr:
      "La lavande blanche se distingue de sa cousine violette par un profil olfactif plus subtil : moins herbacé, plus floral, presque poudré. Là où la lavande classique évoque la Provence et la campagne, la lavande blanche invite à un silence plus intérieur — aérien, apaisé, presque lumineux. Ce pack de 10 flacons vous en offre une réserve généreuse.\n\nEn diffusion le soir, elle prépare naturellement au repos et calme le rythme de la journée. Incorporée à une bougie de chambre à coucher, elle crée une ambiance que l'on retrouve dans les grandes maisons d'hôtel zen. En spray oreillers DIY (quelques gouttes dans de l'eau distillée et de l'alcool neutre), elle accompagne chaque nuit d'un parfum rassurant et durable.\n\nFormulation concentrée, compatible cires naturelles, savons et supports cosmétiques dilués. La note florale reste perceptible plusieurs heures après diffusion, sans jamais devenir entêtante.",
    benefitsFr: [
      "Pack économique — 10 flacons de 10 ml, réserve pour toute la saison",
      "Note florale douce et aérienne — jamais entêtante ni médicinale",
      "Particulièrement adaptée à la chambre et aux rituels de sommeil",
      "Compatible spray d'oreillers, bougies et savons artisanaux",
    ],
    usageFr:
      "En diffuseur : 4–6 gouttes pour une chambre standard. Spray oreillers DIY : 10 ml d'eau distillée + 5 ml d'alcool à 70° + 15–20 gouttes. Pour bougies : dosage 6–8 % du poids de cire. Conservez à l'abri de la lumière directe.",
    faqFr: [
      {
        question: "Le pack contient combien de flacons ?",
        answer:
          "Ce pack contient 10 flacons individuels de 10 ml chacun, soit 100 ml au total. Idéal pour une utilisation prolongée, pour les ateliers DIY ou pour offrir à plusieurs personnes.",
      },
      {
        question: "Quelle est la différence avec la lavande classique ?",
        answer:
          "La lavande blanche a un profil olfactif plus doux, plus floral et moins herbacé que la lavande vraie ou la lavande aspic. Elle convient particulièrement à ceux qui trouvent la lavande classique trop prononcée ou médicinale.",
      },
      {
        question: "Est-ce une huile essentielle ou une huile parfumée ?",
        answer:
          "Il s'agit d'une huile parfumée — une composition aromatique haute qualité inspirée de la lavande blanche naturelle. Elle offre une tenue supérieure et un meilleur comportement en cire et savon par rapport aux huiles essentielles pures.",
      },
    ],
    characteristics: [
      { label: 'Parfum', value: 'Lavande Blanche' },
      { label: 'Contenu', value: '10 flacons × 10 ml' },
      { label: 'Volume total', value: '100 ml' },
      { label: 'Type', value: 'Huile parfumée concentrée' },
      { label: 'Usage principal', value: 'Diffusion & DIY' },
      { label: 'Famille olfactive', value: 'Florale poudrée' },
    ],
    category: 'aromatherapie',
    retailPriceEur: 24.90,
    compareAtPriceEur: 32,
    stockStatus: 'Normal',
    stockQty: 50,
    isBestSeller: true,
    isVegan: true,
    isCrueltyFree: true,
    tags: ['huile-parfumee', 'lavande', 'sommeil', 'aromatherapie', 'diy', 'pack'],
    images: [`${RAW}/huile-parfumee-lavande-blanche-apaisante-10ml/image-1.jpg`],
  },

  {
    id: '187416',
    slug: 'huile-parfumee-orange-eclatante-10ml',
    nameFr: 'Huile Parfumée Orange Éclatante — Pack 10 × 10 ml',
    shortDescriptionFr:
      "Un coffret de 10 flacons de 10 ml d'huile parfumée à l'orange douce. Fraîcheur d'agrume et énergie positive pour dynamiser votre matin, vos créations de bougies ou vos mélanges olfactifs d'hiver.",
    descriptionFr:
      "Pack de 10 flacons de 10 ml d'huile parfumée concentrée à l'orange douce. Parfum zesté et légèrement sucré. Excellente tenue à la chaleur — idéale pour bougies artisanales.",
    longDescriptionFr:
      "L'orange est l'un des parfums les plus universellement associés au bien-être et à la bonne humeur. Sa note zestée et légèrement sucrée active naturellement l'énergie et génère une ambiance conviviale et chaleureuse. Ce pack de 10 flacons vous donne largement de quoi expérimenter et créer.\n\nEn diffusion matinale, quelques gouttes suffisent à dynamiser la cuisine ou le bureau. Elle se marie à merveille avec d'autres fragrances — cannelle pour l'hiver, menthe pour l'été, cèdre pour une note boisée plus ronde. Dans les créations de bougies, elle apporte une chaleur conviviale et familière très appréciée.\n\nLa formulation est hautement concentrée et stable à la chaleur. Le profil olfactif est fidèle à l'orange douce — ni trop acide, ni artificiel — avec une belle rondeur qui persiste après le refroidissement des bougies.",
    benefitsFr: [
      "Pack économique — 10 flacons pour des semaines de diffusion ou de création",
      "Boost d'énergie et de bonne humeur dès les premières minutes",
      "Parfaite en mélange — s'associe avec cannelle, menthe, cèdre, vétiver",
      "Excellente tenue en cire — idéale pour bougies artisanales hivernales",
    ],
    usageFr:
      "Diffusion pure : 4–6 gouttes. Mélange festif d'hiver : 3 gouttes orange + 2 gouttes cannelle + 1 goutte clou de girofle. En bougie : 8–10 % du poids de cire. Conservez à l'abri de la chaleur directe.",
    faqFr: [
      {
        question: "Le pack contient combien de flacons ?",
        answer:
          "Ce pack contient 10 flacons individuels de 10 ml chacun, soit 100 ml au total. Pratique pour un usage longue durée, pour des ateliers de création ou pour partager avec des proches.",
      },
      {
        question: "Peut-on mélanger cette huile avec d'autres fragrances ?",
        answer:
          "Oui, les agrumes se mélangent excellemment avec les épices (cannelle, cardamome), les bois (cèdre, santal), les floraux (rose, jasmin) et les herbes (menthe, basilic). Commencez avec un ratio 60/40 et ajustez à votre goût.",
      },
      {
        question: "La couleur de l'huile peut-elle teinter mes bougies ?",
        answer:
          "Les huiles parfumées peuvent légèrement modifier la couleur de la cire. L'orange est légèrement dorée et apporte une note chaude au rendu final — souvent un avantage esthétique apprécié.",
      },
    ],
    characteristics: [
      { label: 'Parfum', value: 'Orange Douce' },
      { label: 'Contenu', value: '10 flacons × 10 ml' },
      { label: 'Volume total', value: '100 ml' },
      { label: 'Type', value: 'Huile parfumée concentrée' },
      { label: 'Usage principal', value: 'Diffusion & DIY' },
      { label: 'Famille olfactive', value: 'Agrume fruitée' },
    ],
    category: 'aromatherapie',
    retailPriceEur: 24.90,
    compareAtPriceEur: 32,
    stockStatus: 'Normal',
    stockQty: 50,
    isBestSeller: false,
    isVegan: true,
    isCrueltyFree: true,
    tags: ['huile-parfumee', 'orange', 'agrume', 'aromatherapie', 'diy', 'bougies', 'pack'],
    images: [`${RAW}/huile-parfumee-orange-eclatante-10ml/image-1.jpg`],
  },

  {
    id: '187420',
    slug: 'huile-parfumee-menthe-poivree-rafraichissante-10ml',
    nameFr: 'Huile Parfumée Menthe Poivrée — Pack 10 × 10 ml',
    shortDescriptionFr:
      "Un coffret de 10 flacons de 10 ml d'huile parfumée à la menthe poivrée. Fraîcheur immédiate, clarté mentale et pouvoir purificateur — pour la diffusion, les savons froids et tous vos projets DIY.",
    descriptionFr:
      "Pack de 10 flacons de 10 ml d'huile parfumée concentrée à la menthe poivrée. Parfum frais et herbacé. Compatible diffuseur, savons froids, baumes. Idéale pour les espaces de travail.",
    longDescriptionFr:
      "La menthe poivrée est le parfum de la vigilance. Sa note fraîche, légèrement mentholée et intensément herbacée agit comme un signal neurologique — elle réveille, clarifie, purifie. Ce pack de 10 flacons vous assure une réserve généreuse pour tous vos usages.\n\nEn diffusion pendant les longues sessions de travail ou d'étude, elle maintient l'alerte sans les effets secondaires de la caféine. Pour un bureau ou une bibliothèque, c'est l'un des parfums les plus plébiscités. Elle masque aussi efficacement les odeurs persistantes, laissant une empreinte de propreté végétale nette.\n\nEn création DIY, elle est particulièrement appréciée dans les savons froids (sensation fraîche au rinçage) et les baumes à lèvres. La formulation concentrée tient bien à la chaleur et conserve sa fraîcheur caractéristique après solidification de la cire.",
    benefitsFr: [
      "Pack économique — 10 flacons pour des mois de diffusion ou de création",
      "Clarté mentale et concentration améliorée en diffusion",
      "Purifie l'atmosphère et neutralise les odeurs tenaces",
      "Idéale pour savons froids — sensation mentholée agréable au rinçage",
    ],
    usageFr:
      "Diffusion : 4–6 gouttes. Pour un effet purificateur intense : 8 gouttes, 15 minutes pièce fermée, puis aérez. Savon froid : 2–3 % maximum. Baumes leave-on : diluez à 0,5–1 %. Déconseillé aux enfants de moins de 3 ans.",
    faqFr: [
      {
        question: "Le pack contient combien de flacons ?",
        answer:
          "Ce pack contient 10 flacons individuels de 10 ml chacun, soit 100 ml au total. Chaque flacon est indépendant — pratique pour tester des recettes différentes ou partager.",
      },
      {
        question: "Cette huile convient-elle pour un environnement de travail ?",
        answer:
          "C'est l'un des meilleurs choix pour le bureau. La menthe améliore la vigilance et la concentration lors de tâches qui exigent de l'attention soutenue. Diffusez 20 minutes, faites une pause, recommencez.",
      },
      {
        question: "Y a-t-il des précautions d'usage particulières ?",
        answer:
          "Ne pas utiliser pur sur la peau. Déconseillé aux enfants de moins de 3 ans en diffusion directe. Les femmes enceintes doivent éviter les huiles à la menthe non diluées. En usage DIY, respectez les taux de dilution recommandés.",
      },
    ],
    characteristics: [
      { label: 'Parfum', value: 'Menthe Poivrée' },
      { label: 'Contenu', value: '10 flacons × 10 ml' },
      { label: 'Volume total', value: '100 ml' },
      { label: 'Type', value: 'Huile parfumée concentrée' },
      { label: 'Usage principal', value: 'Diffusion & DIY' },
      { label: 'Famille olfactive', value: 'Fraîche herbacée' },
    ],
    category: 'aromatherapie',
    retailPriceEur: 24.90,
    compareAtPriceEur: 32,
    stockStatus: 'Normal',
    stockQty: 50,
    isBestSeller: false,
    isVegan: true,
    isCrueltyFree: true,
    tags: ['huile-parfumee', 'menthe', 'fraicheur', 'aromatherapie', 'diy', 'concentration', 'pack'],
    images: [`${RAW}/huile-parfumee-menthe-poivree-rafraichissante-10ml/image-1.jpg`],
  },

  {
    id: '187422',
    slug: 'huile-parfumee-rose-musc-concentree',
    nameFr: 'Huile Parfumée Rose & Musc — Pack 10 × 10 ml',
    shortDescriptionFr:
      "Un coffret de 10 flacons de 10 ml d'huile parfumée rose & musc. L'accord floral-musqué intemporel pour vos bougies romantiques, vos sprays textiles et vos moments de soin personnel.",
    descriptionFr:
      "Pack de 10 flacons de 10 ml d'huile parfumée concentrée rose & musc blanc. Compatible diffuseur, bougies, spray textile, savons. Le musc fixe le parfum pour une longévité supérieure.",
    longDescriptionFr:
      "La rose et le musc forment l'un des duos les plus intemporels de la parfumerie. La rose apporte la délicatesse florale et son caractère romantique. Le musc ajoute une chaleur corporelle et une profondeur qui ancre le parfum dans la durée. Ce pack de 10 flacons vous permet de créer en abondance.\n\nEn diffusion dans une chambre, la rose musc crée une ambiance intime et apaisante. Incorporée à une bougie, elle apporte une sophistication inattendue aux créations artisanales. En spray textile DIY, elle parfume délicatement les rideaux et le linge de lit avec une tenue durable grâce au musc fixateur.\n\nLa formulation concentrée offre une longévité remarquable dans toutes les applications. Compatible cires naturelles, savons froids, lotions et sprays d'ambiance.",
    benefitsFr: [
      "Pack économique — 10 flacons pour vos créations et votre usage personnel",
      "Accord floral-musqué intemporel — élégant et enveloppant",
      "Le musc fixe le parfum pour une longévité supérieure dans toutes les applications",
      "Excellent comportement en bougie — note chaude et romantique à la combustion",
    ],
    usageFr:
      "Diffusion : 4–6 gouttes dans 100 ml d'eau. Bougie : 6–8 % du poids de cire. Spray linge : 15–20 gouttes dans 100 ml eau distillée + alcool neutre. Savon froid : 3 % maximum.",
    faqFr: [
      {
        question: "Le pack contient combien de flacons ?",
        answer:
          "Ce pack contient 10 flacons individuels de 10 ml chacun, soit 100 ml au total. Idéal pour les ateliers de création de bougies, les cours DIY ou un usage personnel longue durée.",
      },
      {
        question: "Ce parfum convient-il aussi aux hommes ?",
        answer:
          "Tout à fait. La rose musc est un accord unisexe dans la parfumerie contemporaine. La note musquée équilibre la rose et donne une profondeur qui transcende les genres.",
      },
      {
        question: "La fragrance sera-t-elle fidèle après combustion en bougie ?",
        answer:
          "La rose musc évolue légèrement à la chaleur — la note florale se renforce tandis que le musc reste en fond. Le résultat en combustion est souvent encore plus agréable qu'à froid. Recommandé sur cire de soja.",
      },
    ],
    characteristics: [
      { label: 'Parfum', value: 'Rose & Musc Blanc' },
      { label: 'Contenu', value: '10 flacons × 10 ml' },
      { label: 'Volume total', value: '100 ml' },
      { label: 'Type', value: 'Huile parfumée concentrée' },
      { label: 'Usage principal', value: 'Diffusion & DIY' },
      { label: 'Famille olfactive', value: 'Florale musquée' },
    ],
    category: 'aromatherapie',
    retailPriceEur: 24.90,
    compareAtPriceEur: 32,
    stockStatus: 'Normal',
    stockQty: 50,
    isBestSeller: false,
    isVegan: true,
    isCrueltyFree: true,
    tags: ['huile-parfumee', 'rose', 'musc', 'floral', 'aromatherapie', 'diy', 'pack'],
    images: [`${RAW}/huile-parfumee-rose-musc-concentree/image-1.jpg`],
  },

  {
    id: '187414',
    slug: 'myrrh-fragrance-oil-10ml',
    nameFr: 'Huile Parfumée Myrrhe Résineuse — Pack 10 × 10 ml',
    shortDescriptionFr:
      "Un coffret de 10 flacons de 10 ml d'huile parfumée à la myrrhe résineuse. Un parfum ancestral et profond pour la méditation, les bougies rituelles et les mélanges d'encens DIY.",
    descriptionFr:
      "Pack de 10 flacons de 10 ml d'huile parfumée concentrée à la myrrhe. Résineuse, légèrement fumée et boisée. Fixateur naturel exceptionnel. Compatible diffuseur, bougies et mélanges d'encens.",
    longDescriptionFr:
      "La myrrhe est une résine extraite d'arbrisseaux épineux du Moyen-Orient et d'Afrique de l'Est. Utilisée depuis l'Antiquité dans les rituels religieux et les pratiques méditatives, elle possède un profil olfactif unique : boisé, légèrement fumé, avec une note amère-douce qui évoque l'encens et les lieux de culte anciens. Ce pack de 10 flacons vous en donne une réserve généreuse.\n\nEn diffusion, la myrrhe crée une atmosphère de recueillement propice à la méditation ou à toute pratique contemplative. Elle s'associe magnifiquement avec le bois de santal, le vétiver, l'encens pur ou le patchouli. Elle est aussi très appréciée des créateurs de bougies artisanales qui recherchent un parfum hors des sentiers fleuris.\n\nLa formulation concentrée offre une longévité supérieure — la myrrhe est naturellement fixatrice. Le format pack de 10 est idéal pour les créateurs qui aiment composer leurs propres accords.",
    benefitsFr: [
      "Pack économique — 10 flacons pour composer des mélanges variés",
      "Parfum ancestral et profond — idéal pour la méditation et le recueillement",
      "Excellent fixateur naturel — prolonge la tenue de tous les mélanges",
      "Se marie parfaitement avec santal, encens, vétiver et patchouli",
    ],
    usageFr:
      "Diffusion seule : 4–6 gouttes. Mélange rituel : 3 gouttes myrrhe + 2 gouttes santal + 1 goutte vétiver. En bougie : 6–8 % du poids de cire, sur cire d'abeille pour le meilleur rendu. Sur potpourri de résines et bois séchés.",
    faqFr: [
      {
        question: "Le pack contient combien de flacons ?",
        answer:
          "Ce pack contient 10 flacons individuels de 10 ml chacun, soit 100 ml au total. Parfait pour les créateurs qui veulent composer plusieurs mélanges différents ou constituer une réserve.",
      },
      {
        question: "Quelle est la différence entre la myrrhe et l'encens en parfumerie ?",
        answer:
          "L'encens (oliban) est plus citronné, lumineux et volatil. La myrrhe est plus sombre, amère-douce, terrienne et boisée. Mélangés, ils forment l'accord dit 'cathédrale' classique de la parfumerie.",
      },
      {
        question: "La myrrhe convient-elle à ceux qui débutent en DIY aromatique ?",
        answer:
          "Elle est légèrement plus technique que les fragrances florales ou fruitées. Commencez par 5 % en bougie et ajustez. En diffusion, le dosage est plus facile à contrôler.",
      },
    ],
    characteristics: [
      { label: 'Parfum', value: 'Myrrhe Résineuse' },
      { label: 'Contenu', value: '10 flacons × 10 ml' },
      { label: 'Volume total', value: '100 ml' },
      { label: 'Type', value: 'Huile parfumée concentrée' },
      { label: 'Usage principal', value: 'Diffusion & DIY' },
      { label: 'Famille olfactive', value: 'Résineuse boisée' },
    ],
    category: 'aromatherapie',
    retailPriceEur: 24.90,
    compareAtPriceEur: 32,
    stockStatus: 'Normal',
    stockQty: 50,
    isBestSeller: false,
    isVegan: true,
    isCrueltyFree: true,
    tags: ['huile-parfumee', 'myrrhe', 'resine', 'meditation', 'aromatherapie', 'diy', 'pack'],
    images: [`${RAW}/myrrh-fragrance-oil-10ml/image-1.jpg`],
  },
];
