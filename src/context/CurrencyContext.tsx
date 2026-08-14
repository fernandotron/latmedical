import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Currency = 'USD' | 'ARS';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  exchangeRate: number; // 1 USD in ARS
  setExchangeRate: (rate: number) => void;
  formatPrice: (usdAmount: number) => string;
  formatPriceDual: (usdAmount: number) => { usd: string; ars: string; active: string };
  convertPrice: (usdAmount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const DEFAULT_EXCHANGE_RATE = 1380; // 1 USD = $1380 ARS (Actualizado 2026)

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('latmedical_currency');
    return (saved === 'ARS' || saved === 'USD') ? saved : 'USD';
  });

  const [exchangeRate, setExchangeRateState] = useState<number>(() => {
    const savedRate = localStorage.getItem('latmedical_exchange_rate');
    return savedRate ? parseFloat(savedRate) : DEFAULT_EXCHANGE_RATE;
  });

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('latmedical_currency', c);
  };

  const setExchangeRate = (rate: number) => {
    setExchangeRateState(rate);
    localStorage.setItem('latmedical_exchange_rate', rate.toString());
  };

  const convertPrice = (usdAmount: number): number => {
    if (currency === 'ARS') {
      return Math.round(usdAmount * exchangeRate);
    }
    return usdAmount;
  };

  const formatPrice = (usdAmount: number): string => {
    if (currency === 'ARS') {
      const ars = Math.round(usdAmount * exchangeRate);
      return `$ ${ars.toLocaleString('es-AR')} ARS`;
    }
    return `USD $${usdAmount.toFixed(2)}`;
  };

  const formatPriceDual = (usdAmount: number) => {
    const usd = `USD $${usdAmount.toFixed(2)}`;
    const ars = `$ ${Math.round(usdAmount * exchangeRate).toLocaleString('es-AR')} ARS`;
    const active = currency === 'ARS' ? ars : usd;
    return { usd, ars, active };
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      exchangeRate,
      setExchangeRate,
      formatPrice,
      formatPriceDual,
      convertPrice
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
