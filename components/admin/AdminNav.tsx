'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Receipt, BookOpen, ShoppingBag, LogOut } from 'lucide-react';

const LINKS = [
  { href: '/admin',            label: 'Vue d\'ensemble', icon: LayoutDashboard, exact: true },
  { href: '/admin/catalogue',  label: 'Catalogue',       icon: BookOpen,        exact: false },
  { href: '/admin/produits',   label: 'Produits',        icon: ShoppingBag,     exact: false },
  { href: '/admin/commandes',  label: 'Commandes',       icon: Package,         exact: false },
  { href: '/admin/tva',        label: 'TVA OSS',         icon: Receipt,         exact: false },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-6 space-y-1">
      {LINKS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link key={href} href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              active
                ? 'bg-white/10 text-white font-medium'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}>
            <Icon size={15} />
            {label}
          </Link>
        );
      })}

      <div className="pt-4 mt-4 border-t border-white/10">
        <form action="/api/auth/signout" method="POST">
          <button type="submit"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors">
            <LogOut size={15} /> Déconnexion
          </button>
        </form>
      </div>
    </nav>
  );
}
