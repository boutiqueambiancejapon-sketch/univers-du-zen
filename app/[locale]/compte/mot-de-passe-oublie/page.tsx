'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Mail, ArrowLeft, Leaf } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function MotDePasseOubliePage() {
  const locale    = useLocale();
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback?locale=${locale}&next=/${locale}/compte/nouveau-mot-de-passe`,
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Leaf size={20} className="text-zen-terracotta" />
            <span className="font-serif text-xl text-zen-bark tracking-widest">UNIVERS DU ZEN</span>
          </div>
          <h1 className="font-serif text-3xl text-zen-bark mb-2">Mot de passe oublié</h1>
          <p className="text-sm font-sans text-zen-muted">Entrez votre email pour recevoir un lien de réinitialisation.</p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-5">📩</div>
            <p className="font-serif text-xl text-zen-bark mb-2">Email envoyé !</p>
            <p className="text-sm font-sans text-zen-muted mb-6">
              Un lien de réinitialisation a été envoyé à <strong className="text-zen-bark">{email}</strong>.
            </p>
            <Link href={`/${locale}/compte/connexion`}
              className="flex items-center justify-center gap-2 text-sm font-sans text-zen-bark hover:text-zen-terracotta transition-colors">
              <ArrowLeft size={14} /> Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-sans font-medium uppercase tracking-widest text-zen-muted mb-1.5">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-9 px-4 py-3.5 text-sm font-sans text-zen-bark placeholder-gray-300 focus:outline-none focus:border-zen-bark bg-white transition-colors"
                  placeholder="votre@email.com" />
              </div>
            </div>

            {error && <p className="text-sm text-red-600 font-sans bg-red-50 rounded-xl px-4 py-3">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-zen-bark text-white font-sans font-semibold py-4 rounded-xl hover:bg-zen-terracotta transition-colors disabled:opacity-60">
              {loading ? 'Envoi…' : 'Envoyer le lien'}
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
