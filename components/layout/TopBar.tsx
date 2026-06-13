'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

// Durée du countdown en secondes (15 min)
const COUNTDOWN_DURATION = 15 * 60;

export default function TopBar() {
  const t = useTranslations('topbar');
  const [seconds, setSeconds] = useState(COUNTDOWN_DURATION);
  const [hasOffer, setHasOffer] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('topbar-countdown');
    const start = stored ? parseInt(stored) : Date.now();
    if (!stored) sessionStorage.setItem('topbar-countdown', String(start));

    const tick = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const remaining = COUNTDOWN_DURATION - elapsed;
      if (remaining <= 0) {
        setHasOffer(false);
        clearInterval(tick);
      } else {
        setSeconds(remaining);
      }
    }, 1000);

    return () => clearInterval(tick);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="bg-zen-bark text-white text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between gap-4">
        {/* Gauche */}
        <span className="hidden md:block text-white/70 tracking-wide">
          {t('ethical')}
        </span>

        {/* Centre */}
        <div className="flex items-center gap-2 font-medium tracking-wide">
          {hasOffer ? (
            <>
              <span>{t('offer', { discount: 20 })}</span>
              <span className="bg-zen-terracotta text-white px-2 py-0.5 rounded font-mono countdown-pulse">
                {mm}:{ss}
              </span>
            </>
          ) : (
            <span>{t('shipping')}</span>
          )}
        </div>

        {/* Droite */}
        <span className="hidden md:block text-white/70 tracking-wide">
          {t('shipping')}
        </span>
      </div>
    </div>
  );
}
