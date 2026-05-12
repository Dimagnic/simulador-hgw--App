import React, { createContext, useContext, useState, useEffect } from 'react';

// ─── Translations ────────────────────────────────────────────────────────────
export const translations = {
  es: {
    appTitle: 'Simulador de Productos',
    appSubtitle: 'Lista de Precios México — Febrero 2026',
    roleDistribuidor: 'Distribuidor',
    roleMaster: 'Master',
    tabRandom: 'Aleatoria',
    tabBV: 'Por Meta BV',
    tabManual: 'Manual',

    // RandomTab
    randomLabel: 'Cantidad de productos a generar:',
    randomButton: 'Generar selección',
    randomResults: 'Resultados',
    colCode: 'Código',
    colProduct: 'Producto',
    colCategory: 'Categoría',
    colPrice: 'Precio',
    colBV: 'BV',
    noPrice: 'Sin precio',
    totals: 'TOTALES:',
    print: 'Imprimir',

    // BVGoalTab
    bvLabel: 'Meta de Puntos (BV)',
    bvPlaceholder: 'Ej. 150',
    bvCalculate: 'Calcular Opciones',
    bvHint: 'El algoritmo generará hasta 10 combinaciones diversas que se acerquen a la meta sin excederla.',
    bvGenerated: 'Opciones Generadas',
    bvFound: 'combinaciones. Selecciona tu favorita.',
    bvFound1: 'Se encontraron',
    bvExact: 'Meta Exacta',
    bvTotal: 'BV Total:',
    bvPrice: 'Precio Total:',
    bvMissing: 'Faltan',
    bvMissingBV: 'BV',
    bvPrintSel: 'Imprimir Selección',
    bvSelect: 'Seleccionar esta opción',
    bvSelected: 'Seleccionada',
    bvEmpty: 'No se pudo encontrar ninguna combinación válida para esa meta. Intenta con un valor mayor.',
    colQty: 'Cant.',
    colUnitPrice: 'Precio Unit.',
    colSubBV: 'Subtotal BV',
    option: 'Opción',

    // ManualTab
    manualCatalog: 'Catálogo de Productos',
    manualSummary: 'Resumen de Selección',
    manualClear: 'Limpiar',
    manualNone: 'Ningún producto seleccionado todavía.',
    manualNoneHint: 'Selecciona productos del catálogo de la izquierda.',
    manualAll: 'Todos',
    manualTotal: 'Total:',
    manualPrint: 'Imprimir Selección',
    manualItems: 'productos',

    // Dark mode / language
    darkMode: 'Modo oscuro',
    language: 'Idioma',

    // Tutorial
    tutorialTitle: '¿Cómo usar el Simulador?',
    tutorialSkip: 'Saltar tutorial',
    tutorialClose: 'Cerrar',
    tutorialNext: 'Siguiente →',
    tutorialPrev: '← Anterior',
    tutorialFinish: '¡Entendido!',
    tutorialStep1Title: 'Bienvenido al Simulador HGW 👋',
    tutorialStep1Desc: 'Esta app te ayuda a armar combinaciones de productos para tus clientes, calcular precios y BV de forma rápida.',
    tutorialStep2Title: 'Selecciona tu Rol',
    tutorialStep2Desc: 'Elige entre Distribuidor o Master para ver los precios que te corresponden en cada combinación.',
    tutorialStep3Title: 'Tab Aleatoria 🎲',
    tutorialStep3Desc: 'Genera una selección aleatoria de productos. Ideal para inspirarte o mostrar variedad al prospecto.',
    tutorialStep4Title: 'Tab Por Meta BV 🎯',
    tutorialStep4Desc: 'Ingresa cuántos BV necesitas y el algoritmo te propone hasta 10 combinaciones que lleguen a esa meta.',
    tutorialStep5Title: 'Tab Manual ✅',
    tutorialStep5Desc: 'Selecciona tú mismo los productos del catálogo. Puedes filtrar por categoría y ver el total acumulado en tiempo real.',
    tutorialStep6Title: '¡Listo para vender! 🚀',
    tutorialStep6Desc: 'Usa el botón Imprimir en cualquier tab para generar una hoja lista para compartir con tu prospecto.',

    // New tabs
    tabProfit: '💰 Ganancia',
    tabPackages: '📦 Paquetes',
    tabRank: '🏆 Rango',

    // ProfitCalculatorTab
    profitBestProfit: 'Mejor ganancia',
    profitAvgMargin: 'Margen promedio',
    profitProducts: 'Con precio',
    profitSearch: 'Buscar producto…',
    profitSortProfitDesc: 'Mayor ganancia primero',
    profitSortProfitAsc: 'Menor ganancia primero',
    profitSortMargin: 'Mayor margen %',
    profitSortBV: 'Mejor BV/peso',
    profitColCost: 'Precio dist.',
    profitColPub: 'Precio público',
    profitColGain: 'Ganancia',
    profitColMargin: 'Margen %',
    profitColBVeff: 'BV/peso',
    profitEmpty: 'No hay productos que coincidan con los filtros.',

    // PackagesTab
    pkgIntro: 'Paquetes precargados por la empresa. Úsalos como propuesta rápida para tus prospectos o como base para armar pedidos estratégicos.',

    // ManualTab / Rank
    rankLabel: 'Rango alcanzado',
    rankNext: 'Siguiente',

    // RankGoalTab
    rankSimLabel: 'Simula tu BV acumulado',
    rankSimPlaceholder: 'Ej. 350',
    rankRange: 'Rango',
    rankProgress: 'completado',
    rankTop: '¡Rango máximo alcanzado!',
    rankTableTitle: 'Tabla de Rangos',
    rankColName: 'Rango',
    rankColMin: 'BV mínimo',
    rankColMax: 'BV máximo',
    rankColStatus: 'Estado',
    rankCurrent: 'Actual',
    rankPassed: 'Superado',
  },

  en: {
    appTitle: 'Product Simulator',
    appSubtitle: 'Mexico Price List — February 2026',
    roleDistribuidor: 'Distributor',
    roleMaster: 'Master',
    tabRandom: 'Random',
    tabBV: 'BV Goal',
    tabManual: 'Manual',

    randomLabel: 'Number of products to generate:',
    randomButton: 'Generate selection',
    randomResults: 'Results',
    colCode: 'Code',
    colProduct: 'Product',
    colCategory: 'Category',
    colPrice: 'Price',
    colBV: 'BV',
    noPrice: 'No price',
    totals: 'TOTALS:',
    print: 'Print',

    bvLabel: 'Points Goal (BV)',
    bvPlaceholder: 'e.g. 150',
    bvCalculate: 'Calculate Options',
    bvHint: 'The algorithm will generate up to 10 diverse combinations that reach the goal without exceeding it.',
    bvGenerated: 'Generated Options',
    bvFound: 'combinations. Pick your favorite.',
    bvFound1: 'Found',
    bvExact: 'Exact Goal',
    bvTotal: 'Total BV:',
    bvPrice: 'Total Price:',
    bvMissing: 'Missing',
    bvMissingBV: 'BV',
    bvPrintSel: 'Print Selection',
    bvSelect: 'Select this option',
    bvSelected: 'Selected',
    bvEmpty: 'No valid combination found for that goal. Try a higher value.',
    colQty: 'Qty.',
    colUnitPrice: 'Unit Price',
    colSubBV: 'BV Subtotal',
    option: 'Option',

    manualCatalog: 'Product Catalog',
    manualSummary: 'Selection Summary',
    manualClear: 'Clear',
    manualNone: 'No products selected yet.',
    manualNoneHint: 'Select products from the catalog on the left.',
    manualAll: 'All',
    manualTotal: 'Total:',
    manualPrint: 'Print Selection',
    manualItems: 'products',

    darkMode: 'Dark mode',
    language: 'Language',

    tutorialTitle: 'How to use the Simulator?',
    tutorialSkip: 'Skip tutorial',
    tutorialClose: 'Close',
    tutorialNext: 'Next →',
    tutorialPrev: '← Back',
    tutorialFinish: 'Got it!',
    tutorialStep1Title: 'Welcome to HGW Simulator 👋',
    tutorialStep1Desc: 'This app helps you build product combinations for your clients, calculate prices and BV quickly.',
    tutorialStep2Title: 'Select your Role',
    tutorialStep2Desc: 'Choose between Distributor or Master to see the prices that apply to you in each combination.',
    tutorialStep3Title: 'Random Tab 🎲',
    tutorialStep3Desc: 'Generate a random product selection. Great for inspiration or showing variety to prospects.',
    tutorialStep4Title: 'BV Goal Tab 🎯',
    tutorialStep4Desc: 'Enter how many BV you need and the algorithm proposes up to 10 combinations that reach that goal.',
    tutorialStep5Title: 'Manual Tab ✅',
    tutorialStep5Desc: 'Manually select products from the catalog. Filter by category and see the running total in real time.',
    tutorialStep6Title: 'Ready to sell! 🚀',
    tutorialStep6Desc: 'Use the Print button in any tab to generate a sheet ready to share with your prospect.',

    // New tabs
    tabProfit: '💰 Profit',
    tabPackages: '📦 Packages',
    tabRank: '🏆 Rank',

    // ProfitCalculatorTab
    profitBestProfit: 'Best profit',
    profitAvgMargin: 'Avg. margin',
    profitProducts: 'With price',
    profitSearch: 'Search product…',
    profitSortProfitDesc: 'Highest profit first',
    profitSortProfitAsc: 'Lowest profit first',
    profitSortMargin: 'Highest margin %',
    profitSortBV: 'Best BV/currency',
    profitColCost: 'Dist. price',
    profitColPub: 'Public price',
    profitColGain: 'Profit',
    profitColMargin: 'Margin %',
    profitColBVeff: 'BV/unit',
    profitEmpty: 'No products match the filters.',

    // PackagesTab
    pkgIntro: 'Company-curated packages. Use them as quick proposals for prospects or as a base for strategic orders.',

    // ManualTab / Rank
    rankLabel: 'Rank achieved',
    rankNext: 'Next',

    // RankGoalTab
    rankSimLabel: 'Simulate your accumulated BV',
    rankSimPlaceholder: 'e.g. 350',
    rankRange: 'Range',
    rankProgress: 'completed',
    rankTop: 'Maximum rank reached!',
    rankTableTitle: 'Rank Table',
    rankColName: 'Rank',
    rankColMin: 'Min BV',
    rankColMax: 'Max BV',
    rankColStatus: 'Status',
    rankCurrent: 'Current',
    rankPassed: 'Passed',
  },
};

// ─── Context ─────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Dark mode
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('hgw-dark');
    return saved ? saved === 'true' : false;
  });

  // Language
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('hgw-lang') || 'es';
  });

  // Tutorial shown
  const [showTutorial, setShowTutorial] = useState(() => {
    return localStorage.getItem('hgw-tutorial-done') !== 'true';
  });

  // Apply dark class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('hgw-dark', dark);
  }, [dark]);

  // Persist language
  useEffect(() => {
    localStorage.setItem('hgw-lang', lang);
  }, [lang]);

  const t = translations[lang] || translations.es;

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('hgw-tutorial-done', 'true');
  };

  const reopenTutorial = () => setShowTutorial(true);

  return (
    <AppContext.Provider value={{ dark, setDark, lang, setLang, t, showTutorial, closeTutorial, reopenTutorial }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
