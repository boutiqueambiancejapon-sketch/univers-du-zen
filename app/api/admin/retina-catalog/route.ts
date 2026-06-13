import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getProducts } from '@/lib/retina';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'boutiqueambiancejapon@gmail.com';

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    // Fetch page 1 to get total pages
    const first = await getProducts(1, 100);
    const allProducts = [...(first.data ?? [])];
    const lastPage = first.meta?.last_page ?? 1;

    // Fetch remaining pages in parallel
    if (lastPage > 1) {
      const pages = await Promise.all(
        Array.from({ length: lastPage - 1 }, (_, i) => getProducts(i + 2, 100))
      );
      pages.forEach(p => allProducts.push(...(p.data ?? [])));
    }

    return NextResponse.json({ data: allProducts, total: allProducts.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
