'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Mail, Lock, Eye, EyeOff, Leaf } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ConnexionPage() {
  const locale    = useLocale();
  const router    = useRouter();
  const params    = useSearchParams();
  const redirect  = params.get('redirect') ?? `/${locale}/compte`;

  const [mode, setMode]         = useState<'password' | 'magic'>('password');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (mode === 'password') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError('Email ou mot de passe incorrect.'); setLoading(false); return; }
      router.push(redirect);
      router.refresh();
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(redirect)}&locale=${locale}` },
      });
      if (error) { setError(error.message); setLoading(false); return; }
      setSuccess('Lien envoyé ! Vérifiez votre boîte email.');
      setLoading(false);
    }
  }

  const inputClass = 'w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-sans text-zen-bark placeholder-gray-300 focus:outline-none focus:border-zen-bark bg-white transition-colors';

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Leaf size={20} className="text-zen-terracotta" />
            <span className="font-serif text-xl text-zen-bark tracking-widest">UNIVERS DU ZEN</span>
          </div>
          <h1 className="font-serif text-3xl text-zen-bark mb-2">Connexion</h1>
          <p className="text-sm font-sans text-zen-muted">Accédez à votre espace personnel</p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-6 bg-white border border-gray-100 rounded-xl p-1">
          {(['password', 'magic'] as const).map(m => (
            <button key={m} type="button" onClick={() => { setMode(m); setError(''); setSuccess(''); }}
              className={`flex-1 text-sm font-sans py-2.5 rounded-lg transition-all ${
                mode === m ? 'bg-zen-bark text-white font-medium' : 'text-zen-muted hover:text-zen-bark'
              }`}>
              {m === 'password' ? '🔑 Mot de passe' : '✉️ Lien magique'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-sans font-medium uppercase tracking-widest text-zen-muted mb-1.5">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className={`${inputClass} pl-10`} placeholder="votre@email.com" />
            </div>
          </div>

          {mode === 'password' && (
            <div>
              <label className="block text-xs font-sans font-medium uppercase tracking-widest text-zen-muted mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPwd ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`${inputClass} pl-10 pr-12`} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-zen-bark">
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <Link href={`/${locale}/compte/mot-de-passe-oublie`}
                  className="text-xs text-zen-muted hover:text-zen-bark font-sans transition-colors">
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600 font-sans bg-red-50 rounded-xl px-4 py-3">{error}</p>}
          {success && <p className="text-sm text-green-700 font-sans bg-green-50 rounded-xl px-4 py-3">{success}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-zen-bark text-white font-sans font-semibold py-4 rounded-xl hover:bg-zen-terracotta transition-colors disabled:opacity-60 mt-2">
            {loading ? 'Connexion…' : mode === 'password' ? 'Se connecter' : 'Envoyer le lien'}
          </button>
        </form>

        <p className="text-center text-sm font-sans text-zen-muted mt-6">
          Pas encore client ?{' '}
          <Link href={`/${locale}/compte/inscription`} className="text-zen-bark font-medium hover:text-zen-terracotta transition-colors">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
