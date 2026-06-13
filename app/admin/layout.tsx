import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminNav from '@/components/admin/AdminNav';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'boutiqueambiancejapon@gmail.com';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/fr-BE/compte/connexion');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 min-h-screen bg-[#1C1917] fixed top-0 left-0 z-40 flex flex-col">
          <div className="px-5 py-6 border-b border-white/10">
            <p className="text-white font-serif text-base tracking-widest">UNIVERS DU ZEN</p>
            <p className="text-white/40 text-[10px] font-sans mt-0.5">Administration</p>
          </div>
          <AdminNav />
        </aside>

        {/* Main */}
        <main className="ml-56 flex-1 min-h-screen">
          <div className="max-w-6xl mx-auto px-8 py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
