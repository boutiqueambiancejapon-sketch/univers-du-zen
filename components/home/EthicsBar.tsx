const ITEMS = [
  '— SÉLECTION 100% NATURELLE',
  '— SANS TEST SUR ANIMAUX',
  '— EXPÉDIÉ DEPUIS L\'EUROPE',
  '— LIVRAISON OFFERTE DÈS 59 €',
  '— RETOURS 30 JOURS',
  '— PAIEMENT SÉCURISÉ',
  '— STOCKS EN SLOVAQUIE',
  '— LIVRAISON 3–5 JOURS',
];

export default function EthicsBar() {
  const text = ITEMS.join('  ');

  return (
    <div className="overflow-hidden" style={{ background: '#2C2420', color: '#F2ECE0' }}>
      <div className="flex py-3" style={{ animation: 'marquee 28s linear infinite' }}>
        {/* Double pour boucle seamless */}
        {[0, 1].map(k => (
          <div key={k} className="flex flex-shrink-0 items-center gap-0 whitespace-nowrap pr-0">
            {ITEMS.map((item, i) => (
              <span key={i} className="font-sans font-medium" style={{ fontSize: 12, letterSpacing: '0.06em', paddingRight: 40, color: 'rgba(242,236,224,.75)' }}>
                {item}
                {i < ITEMS.length - 1 && ''}
              </span>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
