import Hero from '@/components/home/Hero';
import EthicsBar from '@/components/home/EthicsBar';
import CategoriesGrid from '@/components/home/CategoriesGrid';
import BestSellers from '@/components/home/BestSellers';
import EthicsSection from '@/components/home/EthicsSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import StatsBar from '@/components/home/StatsBar';
import ReviewsSection from '@/components/home/ReviewsSection';
import { getPublishedProducts } from '@/lib/get-products';

export default function HomePage() {
  const products = getPublishedProducts();

  // Huiles de fragrance en vedette (collection principale actuelle)
  const huilesFeatured = products.slice(0, 4);
  // Best sellers = les 4 premiers dispo
  const bestSellers = products.slice(0, 4);

  return (
    <>
      <Hero />
      <EthicsBar />
      <CategoriesGrid />

      {products.length > 0 && (
        <FeaturedSection
          sectionLabel="Nouveautés"
          title="Huiles de Fragrance"
          description="Nos huiles parfumées naturelles pour diffuseur, brûle-parfum et créations DIY. Longue tenue, formulas haute concentration."
          products={huilesFeatured as any}
          ctaHref="/boutique"
          cardBg="#2B4036"
          pieceCount={products.length}
        />
      )}

      <StatsBar />

      {products.length > 0 && (
        <BestSellers products={bestSellers as any} />
      )}

      <ReviewsSection />
      <EthicsSection />
    </>
  );
}
