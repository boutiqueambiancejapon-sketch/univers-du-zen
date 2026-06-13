/**
 * Produits importés via Nano Banana (push fournisseur).
 * Ne PAS éditer manuellement — ce fichier est généré par le pipeline.
 * Image URL : raw GitHub du dossier products/<slug>/image-1.jpg
 */
import type { DemoProduct } from '@/lib/demo-products';

const RAW =
  'https://raw.githubusercontent.com/boutiqueambiancejapon-sketch/univers-du-zen/main/products';

export const SUPPLIER_PRODUCTS: DemoProduct[] = [
  {
    id: '220425',
    slug: 'spray-ambiance-bois-santal-apaisant',
    nameFr: "Spray d’Ambiance Bois de Santal — 100 ml",
    shortDescriptionFr:
      "Transformez votre intérieur en sanctuaire zen avec ce spray parfumé au bois de santal. Une fragrance chaude et enveloppante pour une atmosphère apaisante instantanée.",
    descriptionFr:
      "Ce spray d’ambiance diffuse en quelques secondes une fragrance boisée, chaude et méditative inspirée du bois de santal sacré. Flacon aluminium 100 ml, formule longue tenue.",
    longDescriptionFr:
      "Le bois de santal est l’un des parfums les plus anciens et les plus universellement appréciés de l’humanité. Utilisé depuis des millénaires dans les temples et les cérémonies méditatives en Asie, il possède une chaleur boisée légèrement mus quée, profondément apaisante pour le système nerveux.\n\nNotre spray d’ambiance capture cette essence avec une formule équilibrée, conçue pour une diffusion instantanée et une tenue prolongée. Quelques pulvérisations suffisent pour infuser votre salon, votre chambre ou votre espace de méditation d’une aura de sérénité et de raffinement. Il aide à réduire le stress, favorise la concentration et crée naturellement une atmosphère propice à la détente.\n\nLe flacon en aluminium est recyclable et résistant aux chocs. Son format 100 ml est parfait pour la maison comme pour les déplacements.",
    benefitsFr: [
      "Fragrance boisée apaisante — esprit calmé en quelques secondes",
      "Diffusion instantanée et longue tenue",
      "Flacon aluminium recyclé et réutilisable",
      "Idéal méditation, yoga, bureau ou chambre",
    ],
    usageFr:
      "Agitez avant utilisation. Vaporisez 2–3 fois dans la pièce, en direction du plafond ou des murs (évitez le contact direct sur les textiles délicats). Laissez le parfum se diffuser naturellement. Conservez à température ambiante, à l’abri de la chaleur et de la lumière directe.",
    faqFr: [
      {
        question: "Ce spray convient-il à toutes les pièces ?",
        answer:
          "Oui — salon, chambre, bureau, salle de bain, hall d’entrée. Évitez les espaces très confinés sans ventilation. Particulièrement adapté à l’espace de méditation ou de yoga.",
      },
      {
        question: "Peut-on vaporiser sur les textiles ?",
        answer:
          "Testé sur une zone discrète au préalable. Nous recommandons de vaporiser dans l’air plutôt que directement sur les tissus, notamment les soieries et matières délicates.",
      },
      {
        question: "La fragrance bois de santal est-elle naturelle ?",
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
];
