'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, User, LogOut } from 'lucide-react';

interface Props {
  locale: string;
  userEmail: string;
  firstName: string;
}

export default function AccountNav({ locale, userEmail, firstName }: Props) {
  const pathname = usePathname();

  const links = [
    { href: `/${locale}/compte`,           label: 'Vue d\'ensemble', icon: LayoutDashboard, exact: true },
    { href: `/${locale}/compte/commandes`, label: 'Mes commandes',   icon: Package,         exact: false },
    { href: `/${locale}/compte/profil`,    label: 'Mon profil',      icon: User,            exact: true },
  ];

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="space-y-2">
      {/* Dark profile card */}
      <div className="rounded-2xl p-5 mb-2" style={{
        background: 'linear-gradient(158deg, #3A332B 0%, #2C2420 100%)',
        color: '#F2ECE0',
      }}>
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full flex items-center justify-center font-sans font-semibold text-base mb-3"
          style={{ background: 'linear-gradient(152deg, #E8D3BE, #C2A982)', color: '#2C2420', fontSize: 18 }}>
          {firstName.charAt(0).toUpperCase()}
        </div>

        <p className="font-serif font-semibold text-base mb-0.5" style={{ color: '#F2ECE0' }}>
          {firstName}
        </p>
        <p className="font-sans text-xs truncate mb-3" style={{ color: 'rgba(242,236,224,.5)' }}>
          {userEmail}
        </p>

        {/* Tier badge */}
        <span className="inline-flex items-center gap-1.5 text-[10px] font-sans font-semibold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(232,197,160,.14)', border: '1px solid rgba(232,197,160,.3)', color: '#E8C5A0', letterSpacing: '0.05em' }}>
          ✦ Membre Zen
        </span>
      </div>

      {/* Nav links */}
      <nav className="rounded-2xl p-2" style={{ background: '#fff', border: '1px solid rgba(44,36,32,.07)' }}>
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans transition-all mb-0.5 last:mb-0"
              style={active
                ? { background: '#2C2420', color: '#F2ECE0', fontWeight: 600 }
                : { color: '#2C2420' }}>
              <Icon size={15} style={{ color: active ? '#E8C5A0' : '#9a8878', flexShrink: 0 }} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="pt-1">
        <form action="/api/auth/signout" method="POST">
          <button type="submit"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-sans transition-all"
            style={{ border: '1px solid rgba(44,36,32,.12)', color: '#9a8878' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#C1714A';
              (e.currentTarget as HTMLElement).style.color = '#C1714A';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(44,36,32,.12)';
              (e.currentTarget as HTMLElement).style.color = '#9a8878';
            }}>
            <LogOut size={15} style={{ flexShrink: 0 }} />
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  );
}
