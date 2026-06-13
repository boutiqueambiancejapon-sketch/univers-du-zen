'use client';

import { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertCircle } from 'lucide-react';

/* ---------- CSV parser ---------- */
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/);
  if (lines.length < 2) return [];
  // Remove BOM if present
  const firstLine = lines[0].replace(/^﻿/, '');
  const headers = splitCSVLine(firstLine);
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const vals = splitCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, j) => { row[h.trim().replace(/^"|"$/g, '')] = (vals[j] ?? '').trim().replace(/^"|"$/g, ''); });
    rows.push(row);
  }
  return rows;
}

function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (c === ',' && !inQ) {
      result.push(cur); cur = '';
    } else cur += c;
  }
  result.push(cur);
  return result;
}

/* ---------- UDZ dept mapping (exact CSV department names) ---------- */
const UDZ_DEPTS: Record<string, string> = {
  'Aromatherapy':        'Aromathérapie',
  'Fragrance':           'Huiles de fragrance',
  'Incense and Burners': 'Encens & Rituel',
  'Crystals & Esoterics':'Cristaux & Pierres',
  'Candles & Holders':   'Bougies & Photophores',
  'Bath & Body':         'Bien-être Corps',
  'Home & Garden':       'Déco & Maison',
  'Artisan Tea':         'Thé & Tisanes',
  'Musical Instruments': 'Instruments',
};

/* ---------- convert CSV row → Supabase record ---------- */
// Actual CSV columns: Status, Product code, Department, Subdepartment, Family code, Family,
// Barcode, Price, Unit label, Unit price, Unit Name, Unit RRP, Unit net weight,
// Package weight (shipping), Webpage description (plain text), Stock, Images, Available Quantity
function rowToProduct(row: Record<string, string>) {
  const dept = UDZ_DEPTS[row['Department']];
  if (!dept) return null;
  if (row['Status']?.toLowerCase() !== 'active') return null;

  const sku = row['Product code'];
  if (!sku) return null;

  const qty = parseInt(row['Available Quantity'] ?? '0') || 0;
  const ws  = parseFloat(row['Unit price'] ?? row['Price'] ?? '0');
  const rrp = parseFloat(row['Unit RRP'] ?? '0');

  // Images is comma-separated — take first
  const imageRaw = (row['Images'] ?? '').trim();
  const imageUrl = imageRaw ? imageRaw.split(',')[0].trim() : '';

  return {
    sku,
    name:            row['Unit Name'] ?? row['Product code'],
    department:      dept,
    family_code:     row['Family code'] ?? '',
    family:          row['Family'] ?? '',
    barcode:         row['Barcode'] ?? '',
    wholesale_price: isNaN(ws)  ? 0 : ws,
    rrp:             isNaN(rrp) ? 0 : rrp,
    stock_qty:       qty,
    in_stock:        qty > 0,
    image_url:       imageUrl,
    weight:          parseFloat(row['Package weight (shipping)'] ?? '0') || 0,
    description:     row['Webpage description (plain text)'] ?? '',
  };
}

/* ---------- component ---------- */
export default function ImportPage() {
  const inputRef  = useRef<HTMLInputElement>(null);
  const [file, setFile]         = useState<File | null>(null);
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult]     = useState<{ ok?: boolean; total?: number; skipped?: number; error?: string } | null>(null);

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setProgress('Lecture du fichier…');

    try {
      const text = await file.text();
      setProgress('Analyse CSV…');
      const rows = parseCSV(text);

      const products: any[] = [];
      let skipped = 0;
      rows.forEach(r => {
        const p = rowToProduct(r);
        if (p) products.push(p); else skipped++;
      });

      if (products.length === 0) {
        setResult({ error: `Aucun produit UDZ trouvé (${rows.length} lignes analysées, ${skipped} ignorées). Vérifie les colonnes du CSV.` });
        return;
      }

      setProgress(`${products.length.toLocaleString()} produits UDZ · envoi par lots…`);

      const BATCH = 500;
      let total = 0;
      for (let i = 0; i < products.length; i += BATCH) {
        const batch = products.slice(i, i + BATCH);
        const batchNum = Math.floor(i / BATCH) + 1;
        const totalBatches = Math.ceil(products.length / BATCH);
        setProgress(`Lot ${batchNum}/${totalBatches} (${(i + batch.length).toLocaleString()}/${products.length.toLocaleString()})…`);

        const res = await fetch('/api/admin/import-catalog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products: batch }),
        });
        const data = await res.json().catch(() => ({ error: 'Réponse serveur invalide' }));
        if (data.error) throw new Error(data.error);
        total += data.count ?? batch.length;
      }

      setResult({ ok: true, total, skipped });
    } catch (e: any) {
      setResult({ error: e.message });
    } finally {
      setLoading(false);
      setProgress('');
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Import catalogue fournisseur</h1>
      <p className="text-sm text-gray-500 mb-8">
        Le CSV est analysé directement dans le navigateur et envoyé par lots — aucune limite de taille.
        Seuls les 9 départements UDZ sont importés, les autres sont ignorés.
      </p>

      <div
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
          file ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f?.name.endsWith('.csv')) setFile(f);
        }}
      >
        <input ref={inputRef} type="file" accept=".csv" className="hidden"
          onChange={e => { setFile(e.target.files?.[0] ?? null); setResult(null); }} />
        <Upload size={32} className={`mx-auto mb-3 ${file ? 'text-gray-900' : 'text-gray-300'}`} />
        {file ? (
          <>
            <p className="font-semibold text-gray-900">{file.name}</p>
            <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
          </>
        ) : (
          <>
            <p className="font-semibold text-gray-700">Glisser-déposer le CSV ici</p>
            <p className="text-sm text-gray-400 mt-1">ou cliquer pour sélectionner</p>
          </>
        )}
      </div>

      <button onClick={handleUpload} disabled={!file || loading}
        className="mt-4 w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-colors disabled:opacity-40">
        {loading ? 'Import en cours…' : 'Importer le catalogue'}
      </button>

      {loading && progress && (
        <p className="mt-3 text-center text-xs text-gray-500 animate-pulse">{progress}</p>
      )}

      {result && (
        <div className={`mt-4 flex items-start gap-3 p-4 rounded-xl text-sm ${
          result.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
        }`}>
          {result.ok
            ? <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
            : <AlertCircle   size={18} className="flex-shrink-0 mt-0.5" />
          }
          <div>
            {result.ok ? (
              <>
                <strong>{result.total?.toLocaleString()} produits</strong> importés dans Supabase.
                {result.skipped ? <span className="text-emerald-600 ml-1">({result.skipped?.toLocaleString()} ignorés : hors UDZ)</span> : null}
              </>
            ) : (
              <><strong>Erreur :</strong> {result.error}</>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 p-5 bg-gray-50 rounded-xl text-xs text-gray-500 space-y-1.5 border border-gray-200">
        <p className="font-semibold text-gray-700 mb-2">Départements importés</p>
        {Object.entries(UDZ_DEPTS).map(([src, label]) => {
          const emoji: Record<string, string> = {
            'Aromathérapie':'🌿','Huiles de fragrance':'🧴','Encens & Rituel':'🌸',
            'Cristaux & Pierres':'💎','Bougies & Photophores':'🕯️','Bien-être Corps':'🛁',
            'Déco & Maison':'🏠','Thé & Tisanes':'🍵','Instruments':'🎵',
          };
          return (
            <p key={label}>{emoji[label]} <strong>{label}</strong> <span className="text-gray-400">← {src}</span></p>
          );
        })}
      </div>
    </div>
  );
}
