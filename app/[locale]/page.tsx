import Hero from '@/components/home/Hero';
import EthicsBar from '@/components/home/EthicsBar';
import CategoriesGrid from '@/components/home/CategoriesGrid';
import BestSellers from '@/components/home/BestSellers';
import EthicsSection from '@/components/home/EthicsSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import StatsBar from '@/components/home/StatsBar';
import ReviewsSection from '@/components/home/ReviewsSection';
import { DEMO_PRODUCTS } from '@/lib/demo-products';

const BOUGIES_SELECTION = DEMO_PRODUCTS.filter(p =>
  ['bougies', 'encens'].includes(p.category ?? '')
);

const AROMA_SELECTION = DEMO_PRODUCTS.filter(p =>
  ['aromatherapie', 'pierres-cristaux', 'thes-artisanaux'].includes(p.category ?? '')
);

export default function HomePage() {
  return (
    <>
      <Hero />
      <EthicsBar />
      <CategoriesGrid />

      <FeaturedSection
        sectionLabel="La collection à l&apos;honneur"
        title="Ambiancer la maison"
        description="Bougies de soja, encens et parfums naturels pour transformer votre intérieur en espace de quiétude."
        products={BOUGIES_SELECTION}
        ctaHref="/boutique/bougies"
        cardBg="#2B4036"
        pieceCount={8}
        discount={15}
      />

      <StatsBar />

      <BestSellers />

      <FeaturedSection
        sectionLabel="Les incontournables"
        title="Aromathérapie Essentielle"
        description="Huiles pures, diffuseurs et cristaux pour un bien-être au quotidien. Sélectionnés avec soin, certifiés sans test animal."
        products={AROMA_SELECTION}
        ctaHref="/boutique/aromatherapie"
        cardBg="#3B2A1F"
        pieceCount={12}
      />

      <ReviewsSection />

      <EthicsSection />
    </>
  );
}
