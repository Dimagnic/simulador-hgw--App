import React, { useState } from 'react';
import { useQuotes } from '@/contexts/QuoteContext';
import { useApp } from '@/contexts/AppContext';
import { Trash2, Clock, GitCompare, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

function QuoteCard({ quote, onDelete, isSelected, onSelect, compareMode }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`bg-card border rounded-xl p-4 transition-all ${isSelected ? 'border-primary ring-1 ring-primary' : 'border-border'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-foreground truncate">{quote.name || 'Cotización sin nombre'}</div>
          <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {quote.date}
            <span className="ml-2 bg-secondary px-1.5 py-0.5 rounded text-xs">{quote.role}</span>
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          {compareMode && (
            <button
              onClick={() => onSelect(quote)}
              className={`px-2 py-1 text-xs rounded-lg font-medium transition-all ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-primary/20'}`}
            >
              {isSelected ? '✓' : 'Selec.'}
            </button>
          )}
          <button onClick={() => onDelete(quote.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="bg-secondary/50 rounded-lg p-2">
          <div className="text-xs text-muted-foreground">Precio</div>
          <div className="font-bold text-sm text-foreground">${quote.totalPrice}</div>
        </div>
        <div className="bg-primary/10 rounded-lg p-2">
          <div className="text-xs text-muted-foreground">BV</div>
          <div className="font-bold text-sm text-primary">{quote.totalBV}</div>
        </div>
        <div className="bg-emerald-500/10 rounded-lg p-2">
          <div className="text-xs text-muted-foreground">Ganancia</div>
          <div className="font-bold text-sm text-emerald-600">${quote.totalProfit || 0}</div>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 w-full flex items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors pt-2 border-t border-border"
      >
        <span>{quote.products?.length || 0} productos</span>
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {expanded && (
        <div className="mt-2 space-y-1">
          {(quote.products || []).map((p, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-foreground truncate flex-1">{p.name}</span>
              <span className="text-muted-foreground ml-2 shrink-0">${p.price} · {p.bv} BV</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ComparePanel({ a, b, onClose }) {
  if (!a || !b) return null;
  const fields = [
    { label: 'Precio total', aVal: `$${a.totalPrice}`, bVal: `$${b.totalPrice}`, better: a.totalPrice <= b.totalPrice ? 'a' : 'b' },
    { label: 'BV total', aVal: a.totalBV, bVal: b.totalBV, better: a.totalBV >= b.totalBV ? 'a' : 'b' },
    { label: 'Ganancia', aVal: `$${a.totalProfit || 0}`, bVal: `$${b.totalProfit || 0}`, better: (a.totalProfit || 0) >= (b.totalProfit || 0) ? 'a' : 'b' },
    { label: 'Productos', aVal: a.products?.length || 0, bVal: b.products?.length || 0, better: null },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-bold text-foreground flex items-center gap-2"><GitCompare className="w-4 h-4 text-primary" /> Comparar Cotizaciones</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="font-semibold text-foreground text-sm truncate">{a.name || 'Cotización A'}</div>
              <div className="text-xs text-muted-foreground">{a.date}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-foreground text-sm truncate">{b.name || 'Cotización B'}</div>
              <div className="text-xs text-muted-foreground">{b.date}</div>
            </div>
          </div>
          <div className="space-y-2">
            {fields.map((f, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 bg-secondary/30 rounded-lg p-2">
                <div className={`text-center font-bold ${f.better === 'a' ? 'text-emerald-600' : 'text-foreground'}`}>{f.aVal}</div>
                <div className="text-xs text-muted-foreground text-center font-medium">{f.label}</div>
                <div className={`text-center font-bold ${f.better === 'b' ? 'text-emerald-600' : 'text-foreground'}`}>{f.bVal}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-border">
          <Button className="w-full" onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </div>
  );
}

export default function QuoteHistoryPanel({ onClose }) {
  const { quotes, deleteQuote, clearQuotes } = useQuotes();
  const { t } = useApp();
  const [compareMode, setCompareMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const handleSelect = (quote) => {
    setSelected(prev => {
      const exists = prev.find(q => q.id === quote.id);
      if (exists) return prev.filter(q => q.id !== quote.id);
      if (prev.length >= 2) return [prev[1], quote];
      return [...prev, quote];
    });
  };

  return (
    <>
      {showCompare && selected.length === 2 && (
        <ComparePanel a={selected[0]} b={selected[1]} onClose={() => setShowCompare(false)} />
      )}
      <div className="fixed inset-0 z-40 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
        <div
          className="bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg border border-border flex flex-col max-h-[85vh]"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Historial de Cotizaciones
            </h3>
            <div className="flex gap-2">
              {quotes.length >= 2 && (
                <button
                  onClick={() => { setCompareMode(!compareMode); setSelected([]); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${compareMode ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}
                >
                  <GitCompare className="w-3.5 h-3.5" /> Comparar
                </button>
              )}
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {compareMode && (
            <div className="px-4 py-2 bg-primary/10 border-b border-border shrink-0">
              <div className="flex items-center justify-between">
                <p className="text-xs text-primary font-medium">Selecciona 2 cotizaciones para comparar ({selected.length}/2)</p>
                {selected.length === 2 && (
                  <button onClick={() => setShowCompare(true)} className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-lg font-medium">
                    Ver comparación
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="overflow-y-auto flex-1 p-4 space-y-3">
            {quotes.length === 0 ? (
              <div className="text-center py-10">
                <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">Aún no hay cotizaciones guardadas.</p>
                <p className="text-xs text-muted-foreground mt-1">Guarda una selección desde el tab Manual.</p>
              </div>
            ) : (
              quotes.map(q => (
                <QuoteCard
                  key={q.id}
                  quote={q}
                  onDelete={deleteQuote}
                  isSelected={!!selected.find(s => s.id === q.id)}
                  onSelect={handleSelect}
                  compareMode={compareMode}
                />
              ))
            )}
          </div>

          {quotes.length > 0 && (
            <div className="p-4 border-t border-border shrink-0">
              <button onClick={clearQuotes} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                Borrar todo el historial
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
