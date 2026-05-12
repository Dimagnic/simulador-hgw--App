import React, { useState } from 'react';
import { PRODUCTS } from '@/data/products';
import { printSelection } from '@/utils/print';
import { useBVCombinationGenerator } from '@/hooks/useBVCombinationGenerator';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Printer, Calculator, CheckCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function BVGoalTab({ role }) {
  const { t } = useApp();
  const [goal, setGoal] = useState('');
  const [combinations, setCombinations] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [calculated, setCalculated] = useState(false);
  const { generateCombinations } = useBVCombinationGenerator();

  const handleCalculate = () => {
    const results = generateCombinations(PRODUCTS, goal, role);
    setCombinations(results);
    setSelectedOption(results.length > 0 ? results[0].optionNumber : null);
    setCalculated(true);
  };

  const handlePrint = () => {
    if (!selectedOption) return;
    const selectedCombo = combinations.find(c => c.optionNumber === selectedOption);
    if (selectedCombo) printSelection(selectedCombo.flatItems, role, selectedCombo.totalPrice, selectedCombo.totalBV);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-secondary/50 p-6 rounded-2xl border border-border">
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
          <div className="flex-1 w-full">
            <label className="block text-sm font-semibold text-foreground mb-2">{t.bvLabel}</label>
            <Input type="number" placeholder={t.bvPlaceholder} value={goal} onChange={(e) => setGoal(e.target.value)} className="bg-background text-lg py-6" />
          </div>
          <Button onClick={handleCalculate} size="lg" className="w-full sm:w-auto shadow-md h-14 px-8">
            <Calculator className="w-5 h-5 mr-2" />{t.bvCalculate}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-3">{t.bvHint}</p>
      </div>

      {calculated && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">{t.bvGenerated}</h3>
              <p className="text-muted-foreground text-sm">{t.bvFound1} {combinations.length} {t.bvFound}</p>
            </div>
            <Button size="lg" onClick={handlePrint} disabled={!selectedOption} className="shadow-sm">
              <Printer className="w-5 h-5 mr-2" />{t.bvPrintSel}
            </Button>
          </div>

          {combinations.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {combinations.map((combo) => {
                const isSelected = selectedOption === combo.optionNumber;
                return (
                  <div key={combo.optionNumber} className={cn("overflow-hidden border-2 rounded-2xl transition-all duration-300 group", isSelected ? "border-combo-selected bg-combo-selected shadow-md" : "border-combo bg-combo hover:bg-combo-hover")}>
                    <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className={cn("font-bold text-lg", isSelected ? "text-primary" : "text-foreground")}>{t.option} {combo.optionNumber}</h4>
                          {combo.differenceFromGoal === 0 && (<span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-semibold">{t.bvExact}</span>)}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="font-semibold text-foreground">{t.bvTotal} <span className="text-primary text-base ml-1">{combo.totalBV}</span></span>
                          <span className="font-semibold text-foreground">{t.bvPrice} <span className="text-base ml-1">${combo.totalPrice}</span></span>
                          {combo.differenceFromGoal > 0 && (<span className="text-muted-foreground">({t.bvMissing} {combo.differenceFromGoal} {t.bvMissingBV})</span>)}
                        </div>
                      </div>
                      <Button variant={isSelected ? "default" : "outline"} onClick={() => setSelectedOption(combo.optionNumber)} className={cn("shrink-0", isSelected ? "bg-primary text-primary-foreground shadow-sm" : "")}>
                        {isSelected ? (<><CheckCircle className="w-4 h-4 mr-2" />{t.bvSelected}</>) : t.bvSelect}
                      </Button>
                    </div>

                    <div className="border-t border-border/50">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-black/5 text-muted-foreground">
                            <tr>
                              <th className="px-5 py-3 font-medium">{t.colQty}</th>
                              <th className="px-5 py-3 font-medium">{t.colCode}</th>
                              <th className="px-5 py-3 font-medium">{t.colProduct}</th>
                              <th className="px-5 py-3 font-medium text-right">{t.colUnitPrice}</th>
                              <th className="px-5 py-3 font-medium text-right">{t.colSubBV}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/50">
                            {combo.products.map((p, idx) => {
                              const price = role === 'Master' ? p.master : p.dist;
                              return (
                                <tr key={`${p.id}-${idx}`} className={cn("transition-colors", isSelected ? "hover:bg-black/5" : "hover:bg-muted/50")}>
                                  <td className="px-5 py-3 font-bold text-foreground">x{p.quantity}</td>
                                  <td className="px-5 py-3 text-muted-foreground">{p.id}</td>
                                  <td className="px-5 py-3 font-medium text-foreground">{p.name}<div className="text-xs font-normal text-muted-foreground">{p.description}</div></td>
                                  <td className="px-5 py-3 text-right font-medium">{price === null ? <span className="text-muted-foreground italic font-normal">{t.noPrice}</span> : `$${price}`}</td>
                                  <td className="px-5 py-3 text-right text-primary font-semibold">{p.bv * p.quantity}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center border border-border rounded-2xl bg-card shadow-sm">
              <p className="text-muted-foreground">{t.bvEmpty}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
