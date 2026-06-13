'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ConnexionPage() {
  const locale   = useLocale();
  const router   = useRouter();
  const params   = useSearchParams();
  const redirect = params.get('redirect') ?? `/${locale}/compte`;

  const [tab, setTab]           = useState<'login' | 'signup'>('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (tab === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError('Email ou mot de passe incorrect.'); setLoading(false); return; }
      router.push(redirect);
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(redirect)}&locale=${locale}` },
      });
      if (error) { setError(error.message); setLoading(false); return; }
      setSuccess('Compte créé ! Vérifiez votre email pour confirmer.');
      setLoading(false);
    }
  }

  const inputCls = `w-full px-4 py-3.5 rounded-xl border border-[rgba(34,30,25,.14)] bg-[#FCFAF4] text-sm
    text-[#221E19] placeholder-[#9a9087] transition-all outline-none
    focus:border-[#BF5E37] focus:shadow-[0_0_0_3px_rgba(191,94,55,.13)] focus:bg-white`;

  return (
    <div className="grid min-h-screen" style={{ gridTemplateColumns: '1.02fr .98fr' }}>

      {/* ── LEFT: form ── */}
      <div className="flex flex-col px-10 py-9 bg-white" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
        {/* Logo */}
        <div className="mb-auto pb-8">
          <Link href={`/${locale}`} className="inline-flex items-baseline gap-2">
            <span style={{ fontFamily: "'Newsreader', serif", fontWeight: 800, fontSize: 22, color: '#221E19', letterSpacing: '-0.01em' }}>UDZ</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.22em', color: '#221E19', opacity: 0.55, fontWeight: 500 }}>UNIVERS&nbsp;DU&nbsp;ZEN</span>
          </Link>
        </div>

        <div className="flex flex-col justify-center flex-1 max-w-[412px] w-full mx-auto">
          {/* Tabs */}
          <div className="flex gap-1 mb-7 p-1 rounded-xl" style={{ background: '#F1ECE3' }}>
            {(['login', 'signup'] as const).map(t => (
              <button key={t} type="button" onClick={() => { setTab(t); setError(''); setSuccess(''); }}
                className="flex-1 py-2.5 text-sm font-semibold rounded-[10px] transition-all"
                style={tab === t
                  ? { background: '#fff', color: '#221E19', boxShadow: '0 2px 6px rgba(34,30,25,.12)' }
                  : { color: '#4A4138' }}>
                {t === 'login' ? 'Se connecter' : 'Créer un compte'}
              </button>
            ))}
          </div>

          {/* Label + Title */}
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.08em', color: '#BF5E37', fontWeight: 500, marginBottom: 10 }}>
            ESPACE CLIENT
          </p>
          <h1 style={{ fontFamily: "'Newsreader', serif", fontWeight: 800, fontSize: 'clamp(32px, 4vw, 44px)', lineHeight: 1.05, color: '#221E19', marginBottom: 8 }}>
            {tab === 'login' ? 'Bon retour parmi\nnous' : 'Rejoignez\nle cercle'}
          </h1>
          <p className="text-sm mb-7" style={{ color: '#4A4138', lineHeight: 1.55 }}>
            {tab === 'login'
              ? 'Connectez-vous pour suivre vos commandes et profiter de vos offres réservées aux membres.'
              : 'Créez votre compte pour bénéficier du suivi de commandes et des offres membres.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#9a9087', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>
                Adresse e-mail
              </label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="vous@exemple.com" className={inputCls} />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#9a9087', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>
                Mot de passe
              </label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" className={inputCls + ' pr-16'} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#9a9087', letterSpacing: '0.05em' }}>
                  {showPwd ? 'Masquer' : 'Afficher'}
                </button>
              </div>
            </div>

            {tab === 'login' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: '#4A4138' }}>
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                    className="rounded" style={{ accentColor: '#BF5E37' }} />
                  Se souvenir de moi
                </label>
                <Link href={`/${locale}/compte/mot-de-passe-oublie`}
                  className="text-sm font-medium transition-colors"
                  style={{ color: '#BF5E37', fontFamily: "'Hanken Grotesk', sans-serif" }}>
                  Mot de passe oublié ?
                </Link>
              </div>
            )}

            {error   && <p className="text-sm rounded-xl px-4 py-3 bg-red-50 text-red-600">{error}</p>}
            {success && <p className="text-sm rounded-xl px-4 py-3 bg-green-50 text-green-700">{success}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl text-base font-semibold text-white transition-all disabled:opacity-60"
              style={{ background: '#BF5E37', boxShadow: '0 10px 24px rgba(191,94,55,.26)', marginTop: 4 }}
              onMouseEnter={e => !loading && ((e.target as HTMLElement).style.transform = 'translateY(-1px)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.transform = 'none')}>
              {loading ? 'Chargement…' : tab === 'login' ? 'Se connecter →' : 'Créer mon compte →'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#9a9087' }}>
            {tab === 'login' ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
            <button onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }}
              className="font-semibold transition-colors" style={{ color: '#BF5E37' }}>
              {tab === 'login' ? 'Créer un compte' : 'Se connecter'}
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 text-center" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#9a9087', opacity: 0.65, letterSpacing: '0.04em' }}>
          🔒 Connexion sécurisée · Univers du Zen © 2026
        </div>
      </div>

      {/* ── RIGHT: decorative dark panel ── */}
      <div className="relative flex flex-col justify-center px-14 overflow-hidden"
        style={{ background: 'linear-gradient(158deg, #3A332B 0%, #221E19 60%, #1A1713 100%)', color: '#F2ECE0' }}>

        {/* Radial orange glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(120% 90% at 80% 10%, rgba(191,94,55,.28), transparent 55%)'
        }} />

        <div className="relative z-10 max-w-[440px]">
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.12em', color: 'rgba(242,236,224,.55)', fontWeight: 500, marginBottom: 20 }}>
            — LE CERCLE UNIVERS DU ZEN
          </p>

          <h2 style={{ fontFamily: "'Newsreader', serif", fontWeight: 800, fontSize: 'clamp(34px, 3.8vw, 52px)', lineHeight: 1.05, marginBottom: 16 }}>
            Vos rituels,<br />
            vos commandes,<br />
            <span style={{ color: '#E8C5A0' }}>vos privilèges.</span>
          </h2>

          <p className="mb-10 text-base leading-relaxed" style={{ color: 'rgba(242,236,224,.7)' }}>
            Connectez-vous pour suivre vos livraisons en temps réel,
            retrouver vos commandes et profiter d&apos;offres réservées aux membres.
          </p>

          {/* Benefits */}
          <div className="space-y-3 mb-10">
            {[
              { icon: '⊙', title: 'Suivi en temps réel',    sub: 'De votre commande à votre porte, étape par étape' },
              { icon: '+', title: 'Offres VIP exclusives',   sub: 'Codes perso, points & cadeaux anniversaire' },
              { icon: '↻', title: 'Recommande en 1 clic',   sub: 'Vos rituels favoris, toujours à portée' },
            ].map(({ icon, title, sub }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-sm"
                  style={{ background: 'rgba(242,236,224,.08)', border: '1px solid rgba(242,236,224,.16)', color: '#E8C5A0', fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-semibold mb-0.5" style={{ color: '#F2ECE0', fontFamily: "'Hanken Grotesk', sans-serif" }}>{title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(242,236,224,.55)', fontFamily: "'Hanken Grotesk', sans-serif" }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Floating testimonial */}
          <div className="rounded-2xl p-5" style={{
            background: 'rgba(252,250,244,.07)',
            border: '1px solid rgba(242,236,224,.14)',
            backdropFilter: 'blur(6px)',
            animation: 'floaty 6s ease-in-out infinite',
          }}>
            <div className="flex gap-0.5 mb-2">
              {'★★★★★'.split('').map((s, i) => <span key={i} style={{ color: '#E8C5A0', fontSize: 14 }}>{s}</span>)}
            </div>
            <p className="text-sm italic mb-3" style={{ color: 'rgba(242,236,224,.85)', lineHeight: 1.55, fontFamily: "'Newsreader', serif" }}>
              «&nbsp;Je suis mes colis à la minute près et mes points fidélité tombent à chaque commande. Le petit luxe zen.&nbsp;»
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{ background: 'linear-gradient(152deg, #E8D3BE, #C2A982)', color: '#221E19', fontFamily: "'Hanken Grotesk', sans-serif" }}>
                I
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(242,236,224,.55)', letterSpacing: '0.04em' }}>
                Inès B. · membre depuis 2024
              </span>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes floaty {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    </div>
  );
}
