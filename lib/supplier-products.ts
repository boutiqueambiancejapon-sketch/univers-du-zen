/**
 * Produits importés via Nano Banana (push fournisseur).
 * Contenu rédigé par Claude — ne pas remplacer par un outil AI tiers.
 * Image URL : raw GitHub du dossier products/<slug>/image-1.jpg
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

  // ─── Huiles parfumées 10 ml — Aromathérapie ──────────────────────────────────
  {
    id: '187398',
    slug: 'huile-parfumee-concentree-camomille-apaisante',
    nameFr: 'Huile Parfumée Camomille Apaisante — 10 ml',
    shortDescriptionFr:
      "Une huile parfumée concentrée à la camomille douce, idéale pour créer une atmosphère sereine propice au repos. Un parfum familier, doux et réconfortant qui apaise instantanément.",
    descriptionFr:
      "Huile parfumée concentrée 10 ml. Parfum de camomille florale et herbacée. Compatible diffuseur électrique, bougies artisanales, savons et potpourris.",
    longDescriptionFr:
      "La camomille est l'une des plantes médicinales les plus anciennes et les plus appréciées d'Europe. Son parfum — légèrement floral, avec une note douce de foin et une chaleur herbacée — évoque instantanément la quiétude d'une tisane du soir, la chaleur d'une couverture, le calme retrouvé après une journée chargée. Notre huile parfumée concentrée en restitue fidèlement l'essence.\n\nQuelques gouttes dans votre diffuseur électrique suffisent à métamorphoser une pièce en cocon sensoriel. Utilisée en candle-making ou dans vos créations DIY (savons, sels de bain, sachets odorants), elle imprime une identité olfactive douce et naturelle à vos projets. À faible dosage, elle parfume aussi les potpourris ou les oreillers pour favoriser un endormissement serein.\n\nLe flacon de 10 ml contient une formulation hautement concentrée : quelques gouttes seulement suffisent pour une diffusion longue durée. La fragrance est stable à la chaleur, compatible avec les cires naturelles et les supports savonniers.",
    benefitsFr: [
      "Parfum doux de camomille — apaisant et immédiatement familier",
      "Hautement concentré — quelques gouttes pour tout un soir de diffusion",
      "Compatible DIY : bougies, savons, sels de bain, potpourri",
      "Favorise le calme et prépare naturellement à l'endormissement",
    ],
    usageFr:
      "En diffuseur électrique : 3 à 6 gouttes dans de l'eau. Pour bougies artisanales : dosage recommandé 6–10 % du poids de cire. Pour savons à froid : jusqu'à 3 %. Pour potpourri : quelques gouttes sur les fleurs séchées. Conservez le flacon fermé, à l'abri de la lumière et de la chaleur.",
    faqFr: [
      {
        question: "Peut-on utiliser cette huile directement sur la peau ?",
        answer:
          "Non, cette huile est conçue pour la diffusion et les créations DIY (bougies, savons, sprays d'ambiance), pas pour une application cutanée directe non diluée. Pour un usage sur la peau, incorporez-la à un support adapté (huile de base, crème, savon) en respectant les taux de dilution.",
      },
      {
        question: "Combien de temps dure le parfum dans un diffuseur ?",
        answer:
          "Avec 4 à 6 gouttes dans un diffuseur électrique standard, le parfum est perceptible 2 à 4 heures selon la taille de la pièce. La concentration élevée garantit une tenue remarquable dans les bougies artisanales.",
      },
      {
        question: "Cette fragrance est-elle compatible avec toutes les cires ?",
        answer:
          "Oui — cire de soja, cire d'abeille, cire de coco et mélanges paraffine. Testez à petite échelle pour valider le comportement à la solidification.",
      },
    ],
    characteristics: [
      { label: 'Parfum', value: 'Camomille Douce' },
      { label: 'Volume', value: '10 ml' },
      { label: 'Type', value: 'Huile parfumée concentrée' },
      { label: 'Usage principal', value: 'Diffusion & DIY' },
      { label: 'Famille olfactive', value: 'Florale herbacée' },
    ],
    category: 'aromatherapie',
    retailPriceEur: 19.90,
    compareAtPriceEur: 25,
    stockStatus: 'Normal',
    stockQty: 50,
    isBestSeller: false,
    isVegan: true,
    isCrueltyFree: true,
    tags: ['huile-parfumee', 'camomille', 'aromatherapie', 'diy', 'bougies'],
    images: [`${RAW}/huile-parfumee-concentree-camomille-apaisante/image-1.jpg`],
  },

  {
    id: '187428',
    slug: 'huile-parfumee-lavande-blanche-apaisante-10ml',
    nameFr: 'Huile Parfumée Lavande Blanche — 10 ml',
    shortDescriptionFr:
      "Plus douce et plus aérienne que la lavande classique, la lavande blanche apporte une note florale délicate et raffinée. La fragrance idéale pour les rituels du soir et les espaces de sommeil.",
    descriptionFr:
      "Huile parfumée concentrée 10 ml. Note de lavande blanche florale et légèrement poudrée — moins herbacée que la lavande classique. Compatible diffuseur, bougies, spray oreillers DIY.",
    longDescriptionFr:
      "La lavande blanche se distingue de sa cousine violette par un profil olfactif plus subtil : moins herbacé, plus floral, presque poudré. Là où la lavande classique évoque la Provence et la campagne, la lavande blanche invite à un silence plus intérieur — aérien, apaisé, presque lumineux. C'est le choix des amateurs de parfums discrets et raffinés.\n\nEn diffusion le soir, elle prépare naturellement au repos et calme le rythme de la journée. Incorporée à une bougie de chambre à coucher, elle crée une ambiance que l'on retrouve dans les grandes maisons d'hôtel zen. En spray oreillers DIY (quelques gouttes dans de l'eau distillée et de l'alcool neutre), elle accompagne chaque nuit d'un parfum rassurant et durable.\n\nFormulation concentrée 10 ml, compatible cires naturelles, savons et supports cosmétiques dilués. Le profil de tenue est excellent : la note florale reste perceptible plusieurs heures après diffusion, sans jamais devenir entêtante.",
    benefitsFr: [
      "Note florale douce et aérienne — jamais entêtante ni médicinale",
      "Particulièrement adaptée à la chambre et aux rituels de sommeil",
      "Compatible spray d'oreillers, bougies et savons artisanaux",
      "Apaise et ralentit naturellement avant le coucher",
    ],
    usageFr:
      "En diffuseur : 4–6 gouttes pour une chambre standard. Spray oreillers DIY : 10 ml d'eau distillée + 5 ml d'alcool à 70° + 15–20 gouttes de cette huile. Pour bougies : dosage 6–8 % du poids de cire. Conservez à l'abri de la lumière directe.",
    faqFr: [
      {
        question: "Quelle est la différence avec la lavande classique ?",
        answer:
          "La lavande blanche a un profil olfactif plus doux, plus floral et moins herbacé que la lavande vraie ou la lavande aspic. Elle convient particulièrement à ceux qui trouvent la lavande classique trop prononcée ou médicinale.",
      },
      {
        question: "Peut-on l'utiliser dans un diffuseur à ultrasons ?",
        answer:
          "Oui, parfaitement compatible. Ajoutez 3 à 6 gouttes dans le réservoir d'eau. Évitez les diffuseurs à chaleur directe (brûle-parfums avec bougie) qui peuvent modifier le profil olfactif.",
      },
      {
        question: "Est-ce une huile essentielle ou une huile parfumée ?",
        answer:
          "Il s'agit d'une huile parfumée — une composition aromatique haute qualité inspirée de la lavande blanche naturelle. Elle offre une tenue supérieure et un meilleur comportement en cire et savon par rapport aux huiles essentielles pures.",
      },
    ],
    characteristics: [
      { label: 'Parfum', value: 'Lavande Blanche' },
      { label: 'Volume', value: '10 ml' },
      { label: 'Type', value: 'Huile parfumée concentrée' },
      { label: 'Usage principal', value: 'Diffusion & DIY' },
      { label: 'Famille olfactive', value: 'Florale poudrée' },
    ],
    category: 'aromatherapie',
    retailPriceEur: 19.90,
    compareAtPriceEur: 25,
    stockStatus: 'Normal',
    stockQty: 50,
    isBestSeller: true,
    isVegan: true,
    isCrueltyFree: true,
    tags: ['huile-parfumee', 'lavande', 'sommeil', 'aromatherapie', 'diy'],
    images: [`${RAW}/huile-parfumee-lavande-blanche-apaisante-10ml/image-1.jpg`],
  },

  {
    id: '187416',
    slug: 'huile-parfumee-orange-eclatante-10ml',
    nameFr: 'Huile Parfumée Orange Éclatante — 10 ml',
    shortDescriptionFr:
      "La fraîcheur d'agrume et l'énergie positive en flacon. Idéale pour dynamiser votre matin, égayer votre bureau ou apporter de la chaleur à vos créations de bougies artisanales.",
    descriptionFr:
      "Huile parfumée concentrée 10 ml. Parfum d'orange douce zestée, légèrement sucrée. Compatible diffuseur, bougies artisanales, mélanges olfactifs. Excellente tenue à la chaleur.",
    longDescriptionFr:
      "L'orange est l'un des parfums les plus universellement associés au bien-être et à la bonne humeur. Sa note zestée et légèrement sucrée active naturellement l'énergie, améliore la concentration et génère une ambiance conviviale et chaleureuse. Dans les pratiques d'aromathérapie, les agrumes sont réputés pour lever le moral et réduire l'anxiété légère.\n\nEn diffusion matinale, quelques gouttes dans votre diffuseur électrique suffisent à dynamiser la cuisine ou le bureau pour la journée. Elle se marie à merveille avec d'autres fragrances — cannelle pour l'hiver, menthe pour l'été, cèdre pour une note boisée plus ronde. Dans les créations de bougies, elle apporte une chaleur conviviale et familière qui rappelle les agrumes de fête.\n\nLa formulation est hautement concentrée et stable à la chaleur, ce qui la rend particulièrement adaptée au travail en cire. Le profil olfactif est fidèle à l'orange douce — ni trop acide, ni artificiel — avec une belle rondeur qui persiste après le refroidissement des bougies.",
    benefitsFr: [
      "Boost d'énergie et de bonne humeur dès les premières minutes",
      "Parfaite en mélange — s'associe avec cannelle, menthe, cèdre, vétiver",
      "Excellente tenue en cire — idéale pour bougies artisanales hivernales",
      "Ambiance chaleureuse et conviviale pour cuisine, salon ou bureau",
    ],
    usageFr:
      "Diffusion pure : 4–6 gouttes. Mélange festif d'hiver : 3 gouttes orange + 2 gouttes cannelle + 1 goutte clou de girofle. En bougie : 8–10 % du poids de cire. Conservez à l'abri de la chaleur directe et de la lumière.",
    faqFr: [
      {
        question: "L'orange convient-elle au bureau ou à la maison ?",
        answer:
          "Les deux. Dans un espace de travail, elle améliore la concentration et réduit la fatigue olfactive. À la maison, elle crée une ambiance conviviale et chaleureuse, particulièrement appréciée en cuisine ou en salon.",
      },
      {
        question: "Peut-on mélanger cette huile avec d'autres fragrances ?",
        answer:
          "Oui, les agrumes se mélangent excellemment avec les épices (cannelle, cardamome), les bois (cèdre, santal), les floraux (rose, jasmin) et les herbes (menthe, basilic). Commencez avec un ratio 60/40 et ajustez à votre goût.",
      },
      {
        question: "La couleur de l'huile peut-elle teinter mes bougies ?",
        answer:
          "Les huiles parfumées peuvent légèrement modifier la couleur de la cire selon leur teinte naturelle. L'orange est généralement légèrement dorée et apporte une note chaude au rendu final — souvent un avantage esthétique apprécié.",
      },
    ],
    characteristics: [
      { label: 'Parfum', value: 'Orange Douce' },
      { label: 'Volume', value: '10 ml' },
      { label: 'Type', value: 'Huile parfumée concentrée' },
      { label: 'Usage principal', value: 'Diffusion & DIY' },
      { label: 'Famille olfactive', value: 'Agrume fruitée' },
    ],
    category: 'aromatherapie',
    retailPriceEur: 19.90,
    compareAtPriceEur: 25,
    stockStatus: 'Normal',
    stockQty: 50,
    isBestSeller: false,
    isVegan: true,
    isCrueltyFree: true,
    tags: ['huile-parfumee', 'orange', 'agrume', 'aromatherapie', 'diy', 'bougies'],
    images: [`${RAW}/huile-parfumee-orange-eclatante-10ml/image-1.jpg`],
  },

  {
    id: '187420',
    slug: 'huile-parfumee-menthe-poivree-rafraichissante-10ml',
    nameFr: 'Huile Parfumée Menthe Poivrée Fraîche — 10 ml',
    shortDescriptionFr:
      "La fraîcheur immédiate de la menthe poivrée en flacon concentré. Purifie l'atmosphère, réveille les esprits et apporte une clarté mentale bienvenue à tout moment de la journée.",
    descriptionFr:
      "Huile parfumée concentrée 10 ml. Parfum de menthe poivrée frais et herbacé. Compatible diffuseur, savons froids, baumes. Idéale pour les espaces de travail et les rituels de clarté mentale.",
    longDescriptionFr:
      "La menthe poivrée est le parfum de la vigilance. Sa note fraîche, légèrement mentholée et intensément herbacée agit comme un signal neurologique — elle réveille, clarifie, purifie. En aromathérapie, la menthe est traditionnellement utilisée pour améliorer la concentration, combattre la fatigue mentale et assainir l'air ambiant.\n\nEn diffusion pendant les longues sessions de travail ou d'étude, elle maintient l'alerte sans les effets secondaires de la caféine. Pour un bureau ou une bibliothèque, c'est l'un des parfums les plus plébiscités. Elle masque aussi efficacement les odeurs persistantes de cuisine, laissant une empreinte de propreté végétale nette et durable.\n\nEn création DIY, elle est particulièrement appréciée dans les savons froids (sensation fraîche au rinçage) et les baumes à lèvres. La formulation concentrée tient bien à la chaleur et conserve sa fraîcheur caractéristique après solidification de la cire.",
    benefitsFr: [
      "Clarté mentale et concentration améliorée en diffusion",
      "Purifie l'atmosphère et neutralise les odeurs tenaces",
      "Sensation de fraîcheur immédiate et durablement stimulante",
      "Idéale pour savons froids — sensation mentholée agréable au rinçage",
    ],
    usageFr:
      "Diffusion : 4–6 gouttes. Pour un effet purificateur intense : 8 gouttes seules, 15 minutes pièce fermée, puis aérez. Savon froid : 2–3 % maximum (attention à l'accélération en trace). Baumes et produits leave-on : diluez à 0,5–1 %. Déconseillé aux enfants de moins de 3 ans.",
    faqFr: [
      {
        question: "Cette huile convient-elle pour un environnement de travail ?",
        answer:
          "C'est l'un des meilleurs choix pour le bureau. La menthe est reconnue pour améliorer la vigilance et la concentration lors de tâches qui exigent de l'attention soutenue. Diffusez 20 minutes, faites une pause, recommencez selon besoin.",
      },
      {
        question: "Peut-on l'utiliser en salle de sport ou vestiaire ?",
        answer:
          "Absolument. La menthe poivrée combine fraîcheur olfactive et propriétés assainissantes. Quelques gouttes dans un diffuseur passif ou un spray d'ambiance DIY neutralisent les odeurs et rafraîchissent efficacement l'atmosphère.",
      },
      {
        question: "Y a-t-il des précautions d'usage particulières ?",
        answer:
          "Ne pas utiliser pur sur la peau. Déconseillé aux enfants de moins de 3 ans en diffusion directe. Les femmes enceintes doivent éviter les huiles parfumées à la menthe non diluées. En usage DIY, respectez les taux de dilution recommandés.",
      },
    ],
    characteristics: [
      { label: 'Parfum', value: 'Menthe Poivrée' },
      { label: 'Volume', value: '10 ml' },
      { label: 'Type', value: 'Huile parfumée concentrée' },
      { label: 'Usage principal', value: 'Diffusion & DIY' },
      { label: 'Famille olfactive', value: 'Fraîche herbacée' },
    ],
    category: 'aromatherapie',
    retailPriceEur: 19.90,
    compareAtPriceEur: 25,
    stockStatus: 'Normal',
    stockQty: 50,
    isBestSeller: false,
    isVegan: true,
    isCrueltyFree: true,
    tags: ['huile-parfumee', 'menthe', 'fraicheur', 'aromatherapie', 'diy', 'concentration'],
    images: [`${RAW}/huile-parfumee-menthe-poivree-rafraichissante-10ml/image-1.jpg`],
  },

  {
    id: '187422',
    slug: 'huile-parfumee-rose-musc-concentree',
    nameFr: 'Huile Parfumée Rose & Musc — 10 ml',
    shortDescriptionFr:
      "L'alliance de la rose et du musc — deux ingrédients iconiques de la parfumerie fine réunis dans une huile concentrée. Un parfum romantique, profond et enveloppant pour votre intérieur ou vos créations.",
    descriptionFr:
      "Huile parfumée concentrée 10 ml. Accord floral-musqué : note de rose délicate fixée par un fond de musc blanc chaud. Compatible diffuseur, bougies, spray textile, savons.",
    longDescriptionFr:
      "La rose et le musc forment l'un des duos les plus intemporels de la parfumerie. La rose apporte la délicatesse florale, sa note légèrement poudrée et son caractère romantique. Le musc ajoute une chaleur corporelle, une sensualité douce et une profondeur qui fait que le parfum semble ancré, continu, presque peau. Ensemble, ils créent une fragrance à la fois élégante et enveloppante.\n\nEn diffusion dans une chambre, la rose musc crée une ambiance intime et apaisante — idéale lors d'un moment de soin personnel ou d'une soirée détendue. Incorporée à une bougie, elle apporte une sophistication inattendue aux créations artisanales. En spray textile DIY, elle parfume délicatement les rideaux et le linge de lit avec une tenue durable.\n\nLa formulation concentrée offre une longévité remarquable : le musc est un excellent fixateur qui ancre la note florale et prolonge la tenue dans toutes les applications. Compatible cires naturelles, savons froids, lotions et sprays d'ambiance.",
    benefitsFr: [
      "Accord floral-musqué intemporel — élégant et enveloppant",
      "Le musc fixe le parfum pour une longévité supérieure",
      "Crée une ambiance romantique et intimiste en diffusion",
      "Excellent comportement en bougie — note chaude à la combustion",
    ],
    usageFr:
      "Diffusion : 4–6 gouttes dans 100 ml d'eau. Bougie : 6–8 % du poids de cire (testez sur cire de soja pour le meilleur rendu floral). Spray linge ou textiles : 15–20 gouttes dans 100 ml eau distillée + alcool neutre. Savon froid : 3 % maximum.",
    faqFr: [
      {
        question: "Ce parfum convient-il aussi aux hommes ?",
        answer:
          "Tout à fait. La rose musc est un accord unisexe dans la parfumerie contemporaine. La note musquée équilibre la rose et donne une profondeur qui transcende les genres. Elle est d'ailleurs très présente dans les eaux de parfum masculines modernes.",
      },
      {
        question: "La fragrance sera-t-elle fidèle après combustion en bougie ?",
        answer:
          "La rose musc évolue légèrement à la chaleur — la note florale se renforce tandis que le musc reste en fond. Le résultat en combustion est souvent encore plus agréable qu'à froid. Recommandé sur cire de soja pour le meilleur rendu.",
      },
      {
        question: "Peut-on l'utiliser pour parfumer des textiles ?",
        answer:
          "Oui. Le musc est un excellent fixateur : dilué dans un spray (eau distillée + alcool 70° + quelques gouttes), il parfume durablement rideaux, coussins et linge de lit. Testez sur une zone discrète avant application complète.",
      },
    ],
    characteristics: [
      { label: 'Parfum', value: 'Rose & Musc Blanc' },
      { label: 'Volume', value: '10 ml' },
      { label: 'Type', value: 'Huile parfumée concentrée' },
      { label: 'Usage principal', value: 'Diffusion & DIY' },
      { label: 'Famille olfactive', value: 'Florale musquée' },
    ],
    category: 'aromatherapie',
    retailPriceEur: 19.90,
    compareAtPriceEur: 25,
    stockStatus: 'Normal',
    stockQty: 50,
    isBestSeller: false,
    isVegan: true,
    isCrueltyFree: true,
    tags: ['huile-parfumee', 'rose', 'musc', 'floral', 'aromatherapie', 'diy'],
    images: [`${RAW}/huile-parfumee-rose-musc-concentree/image-1.jpg`],
  },

  {
    id: '187414',
    slug: 'myrrh-fragrance-oil-10ml',
    nameFr: 'Huile Parfumée Myrrhe Résineuse — 10 ml',
    shortDescriptionFr:
      "Résineuse, profonde et chargée d'histoire — la myrrhe est l'un des parfums les plus anciens au monde. Cette huile concentrée invite à la méditation, au recueillement et aux ambiances intérieures profondes.",
    descriptionFr:
      "Huile parfumée concentrée 10 ml. Parfum de myrrhe résineuse, légèrement fumée et boisée. Compatible diffuseur, bougies artisanales, mélanges d'encens. Fixateur naturel exceptionnel.",
    longDescriptionFr:
      "La myrrhe est une résine extraite d'arbrisseaux épineux du Moyen-Orient et d'Afrique de l'Est. Utilisée depuis l'Antiquité dans les rituels religieux et les pratiques méditatives, elle possède un profil olfactif unique : boisé, légèrement fumé, avec une note amère-douce qui évoque l'encens, la terre sèche et les lieux de culte anciens. C'est un parfum qui ouvre l'espace intérieur.\n\nEn diffusion, la myrrhe crée une atmosphère de recueillement propice à la méditation profonde ou à toute pratique contemplative. Elle s'associe magnifiquement avec le bois de santal, le vétiver, l'encens pur ou le patchouli pour composer des mélanges profonds et complexes. Elle est aussi très appréciée des créateurs de bougies artisanales qui recherchent un parfum hors des sentiers fleuris.\n\nLa formulation concentrée offre une longévité supérieure — la myrrhe est naturellement fixatrice. Compatible cires, savons et diffuseurs. Le format 10 ml est idéal pour les créateurs qui aiment tester et composer leurs propres accords.",
    benefitsFr: [
      "Parfum ancestral et profond — idéal pour la méditation et le recueillement",
      "Excellent fixateur naturel — prolonge la tenue de tous les mélanges",
      "Se marie parfaitement avec santal, encens, vétiver et patchouli",
      "Tenue supérieure en bougie — présente à la combustion et à froid",
    ],
    usageFr:
      "Diffusion seule : 4–6 gouttes. Mélange rituel recommandé : 3 gouttes myrrhe + 2 gouttes santal + 1 goutte vétiver. En bougie : 6–8 % du poids de cire, sur cire d'abeille pour le meilleur rendu. Quelques gouttes sur un potpourri de résines et de bois séchés.",
    faqFr: [
      {
        question: "Quelle est la différence entre la myrrhe et l'encens en parfumerie ?",
        answer:
          "L'encens (oliban) est plus citronné, lumineux et volatil. La myrrhe est plus sombre, amère-douce, terrienne et boisée. Les deux sont résineux mais ont des personnalités complémentaires — mélangés, ils forment l'accord dit 'cathédrale' classique de la parfumerie.",
      },
      {
        question: "Peut-on l'utiliser pour imiter un parfum d'encens d'ambiance ?",
        answer:
          "Oui, c'est une excellente base. Pour recréer l'atmosphère d'un encens brûlé, mélangez myrrhe et encens (oliban) en proportion égale dans un diffuseur. Ajoutez une pointe de bois de rose ou de cyprès pour plus de complexité.",
      },
      {
        question: "La myrrhe convient-elle à ceux qui débutent en DIY aromatique ?",
        answer:
          "Elle est légèrement plus technique que les fragrances florales ou fruitées car son profil peut paraître âpre à haute concentration. Commencez par 5 % en bougie et ajustez à votre goût. En diffusion, le dosage est plus facile à contrôler.",
      },
    ],
    characteristics: [
      { label: 'Parfum', value: 'Myrrhe Résineuse' },
      { label: 'Volume', value: '10 ml' },
      { label: 'Type', value: 'Huile parfumée concentrée' },
      { label: 'Usage principal', value: 'Diffusion & DIY' },
      { label: 'Famille olfactive', value: 'Résineuse boisée' },
    ],
    category: 'aromatherapie',
    retailPriceEur: 19.90,
    compareAtPriceEur: 25,
    stockStatus: 'Normal',
    stockQty: 50,
    isBestSeller: false,
    isVegan: true,
    isCrueltyFree: true,
    tags: ['huile-parfumee', 'myrrhe', 'resine', 'meditation', 'aromatherapie', 'diy'],
    images: [`${RAW}/myrrh-fragrance-oil-10ml/image-1.jpg`],
  },
];
