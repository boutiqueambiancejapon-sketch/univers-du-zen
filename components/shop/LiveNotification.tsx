'use client';

import { useState, useEffect } from 'react';

const POOL = [
  { name: 'Lucas',    city: 'Toulouse',  product: 'Bougie de soja « Coucher de soleil »',          min: 3  },
  { name: 'Marie',    city: 'Bruxelles', product: 'Huile Parfumée Lavande Blanche — Pack 10×10 ml', min: 7  },
  { name: 'Thomas',   city: 'Lyon',      product: 'Spray Parfumé Santal Zénitude',                  min: 12 },
  { name: 'Sophie',   city: 'Liège',     product: 'Huile Parfumée Rose Musc — Pack 10×10 ml',       min: 5  },
  { name: 'Antoine',  city: 'Paris',     product: 'Huile Parfumée Camomille Apaisante',              min: 18 },
  { name: 'Julie',    city: 'Gand',      product: 'Huile Parfumée Menthe Poivrée — Pack 10×10 ml',   min: 2  },
  { name: 'Cédric',   city: 'Namur',     product: 'Huile Parfumée Orange Douce — Pack 10×10 ml',     min: 9  },
  { name: 'Laura',    city: 'Bordeaux',  product: 'Spray Parfumé Santal Zénitude',                  min: 14 },
  { name: 'Emma',     city: 'Louvain',   product: 'Huile Parfumée Myrrhe — Pack 10×10 ml',          min: 6  },
  { name: 'Nicolas',  city: 'Strasbourg',product: 'Huile Parfumée Lavande Blanche — Pack 10×10 ml', min: 21 },
];

const SHOW_MS    = 5_000;
const INTERVAL_MS = 32_000;
const FIRST_MS   = 10_000;

export default function LiveNotification() {
  const [visible, setVisible] = useState(false);
  const [idx, setIdx]         = useState(0);

  const show = (nextIdx: number) => {
    setIdx(nextIdx);
    setVisible(true);
    setTimeout(() => setVisible(false), SHOW_MS);
  };

  useEffect(() => {
    const first = setTimeout(() => show(0), FIRST_MS);
    const loop  = setInterval(() => {
      setIdx(i => {
        const next = (i + 1) % POOL.length;
        show(next);
        return next;
      });
    }, INTERVAL_MS);
    return () => { clearTimeout(first); clearInterval(loop); };
  }, []); // eslint-disable-line

  const n = POOL[idx];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`fixed bottom-5 left-4 z-40 w-[270px] bg-white rounded-2xl shadow-xl border border-gray-100 p-3 flex items-start gap-2.5 transition-all duration-500 ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-zen-bark flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-sans font-bold">{n.name[0]}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-sans text-zen-muted leading-snug">
          <strong className="text-zen-bark">{n.name}</strong> de {n.city} vient de commander
        </p>
        <p className="text-xs font-sans font-medium text-zen-bark mt-0.5 leading-snug line-clamp-2">
          {n.product}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <p className="text-[10px] text-zen-muted font-sans">
            il y a {n.min} min · achat vérifié ✓
          </p>
        </div>
      </div>
    </div>
  );
}
