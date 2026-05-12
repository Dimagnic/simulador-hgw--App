import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RandomTab from '@/components/RandomTab';
import BVGoalTab from '@/components/BVGoalTab';
import ManualTab from '@/components/ManualTab';
import ProfitCalculatorTab from '@/components/ProfitCalculatorTab';
import PackagesTab from '@/components/PackagesTab';
import RankGoalTab from '@/components/RankGoalTab';
import Tutorial from '@/components/Tutorial';
import QuoteHistoryPanel from '@/components/QuoteHistoryPanel';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { QuoteProvider } from '@/contexts/QuoteContext';
import { Moon, Sun, Globe, HelpCircle, Clock } from 'lucide-react';

function AppContent() {
  const [role, setRole] = useState('Distribuidor');
  const { dark, setDark, lang, setLang, t, showTutorial, reopenTutorial } = useApp();
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20">
      {showTutorial && <Tutorial />}
      {showHistory && <QuoteHistoryPanel onClose={() => setShowHistory(false)} />}

      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md">
                <span className="text-primary-foreground font-bold text-xl tracking-wider">HGW</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground leading-tight">{t.appTitle}</h1>
                <p className="text-sm text-muted-foreground">{t.appSubtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
              <div className="flex items-center gap-1 bg-secondary p-1 rounded-lg border border-border">
                <Globe className="w-4 h-4 text-muted-foreground ml-1" />
                <button onClick={() => setLang('es')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${lang === 'es' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>ES</button>
                <button onClick={() => setLang('en')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${lang === 'en' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>EN</button>
              </div>

              <button onClick={() => setDark(!dark)} title={t.darkMode} className="p-2 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground transition-all">
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <button onClick={reopenTutorial} title={t.tutorialTitle} className="p-2 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground transition-all">
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* 📋 Historial de cotizaciones */}
              <button
                onClick={() => setShowHistory(true)}
                title="Historial de cotizaciones"
                className="p-2 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground transition-all"
              >
                <Clock className="w-4 h-4" />
              </button>

              <div className="flex bg-secondary p-1 rounded-lg border border-border">
                <button onClick={() => setRole('Distribuidor')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${role === 'Distribuidor' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>{t.roleDistribuidor}</button>
                <button onClick={() => setRole('Master')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${role === 'Master' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>{t.roleMaster}</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <Tabs defaultValue="random" className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-8 bg-secondary/50 p-1 rounded-xl">
            <TabsTrigger value="random" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm text-xs sm:text-sm">{t.tabRandom}</TabsTrigger>
            <TabsTrigger value="bv" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm text-xs sm:text-sm">{t.tabBV}</TabsTrigger>
            <TabsTrigger value="manual" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm text-xs sm:text-sm">{t.tabManual}</TabsTrigger>
            <TabsTrigger value="profit" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm text-xs sm:text-sm">{t.tabProfit || '💰 Ganancia'}</TabsTrigger>
            <TabsTrigger value="packages" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm text-xs sm:text-sm">{t.tabPackages || '📦 Paquetes'}</TabsTrigger>
            <TabsTrigger value="rank" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm text-xs sm:text-sm">{t.tabRank || '🏆 Rango'}</TabsTrigger>
          </TabsList>
          <TabsContent value="random" className="mt-0 focus-visible:outline-none focus-visible:ring-0"><RandomTab role={role} /></TabsContent>
          <TabsContent value="bv" className="mt-0 focus-visible:outline-none focus-visible:ring-0"><BVGoalTab role={role} /></TabsContent>
          <TabsContent value="manual" className="mt-0 focus-visible:outline-none focus-visible:ring-0"><ManualTab role={role} /></TabsContent>
          <TabsContent value="profit" className="mt-0 focus-visible:outline-none focus-visible:ring-0"><ProfitCalculatorTab role={role} /></TabsContent>
          <TabsContent value="packages" className="mt-0 focus-visible:outline-none focus-visible:ring-0"><PackagesTab role={role} /></TabsContent>
          <TabsContent value="rank" className="mt-0 focus-visible:outline-none focus-visible:ring-0"><RankGoalTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <QuoteProvider>
        <AppContent />
      </QuoteProvider>
    </AppProvider>
  );
}
