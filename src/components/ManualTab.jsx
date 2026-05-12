import React, { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { printSelection } from '@/utils/print';
import { Button } from '@/components/ui/button';
import { Printer, CheckSquare, TrendingUp, Award, Search, Bookmark, Share2, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useQuotes } from '@/contexts/QuoteContext';
import { RANK_TABLE, getRank } from '@/data/ranks';
import ShareModal from '@/components/ShareModal';

export default function ManualTab({ role }) {
  const { t } = useApp();
  const { saveQuote } = useQuotes();
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [search, setSearch] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [savedAnim, setSavedAnim] = useState(false);

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;
    if (activeCategory) list = list.filter(p => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, search]);

  const toggleProduct = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const selectedProducts = PRODUCTS.filter(p => selectedIds.has(p.id));
  const totalMXN = selectedProducts.reduce((sum, p) => sum + (role === 'Master' ? (p.master || 0) : (p.dist || 0)), 0);
  const totalBV = selectedProducts.reduce((sum, p) => sum + (p.bv || 0), 0);
  const totalPub = selectedProducts.reduce((sum, p) => sum + (p.pub || 0), 0);
  const totalProfit = totalPub - totalMXN;
  const rankInfo = getRank(totalBV);

  const handleSave = () => {
    if (selectedProducts.length === 0) return;
    saveQuote({
      name: `Selección ${selectedProducts.length} prod.`,
      role,
      products: selectedProducts.map(p => ({ name: p.name, price: role === 'Master' ? p.master : p.dist, bv: p.bv, description: p.description })),
      totalPrice: totalMXN,
      totalBV,
      totalProfit,
    });
    setSavedAnim(true);
    setTimeout(() => setSavedAnim(false), 1800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {showShare && (
        <ShareModal
          products={selectedProducts}
          role={role}
          totalPrice={totalMXN}
          totalBV={totalBV}
          totalProfit={totalProfit}
          onClose={() => setShowShare(false)}
        />
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            !activeCategory ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary text-foreground hover:bg-secondary/80'
          }`}
        >
          {t.manualAll}
        </button>
        {CATEGORIES.filter(c => c !== 'Todos').map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === cat ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 bg-secondary/30 border-b border-border space-y-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-primary" />
              {t.manualCatalog}
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nombre, código o descripción…"
                className="w-full pl-9 pr-8 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {search && (
              <p className="text-xs text-muted-foreground">{filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''} para "{search}"</p>
            )}
          </div>
          <div className="overflow-y-auto flex-1 p-2">
            <div className="space-y-1">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                  <p className="text-muted-foreground text-sm">Sin resultados para "{search}"</p>
                </div>
              ) : (
                filteredProducts.map(p => {
                  const price = role === 'Master' ? p.master : p.dist;
                  return (
                    <label
                      key={p.id}
                      className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors ${
                        selectedIds.has(p.id) ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted border border-transparent'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.has(p.id)}
                        onChange={() => toggleProduct(p.id)}
                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary accent-primary"
                      />
                      <div className="ml-4 flex-1">
                        <div className="font-medium text-foreground">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.id} • {p.description}</div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-semibold text-foreground">
                          {price === null ? <span className="text-muted-foreground font-normal italic text-sm">{t.noPrice}</span> : `$${price}`}
                        </div>
                        <div className="text-xs text-primary font-medium">{p.bv} BV</div>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col h-fit sticky top-6">
          <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
            <h3 className="font-semibold text-foreground">{t.manualSummary}</h3>
            {selectedIds.size > 0 && (
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                {t.manualClear}
              </button>
            )}
          </div>

          <div className="space-y-3 flex-1">
            {selectedProducts.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground text-sm">{t.manualNone}</p>
                <p className="text-muted-foreground text-xs mt-1">{t.manualNoneHint}</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">{t.manualItems.charAt(0).toUpperCase() + t.manualItems.slice(1)}:</span>
                  <span className="font-semibold text-foreground">{selectedProducts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">{t.manualTotal}</span>
                  <span className="font-bold text-xl text-foreground">${totalMXN}</span>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-700">{t.profitColGain || 'Ganancia estimada'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{t.profitColPub || 'Precio público'}: ${totalPub}</span>
                    <span className="font-bold text-lg text-emerald-600">${totalProfit}</span>
                  </div>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-primary font-semibold text-sm">{t.colBV} {t.manualTotal}</span>
                    <span className="font-bold text-2xl text-primary">{totalBV}</span>
                  </div>
                  {rankInfo && (
                    <div className="mt-2 border-t border-primary/20 pt-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-xs font-semibold text-amber-600">{t.rankLabel || 'Rango alcanzado'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-foreground text-sm">{rankInfo.name}</span>
                        <span className="text-xs text-muted-foreground">{rankInfo.bvMin}–{rankInfo.bvMax === Infinity ? '∞' : rankInfo.bvMax} BV</span>
                      </div>
                      {rankInfo.nextName && (
                        <div className="mt-1.5">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>{t.rankNext || 'Siguiente'}: {rankInfo.nextName}</span>
                            <span>+{rankInfo.bvToNext} BV</span>
                          </div>
                          <div className="h-1.5 bg-border rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${rankInfo.progress}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="mt-6 space-y-2">
            <button
              disabled={selectedProducts.length === 0}
              onClick={handleSave}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                savedAnim
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'bg-secondary text-foreground border-border hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              {savedAnim ? '¡Guardado en historial!' : 'Guardar en historial'}
            </button>

            <button
              disabled={selectedProducts.length === 0}
              onClick={() => setShowShare(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-[#25D366]/10 text-[#1a9e4f] border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Share2 className="w-4 h-4" />
              Compartir / WhatsApp
            </button>

            <Button
              className="w-full shadow-md"
              size="lg"
              disabled={selectedProducts.length === 0}
              onClick={() => printSelection(selectedProducts, role, totalMXN, totalBV)}
            >
              <Printer className="w-5 h-5 mr-2" />
              {t.manualPrint}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
