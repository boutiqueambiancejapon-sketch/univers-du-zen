import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('nav');
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-serif text-zen-bark mb-4">Univers du Zen</h1>
        <p className="text-zen-muted text-lg">Bien-être corps, esprit & maison</p>
      </div>
    </main>
  );
}
