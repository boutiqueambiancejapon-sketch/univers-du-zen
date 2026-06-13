export default function EthicsSection() {
  return (
    <section className="bg-zen-beige">
      <div className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs font-sans tracking-widest uppercase text-zen-terracotta mb-4">
            Notre engagement
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-zen-bark leading-tight mb-6">
            Sélectionnés avec soin,
            <br />livrés depuis l'Europe
          </h2>
          <p className="text-zen-muted leading-relaxed mb-6">
            Chaque produit de notre boutique est choisi auprès de producteurs
            engagés dans des pratiques éthiques — sans test sur animaux,
            avec des matières premières durables et des conditions de travail équitables.
          </p>
          <ul className="space-y-3">
            {[
              'Aucun produit testé sur les animaux',
              'Fournisseurs audités régulièrement',
              'Emballages eco-responsables',
              'Expédition depuis l'Europe en 3–5 jours',
            ].map(item => (
              <li key={item} className="flex items-center gap-3 text-sm text-zen-bark">
                <span className="w-5 h-5 rounded-full bg-zen-sage/20 flex items-center justify-center text-zen-sage flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6">
          {[
            { value: '+7 500', label: 'références disponibles' },
            { value: '3–5j', label: 'délai de livraison' },
            { value: '30j', label: 'de retours gratuits' },
            { value: '100%', label: 'sans test sur animaux' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white rounded-xl p-6">
              <p className="font-serif text-3xl text-zen-terracotta">{value}</p>
              <p className="text-sm text-zen-muted mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
