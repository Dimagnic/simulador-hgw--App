import React, { useState } from 'react';
import { PRODUCTS } from '@/data/products';
import { printSelection } from '@/utils/print';
import { Button } from '@/components/ui/button';
import { Printer, RefreshCw } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function RandomTab({ role }) {
  const { t } = useApp();
  const [count, setCount] = useState(5);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const generateRandom = () => {
    const selection = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * PRODUCTS.length);
      selection.push(PRODUCTS[randomIndex]);
    }
    setSelectedProducts(selection);
  };

  const totalMXN = selectedProducts.reduce((sum, p) => sum + (role === 'Master' ? (p.master || 0) : (p.dist || 0)), 0);
  const totalBV = selectedProducts.reduce((sum, p) => sum + (p.bv || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-secondary/50 p-6 rounded-2xl border border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex-1 w-full">
            <label className="block text-sm font-semibold text-foreground mb-3">
              {t.randomLabel} <span className="text-primary text-lg ml-2">{count}</span>
            </label>
            <input
              type="range" min="1" max="15" value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <Button onClick={generateRandom} size="lg" className="w-full sm:w-auto shadow-md">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t.randomButton}
          </Button>
        </div>
      </div>

      {selectedProducts.length > 0 && (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 bg-secondary/30 border-b border-border flex justify-between items-center">
            <h3 className="font-semibold text-foreground">{t.randomResults} ({selectedProducts.length})</h3>
            <Button variant="outline" size="sm" onClick={() => printSelection(selectedProducts, role, totalMXN, totalBV)}>
              <Printer className="w-4 h-4 mr-2" />{t.print}
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">{t.colCode}</th>
                  <th className="px-4 py-3 font-medium">{t.colProduct}</th>
                  <th className="px-4 py-3 font-medium">{t.colCategory}</th>
                  <th className="px-4 py-3 font-medium text-right">{t.colPrice}</th>
                  <th className="px-4 py-3 font-medium text-right">{t.colBV}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {selectedProducts.map((p, idx) => {
                  const price = role === 'Master' ? p.master : p.dist;
                  return (
                    <tr key={`${p.id}-${idx}`} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">{p.id}</td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {p.name}
                        <div className="text-xs font-normal text-muted-foreground">{p.description}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                      <td className="px-4 py-3 text-right font-medium">
                        {price === null ? <span className="text-muted-foreground italic">{t.noPrice}</span> : `$${price}`}
                      </td>
                      <td className="px-4 py-3 text-right text-primary font-semibold">{p.bv}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-primary/5 border-t-2 border-primary/20">
                <tr>
                  <td colSpan="3" className="px-4 py-4 text-right font-bold text-foreground">{t.totals}</td>
                  <td className="px-4 py-4 text-right font-bold text-foreground">${totalMXN}</td>
                  <td className="px-4 py-4 text-right font-bold text-primary">{totalBV}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
