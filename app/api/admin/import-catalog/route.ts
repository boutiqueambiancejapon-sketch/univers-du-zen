import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'boutiqueambiancejapon@gmail.com';

const UDZ_DEPTS: Record<string, string> = {
  'Aromatherapy':         'Aromathérapie',
  'Fragrance':            'Huiles de fragrance',
  'Incense and Burners':  'Encens & Rituel',
  'Crystals & Esoterics': 'Cristaux & Pierres',
  'Candles & Holders':    'Bougies & Photophores',
  'Bath & Body':          'Bien-être Corps',
  'Home & Garden':        'Déco & Maison',
  'Artisan Tea':          'Thé & Tisanes',
  'Musical Instruments':  'Instruments',
};

function parseStock(s: string): number {
  const n = parseInt(s ?? '0', 10);
  return isNaN(n) ? 0 : n;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];

  // Parse quoted CSV
  function parseLine(line: string): string[] {
    const fields: string[] = [];
    let cur = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuote && line[i + 1] === '"') { cur += '"'; i++; }
        else inQuote = !inQuote;
      } else if (ch === ',' && !inQuote) {
        fields.push(cur); cur = '';
      } else {
        cur += ch;
      }
    }
    fields.push(cur);
    return fields;
  }

  const headers = parseLine(lines[0]);
  return lines.slice(1).map(line => {
    const vals = parseLine(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h.trim()] = (vals[i] ?? '').trim(); });
    return obj;
  });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 });

  const text = await file.text();
  const rows = parseCSV(text);

  const products = rows
    .filter(r => r['Status'] === 'Active' && UDZ_DEPTS[r['Department']])
    .map(r => {
      const imgs = (r['Images'] ?? '').split(',').map(u => u.trim()).filter(u => u.startsWith('http'));
      const stock = parseStock(r['Available Quantity'] || r['Stock'] || '0');
      return {
        sku:         r['Product code'],
        name:        r['Unit Name'],
        dept:        UDZ_DEPTS[r['Department']],
        family_code: r['Family code'],
        family:      r['Family'],
        price:       parseFloat(r['Price'] || '0') || 0,
        rrp:         parseFloat(r['Unit RRP'] || '0') || 0,
        stock,
        in_stock:    stock > 0,
        image:       imgs[0] ?? '',
        updated_at:  new Date().toISOString(),
      };
    });

  if (products.length === 0) {
    return NextResponse.json({ error: 'Aucun produit UDZ trouvé dans ce CSV' }, { status: 400 });
  }

  // Upsert in batches of 500
  const admin = createAdminClient();
  const BATCH = 500;
  let inserted = 0;

  for (let i = 0; i < products.length; i += BATCH) {
    const batch = products.slice(i, i + BATCH);
    const { error } = await admin.from('supplier_catalog').upsert(batch, { onConflict: 'sku' });
    if (error) return NextResponse.json({ error: error.message, at: i }, { status: 500 });
    inserted += batch.length;
  }

  return NextResponse.json({ ok: true, total: products.length, inserted });
}
