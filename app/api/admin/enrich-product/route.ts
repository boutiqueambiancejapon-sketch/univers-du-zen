import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

const ADMIN_EMAIL  = process.env.ADMIN_EMAIL   ?? 'boutiqueambiancejapon@gmail.com';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ?? '';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN  ?? '';
const REPO         = 'boutiqueambiancejapon-sketch/univers-du-zen';

/* ── GitHub helpers ─────────────────────────────────────────────────────── */
async function ghRead(path: string): Promise<{ content: string; sha: string }> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}`,
    { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' } }
  );
  if (!res.ok) throw new Error(`GitHub read 404: ${path}`);
  const json = await res.json();
  return { content: Buffer.from(json.content as string, 'base64').toString('utf-8'), sha: json.sha };
}

async function ghWrite(path: string, content: string, sha: string | undefined, message: string) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(content).toString('base64'),
        ...(sha ? { sha } : {}),
      }),
    }
  );
  if (!res.ok) throw new Error(`GitHub write error ${res.status}: ${path}`);
}

/* ── Anthropic ──────────────────────────────────────────────────────────── */
async function generateEnrichment(product: {
  name: string; description: string; category: string;
  originalName: string; targetKeyword: string;
}) {
  if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY manquant');

  const prompt = `Tu es expert SEO et bien-être pour la boutique "Univers du Zen" (universduzen.com).

Produit :
- Nom FR : ${product.name}
- Nom original fournisseur : ${product.originalName}
- Description brute : ${product.description}
- Catégorie : ${product.category}
- Mot-clé longue traîne cible : "${product.targetKeyword}"

Génère le contenu marketing en français. RÈGLES STRICTES :
• Ne jamais mentionner le fournisseur (AW Artisan, Ancient Wisdom, Retina)
• La description doit contenir un <h2> avec le mot-clé longue traîne "${product.targetKeyword}"
• Ton chaleureux, expert, boutique bien-être premium
• JSON strict uniquement, aucun texte avant ou après

{
  "description": "Paragraphe intro...\\n\\n<h2>${product.targetKeyword}</h2>\\n\\nContenu riche...",
  "faqFr": [
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."}
  ],
  "characteristics": [
    {"label": "Contenance", "value": "..."},
    {"label": "Famille", "value": "..."},
    {"label": "Utilisation", "value": "..."},
    {"label": "Convient à", "value": "..."},
    {"label": "Vegan & Cruelty-free", "value": "Oui"}
  ],
  "usageFr": "2-3 phrases d'utilisation concrètes.",
  "benefitsFr": ["Bénéfice 1", "Bénéfice 2", "Bénéfice 3", "Bénéfice 4"]
}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`Anthropic ${res.status}`);
  const data = await res.json();
  const text: string = data.content?.[0]?.text ?? '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Pas de JSON dans la réponse Anthropic');
  return JSON.parse(match[0]);
}

/* ── Validation publication ─────────────────────────────────────────────── */
function isPublishable(data: Record<string, unknown>): boolean {
  return !!(
    data.name &&
    data.description &&
    data.short_description &&
    data.meta_description &&
    data.price &&
    data.category &&
    data.target_keyword &&
    Array.isArray(data.faqFr) && (data.faqFr as unknown[]).length > 0 &&
    Array.isArray(data.characteristics) && (data.characteristics as unknown[]).length > 0 &&
    data.usageFr &&
    Array.isArray(data.benefitsFr) && (data.benefitsFr as unknown[]).length > 0 &&
    Array.isArray(data.images) && (data.images as unknown[]).length > 0
  );
}

/* ── Route ──────────────────────────────────────────────────────────────── */
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { slug, targetKeyword } = await request.json() as { slug: string; targetKeyword?: string };
  if (!slug) return NextResponse.json({ error: 'slug requis' }, { status: 400 });

  // 1. Read existing data.json
  let existing: Record<string, unknown>;
  let dataSha: string;
  try {
    const file = await ghRead(`products/${slug}/data.json`);
    existing = JSON.parse(file.content);
    dataSha = file.sha;
  } catch {
    return NextResponse.json({ error: 'Produit introuvable sur GitHub' }, { status: 404 });
  }

  // 2. Fetch wholesale price from Supabase by SKU
  const admin = createAdminClient();
  const sku = String(existing.id ?? slug);
  const { data: catalogRow } = await admin
    .from('supplier_catalog')
    .select('wholesale_price, department')
    .eq('sku', sku)
    .single();

  const wholesalePrice = catalogRow?.wholesale_price ?? existing.price ?? null;
  const category = catalogRow?.department ?? existing.category ?? '';

  // 3. Check keywords-index for uniqueness
  let keywordsIndex: Record<string, string> = {};
  let keywordsSha: string | undefined;
  try {
    const kf = await ghRead('data/keywords-index.json');
    keywordsIndex = JSON.parse(kf.content);
    keywordsSha = kf.sha;
  } catch { /* first time */ }

  const usedKeywords = Object.values(keywordsIndex).map(k => k.toLowerCase());
  const keyword = targetKeyword ?? String(existing.target_keyword ?? '');
  if (!keyword) {
    return NextResponse.json({ error: 'targetKeyword requis pour éviter la cannibalisation' }, { status: 400 });
  }
  if (usedKeywords.includes(keyword.toLowerCase()) && keywordsIndex[slug] !== keyword) {
    return NextResponse.json({ error: `Mot-clé déjà utilisé : "${keyword}"` }, { status: 409 });
  }

  // 4. Generate enrichment
  let enrichment: Record<string, unknown>;
  try {
    enrichment = await generateEnrichment({
      name:          String(existing.name ?? slug),
      description:   String(existing.description ?? existing.short_description ?? ''),
      category,
      originalName:  String(existing.original_name ?? ''),
      targetKeyword: keyword,
    });
  } catch (e) {
    return NextResponse.json({ error: `Anthropic: ${String(e)}` }, { status: 500 });
  }

  // 5. Build enriched data.json
  const enriched: Record<string, unknown> = {
    ...existing,
    ...enrichment,
    price:          wholesalePrice,
    category,
    target_keyword: keyword,
    enriched_at:    new Date().toISOString(),
  };

  // 6. Write data.json
  try {
    await ghWrite(
      `products/${slug}/data.json`,
      JSON.stringify(enriched, null, 2),
      dataSha,
      `feat(seo): enrich ${slug} — ${keyword}`
    );
  } catch (e) {
    return NextResponse.json({ error: `GitHub write data: ${String(e)}` }, { status: 500 });
  }

  // 7. Update keywords-index
  keywordsIndex[slug] = keyword;
  try {
    await ghWrite(
      'data/keywords-index.json',
      JSON.stringify(keywordsIndex, null, 2),
      keywordsSha,
      `chore: register keyword "${keyword}" → ${slug}`
    );
  } catch (e) {
    return NextResponse.json({ error: `GitHub write keywords: ${String(e)}` }, { status: 500 });
  }

  // 8. Add to catalog.json if publishable
  let addedToCatalog = false;
  if (isPublishable(enriched)) {
    try {
      const cf = await ghRead('products/catalog.json');
      const catalog: { slug: string; pushed_at: string }[] = JSON.parse(cf.content);
      if (!catalog.find(e => e.slug === slug)) {
        catalog.push({ slug, pushed_at: new Date().toISOString() });
        await ghWrite(
          'products/catalog.json',
          JSON.stringify(catalog, null, 2),
          cf.sha,
          `feat: publish ${slug}`
        );
        addedToCatalog = true;
      }
    } catch (e) {
      return NextResponse.json({ error: `GitHub write catalog: ${String(e)}` }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, slug, keyword, published: addedToCatalog });
}
