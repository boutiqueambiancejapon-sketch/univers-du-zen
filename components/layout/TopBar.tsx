'use client';

import { useTranslations } from 'next-intl';

export default function TopBar() {
  const t = useTranslations('topbar');

  return (
    <div className="bg-zen-bark text-white text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between gap-4">
        {/* Gauche (desktop) */}
        <span className="hidden md:block text-white/70 tracking-wide">
          {t('ethical')}
        </span>

        {/* Centre — visible aussi sur mobile */}
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <span>{t('shipping')}</span>
        </div>

        {/* Droite (desktop) */}
        <span className="hidden md:block text-white/70 tracking-wide">
          {t('ethical')}
        </span>
      </div>
    </div>
  );
}
