import React, { createContext, useContext, useState, useEffect } from 'react';

const QuoteContext = createContext(null);

export function QuoteProvider({ children }) {
  const [quotes, setQuotes] = useState(() => {
    try {
      const saved = localStorage.getItem('hgw-quotes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('hgw-quotes', JSON.stringify(quotes));
  }, [quotes]);

  const saveQuote = (quote) => {
    const newQuote = {
      id: Date.now(),
      date: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      ...quote,
    };
    setQuotes(prev => [newQuote, ...prev].slice(0, 20)); // keep last 20
    return newQuote;
  };

  const deleteQuote = (id) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
  };

  const clearQuotes = () => setQuotes([]);

  return (
    <QuoteContext.Provider value={{ quotes, saveQuote, deleteQuote, clearQuotes }}>
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuotes() {
  return useContext(QuoteContext);
}
