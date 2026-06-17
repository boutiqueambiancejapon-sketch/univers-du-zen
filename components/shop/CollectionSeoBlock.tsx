import { getCollectionSeo } from '@/lib/collection-seo';

/** Bloc éditorial SEO (description longue + FAQ) rendu en bas d'une page collection. */
export default async function CollectionSeoBlock({ path }: { path: string }) {
  const seo = await getCollectionSeo(path);
  if (!seo || (!seo.long_description && seo.faq.length === 0)) return null;

  return (
    <div className="bg-zen-beige border-t border-zen-sand mt-8">
      <div className="max-w-4xl mx-auto px-4 py-14">
        {seo.long_description && (
          <div className="mb-10">
            {seo.long_description.split('\n\n').map((para, i) => (
              <p key={i} className="text-zen-muted leading-relaxed mb-4 text-sm">{para}</p>
            ))}
          </div>
        )}

        {seo.faq.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl text-zen-bark mb-6">Questions fréquentes</h2>
            <div className="space-y-3">
              {seo.faq.map((item, i) => (
                <details key={i} className="group border border-zen-sand rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-sans font-medium text-zen-bark hover:bg-white/60 transition-colors list-none">
                    {item.question}
                    <span className="ml-3 flex-shrink-0 text-zen-muted group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <div className="px-4 pb-4 text-sm text-zen-muted leading-relaxed border-t border-zen-sand pt-3">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
