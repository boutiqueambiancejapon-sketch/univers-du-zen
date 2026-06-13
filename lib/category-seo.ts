export interface CategorySeoContent {
  title: string;
  shortDesc: string;
  longDesc: string;
  faq: { question: string; answer: string }[];
}

export const CATEGORY_SEO: Record<string, CategorySeoContent> = {
  aromatherapie: {
    title: "Aromathérapie — Huiles Essentielles Naturelles",
    shortDesc:
      "Découvrez notre sélection d’huiles essentielles pures et de diffuseurs pour créer une atmosphère apaisante chez vous. Chaque produit est sélectionné pour sa qualité, son origine tracée et son efficacité prouvée.",
    longDesc:
      "L’aromathérapie est l’art d’utiliser les essences naturelles des plantes pour favoriser le bien-être physique et émotionnel. Pratiquée depuis des millénaires en Orient comme en Occident, elle s’impose aujourd’hui comme l’un des piliers du mode de vie naturel.\n\nChez Univers du Zen, nous sélectionnons rigoureusement chaque huile essentielle selon trois critères : la pureté (100% pure et naturelle, sans additif), l’origine (producteurs engagés dans des pratiques durables) et la traçabilité (chaque lot est testé en laboratoire indépendant). Nos diffuseurs ultrasoniques sont choisis pour leur silence, leur design sobre et leur efficacité à préserver les molécules actives des huiles.\n\nQue vous cherchiez à favoriser l’endormissement avec la lavande vraie, à stimuler votre concentration avec le romarin ou à purifier l’air de votre maison avec l’arbre à thé, notre gamme couvre tous vos besoins bien-être. Les huiles essentielles s’utilisent en diffusion atmosphérique, en application topique (diluées dans une huile végétale), en bain aromatique ou en inhalation.\n\nNous livrons en Belgique, en France et au Luxembourg en 3 à 5 jours ouvrables, avec emballage éco-responsable. Tous nos produits sont expédiés depuis nos entrepôts européens, garantissant une fraîcheur et une traçabilité optimales.",
    faq: [
      {
        question: "Comment choisir son huile essentielle pour le sommeil ?",
        answer:
          "La lavande vraie (Lavandula angustifolia) est la référence pour favoriser l’endormissement. Vous pouvez aussi opter pour la camomille romaine, le petit grain bigarade ou la marjolaine à coquilles. En diffusion 30 minutes avant le coucher, ou quelques gouttes sur l’oreiller diluées dans une huile végétale.",
      },
      {
        question: "Peut-on utiliser les huiles essentielles sans diffuseur ?",
        answer:
          "Oui. Vous pouvez inhaler directement depuis le flacon (quelques secondes), déposer 1-2 gouttes sur un mouchoir, ou les mélanger à une huile végétale (jojoba, amande douce) pour un massage. Certaines se déposent aussi sur les poignets, la nuque ou la plante des pieds.",
      },
      {
        question: "Vos huiles essentielles sont-elles bio ?",
        answer:
          "Nous proposons une large sélection certifiée bio. Chaque fiche produit indique clairement si l’huile est certifiée Agriculture Biologique. Toutes nos huiles, bio ou non, sont 100% pures, naturelles et sans additif.",
      },
      {
        question: "Quelle est la durée de conservation d’une huile essentielle ?",
        answer:
          "La plupart des huiles essentielles se conservent 3 à 5 ans si elles sont stockées correctement : à l’abri de la lumière, de la chaleur et de l’humidité. Certaines agrumes (citron, bergamote) ont une durée plus courte : 12 à 18 mois.",
      },
    ],
  },
  bougies: {
    title: "Bougies Naturelles — Cire de Soja & Parfums Doux",
    shortDesc:
      "Bougies artisanales en cire de soja pure, parfums naturels et mèches en coton. Pour une atmosphère chaleureuse et une combustion propre, sans paraffine ni produits chimiques.",
    longDesc:
      "La bougie est bien plus qu’un objet décoratif : c’est un rituel. La flamme qui vacille, le parfum qui se répand doucement dans la pièce, la lumière qui adoucit les angles — tout cela contribue à créer un espace de bien-être chez soi.\n\nNos bougies sont fabriquées à partir de cire de soja, extraite de soja non-OGM. Contrairement à la paraffine (dérivée du pétrole), la cire de soja est biodegradable, ne libère pas de toxines en brulant et offre une durée de vie 50% plus longue. Nos mèches sont en coton naturel tressé, garantissant une flamme stable et des dépôts de carbone nuls.\n\nLes parfums utilisés sont soit des huiles essentielles pures, soit des parfums synthétiques de haute qualité soigneusement sélectionnés. Nos contenants en verre sont réutilisables : nettoyez le fond après consommation et redonner leur une seconde vie en pot à crayons, vase ou rangement cosmtique.\n\nChaque bougie de notre collection brule entre 35 et 55 heures selon la taille. Pour maximiser la durée de vie : coupez la mèche à 5 mm avant chaque allumage, et n’éteignez jamais avant que le fond de cire soit entièrement fondu lors de la première utilisation.",
    faq: [
      {
        question: "Pourquoi choisir une bougie en cire de soja plutôt qu’en paraffine ?",
        answer:
          "La cire de soja est végétale, renouvelable et biodegradable. Elle brule plus lentement (durée de vie plus longue), à une température plus basse, sans dégager de suie ni de composés toxiques. Idéale pour les intérieurs fermés et les personnes sensibles.",
      },
      {
        question: "Comment bien entretenir ma bougie pour qu’elle dure le plus longtemps possible ?",
        answer:
          "Coupez la mèche à 5 mm avant chaque allumage. Lors de la première utilisation, laissez brûler jusqu’à ce que tout le dessus soit fondu (2-3h) pour éviter l’effet tunnel. Ne brülez jamais plus de 4h d’affilée. Stockez à l’abri de la lumière directe.",
      },
      {
        question: "Vos bougies sont-elles testées sur les animaux ?",
        answer:
          "Non. Toutes nos bougies sont cruelty-free. Nous ne travaillons qu’avec des fournisseurs certifiés sans test sur les animaux, en lien avec notre engagement éthique global.",
      },
    ],
  },
  encens: {
    title: "Encens Naturels — Bâtonnets, Résines & Cônes",
    shortDesc:
      "Encens artisanaux du monde entier : bâtonnets nag champa, palo santo sacré, résines de myrrhe et d’oliban. Pour vos rituels de méditation, de purification ou simplement pour parfumer votre espace.",
    longDesc:
      "L’encens est l’une des plus anciennes pratiques de bien-être. Des temples bouddhistes d’Asie aux rituels amérindiens, de l’encens égyptien aux traditions champêteurs indiennes, chaque civilisation a utilisé les fumées aromatiques pour purifier, méditer et soigner.\n\nNos encens sont sélectionnés auprès de producteurs artisanaux engagés : pas de charbon, pas de produits chimiques de synthèse. Nos bâtonnets Nag Champa sont confectionnés à la main selon la recette traditionnelle indienne — fleur de frangipanier, santal, résines naturelles. Le Palo Santo que nous proposons provient de bois de bois tombés naturellement, sans abattage d’arbres vivants.\n\nPour une expérience optimale : brûlez l’encens dans une pièce aérée, sur un support adapté. Prévoyez 5 à 15 minutes de fumée selon le format. Les résines (myrrhe, oliban, benjoin) se brülent sur charbons ardents et offrent un parfum plus intense, plus long et plus authentique que les bâtonnets.\n\nNos encens sont sans gluten, végans et cruet-free.",
    faq: [
      {
        question: "Quelle est la différence entre encens à bâtonnets et résine d’encens ?",
        answer:
          "Les bâtonnets sont pratiques, prêts à l’emploi et brulent seuls une fois allumés. Les résines offrent un parfum plus pur, plus intense et plus authentique — elles sont brûlées sur un charbon ardent dans un encensoir. Les résines sont la forme la plus ancienne d’encens.",
      },
      {
        question: "Le Palo Santo est-il écologiquement responsable ?",
        answer:
          "Notre Palo Santo provient exclusivement de bois tombés naturellement en Amérique du Sud — jamais d’abattage d’arbres vivants. Les arbres doivent rester à terre au moins 4 ans avant récolte pour que les huiles aromatiques se développent pleinement. Certifié commerce équitable.",
      },
      {
        question: "Comment utiliser l’encens pour la méditation ?",
        answer:
          "Allumez votre encens quelques minutes avant de commencer votre séance. La fumée et le parfum signalent au cerveau qu’il est temps de se centrer. Privilégiez les parfums terreux (palo santo, santal, cèdre) pour l’ancrage, ou les parfums floraux (nag champa, jasmin) pour l’ouverture spirituelle.",
      },
    ],
  },
  "pierres-cristaux": {
    title: "Pierres & Cristaux — Quartz, Améthyste & Mineraux Naturels",
    shortDesc:
      "Pierres semi-précieuses et cristaux naturels sélectionnés pour leur qualité, leur couleur et leur énergie. Collection brute, roule ou sculptée pour la décoration, la lithérapie ou le bien-être personnel.",
    longDesc:
      "Les pierres et cristaux fascinent l’humanité depuis des millénaires. Amulettes, bijoux, outils spirituels ou simples objets de décoration — leur beauté minuscule et leurs textures uniques en font des objets à part. Chaque pierre est unique : même famille, jamais identique.\n\nNous sélectionnons nos pierres directement auprès de négociants spécialisés qui travaillent avec des mines éthiques. Notre critère principal : la beauté naturelle et la qualité du polissage (pour les pierres roules) ou l’intégrité brute (pour les échantillons naturels).\n\nLa lithérapie — utilisation des pierres à des fins énergétiques et de bien-être — est une pratique complémentaire qui s’est développée en parallèle des médecines conventionnelles. Chaque pierre est associée à des propriétés spécifiques selon les traditions : le quartz rose pour l’amour et la douceur, l’améthyste pour la spléendeur et la paix intérieure, l’obsidienne pour la protection.\n\nNos pierres sont livrées dans une pochette en lin avec une carte explicative sur leurs propriétés traditionnelles et conseils d’entretien.",
    faq: [
      {
        question: "Comment purifier et recharger mes cristaux ?",
        answer:
          "Il existe plusieurs méthodes : le bain de lumière solaire (1-2h, attention aux pierres décolorables), la lumière lunaire (nuit de pleine lune), la fumée de Palo Santo ou de sauge, le sel marin (ne convient pas à toutes les pierres), ou le son (bols tibétains, diapason).",
      },
      {
        question: "Quelle pierre choisir pour débuter en lithérapie ?",
        answer:
          "Le quartz rose est idéal pour commencer : polyvalent, doux et accessible. Le cristal de roche (quartz clair) est excellent pour amplifier les intentions. L’améthyste aide à la relaxation et au sommeil. La pierre de lune soutient l’intuition. Choisissez intuitivement — la pierre qui vous attire est souvent celle dont vous avez besoin.",
      },
      {
        question: "Vos pierres sont-elles naturelles ou traitées ?",
        answer:
          "Toutes nos pierres sont naturelles. Certaines peuvent avoir subi un polissage (pierres roules, sphères) mais sans traitement chimique ni teinture. Les couleurs sont 100% naturelles. Chaque fiche produit précise l’origine géographique de la pierre.",
      },
    ],
  },
  "maison-deco": {
    title: "Maison & Déco Zen — Objets de bien-être pour l’intérieur",
    shortDesc:
      "Diffuseurs, bols tibétains, statues et objets déco pour créer un intérieur zen et apaisant. Des pièces uniques, choisies pour leur beauté naturelle et leur résonance positive.",
    longDesc:
      "L’aménagement intérieur influence directement notre bien-être mental et émotionnel. Le principe du Feng Shui ou la philosophie wabi-sabi japonaise nous rappellent que chaque objet dans notre espace a une énergie, une intention.\n\nNous avons sélectionné pour vous une collection d’objets qui conjuguent beauté naturelle et fonctionnalité bien-être. Nos diffuseurs ultrasoniques en bambou et céramique transforment vos huiles essentielles en brume fine sans altérer leurs propriétés thérapeutiques. Nos bols chantants tibétains, faits à la main en alliage de métaux, produisent des vibrations sonores qui induisent état de calme et de concentration.\n\nChaque pièce est sélectionnée pour sa qualité de fabrication, ses matériaux durables (bambou, céramique, bois, pierre naturelle) et son esthétique minimaliste. Nous évitons les plastiques, les dorures bon marché et les pièces qui cherchent à impressionner plutôt qu’à apaiser.\n\nNos objets sont idéaux comme cadeaux bien-être : coffrets, emballage soigné et possibilité d’ajout d’un message personnalisé.",
    faq: [
      {
        question: "Comment choisir un bon diffuseur d’huiles essentielles ?",
        answer:
          "Privilégiez les diffuseurs ultrasoniques (brume froide) qui n’altèrent pas les molécules actives des huiles. Vérifiez la surface couverte (15 à 40m²), l’autonomie du réservoir, le niveau sonore (< 30dB pour la chambre) et la présence d’une minuterie. Les matériaux naturels (bambou, céramique) sont préférables au plastique.",
      },
      {
        question: "Comment utiliser un bol tibétain ?",
        answer:
          "Posez le bol dans la paume ouverte de votre main non-dominante. Avec le maillet, frottez lentement le bord extérieur du bol en maintenant une pression constante. Le son apparaît progressivement. Vous pouvez aussi frapper le bol d’un coup sec pour une sonnerie instantanée. Un bon bol produit un son pur qui résonne plusieurs secondes.",
      },
      {
        question: "Proposez-vous un service d’emballage cadeau ?",
        answer:
          "Oui, tous nos produits peuvent être emballés en format cadeau avec du papier de soie recyclé et un ruban naturel. Option disponible au checkout. Vous pouvez également ajouter un message manuscrit à tarif gratuit.",
      },
    ],
  },
  "thes-artisanaux": {
    title: "Thés Artisanaux & Infusions Naturelles",
    shortDesc:
      "Thés bio sélectionnés à la source : matcha de cérémonie du Japon, pu-erh de Yunnan, oolongs tawanais et mélanges bien-être. Pour les amateurs exigeants comme pour les curieux.",
    longDesc:
      "Le thé est la deuxième boisson la plus consommée au monde après l’eau. Mais derrière ce mot simple se cache une richesse infinie : des centaines de variétés, des milliers de jardins, des séacles de savoir-faire artisanal.\n\nNous travaillons directement avec des théiculteurs en Agriculture Biologique certifiée, principalement au Japon (Uji, Kagoshima), en Chine (Yunnan, Fujian), en Inde (Darjeeling, Assam) et à Taïwan. Nos thés ne passent pas par des négociants intermédiaires — nous visitons les jardins ou travaillons avec des importateurs spécialistes de confiance.\n\nNotre sélection comprend des thés pour toutes les occasions : le matcha de grémonie pour une énergie claire et centrée, les thés blancs pour leur douceur florale, les oolongs toréfiés pour accompagner un moment de repos, les pu-erh vieillis pour les explorateurs. Nous proposons aussi des mélanges bien-être formulés par notre herboriste partenaire : sommeil, relaxation, énergie, digestion.\n\nChaque thé est livré dans un emballage hermtique protégé de la lumière et de l’humidité, avec une fiche de dégustation et les paramètres d’infusion recommandés.",
    faq: [
      {
        question: "Comment conserver correctement mon thé ?",
        answer:
          "Conservez le thé dans une boîte hermétique, à l’abri de la lumière, de l’humidité, de la chaleur et des odeurs fortes. Évitez le réfrigérateur (humidité). Un thé bien stocké garde sa saveur 12 à 24 mois selon la variété. Les pu-erh vieillis s’améliorent avec le temps.",
      },
      {
        question: "Quelle est la différence entre matcha de cérémonie et matcha culinaire ?",
        answer:
          "Le grade cérémonie est issu des premières feuilles de la récolte de printemps, ombrages 4-6 semaines, broyage sur pierre lente. Couleur vert intense, saveur douce, umami marqué, amértume nulle. Le grade culinaire est plus astringent et plus amère — adapté aux recettes (lattes, pâtisseries).",
      },
      {
        question: "La cafféine dans le thé est-elle différente de celle du café ?",
        answer:
          "Oui. La théine (cafféine du thé) est librée plus lentement grâce à la présence de L-théanine, un acide aminé qui modulee ses effets. Résultat : une énergie plus stable, sans pic ni crash, et une concentration améliorée sans nervosité.",
      },
    ],
  },
};
