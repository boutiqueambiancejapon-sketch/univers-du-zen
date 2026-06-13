import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

const ADMIN_EMAIL  = process.env.ADMIN_EMAIL  ?? 'boutiqueambiancejapon@gmail.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? '';
const REPO         = 'boutiqueambiancejapon-sketch/univers-du-zen';
const CATALOG_PATH = 'data/supplier-catalog.json';

async function getAllProducts() {
  const admin = createAdminClient();
  const PAGE  = 1000;
  let from     = 0;
  const all: unknown[] = [];

  while (true) {
    const { data, error } = await admin
      .from('supplier_catalog')
      .select('*')
      .order('department')
      .order('name')
      .range(from, from + PAGE - 1);

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < PAGE) break;
    from += PAGE;
  }

  return all;
}

async function writeToGitHub(products: unknown[]) {
  if (!GITHUB_TOKEN) throw new Error('GITHUB_TOKEN manquant dans les variables d\'environnement Vercel');

  let sha: string | undefined;
  try {
    const check = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${CATALOG_PATH}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' } }
    );
    if (check.ok) sha = (await check.json()).sha;
  } catch { /* première fois */ }

  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${CATALOG_PATH}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `chore: export full supplier catalog (${products.length} products)`,
        content: Buffer.from(JSON.stringify(products)).toString('base64'),
        ...(sha ? { sha } : {}),
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub ${res.status}: ${err.slice(0, 200)}`);
  }
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const products = await getAllProducts();
    await writeToGitHub(products);
    return NextResponse.json({ ok: true, count: products.length });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
