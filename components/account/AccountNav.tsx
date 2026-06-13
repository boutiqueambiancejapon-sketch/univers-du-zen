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
    { href: `/${locale}/compte`,            label: 'Vue d\'ensemble', icon: LayoutDashboard, exact: true },
    { href: `/${locale}/compte/commandes`,  label: 'Mes commandes',   icon: Package,         exact: false },
    { href: `/${locale}/compte/profil`,     label: 'Mon profil',      icon: User,            exact: true },
  ];

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="space-y-2">
      {/* User card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <div className="w-11 h-11 rounded-full bg-zen-bark text-white flex items-center justify-center font-sans font-semibold text-base mb-3">
          {firstName.charAt(0).toUpperCase()}
        </div>
        <p className="font-serif text-zen-bark font-medium">{firstName}</p>
        <p className="text-xs text-zen-muted font-sans mt-0.5 truncate">{userEmail}</p>
      </div>

      {/* Nav links */}
      <nav className="space-y-1">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans transition-colors ${
                active
                  ? 'bg-zen-bark text-white font-medium'
                  : 'text-zen-bark hover:bg-zen-beige'
              }`}>
              <Icon size={16} className={active ? 'text-white' : 'text-zen-muted'} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="pt-2">
        <form action="/api/auth/signout" method="POST">
          <button type="submit"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-sans text-zen-muted hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut size={16} />
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  );
}
