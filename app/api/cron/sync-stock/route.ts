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

type CatalogUpsert = {
  sku: string;
  stock_qty: number;
  in_stock: boolean;
  wholesale_price: number;
  rrp: number;
  updated_at: string;
};

export async function GET(request: Request) {
  // Sécurité — Vercel envoie automatiquement le CRON_SECRET
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const startedAt = Date.now();
  const admin = createAdminClient();

  try {
    // 1. Première page pour connaître le nombre total
    const first = await getProducts(1, 100);
    const lastPage = first.meta?.last_page ?? 1;

    // 2. Toutes les pages en parallèle
    const pages =
      lastPage > 1
        ? await Promise.all(
            Array.from({ length: lastPage - 1 }, (_, i) => getProducts(i + 2, 100)),
          )
        : [];

    const allProducts = [...(first.data ?? []), ...pages.flatMap((p) => p.data ?? [])];

    // 3. Dédupliquer par SKU — un upsert ne peut pas viser deux fois la même ligne
    //    dans le même lot (cause classique du 400). On écarte aussi les SKU vides.
    const bySku = new Map<string, CatalogUpsert>();
    const now = new Date().toISOString();
    let skipped = 0;
    for (const p of allProducts) {
      const sku = typeof p.sku === 'string' ? p.sku.trim() : '';
      if (!sku) {
        skipped++;
        continue;
      }
      const stock = Number.isFinite(Number(p.stock)) ? Math.max(0, Math.trunc(Number(p.stock))) : 0;
      bySku.set(sku, {
        sku,
        stock_qty: stock,
        in_stock: stock > 0,
        wholesale_price: Number(p.wholesale) || 0,
        rrp: Number(p.price) || 0,
        updated_at: now,
      });
    }
    const updates = Array.from(bySku.values());

    // 4. Upsert par batch de 500 — clé de conflit = sku
    const BATCH = 500;
    let updated = 0;
    const errors: string[] = [];
    for (let i = 0; i < updates.length; i += BATCH) {
      const batch = updates.slice(i, i + BATCH);
      const { error, count } = await admin
        .from('supplier_catalog')
        .upsert(batch, { onConflict: 'sku', ignoreDuplicates: false, count: 'exact' });

      if (error) {
        errors.push(error.message);
        console.error('[sync-stock] upsert error:', error.message, (error as any).details ?? '');
      } else {
        updated += count ?? batch.length;
      }
    }

    const duration = ((Date.now() - startedAt) / 1000).toFixed(1);
    console.log(
      `[sync-stock] ${updated} mis à jour · ${skipped} sans SKU · ${errors.length} lot(s) en erreur · ${duration}s`,
    );

    return NextResponse.json({
      ok: errors.length === 0,
      total_from_api: allProducts.length,
      unique_skus: updates.length,
      skipped_no_sku: skipped,
      updated,
      batch_errors: errors.slice(0, 3),
      duration_s: duration,
      synced_at: now,
    });
  } catch (err: any) {
    console.error('[sync-stock] erreur:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
