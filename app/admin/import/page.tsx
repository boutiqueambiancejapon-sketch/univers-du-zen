'use client';

import { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ImportPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile]       = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<{ ok?: boolean; total?: number; error?: string } | null>(null);

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    setResult(null);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/admin/import-catalog', { method: 'POST', body: fd });
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setResult({ error: e.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Import catalogue fournisseur</h1>
      <p className="text-sm text-gray-500 mb-8">
        Télécharge le CSV depuis le portail fournisseur et importe-le ici pour mettre à jour le catalogue.
        Seuls les départements pertinents pour UDZ sont importés (aromathérapie, encens, cristaux…).
      </p>

      {/* Drop zone */}
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
        {[
          ['🌿', 'Aromathérapie'],
          ['🧴', 'Huiles de fragrance'],
          ['🌸', 'Encens & Rituel'],
          ['💎', 'Cristaux & Pierres'],
          ['🕯️', 'Bougies & Photophores'],
          ['🛁', 'Bien-être Corps'],
          ['🏠', 'Déco & Maison'],
          ['🍵', 'Thé & Tisanes'],
          ['🎵', 'Instruments'],
        ].map(([e, l]) => (
          <p key={l}>{e} {l}</p>
        ))}
      </div>
    </div>
  );
}
