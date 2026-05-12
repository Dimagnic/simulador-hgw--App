import React, { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { useApp } from '@/contexts/AppContext';
import { TrendingUp, DollarSign, Search } from 'lucide-react';

export default function ProfitCalculatorTab({ role }) {
  const { t } = useApp();
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('profit_desc');

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS.filter(p => {
      const price = role === 'Master' ? p.master : p.dist;
      return price !== null && p.pub !== null && p.pub > 0 && price > 0;
    });
    if (activeCategory) list = list.filter(p => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
    }
    list = list.map(p => {
      const cost = role === 'Master' ? p.master : p.dist;
      const profit = p.pub - cost;
      const margin = ((profit / p.pub) * 100).toFixed(1);
      const bvPerPeso = p.bv > 0 ? (p.bv / cost).toFixed(3) : 0;
      return { ...p, cost, profit, margin, bvPerPeso };
    });
    switch (sortBy) {
      case 'profit_desc': return list.sort((a, b) => b.profit - a.profit);
      case 'profit_asc': return list.sort((a, b) => a.profit - b.profit);
      case 'margin_desc': return list.sort((a, b) => b.margin - a.margin);
      case 'bv_eff': return list.sort((a, b) => b.bvPerPeso - a.bvPerPeso);
      default: return list;
    }
  }, [activeCategory, search, sortBy, role]);

  const topProfit = filteredProducts.length > 0 ? Math.max(...filteredProducts.map(p => p.profit)) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: t.profitBestProfit || 'Mejor ganancia',
            value: `$${topProfit}`,
            icon: <DollarSign className="w-5 h-5" />,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10 border-emerald-500/20'
          },
          {
            label: t.profitAvgMargin || 'Margen promedio',
            value: filteredProducts.length > 0
              ? `${(filteredProducts.reduce((s, p) => s + parseFloat(p.margin), 0) / filteredProducts.length).toFixed(1)}%`
              : '—',
            icon: <TrendingUp className="w-5 h-5" />,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10 border-blue-500/20'
          },
          {
            label: t.profitProducts || 'Productos con precio',
            value: filteredProducts.length,
            icon: <Search className="w-5 h-5" />,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10 border-purple-500/20'
          }
        ].map((kpi, i) => (
          <div key={i} className={`rounded-2xl border p-5 flex items-center gap-4 ${kpi.bg}`}>
            <div className={`${kpi.color}`}>{kpi.icon}</div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
              <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t.profitSearch || 'Buscar producto…'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="profit_desc">{t.profitSortProfitDesc || 'Mayor ganancia primero'}</option>
          <option value="profit_asc">{t.profitSortProfitAsc || 'Menor ganancia primero'}</option>
          <option value="margin_desc">{t.profitSortMargin || 'Mayor margen %'}</option>
          <option value="bv_eff">{t.profitSortBV || 'Mejor BV/peso'}</option>
        </select>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!activeCategory ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary text-foreground hover:bg-secondary/80'}`}
        >{t.manualAll}</button>
        {CATEGORIES.filter(c => c !== 'Todos').map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategory === cat ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary text-foreground hover:bg-secondary/80'}`}
          >{cat}</button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">{t.colCode}</th>
                <th className="px-4 py-3 text-left font-medium">{t.colProduct}</th>
                <th className="px-4 py-3 text-right font-medium">{t.profitColCost || 'Precio dist.'}</th>
                <th className="px-4 py-3 text-right font-medium">{t.profitColPub || 'Precio público'}</th>
                <th className="px-4 py-3 text-right font-medium text-emerald-600">{t.profitColGain || 'Ganancia'}</th>
                <th className="px-4 py-3 text-right font-medium text-blue-600">{t.profitColMargin || 'Margen %'}</th>
                <th className="px-4 py-3 text-right font-medium">{t.colBV}</th>
                <th className="px-4 py-3 text-right font-medium text-purple-600">{t.profitColBVeff || 'BV/peso'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map(p => {
                const profitPct = (p.profit / topProfit) * 100;
                return (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-4 py-3 text-muted-foreground text-xs">{p.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.description}</div>
                      {/* inline bar */}
                      <div className="mt-1 h-1 bg-border rounded-full overflow-hidden w-full max-w-[180px]">
                        <div className="h-full bg-emerald-500/60 rounded-full transition-all" style={{ width: `${profitPct}%` }} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">${p.cost}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">${p.pub}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-emerald-600">${p.profit}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${parseFloat(p.margin) >= 30 ? 'bg-emerald-500/10 text-emerald-600' : parseFloat(p.margin) >= 20 ? 'bg-yellow-500/10 text-yellow-600' : 'bg-red-500/10 text-red-500'}`}>
                        {p.margin}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-primary font-semibold">{p.bv}</td>
                    <td className="px-4 py-3 text-right text-purple-600 font-medium">{p.bvPerPeso}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="p-12 text-center text-muted-foreground text-sm">
            {t.profitEmpty || 'No hay productos que coincidan con los filtros.'}
          </div>
        )}
      </div>
    </div>
  );
}
