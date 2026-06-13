import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/account/ProfileForm';

export default async function ProfilPage({ params }: { params: { locale: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${params.locale}/compte/connexion`);

  const admin = createAdminClient();
  const { data: customer } = await admin
    .from('customers')
    .select('first_name, last_name, phone')
    .eq('id', user!.id)
    .single();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-zen-bark">Mon profil</h1>
        <p className="text-sm text-zen-muted mt-1 font-sans">Gérez vos informations personnelles</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-xl">
        <ProfileForm
          userId={user!.id}
          initialData={{
            firstName: customer?.first_name ?? user!.user_metadata?.first_name ?? '',
            lastName:  customer?.last_name  ?? user!.user_metadata?.last_name  ?? '',
            email:     user!.email ?? '',
            phone:     customer?.phone ?? '',
          }}
        />
      </div>
    </div>
  );
}
