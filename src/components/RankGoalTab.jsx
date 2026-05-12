import React, { useState } from 'react';
import { RANK_TABLE, getRank } from '@/data/ranks';
import { useApp } from '@/contexts/AppContext';
import { Award, Target } from 'lucide-react';

export default function RankGoalTab() {
  const { t, lang } = useApp();
  const [inputBV, setInputBV] = useState('');

  const numBV = parseInt(inputBV) || 0;
  const rankInfo = numBV > 0 ? getRank(numBV, lang) : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Simulator */}
      <div className="bg-secondary/50 p-6 rounded-2xl border border-border">
        <label className="block text-sm font-semibold text-foreground mb-2">
          <Target className="inline w-4 h-4 mr-1.5 text-primary" />
          {t.rankSimLabel || 'Simula tu BV acumulado'}
        </label>
        <div className="flex gap-3">
          <input
            type="number"
            min="0"
            placeholder={t.rankSimPlaceholder || 'Ej. 350'}
            value={inputBV}
            onChange={e => setInputBV(e.target.value)}
            className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-lg font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {rankInfo && (
          <div className="mt-4 p-4 bg-amber-500/10 rounded-xl border border-amber-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-lg text-foreground">{rankInfo.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.rankRange || 'Rango'}: {rankInfo.bvMin} – {rankInfo.bvMax === Infinity ? '∞' : rankInfo.bvMax} BV
            </p>
            {rankInfo.nextName && (
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">
                    {t.rankNext || 'Siguiente nivel'}: <span className="font-semibold text-foreground">{rankInfo.nextName}</span>
                  </span>
                  <span className="text-amber-600 font-semibold">+{rankInfo.bvToNext} BV</span>
                </div>
                <div className="h-2.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${rankInfo.progress}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{rankInfo.progress}% {t.rankProgress || 'completado'}</p>
              </div>
            )}
            {!rankInfo.nextName && (
              <p className="mt-2 text-sm font-semibold text-amber-600">🏆 {t.rankTop || '¡Rango máximo alcanzado!'}</p>
            )}
          </div>
        )}
      </div>

      {/* Full rank table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 bg-secondary/30 border-b border-border flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <h3 className="font-semibold text-foreground">{t.rankTableTitle || 'Tabla de Rangos'}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left font-medium">#</th>
                <th className="px-5 py-3 text-left font-medium">{t.rankColName || 'Rango'}</th>
                <th className="px-5 py-3 text-right font-medium">{t.rankColMin || 'BV mínimo'}</th>
                <th className="px-5 py-3 text-right font-medium">{t.rankColMax || 'BV máximo'}</th>
                <th className="px-5 py-3 text-left font-medium">{t.rankColStatus || 'Estado'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {RANK_TABLE.map((rank, idx) => {
                const name = lang === 'en' ? rank.nameEn : rank.nameEs;
                const isActive = numBV >= rank.bvMin && (rank.bvMax === Infinity ? true : numBV <= rank.bvMax);
                const isPassed = numBV > rank.bvMax;
                return (
                  <tr key={rank.id} className={`transition-colors ${isActive ? 'bg-amber-500/10' : 'hover:bg-muted/30'}`}>
                    <td className="px-5 py-3 text-muted-foreground font-medium">{idx + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {isActive && <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />}
                        <span className={`font-semibold ${isActive ? 'text-amber-700' : 'text-foreground'}`}>{name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-primary">{rank.bvMin}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground">
                      {rank.bvMax === Infinity ? '∞' : rank.bvMax}
                    </td>
                    <td className="px-5 py-3">
                      {isActive ? (
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700">
                          ← {t.rankCurrent || 'Actual'}
                        </span>
                      ) : isPassed ? (
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600">
                          ✓ {t.rankPassed || 'Superado'}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
