/**
 * Vercel Cron — quotidien à 4h00 UTC
 * Sync stock + prix depuis l'API Retina vers supplier_catalog dans Supabase.
 * Sécurisé par CRON_SECRET (Vercel injecte Authorization: Bearer <secret>).
 */

import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { getProducts } from '@/lib/retina';

export const maxDuration = 60; // secondes (Vercel Pro) — Hobby limité à 10s
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Vérification sécurité — Vercel envoie automatiquement le CRON_SECRET
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const startedAt = Date.now();
  const admin = createAdminClient();

  try {
    // 1. Fetch première page pour connaître le nombre total
    const first = await getProducts(1, 100);
    const lastPage = first.meta?.last_page ?? 1;

    // 2. Fetch toutes les pages en parallèle
    const pages = lastPage > 1
      ? await Promise.all(
          Array.from({ length: lastPage - 1 }, (_, i) => getProducts(i + 2, 100))
        )
      : [];

    const allProducts = [...(first.data ?? []), ...pages.flatMap(p => p.data ?? [])];

    // 3. Filtrer uniquement les produits qui existent déjà dans supplier_catalog
    //    et construire les updates (stock + prix uniquement)
    const updates = allProducts.map(p => ({
      sku:             p.sku,
      stock_qty:       p.stock ?? 0,
      in_stock:        (p.stock ?? 0) > 0,
      wholesale_price: p.wholesale ?? 0,
      rrp:             p.price ?? 0,
      updated_at:      new Date().toISOString(),
    }));

    // 4. Upsert par batch de 500 — ignore les SKUs absents de supplier_catalog
    const BATCH = 500;
    let updated = 0;
    for (let i = 0; i < updates.length; i += BATCH) {
      const batch = updates.slice(i, i + BATCH);
      const { error, count } = await admin
        .from('supplier_catalog')
        .upsert(batch, { onConflict: 'sku', ignoreDuplicates: false });

      if (error) {
        console.error('[sync-stock] upsert error:', error.message);
      } else {
        updated += count ?? batch.length;
      }
    }

    const duration = ((Date.now() - startedAt) / 1000).toFixed(1);
    console.log(`[sync-stock] ✓ ${updated} produits mis à jour en ${duration}s`);

    return NextResponse.json({
      ok: true,
      total_from_api: allProducts.length,
      updated,
      duration_s: duration,
      synced_at: new Date().toISOString(),
    });

  } catch (err: any) {
    console.error('[sync-stock] erreur:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
