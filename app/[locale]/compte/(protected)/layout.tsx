import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AccountNav from '@/components/account/AccountNav';

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${params.locale}/compte/connexion`);
  }

  const firstName = (user.user_metadata?.first_name as string | undefined)
    ?? user.email?.split('@')[0]
    ?? 'Mon compte';

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-14 items-start">
          <aside className="lg:col-span-1">
            <AccountNav locale={params.locale} userEmail={user.email!} firstName={firstName} />
          </aside>
          <main className="lg:col-span-3 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
