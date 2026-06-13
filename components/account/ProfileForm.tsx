'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface Props {
  userId: string;
  initialData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export default function ProfileForm({ userId, initialData }: Props) {
  const [form, setForm] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      // Update auth metadata
      const { error: authErr } = await supabase.auth.updateUser({
        data: { first_name: form.firstName, last_name: form.lastName },
      });
      if (authErr) throw authErr;

      // Upsert customers table
      const { error: dbErr } = await supabase
        .from('customers')
        .upsert({
          id:         userId,
          first_name: form.firstName,
          last_name:  form.lastName,
          phone:      form.phone || null,
        }, { onConflict: 'id' });
      if (dbErr) throw dbErr;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message ?? 'Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof typeof form, type = 'text', disabled = false) => (
    <div>
      <label className="block text-xs font-semibold text-zen-bark uppercase tracking-wider mb-1.5 font-sans">
        {label}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-sans text-zen-bark
                   placeholder-zen-muted focus:outline-none focus:ring-2 focus:ring-zen-bark/20
                   disabled:bg-gray-50 disabled:text-zen-muted"
      />
      {disabled && <p className="text-xs text-zen-muted mt-1 font-sans">L&apos;email ne peut pas être modifié ici</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        {field('Prénom', 'firstName')}
        {field('Nom', 'lastName')}
      </div>
      {field('Email', 'email', 'email', true)}
      {field('Téléphone', 'phone', 'tel')}

      {success && (
        <p className="text-sm text-green-600 font-sans bg-green-50 px-4 py-3 rounded-xl">
          ✓ Profil mis à jour avec succès
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600 font-sans bg-red-50 px-4 py-3 rounded-xl">{error}</p>
      )}

      <button type="submit" disabled={saving}
        className="w-full py-3 rounded-xl bg-zen-bark text-white text-sm font-semibold font-sans
                   hover:bg-zen-bark/90 disabled:opacity-60 transition-colors">
        {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
      </button>
    </form>
  );
}
