'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Star, Check, Loader2, ShieldCheck } from 'lucide-react';

export interface ProductReviewItem {
  id: string;
  author_name: string;
  rating: number;
  title: string | null;
  body: string;
  verified_purchase: boolean;
  created_at: string;
}

export interface ReviewSummaryUI {
  count: number;
  average: number;
  distribution: Record<number, number>;
}

interface Props {
  slug: string;
  sku?: string;
  productName: string;
  initialReviews: ProductReviewItem[];
  summary: ReviewSummaryUI;
}

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex" aria-label={`${value} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(value) ? 'text-zen-gold' : 'text-zen-sand'}
          fill={i <= Math.round(value) ? 'currentColor' : 'none'}
        />
      ))}
    </span>
  );
}

type Elig =
  | { state: 'loading' }
  | { state: 'not_logged_in' }
  | { state: 'not_purchased' }
  | { state: 'already_reviewed'; status: string }
  | { state: 'eligible'; suggestedName: string };

export default function ProductReviews({ slug, sku, productName, initialReviews, summary }: Props) {
  const locale = useLocale();
  const [elig, setElig] = useState<Elig>({ state: 'loading' });
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams({ slug, ...(sku ? { sku } : {}) });
    fetch(`/api/reviews/eligibility?${q}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.loggedIn) return setElig({ state: 'not_logged_in' });
        if (d.eligible) {
          setName((d.suggestedName as string) ?? '');
          return setElig({ state: 'eligible', suggestedName: d.suggestedName ?? '' });
        }
        if (d.reason === 'already_reviewed') return setElig({ state: 'already_reviewed', status: d.status });
        return setElig({ state: 'not_purchased' });
      })
      .catch(() => setElig({ state: 'not_purchased' }));
  }, [slug, sku]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (rating < 1) { setError('Veuillez sélectionner une note.'); return; }
    if (comment.trim().length < 10) { setError('Votre avis doit faire au moins 10 caractères.'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, sku, rating, title, comment, authorName: name }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Une erreur est survenue.'); return; }
      setDone(true);
    } catch {
      setError('Impossible de contacter le serveur. Réessayez.');
    } finally {
      setSubmitting(false);
    }
  }

  const { count, average, distribution } = summary;

  return (
    <section id="avis" className="mt-16 pt-12 border-t border-zen-sand scroll-mt-24">
      <h2 className="font-serif text-3xl lg:text-4xl text-zen-bark mb-8">Avis clients</h2>

      <div className="grid lg:grid-cols-[300px_1fr] gap-10 lg:gap-16">
        {/* ===== Résumé ===== */}
        <div>
          {count > 0 ? (
            <>
              <div className="flex items-end gap-3 mb-3">
                <span className="font-serif text-5xl text-zen-bark leading-none">
                  {average.toFixed(1).replace('.', ',')}
                </span>
                <div className="pb-1">
                  <Stars value={average} size={18} />
                  <p className="text-xs font-sans text-zen-muted mt-1">
                    {count} avis vérifié{count > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="space-y-1.5 mt-5">
                {[5, 4, 3, 2, 1].map((n) => {
                  const c = distribution[n] ?? 0;
                  const pct = count ? Math.round((c / count) * 100) : 0;
                  return (
                    <div key={n} className="flex items-center gap-2 text-xs font-sans text-zen-muted">
                      <span className="w-3 text-right">{n}</span>
                      <Star size={11} className="text-zen-gold flex-shrink-0" fill="currentColor" />
                      <span className="flex-1 h-1.5 rounded-full bg-zen-sand overflow-hidden">
                        <span className="block h-full rounded-full bg-zen-gold" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="w-6 text-right">{c}</span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-zen-muted text-sm font-sans">
              <Stars value={0} size={18} />
              <p className="mt-2">Aucun avis pour le moment.</p>
              <p className="mt-1 text-zen-muted/70">Soyez le premier à donner votre avis sur ce produit.</p>
            </div>
          )}
        </div>

        {/* ===== Liste + formulaire ===== */}
        <div>
          {/* Formulaire / état d'éligibilité */}
          <div className="rounded-2xl border border-zen-sand p-6 mb-8 bg-zen-beige/40">
            {done ? (
              <div className="flex items-start gap-3 text-sm font-sans text-zen-bark">
                <Check size={18} className="text-zen-sage flex-shrink-0 mt-0.5" />
                <p>Merci ! Votre avis a été envoyé et sera publié après validation.</p>
              </div>
            ) : elig.state === 'loading' ? (
              <p className="text-sm font-sans text-zen-muted flex items-center gap-2">
                <Loader2 size={15} className="animate-spin" /> Chargement…
              </p>
            ) : elig.state === 'not_logged_in' ? (
              <p className="text-sm font-sans text-zen-muted">
                <Link href={`/${locale}/compte/connexion`} className="text-zen-terracotta font-semibold underline underline-offset-2">
                  Connectez-vous
                </Link>{' '}
                pour laisser un avis. Seuls les clients ayant acheté ce produit peuvent l&apos;évaluer.
              </p>
            ) : elig.state === 'not_purchased' ? (
              <p className="text-sm font-sans text-zen-muted flex items-start gap-2">
                <ShieldCheck size={16} className="text-zen-sage flex-shrink-0 mt-0.5" />
                Seuls les clients ayant acheté ce produit peuvent laisser un avis vérifié.
              </p>
            ) : elig.state === 'already_reviewed' ? (
              <p className="text-sm font-sans text-zen-muted">
                Vous avez déjà laissé un avis pour ce produit
                {elig.status === 'pending' ? ' — il est en attente de validation.' : '.'}
              </p>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <p className="text-sm font-sans font-semibold text-zen-bark flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-zen-sage" /> Donnez votre avis sur {productName}
                </p>

                {/* Étoiles */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i)}
                      onMouseEnter={() => setHover(i)}
                      onMouseLeave={() => setHover(0)}
                      aria-label={`${i} étoile${i > 1 ? 's' : ''}`}
                      className="p-0.5"
                    >
                      <Star
                        size={26}
                        className={i <= (hover || rating) ? 'text-zen-gold' : 'text-zen-sand'}
                        fill={i <= (hover || rating) ? 'currentColor' : 'none'}
                      />
                    </button>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre prénom"
                    maxLength={60}
                    className="w-full rounded-xl border border-zen-sand px-4 py-2.5 text-sm font-sans text-zen-bark bg-white focus:outline-none focus:ring-2 focus:ring-zen-bark/20 focus:border-zen-bark"
                  />
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Titre (facultatif)"
                    maxLength={120}
                    className="w-full rounded-xl border border-zen-sand px-4 py-2.5 text-sm font-sans text-zen-bark bg-white focus:outline-none focus:ring-2 focus:ring-zen-bark/20 focus:border-zen-bark"
                  />
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Partagez votre expérience avec ce produit…"
                  rows={4}
                  maxLength={2000}
                  className="w-full rounded-xl border border-zen-sand px-4 py-3 text-sm font-sans text-zen-bark bg-white focus:outline-none focus:ring-2 focus:ring-zen-bark/20 focus:border-zen-bark resize-none"
                />

                {error && <p className="text-sm font-sans text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 bg-zen-bark text-white font-sans font-semibold text-sm px-6 py-3 rounded-xl hover:bg-zen-terracotta transition-colors disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                  Publier mon avis
                </button>
                <p className="text-xs font-sans text-zen-muted">
                  Votre avis sera vérifié avant publication.
                </p>
              </form>
            )}
          </div>

          {/* Liste des avis */}
          {initialReviews.length > 0 ? (
            <div className="space-y-6">
              {initialReviews.map((rev) => (
                <article key={rev.id} className="border-b border-zen-sand pb-6 last:border-0">
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-sans font-semibold text-sm text-zen-bark">{rev.author_name}</span>
                      {rev.verified_purchase && (
                        <span className="inline-flex items-center gap-1 text-[12px] font-sans px-2 py-0.5 rounded-full bg-zen-sage/15 text-zen-sage">
                          <ShieldCheck size={11} /> Achat vérifié
                        </span>
                      )}
                    </div>
                    <time className="text-xs font-sans text-zen-muted flex-shrink-0">
                      {new Date(rev.created_at).toLocaleDateString('fr-BE', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </time>
                  </div>
                  <Stars value={rev.rating} size={14} />
                  {rev.title && <h3 className="font-sans font-semibold text-sm text-zen-bark mt-2">{rev.title}</h3>}
                  <p className="text-sm font-sans text-zen-muted leading-relaxed mt-1.5">{rev.body}</p>
                </article>
              ))}
            </div>
          ) : (
            count === 0 && (
              <p className="text-sm font-sans text-zen-muted/70">
                Les premiers avis vérifiés apparaîtront ici une fois validés.
              </p>
            )
          )}
        </div>
      </div>
    </section>
  );
}
