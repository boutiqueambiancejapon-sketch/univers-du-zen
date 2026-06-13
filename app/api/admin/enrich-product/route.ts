import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'boutiqueambiancejapon@gmail.com';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ?? '';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? '';
const REPO = 'boutiqueambiancejapon-sketch/univers-du-zen';

/* ── Anthropic ──────────────────────────────────────────────────────────── */

interface Enrichment {
  faqFr: { question: string; answer: string }[];
  characteristics: { label: string; value: string }[];
  usageFr: string;
  benefitsFr: string[];
}

async function generateEnrichment(product: {
  name: string;
  description: string;
  category: string;
  originalName: string;
}): Promise<Enrichment> {
  if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY manquant');

  const prompt = `Tu es un expert en bien-être, aromathérapie et produits zen pour la boutique "Univers du Zen" (universduzen.com).

Voici les informations sur un produit :
- Nom : ${product.name}
- Nom original (anglais, du fournisseur) : ${product.originalName}
- Description : ${product.description}
- Catégorie : ${product.category}

Génère du contenu marketing enrichi en français. RÈGLES STRICTES :
• Ne mentionne JAMAIS le fournisseur, la marque source, ni aucun nom de distributeur
• Ton chaleureux, expert, bienveillant — boutique de bien-être haut de gamme
• Contenu utile, précis, basé sur les caractéristiques réelles du produit
• Output : JSON strict UNIQUEMENT, aucun texte avant ou après

Format exact :
{
  "faqFr": [
    {"question": "Question fréquente 1 ?", "answer": "Réponse détaillée."},
    {"question": "Question fréquente 2 ?", "answer": "Réponse détaillée."},
    {"question": "Question fréquente 3 ?", "answer": "Réponse détaillée."},
    {"question": "Question fréquente 4 ?", "answer": "Réponse détaillée."}
  ],
  "characteristics": [
    {"label": "Contenance", "value": "100 ml"},
    {"label": "Famille olfactive", "value": "..."},
    {"label": "Utilisation", "value": "..."},
    {"label": "Convient à", "value": "..."},
    {"label": "Vegan & Cruelty-free", "value": "Oui"}
  ],
  "usageFr": "Instructions d'utilisation complètes, 2 à 3 phrases pratiques.",
  "benefitsFr": [
    "Bénéfice concret 1",
    "Bénéfice concret 2",
    "Bénéfice concret 3",
    "Bénéfice concret 4"
  ]
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
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic error ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const text: string = data.content?.[0]?.text ?? '';

  // Extract JSON block
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`Pas de JSON dans la réponse Anthropic: ${text.slice(0, 200)}`);

  return JSON.parse(match[0]) as Enrichment;
}

/* ── GitHub helpers ─────────────────────────────────────────────────────── */

async function ghRead(filePath: string): Promise<{ content: string; sha: string }> {
  if (!GITHUB_TOKEN) throw new Error('GITHUB_TOKEN manquant');
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${filePath}`,
    { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' } }
  );
  if (!res.ok) throw new Error(`GitHub read ${res.status}: ${filePath}`);
  const json = await res.json();
  return {
    content: Buffer.from(json.content as string, 'base64').toString('utf-8'),
    sha: json.sha as string,
  };
}

async function ghWrite(filePath: string, content: string, sha: string, message: string) {
  if (!GITHUB_TOKEN) throw new Error('GITHUB_TOKEN manquant');
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${filePath}`,
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
        sha,
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub write ${res.status}: ${err.slice(0, 200)}`);
  }
}

/* ── Route ──────────────────────────────────────────────────────────────── */

export async function POST(request: Request) {
  // Auth
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const body = await request.json() as { slug?: string };
  const { slug } = body;
  if (!slug) return NextResponse.json({ error: 'slug requis' }, { status: 400 });

  // Read existing data.json
  const filePath = `products/${slug}/data.json`;
  let existing: Record<string, unknown>;
  let sha: string;

  try {
    const file = await ghRead(filePath);
    existing = JSON.parse(file.content);
    sha = file.sha;
  } catch (e) {
    return NextResponse.json({ error: `Produit introuvable: ${String(e)}` }, { status: 404 });
  }

  // Generate enrichment via Anthropic
  let enrichment: Enrichment;
  try {
    enrichment = await generateEnrichment({
      name:         String(existing.name ?? slug),
      description:  String(existing.description ?? existing.short_description ?? ''),
      category:     String(existing.category ?? ''),
      originalName: String(existing.original_name ?? ''),
    });
  } catch (e) {
    return NextResponse.json({ error: `Erreur Anthropic: ${String(e)}` }, { status: 500 });
  }

  // Merge enrichment into existing data
  const enriched = {
    ...existing,
    faqFr:           enrichment.faqFr,
    characteristics: enrichment.characteristics,
    usageFr:         enrichment.usageFr,
    benefitsFr:      enrichment.benefitsFr,
    enriched_at:     new Date().toISOString(),
  };

  // Write back to GitHub
  try {
    await ghWrite(
      filePath,
      JSON.stringify(enriched, null, 2),
      sha,
      `feat(seo): enrich ${slug} — FAQ, caractéristiques, usage, bénéfices`
    );
  } catch (e) {
    return NextResponse.json({ error: `Erreur GitHub: ${String(e)}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true, slug, enriched_at: enriched.enriched_at });
}
