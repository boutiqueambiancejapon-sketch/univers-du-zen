import { createAdminClient } from '@/lib/supabase/server';

const VAT_RATES: Record<string, number> = { BE: 0.21, FR: 0.20, NL: 0.21, LU: 0.17, DE: 0.19 };
const COUNTRY_NAMES: Record<string, string> = { BE: 'Belgique', FR: 'France', NL: 'Pays-Bas', LU: 'Luxembourg', DE: 'Allemagne' };

export default async function TvaPage({
  searchParams,
}: {
  searchParams: { period?: string };
}) {
  const supabase = createAdminClient();
  const { data: rawOrders } = await supabase
    .from('orders')
    .select('id, created_at, total_eur, subtotal_eur, shipping_eur, vat_amount_eur, vat_rate, country_code, status')
    .in('status', ['paid', 'processing', 'shipped', 'delivered'])
    .order('created_at', { ascending: false });

  const orders = rawOrders ?? [];

  // Build available periods (months) — Array.from instead of spread for TS compat
  const periodSet = new Set<string>();
  orders.forEach(o => {
    const d = new Date(o.created_at);
    periodSet.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  });
  const periods = Array.from(periodSet).sort().reverse();
  const activePeriod = searchParams.period ?? periods[0] ?? '';

  // Filter by period
  const periodOrders = activePeriod
    ? orders.filter(o => {
        const d = new Date(o.created_at);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === activePeriod;
      })
    : orders;

  // Aggregate by country
  const byCountry = periodOrders.reduce((acc, o) => {
    const c = o.country_code ?? 'BE';
    if (!acc[c]) acc[c] = { count: 0, totalTtc: 0, totalHt: 0, tva: 0, rate: VAT_RATES[c] ?? 0.21 };
    acc[c].count++;
    acc[c].totalTtc += o.total_eur ?? 0;
    acc[c].tva      += o.vat_amount_eur ?? 0;
    acc[c].totalHt  += (o.total_eur ?? 0) - (o.vat_amount_eur ?? 0);
    return acc;
  }, {} as Record<string, { count: number; totalTtc: number; totalHt: number; tva: number; rate: number }>);

  const totalTva   = Object.values(byCountry).reduce((s, v) => s + v.tva, 0);
  const totalTtc   = Object.values(byCountry).reduce((s, v) => s + v.totalTtc, 0);
  const totalHt    = Object.values(byCountry).reduce((s, v) => s + v.totalHt, 0);
  const totalCount = Object.values(byCountry).reduce((s, v) => s + v.count, 0);

  // Quarterly rollup
  const quarterlyRollup = orders.reduce((acc, o) => {
    const d = new Date(o.created_at);
    const q = `Q${Math.ceil((d.getMonth() + 1) / 3)} ${d.getFullYear()}`;
    if (!acc[q]) acc[q] = { tva: 0, ttc: 0 };
    acc[q].tva += o.vat_amount_eur ?? 0;
    acc[q].ttc += o.total_eur ?? 0;
    return acc;
  }, {} as Record<string, { tva: number; ttc: number }>);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">TVA OSS</h1>
        <p className="text-sm text-gray-500 mt-0.5">Rapport One Stop Shop pour la déclaration trimestrielle</p>
      </div>

      {/* Period selector */}
      {periods.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          <a href="/admin/tva" className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
            !searchParams.period ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}>Tout</a>
          {periods.map(p => {
            const [y, m] = p.split('-');
            const label = new Date(Number(y), Number(m) - 1).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
            return (
              <a key={p} href={`/admin/tva?period=${p}`}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  searchParams.period === p ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}>{label}</a>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'CA TTC',         value: totalTtc.toFixed(2).replace('.', ',') + ' €', sub: `${totalCount} commandes` },
          { label: 'CA HT',          value: totalHt.toFixed(2).replace('.', ',') + ' €',  sub: 'hors taxe' },
          { label: 'TVA à déclarer', value: totalTva.toFixed(2).replace('.', ',') + ' €', sub: 'total OSS', highlight: true },
        ].map(({ label, value, sub, highlight }) => (
          <div key={label} className={`rounded-xl border p-5 ${highlight ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'}`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{label}</p>
            <p className={`text-2xl font-semibold ${highlight ? 'text-amber-700' : 'text-gray-900'}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* By country */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Détail par pays</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Pays', 'Taux TVA', 'Nb commandes', 'CA HT', 'TVA collectée', '% du total'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[12px] font-semibold uppercase tracking-wider text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {Object.entries(byCountry).sort((a, b) => b[1].tva - a[1].tva).map(([country, data]) => (
              <tr key={country} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-gray-800">{COUNTRY_NAMES[country] ?? country}</td>
                <td className="px-5 py-3.5 text-gray-600">{(data.rate * 100).toFixed(0)}%</td>
                <td className="px-5 py-3.5 text-gray-600">{data.count}</td>
                <td className="px-5 py-3.5 text-gray-600">{data.totalHt.toFixed(2).replace('.', ',')} €</td>
                <td className="px-5 py-3.5 font-semibold text-amber-700">{data.tva.toFixed(2).replace('.', ',')} €</td>
                <td className="px-5 py-3.5 text-gray-500">{totalTva > 0 ? (data.tva / totalTva * 100).toFixed(0) : 0}%</td>
              </tr>
            ))}
            {Object.keys(byCountry).length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-sm text-gray-400">Aucune donnée pour cette période</td></tr>
            )}
          </tbody>
          {Object.keys(byCountry).length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-gray-50">
                <td colSpan={2} className="px-5 py-3.5 text-sm font-bold text-gray-800">TOTAL</td>
                <td className="px-5 py-3.5 text-sm font-bold text-gray-800">{totalCount}</td>
                <td className="px-5 py-3.5 text-sm font-bold text-gray-800">{totalHt.toFixed(2).replace('.', ',')} €</td>
                <td className="px-5 py-3.5 text-sm font-bold text-amber-700">{totalTva.toFixed(2).replace('.', ',')} €</td>
                <td className="px-5 py-3.5 text-sm font-bold text-gray-800">100%</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Quarterly rollup */}
      {Object.keys(quarterlyRollup).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Vue trimestrielle (pour déclaration OSS)</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Trimestre', 'CA TTC', 'TVA à déclarer'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[12px] font-semibold uppercase tracking-wider text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {Object.entries(quarterlyRollup).reverse().map(([q, data]) => (
                <tr key={q} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-gray-800">{q}</td>
                  <td className="px-5 py-3.5 text-gray-600">{data.ttc.toFixed(2).replace('.', ',')} €</td>
                  <td className="px-5 py-3.5 font-semibold text-amber-700">{data.tva.toFixed(2).replace('.', ',')} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
