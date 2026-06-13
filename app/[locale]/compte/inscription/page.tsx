'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Mail, Lock, User, Eye, EyeOff, Leaf } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function InscriptionPage() {
  const locale = useLocale();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [cgv, setCgv]         = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
    if (form.password.length < 8) { setError('Le mot de passe doit faire au moins 8 caractères.'); return; }
    if (!cgv) { setError('Veuillez accepter les conditions générales.'); return; }
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { first_name: form.firstName, last_name: form.lastName },
        emailRedirectTo: `${window.location.origin}/api/auth/callback?locale=${locale}`,
      },
    });

    if (error) { setError(error.message); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
  }

  const inputClass = 'w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-sans text-zen-bark placeholder-gray-300 focus:outline-none focus:border-zen-bark bg-white transition-colors';

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-6">📩</div>
          <h1 className="font-serif text-3xl text-zen-bark mb-3">Vérifiez votre email</h1>
          <p className="text-sm font-sans text-zen-muted mb-6">
            Un lien de confirmation a été envoyé à <strong className="text-zen-bark">{form.email}</strong>.
            Cliquez dessus pour activer votre compte.
          </p>
          <Link href={`/${locale}/compte/connexion`}
            className="text-sm font-sans text-zen-bark underline underline-offset-2 hover:text-zen-terracotta">
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Leaf size={20} className="text-zen-terracotta" />
            <span className="font-serif text-xl text-zen-bark tracking-widest">UNIVERS DU ZEN</span>
          </div>
          <h1 className="font-serif text-3xl text-zen-bark mb-2">Créer un compte</h1>
          <p className="text-sm font-sans text-zen-muted">Rejoignez la communauté Univers du Zen</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-sans font-medium uppercase tracking-widest text-zen-muted mb-1.5">Prénom *</label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required value={form.firstName} onChange={set('firstName')} className={`${inputClass} pl-9`} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-sans font-medium uppercase tracking-widest text-zen-muted mb-1.5">Nom *</label>
              <input required value={form.lastName} onChange={set('lastName')} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans font-medium uppercase tracking-widest text-zen-muted mb-1.5">Email *</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" required value={form.email} onChange={set('email')}
                className={`${inputClass} pl-9`} placeholder="votre@email.com" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans font-medium uppercase tracking-widest text-zen-muted mb-1.5">Mot de passe *</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPwd ? 'text' : 'password'} required value={form.password} onChange={set('password')}
                className={`${inputClass} pl-9 pr-11`} placeholder="8 caractères minimum" />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-zen-bark">
                {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans font-medium uppercase tracking-widest text-zen-muted mb-1.5">Confirmer *</label>
            <input type="password" required value={form.confirm} onChange={set('confirm')} className={inputClass} placeholder="••••••••" />
          </div>

          <label className="flex items-start gap-3 cursor-pointer pt-1">
            <input type="checkbox" checked={cgv} onChange={e => setCgv(e.target.checked)}
              className="mt-0.5 accent-zen-bark flex-shrink-0" />
            <span className="text-xs font-sans text-zen-muted leading-relaxed">
              J'accepte les{' '}
              <Link href={`/${locale}/cgv`} className="text-zen-bark underline underline-offset-2 hover:text-zen-terracotta">conditions générales de vente</Link>{' '}
              et la{' '}
              <Link href={`/${locale}/confidentialite`} className="text-zen-bark underline underline-offset-2 hover:text-zen-terracotta">politique de confidentialité</Link>.
            </span>
          </label>

          {error && <p className="text-sm text-red-600 font-sans bg-red-50 rounded-xl px-4 py-3">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-zen-bark text-white font-sans font-semibold py-4 rounded-xl hover:bg-zen-terracotta transition-colors disabled:opacity-60 mt-2">
            {loading ? 'Création du compte…' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-sm font-sans text-zen-muted mt-6">
          Déjà un compte ?{' '}
          <Link href={`/${locale}/compte/connexion`} className="text-zen-bark font-medium hover:text-zen-terracotta transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
