'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff, Leaf } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function InscriptionPage() {
  const locale = useLocale();
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm]     = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [cgv, setCgv]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
    if (form.password.length < 8)       { setError('Le mot de passe doit faire au moins 8 caracteres.'); return; }
    if (!cgv)                           { setError('Veuillez accepter les conditions generales.'); return; }
    setLoading(true);
    setError('');

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { first_name: form.firstName, last_name: form.lastName },
        emailRedirectTo: `${window.location.origin}/api/auth/callback?locale=${locale}`,
      },
    });

    if (signUpError) { setError(signUpError.message); setLoading(false); return; }

    if (data.session) {
      router.push('/' + locale + '/compte');
      return;
    }

    router.push('/' + locale + '/compte/connexion?registered=1');
  }

  const inputCls = 'w-full rounded-xl px-4 py-3.5 text-sm font-sans focus:outline-none transition-colors';
  const inputSty = { background: '#FCFAF4', border: '1px solid rgba(44,36,32,.14)', color: '#3B2A1F' };

  return (
    <div className="min-h-screen flex" style={{ background: '#F5F3EF' }}>

      {/* Left form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          <div className="flex items-center gap-2 mb-10">
            <Leaf size={18} style={{ color: '#C4714A' }} />
            <span className="font-serif tracking-widest text-sm" style={{ color: '#3B2A1F' }}>UNIVERS DU ZEN</span>
          </div>

          <h1 className="font-serif mb-2" style={{ fontSize: 'clamp(28px,3vw,38px)', color: '#3B2A1F' }}>
            Creer un compte
          </h1>
          <p className="text-sm font-sans mb-8" style={{ color: '#675A4E' }}>
            Rejoignez la communaute Univers du Zen
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-sans font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#675A4E' }}>
                  Prenom *
                </label>
                <div className="relative">
                  <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#C4B8AE' }} />
                  <input
                    required
                    value={form.firstName}
                    onChange={set('firstName')}
                    className={inputCls}
                    style={{ ...inputSty, paddingLeft: 36 }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-sans font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#675A4E' }}>
                  Nom *
                </label>
                <input
                  required
                  value={form.lastName}
                  onChange={set('lastName')}
                  className={inputCls}
                  style={inputSty}
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-sans font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#675A4E' }}>
                Adresse e-mail *
              </label>
              <div className="relative">
                <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#C4B8AE' }} />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={set('email')}
                  placeholder="votre@email.com"
                  className={inputCls}
                  style={{ ...inputSty, paddingLeft: 36 }}
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-sans font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#675A4E' }}>
                Mot de passe *
              </label>
              <div className="relative">
                <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#C4B8AE' }} />
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={set('password')}
                  placeholder="8 caracteres minimum"
                  className={inputCls}
                  style={{ ...inputSty, paddingLeft: 36, paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#675A4E' }}
                >
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-sans font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#675A4E' }}>
                Confirmer *
              </label>
              <input
                type="password"
                required
                value={form.confirm}
                onChange={set('confirm')}
                placeholder="xxxxxxxx"
                className={inputCls}
                style={inputSty}
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={cgv}
                onChange={e => setCgv(e.target.checked)}
                className="mt-0.5 flex-shrink-0"
              />
              <span className="text-xs font-sans leading-relaxed" style={{ color: '#675A4E' }}>
                {'J\'accepte les '}
                <Link href={'/' + locale + '/cgv'} style={{ color: '#3B2A1F' }} className="underline underline-offset-2">
                  conditions generales
                </Link>
                {' et la '}
                <Link href={'/' + locale + '/confidentialite'} style={{ color: '#3B2A1F' }} className="underline underline-offset-2">
                  politique de confidentialite
                </Link>.
              </span>
            </label>

            {error && (
              <div className="text-sm font-sans px-4 py-3 rounded-xl" style={{ background: '#FEF2F2', color: '#B91C1C' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-sm font-sans font-semibold text-white transition-all mt-2"
              style={{ background: '#C4714A', boxShadow: '0 10px 24px rgba(193,113,74,.25)', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Creation...' : 'Creer mon compte'}
            </button>
          </form>

          <p className="text-center text-sm font-sans mt-6" style={{ color: '#675A4E' }}>
            {'Deja un compte ? '}
            <Link href={'/' + locale + '/compte/connexion'} className="font-medium" style={{ color: '#3B2A1F' }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>

      {/* Right dark panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-96 p-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(158deg, #3A332B 0%, #221E19 100%)' }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 60% 30%, rgba(193,113,74,.18), transparent 65%)' }}
        />

        <div className="relative z-10">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-8" style={{ color: 'rgba(232,197,160,.5)' }}>
            Pourquoi nous rejoindre
          </p>

          {[
            { icon: '✦', title: 'Programme fidelite', desc: '1 € depense = 1 point. 100 points = -5 € sur votre prochaine commande.' },
            { icon: '⬡', title: 'Suivi de commandes', desc: 'Acces a l\'historique de vos commandes et suivi des livraisons.' },
            { icon: '◈', title: 'Offres membres', desc: 'Acces prioritaire aux nouvelles collections et promotions exclusives.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-4 mb-7">
              <span className="text-lg mt-0.5 flex-shrink-0" style={{ color: '#C4714A' }}>{icon}</span>
              <div>
                <p className="font-serif text-base mb-1" style={{ color: '#F2ECE0' }}>{title}</p>
                <p className="text-xs font-sans leading-relaxed" style={{ color: 'rgba(242,236,224,.45)' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="relative z-10 rounded-2xl p-5"
          style={{ background: 'rgba(242,236,224,.06)', border: '1px solid rgba(242,236,224,.1)' }}
        >
          <div className="flex gap-1 mb-2">
            {[0,1,2,3,4].map(i => (
              <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="#C4714A">
                <path d="M6 1l1.4 2.8 3.1.45-2.25 2.19.53 3.1L6 8.1 3.22 9.54l.53-3.1L1.5 4.25l3.1-.45z"/>
              </svg>
            ))}
          </div>
          <p className="text-sm font-sans italic mb-3" style={{ color: 'rgba(242,236,224,.7)' }}>
            Produits de qualite, livraison rapide. Je commande regulierement pour mes rituels du matin.
          </p>
          <p className="text-xs font-sans font-semibold" style={{ color: 'rgba(242,236,224,.4)' }}>
            Sophie M. — Membre depuis 2024
          </p>
        </div>
      </div>
    </div>
  );
}
