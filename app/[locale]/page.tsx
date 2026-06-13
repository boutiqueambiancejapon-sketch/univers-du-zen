import Hero from '@/components/home/Hero';
import EthicsBar from '@/components/home/EthicsBar';
import CategoriesGrid from '@/components/home/CategoriesGrid';
import BestSellers from '@/components/home/BestSellers';
import EthicsSection from '@/components/home/EthicsSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <EthicsBar />
      <CategoriesGrid />
      <BestSellers />
      <EthicsSection />
    </>
  );
}
