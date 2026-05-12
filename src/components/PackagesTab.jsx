import React, { useState } from 'react';
import { PRODUCTS } from '@/data/products';
import { printSelection } from '@/utils/print';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Printer, Package, Star, Zap, Heart, Leaf } from 'lucide-react';

// ─── Preset Packages ─────────────────────────────────────────────────────────
const PACKAGES = [
  {
    id: 'kit-inicio',
    nameEs: 'Kit de Inicio Básico',
    nameEn: 'Basic Starter Kit',
    descEs: 'Ideal para nuevos distribuidores. Combina suplementos esenciales con cuidado personal.',
    descEn: 'Ideal for new distributors. Combines essential supplements with personal care.',
    icon: 'Zap',
    color: 'blue',
    productIds: ['SP01','SP04','CP01','AB01','SC01'],
  },
  {
    id: 'kit-bienestar',
    nameEs: 'Paquete Bienestar Completo',
    nameEn: 'Complete Wellness Package',
    descEs: 'Los productos más populares de salud y bienestar en un solo paquete.',
    descEn: 'The most popular health and wellness products in one package.',
    icon: 'Heart',
    color: 'rose',
    productIds: ['SP06','SP07','SP03','AB09','AB04'],
  },
  {
    id: 'kit-belleza',
    nameEs: 'Kit Skincare & Belleza',
    nameEn: 'Skincare & Beauty Kit',
    descEs: 'Rutina facial completa para proponer a clientes enfocados en cuidado de la piel.',
    descEn: 'Complete facial routine to propose to skin-focused clients.',
    icon: 'Star',
    color: 'pink',
    productIds: ['SK01','SK02','SK03','SK04','SK05'],
  },
  {
    id: 'kit-accesorios',
    nameEs: 'Paquete Turmalina & Magnético',
    nameEn: 'Tourmaline & Magnetic Pack',
    descEs: 'Accesorios terapéuticos de alta gananciay alta demanda.',
    descEn: 'High-margin, high-demand therapeutic accessories.',
    icon: 'Package',
    color: 'purple',
    productIds: ['AC01','AC06','AC08','AC09','AC04'],
  },
  {
    id: 'kit-nutricion',
    nameEs: 'Kit Nutrición & Energía',
    nameEn: 'Nutrition & Energy Kit',
    descEs: 'Batidos, proteínas y bebidas energéticas para clientes activos.',
    descEn: 'Shakes, proteins and energizing drinks for active clients.',
    icon: 'Leaf',
    color: 'emerald',
    productIds: ['AB04','AB10','AB11','AB15','SP09'],
  },
  {
    id: 'kit-premium',
    nameEs: 'Kit Premium Alto BV',
    nameEn: 'Premium High BV Kit',
    descEs: 'Combinación estratégica para maximizar BV con productos de alta rotación.',
    descEn: 'Strategic combination to maximize BV with high-turnover products.',
    icon: 'Star',
    color: 'amber',
    productIds: ['SP06','SP07','SK03','AC06','AB15'],
  },
];

const ICON_MAP = { Zap, Heart, Star, Package, Leaf };
const COLOR_MAP = {
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    icon: 'text-blue-500',    badge: 'bg-blue-500/10 text-blue-600' },
  rose:    { bg: 'bg-rose-500/10',    border: 'border-rose-500/30',    icon: 'text-rose-500',    badge: 'bg-rose-500/10 text-rose-600' },
  pink:    { bg: 'bg-pink-500/10',    border: 'border-pink-500/30',    icon: 'text-pink-500',    badge: 'bg-pink-500/10 text-pink-600' },
  purple:  { bg: 'bg-purple-500/10',  border: 'border-purple-500/30',  icon: 'text-purple-500',  badge: 'bg-purple-500/10 text-purple-600' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: 'text-emerald-500', badge: 'bg-emerald-500/10 text-emerald-600' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   icon: 'text-amber-500',   badge: 'bg-amber-500/10 text-amber-600' },
};

export default function PackagesTab({ role }) {
  const { t, lang } = useApp();
  const [expanded, setExpanded] = useState(null);

  const getPackageProducts = (pkg) =>
    pkg.productIds.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Intro */}
      <div className="bg-secondary/50 p-5 rounded-2xl border border-border">
        <p className="text-sm text-muted-foreground">
          {t.pkgIntro || 'Paquetes precargados por la empresa. Úsalos como propuesta rápida para tus prospectos o como base para armar pedidos estratégicos.'}
        </p>
      </div>

      {/* Package cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PACKAGES.map(pkg => {
          const name = lang === 'en' ? pkg.nameEn : pkg.nameEs;
          const desc = lang === 'en' ? pkg.descEn : pkg.descEs;
          const products = getPackageProducts(pkg);
          const cost = products.reduce((s, p) => s + (role === 'Master' ? (p.master || 0) : (p.dist || 0)), 0);
          const pubTotal = products.reduce((s, p) => s + (p.pub || 0), 0);
          const profit = pubTotal - cost;
          const totalBV = products.reduce((s, p) => s + (p.bv || 0), 0);
          const isExpanded = expanded === pkg.id;
          const c = COLOR_MAP[pkg.color];
          const IconComp = ICON_MAP[pkg.icon] || Package;

          return (
            <div key={pkg.id} className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 ${c.border} bg-card`}>
              {/* Card header */}
              <div className={`p-5 ${c.bg}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl bg-card/50 ${c.icon}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground leading-tight">{name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-card/70 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground">{t.profitColCost || 'Tu costo'}</p>
                    <p className="font-bold text-foreground">${cost}</p>
                  </div>
                  <div className="bg-emerald-500/10 rounded-xl p-3 text-center border border-emerald-500/20">
                    <p className="text-xs text-muted-foreground">{t.profitColGain || 'Ganancia'}</p>
                    <p className="font-bold text-emerald-600">${profit}</p>
                  </div>
                  <div className={`${c.bg} rounded-xl p-3 text-center border ${c.border}`}>
                    <p className="text-xs text-muted-foreground">{t.colBV} {t.manualTotal || 'Total'}</p>
                    <p className={`font-bold ${c.icon}`}>{totalBV}</p>
                  </div>
                </div>
              </div>

              {/* Products list (expandable) */}
              <div className="px-5 pb-5">
                <button
                  onClick={() => setExpanded(isExpanded ? null : pkg.id)}
                  className="w-full text-left py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center justify-between"
                >
                  <span>{products.length} {t.manualItems || 'productos'}</span>
                  <span className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
                </button>

                {isExpanded && (
                  <div className="space-y-2 mt-1">
                    {products.map(p => {
                      const price = role === 'Master' ? p.master : p.dist;
                      const gain = p.pub - price;
                      return (
                        <div key={p.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-foreground">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.id} • {p.description}</p>
                          </div>
                          <div className="text-right ml-4 shrink-0">
                            <p className="text-sm font-semibold">${price}</p>
                            <p className="text-xs text-emerald-600 font-medium">+${gain}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <Button
                  className="w-full mt-3"
                  size="sm"
                  onClick={() => printSelection(products, role, cost, totalBV)}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  {t.print || 'Imprimir'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
