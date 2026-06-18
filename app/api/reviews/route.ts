import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { hasPurchased } from '@/lib/reviews';

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: 'Vous devez être connecté pour laisser un avis.' }, { status: 401 });
  }

  let payload: any;
  try { payload = await req.json(); }
  catch { return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 }); }

  const { slug, sku, rating, title, comment, authorName } = payload ?? {};

  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ error: 'Produit manquant.' }, { status: 400 });
  }
  const r = Number(rating);
  if (!Number.isInteger(r) || r < 1 || r > 5) {
    return NextResponse.json({ error: 'Veuillez choisir une note de 1 à 5 étoiles.' }, { status: 400 });
  }
  const text = String(comment ?? '').trim();
  if (text.length < 10) {
    return NextResponse.json({ error: 'Votre avis doit faire au moins 10 caractères.' }, { status: 400 });
  }
  if (text.length > 2000) {
    return NextResponse.json({ error: 'Votre avis est trop long (2000 caractères maximum).' }, { status: 400 });
  }

  // Achat vérifié obligatoire
  const { purchased, orderId } = await hasPurchased(user.email, slug, sku ? String(sku) : undefined);
  if (!purchased) {
    return NextResponse.json(
      { error: "Seuls les clients ayant acheté ce produit peuvent laisser un avis." },
      { status: 403 },
    );
  }

  const admin = createAdminClient();

  // Un seul avis par client et par produit
  const { data: existing } = await admin
    .from('product_reviews')
    .select('id')
    .eq('product_slug', slug)
    .ilike('author_email', user.email)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ error: 'Vous avez déjà laissé un avis pour ce produit.' }, { status: 409 });
  }

  const fallbackName =
    (user.user_metadata?.first_name as string | undefined) ?? user.email.split('@')[0];
  const name = (String(authorName ?? '').trim() || fallbackName).slice(0, 60);

  const { error } = await admin.from('product_reviews').insert({
    product_slug: slug,
    product_sku: sku ? String(sku) : null,
    order_id: orderId,
    author_email: user.email,
    author_name: name,
    rating: r,
    title: title ? String(title).trim().slice(0, 120) || null : null,
    body: text,
    status: 'pending',
    verified_purchase: true,
  });

  if (error) {
    if ((error as any).code === '23505') {
      return NextResponse.json({ error: 'Vous avez déjà laissé un avis pour ce produit.' }, { status: 409 });
    }
    return NextResponse.json({ error: "Erreur lors de l'enregistrement de votre avis." }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message: 'Merci ! Votre avis a été envoyé et sera publié après validation.',
  });
}
