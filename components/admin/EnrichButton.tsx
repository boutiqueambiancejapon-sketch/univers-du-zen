'use client';

import { useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface Props {
  slug: string;
  alreadyEnriched?: boolean;
}

export default function EnrichButton({ slug, alreadyEnriched }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>(
    alreadyEnriched ? 'done' : 'idle'
  );
  const [errorMsg, setErrorMsg] = useState('');

  async function enrich() {
    setState('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/enrich-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? `Erreur ${res.status}`);
        setState('error');
      } else {
        setState('done');
      }
    } catch (e) {
      setErrorMsg(String(e));
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full whitespace-nowrap">
        <CheckCircle2 size={10} /> Enrichi
      </span>
    );
  }

  if (state === 'error') {
    return (
      <button
        onClick={enrich}
        title={errorMsg}
        className="inline-flex items-center gap-1 text-[10px] font-semibold bg-red-50 text-red-600 px-2.5 py-1 rounded-full hover:bg-red-100 transition-colors whitespace-nowrap"
      >
        <AlertCircle size={10} /> Réessayer
      </button>
    );
  }

  if (state === 'loading') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400 px-2.5 py-1 whitespace-nowrap">
        <Loader2 size={10} className="animate-spin" /> Enrichissement…
      </span>
    );
  }

  return (
    <button
      onClick={enrich}
      className="inline-flex items-center gap-1 text-[10px] font-semibold bg-violet-600 text-white px-2.5 py-1 rounded-full hover:bg-violet-700 transition-colors whitespace-nowrap"
    >
      <Sparkles size={10} /> Enrichir
    </button>
  );
}
