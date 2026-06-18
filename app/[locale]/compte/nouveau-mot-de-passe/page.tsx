'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Lock, Eye, EyeOff, Leaf, Check, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function NouveauMotDePassePage() {
  const locale = useLocale();
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  // Le clic sur le lien de l'email crée une session de récupération.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setChecking(false);
    });
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Le mot de passe doit faire au moins 8 caractères.'); return; }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return; }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setLoading(false); return; }

    setDone(true);
    setLoading(false);
    setTimeout(() => router.push(`/${locale}/compte`), 2000);
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Leaf size={20} className="text-zen-terracotta" />
            <span className="font-serif text-xl text-zen-bark tracking-widest">UNIVERS DU ZEN</span>
          </div>
          <h1 className="font-serif text-3xl text-zen-bark mb-2">Nouveau mot de passe</h1>
          <p className="text-sm font-sans text-zen-muted">Choisissez un nouveau mot de passe sécurisé.</p>
        </div>

        {checking ? (
          <p className="text-center text-sm font-sans text-zen-muted">Vérification du lien…</p>
        ) : done ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center mx-auto mb-5">
              <Check size={30} className="text-green-500" />
            </div>
            <p className="font-serif text-xl text-zen-bark mb-2">Mot de passe modifié !</p>
            <p className="text-sm font-sans text-zen-muted">Redirection vers votre espace client…</p>
          </div>
        ) : !hasSession ? (
          <div className="text-center">
            <p className="text-sm font-sans text-zen-muted mb-6">
              Ce lien de réinitialisation est invalide ou a expiré. Demandez-en un nouveau.
            </p>
            <Link href={`/${locale}/compte/mot-de-passe-oublie`}
              className="inline-flex items-center justify-center gap-2 bg-zen-bark text-white font-sans font-semibold px-6 py-3 rounded-xl hover:bg-zen-terracotta transition-colors text-sm">
              Demander un nouveau lien
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-sans font-medium uppercase tracking-widest text-zen-muted mb-1.5">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8 caractères minimum"
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-11 py-3.5 text-sm font-sans text-zen-bark placeholder-gray-300 focus:outline-none focus:border-zen-bark bg-white transition-colors"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zen-muted">
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans font-medium uppercase tracking-widest text-zen-muted mb-1.5">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Répétez le mot de passe"
                  className="w-full border border-gray-200 rounded-xl pl-9 px-4 py-3.5 text-sm font-sans text-zen-bark placeholder-gray-300 focus:outline-none focus:border-zen-bark bg-white transition-colors"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600 font-sans bg-red-50 rounded-xl px-4 py-3">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-zen-bark text-white font-sans font-semibold py-4 rounded-xl hover:bg-zen-terracotta transition-colors disabled:opacity-60">
              {loading ? 'Enregistrement…' : 'Réinitialiser mon mot de passe'}
            </button>

            <Link href={`/${locale}/compte/connexion`}
              className="flex items-center justify-center gap-2 text-sm font-sans text-zen-muted hover:text-zen-bark transition-colors pt-2">
              <ArrowLeft size={14} /> Retour à la connexion
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
