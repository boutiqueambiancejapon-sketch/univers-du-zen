export interface Bundle {
  id: string;
  name: string;
  tagline: string;
  productSlugs: string[];
  swatchColors: string[];
  regularPrice: number;
  bundlePrice: number;
  discountPct: number;
}

export const BUNDLES: Bundle[] = [
  {
    id: 'rituel-relaxation',
    name: 'Le rituel relaxation',
    tagline: 'Lavande · Camomille · Rose Musc',
    productSlugs: [
      'huile-parfumee-concentree-lavande-blanche',
      'huile-parfumee-concentree-camomille-apaisante',
      'huile-parfumee-concentree-rose-musc',
    ],
    swatchColors: ['#A89EC0', '#F5E4A0', '#F4C0C8'],
    regularPrice: 74.70,
    bundlePrice: 63.50,
    discountPct: 15,
  },
  {
    id: 'rituel-energie',
    name: 'Le rituel énergie',
    tagline: 'Orange · Menthe · Spray Santal',
    productSlugs: [
      'huile-parfumee-concentree-orange-douce',
      'huile-parfumee-concentree-menthe-poivree',
      'spray-parfume-santal-zenitude',
    ],
    swatchColors: ['#F5A53A', '#8EC67A', '#B8967A'],
    regularPrice: 62.79,
    bundlePrice: 53.37,
    discountPct: 15,
  },
  {
    id: 'rituel-meditation',
    name: 'Le rituel méditation',
    tagline: 'Myrrhe · Lavande · Camomille',
    productSlugs: [
      'myrrh-fragrance-oil-10ml',
      'huile-parfumee-concentree-lavande-blanche',
      'huile-parfumee-concentree-camomille-apaisante',
    ],
    swatchColors: ['#C4A060', '#A89EC0', '#F5E4A0'],
    regularPrice: 74.70,
    bundlePrice: 63.50,
    discountPct: 15,
  },
];
