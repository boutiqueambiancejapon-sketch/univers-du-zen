import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function Hero() {
  const locale = useLocale();

  return (
    <section className="relative h-[85vh] min-h-[560px] overflow-hidden">
      <Image
        src="/images/udz-hero-homepage.jpeg"
        alt="Femme allumant une bougie dans un intérieur cosy"
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-zen-bark/70 via-zen-bark/30 to-transparent" />
      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <div className="max-w-lg">
          <p className="text-white/70 text-sm font-sans tracking-widest uppercase mb-4">
            Bien-être corps, esprit &amp; maison
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-white leading-tight mb-6">
            Votre parenthèse
            <br />
            <span className="text-zen-gold">zen</span> au quotidien
          </h1>
          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            Sélection éthique d&apos;aromates, bougies, cristaux et déco.
            Expédié depuis l&apos;Europe.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/${locale}/boutique`} className="btn-primary text-center">
              Découvrir la boutique
            </Link>
            <Link
              href={`/${locale}/boutique/bougies`}
              className="border border-white text-white font-sans font-medium px-6 py-3 rounded hover:bg-white hover:text-zen-bark transition-colors text-center"
            >
              Nos best-sellers
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 text-xs font-sans">
        <span className="text-zen-terracotta font-semibold">✓</span>
        <span className="text-zen-bark ml-1">Livraison offerte dès 59 €</span>
      </div>
    </section>
  );
}
