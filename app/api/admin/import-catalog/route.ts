import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

const ADMIN_EMAIL  = process.env.ADMIN_EMAIL   ?? 'boutiqueambiancejapon@gmail.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN  ?? '';
const REPO         = 'boutiqueambiancejapon-sketch/univers-du-zen';
const CATALOG_PATH = 'data/supplier-catalog.json';

/* ── GitHub write ──────────────────────────────────────────────────────────── */
async function pushCatalogToGitHub(products: unknown[]) {
  if (!GITHUB_TOKEN) return;  // skip silently if token not configured

  // Check if file already exists (need its SHA to overwrite)
  let sha: string | undefined;
  try {
    const check = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${CATALOG_PATH}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' } }
    );
    if (check.ok) sha = (await check.json()).sha;
  } catch { /* first push, no SHA needed */ }

  const content = Buffer.from(JSON.stringify(products, null, 0)).toString('base64');
  await fetch(
    `https://api.github.com/repos/${REPO}/contents/${CATALOG_PATH}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `chore: refresh supplier catalog (${products.length} products)`,
        content,
        ...(sha ? { sha } : {}),
      }),
    }
  );
}

/* ── Route ─────────────────────────────────────────────────────────────────── */
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const body = await request.json();
  const { products } = body as { products: unknown[] };

  if (!Array.isArray(products) || products.length === 0) {
    return NextResponse.json({ error: 'Aucun produit reçu' }, { status: 400 });
  }

  // 1. Upsert into Supabase
  const admin = createAdminClient();
  const { error } = await admin.from('supplier_catalog').upsert(products, { onConflict: 'sku' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 2. Mirror full catalog to GitHub (async, don't block response)
  pushCatalogToGitHub(products).catch(e =>
    console.error('[import-catalog] GitHub push failed:', e)
  );

  return NextResponse.json({ ok: true, count: products.length });
}
