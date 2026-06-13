'use client';

import { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertCircle } from 'lucide-react';

/* ---------- CSV parser ---------- */
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = splitCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const vals = splitCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, j) => { row[h.trim()] = (vals[j] ?? '').trim(); });
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

/* ---------- UDZ dept mapping ---------- */
const UDZ_DEPTS: Record<string, string> = {
  'Aromatherapy':          'Aromathérapie',
  'Fragrance':             'Huiles de fragrance',
  'Incense and Burners':   'Encens & Rituel',
  'Crystals & Esoterics':  'Cristaux & Pierres',
  'Candles & Holders':     'Bougies & Photophores',
  'Bath & Body':           'Bien-être Corps',
  'Home & Garden':         'Déco & Maison',
  'Artisan Tea':           'Thé & Tisanes',
  'Musical Instruments':   'Instruments',
};

/* ---------- convert row to product record ---------- */
function rowToProduct(row: Record<string, string>) {
  const dept = Object.keys(UDZ_DEPTS).find(k =>
    (row['Department'] ?? '').toLowerCase().includes(k.toLowerCase())
  );
  if (!dept) return null;
  const ws = parseFloat(row['WholesalePrice'] ?? row['Wholesale Price'] ?? '0');
  return {
    sku:             row['SKU'] ?? row['Code'] ?? '',
    name:            row['Name'] ?? row['Product Name'] ?? '',
    department:      UDZ_DEPTS[dept],
    family:          row['Family'] ?? row['Product Family'] ?? '',
    wholesale_price: isNaN(ws) ? 0 : ws,
    in_stock:        (row['Stock'] ?? row['In Stock'] ?? '').toLowerCase() !== 'false' &&
                     (row['Stock'] ?? row['In Stock'] ?? '') !== '0',
    image_url:       row['Image'] ?? row['Image URL'] ?? '',
    barcode:         row['Barcode'] ?? row['EAN'] ?? '',
    weight:          parseFloat(row['Weight'] ?? '0') || 0,
    description:     row['Description'] ?? '',
  };
}

/* ---------- component ---------- */
export default function ImportPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile]       = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult]   = useState<{ ok?: boolean; total?: number; error?: string } | null>(null);

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setProgress('Lecture du fichier…');

    try {
      const text = await file.text();
      setProgress('Analyse CSV…');
      const rows = parseCSV(text);

      const products = rows.map(rowToProduct).filter(Boolean) as any[];
      setProgress(`${products.length} produits UDZ trouvés — envoi par lots…`);

      const BATCH = 500;
      let total = 0;
      for (let i = 0; i < products.length; i += BATCH) {
        const batch = products.slice(i, i + BATCH);
        setProgress(`Lot ${Math.floor(i / BATCH) + 1}/${Math.ceil(products.length / BATCH)} (${i}–${Math.min(i + BATCH, products.length)})…`);
        const res = await fetch('/api/admin/import-catalog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products: batch }),
        });
        const data = await res.json().catch(() => ({ error: 'Réponse invalide' }));
        if (data.error) throw new Error(data.error);
        total += data.count ?? batch.length;
      }
      setResult({ ok: true, total });
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
        Télécharge le CSV depuis le portail fournisseur et importe-le ici.
        Seuls les départements pertinents pour UDZ sont importés.
        Le fichier est analysé dans le navigateur — aucune limite de taille.
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
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={e => setFile(e.target.files?.[0] ?? null)}
        />
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

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="mt-4 w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-colors disabled:opacity-40"
      >
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
            : <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          }
          <div>
            {result.ok
              ? <><strong>{result.total?.toLocaleString()} produits</strong> importés avec succès dans Supabase.</>
              : <><strong>Erreur :</strong> {result.error}</>
            }
          </div>
        </div>
      )}

      <div className="mt-8 p-5 bg-gray-50 rounded-xl text-xs text-gray-500 space-y-1.5 border border-gray-200">
        <p className="font-semibold text-gray-700 mb-2">Départements importés automatiquement</p>
        {Object.entries(UDZ_DEPTS).map(([src, label]) => {
          const emoji = { 'Aromathérapie':'🌿','Huiles de fragrance':'🧴','Encens & Rituel':'🌸','Cristaux & Pierres':'💎','Bougies & Photophores':'🕯️','Bien-être Corps':'🛁','Déco & Maison':'🏠','Thé & Tisanes':'🍵','Instruments':'🎵' }[label] ?? '•';
          return <p key={label}>{emoji} {label} <span className="text-gray-400">← {src}</span></p>;
        })}
      </div>
    </div>
  );
}
