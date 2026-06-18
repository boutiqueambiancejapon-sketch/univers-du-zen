'use client';

import { useEffect, useState, useCallback } from 'react';
import { Star, Check, X, Trash2, Loader2, ShieldCheck } from 'lucide-react';

interface Review {
  id: string;
  product_slug: string;
  product_sku: string | null;
  author_name: string;
  author_email: string;
  rating: number;
  title: string | null;
  body: string;
  status: 'pending' | 'approved' | 'rejected';
  verified_purchase: boolean;
  created_at: string;
}

const TABS: { key: string; label: string }[] = [
  { key: 'pending',  label: 'En attente' },
  { key: 'approved', label: 'Publiés' },
  { key: 'rejected', label: 'Rejetés' },
  { key: 'all',      label: 'Tous' },
];

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={13} className={i <= value ? 'text-amber-500' : 'text-gray-300'} fill={i <= value ? 'currentColor' : 'none'} />
      ))}
    </span>
  );
}

export default function AdminAvisPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tab, setTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/reviews?status=${tab}`)
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews ?? []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [tab]);

  useEffect(() => { load(); }, [load]);

  async function act(id: string, action: 'approve' | 'reject' | 'delete') {
    setBusy(id);
    try {
      await fetch(`/api/admin/reviews/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setBusy(null);
    }
  }

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Avis clients</h1>
        <p className="text-sm text-gray-500 mt-0.5">Modération des avis produits avant publication</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
              tab === t.key ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.label}
            {t.key === 'pending' && tab === 'pending' && pendingCount > 0 && (
              <span className="ml-1.5 text-[12px] opacity-70">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm flex items-center justify-center gap-2">
          <Loader2 size={16} className="animate-spin" /> Chargement…
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 text-sm text-gray-400">
          Aucun avis dans cette catégorie.
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap mb-1">
                    <Stars value={r.rating} />
                    <span className="text-sm font-semibold text-gray-900">{r.author_name}</span>
                    {r.verified_purchase && (
                      <span className="inline-flex items-center gap-1 text-[12px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                        <ShieldCheck size={11} /> Achat vérifié
                      </span>
                    )}
                    <span className={`text-[12px] px-2 py-0.5 rounded-full ${
                      r.status === 'approved' ? 'bg-green-100 text-green-700'
                      : r.status === 'rejected' ? 'bg-red-100 text-red-600'
                      : 'bg-amber-100 text-amber-700'
                    }`}>{r.status === 'approved' ? 'Publié' : r.status === 'rejected' ? 'Rejeté' : 'En attente'}</span>
                  </div>
                  <p className="text-[12px] text-gray-400 mb-2">
                    {r.product_slug} · {r.author_email} · {new Date(r.created_at).toLocaleDateString('fr-BE', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  {r.title && <p className="text-sm font-semibold text-gray-800">{r.title}</p>}
                  <p className="text-sm text-gray-600 leading-relaxed mt-0.5">{r.body}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {r.status !== 'approved' && (
                    <button onClick={() => act(r.id, 'approve')} disabled={busy === r.id}
                      className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
                      {busy === r.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Approuver
                    </button>
                  )}
                  {r.status !== 'rejected' && (
                    <button onClick={() => act(r.id, 'reject')} disabled={busy === r.id}
                      className="flex items-center gap-1.5 text-xs font-medium border border-gray-200 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                      <X size={12} /> Rejeter
                    </button>
                  )}
                  <button onClick={() => act(r.id, 'delete')} disabled={busy === r.id}
                    className="flex items-center gap-1.5 text-xs font-medium text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50">
                    <Trash2 size={12} /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
