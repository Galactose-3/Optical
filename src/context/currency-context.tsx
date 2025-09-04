
'use client';

import * as React from 'react';
import { MOCK_RATES, currencies } from '@/lib/data';

function getExchangeRate(from: string, to: string): number {
    const fromRate = MOCK_RATES[from];
    const toRate = MOCK_RATES[to];

    if (fromRate && toRate) {
        // Convert 'from' currency to USD, then USD to 'to' currency
        return (1 / fromRate) * toRate;
    }
    
    // Fallback for direct conversion if available (legacy support)
    if (from === 'USD' && MOCK_RATES.USD[to]) {
      return MOCK_RATES.USD[to];
    }
    if (to === 'USD' && MOCK_RATES.INR[from]) {
       return MOCK_RATES.INR[from];
    }

    // Default to 1 if no rate is found to avoid breaking calculations
    console.warn(`Unable to find exchange rate from ${from} to ${to}`);
    return 1;
}

type CurrencyContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
  formatCurrency: (value: number, showPlus?: boolean) => string;
  registerValue: (id: string, value: number, isDynamic?: boolean) => void;
  convertedValues: Record<string, number>;
  conversionRate: number;
};

const CurrencyContext = React.createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = React.useState<string>('USD');
  const [conversionRate, setConversionRate] = React.useState(1);
  const [originalValues, setOriginalValues] = React.useState<Record<string, number>>({});
  const [convertedValues, setConvertedValues] = React.useState<Record<string, number>>({});
  const [dynamicValues, setDynamicValues] = React.useState<Record<string, number>>({});
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    try {
        const storedCurrency = localStorage.getItem('app-currency') as string;
        if (storedCurrency && currencies.some(c => c.code === storedCurrency)) {
            setCurrencyState(storedCurrency);
        }
    } catch (error) {
        console.warn('Could not read currency from localStorage', error);
    }
  }, []);

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
     try {
        localStorage.setItem('app-currency', newCurrency);
    } catch (error) {
        console.warn('Could not save currency to localStorage', error);
    }
  };

  React.useEffect(() => {
    if (!isMounted) return;
    const rate = getExchangeRate('USD', currency);
    setConversionRate(rate);
  }, [isMounted, currency]);

  React.useEffect(() => {
    if(!isMounted || conversionRate === 1 && currency === 'USD') return;

    const rate = conversionRate;
    const newConvertedValues: Record<string, number> = {};
    const baseCurrency = 'USD';

    for (const key in originalValues) {
        newConvertedValues[key] = originalValues[key] * rate;
    }
     for (const key in dynamicValues) {
        // Dynamic values are assumed to be entered in the current currency
        // We need to convert them to the base currency (USD) first for consistent storage,
        // then convert to the new target currency.
        const valueInBase = dynamicValues[key] / getExchangeRate(baseCurrency, currency); // This might need adjustment based on how dynamic values are handled
        newConvertedValues[key] = valueInBase * rate;
    }
    
    setConvertedValues(newConvertedValues);
  }, [currency, conversionRate, originalValues, isMounted, dynamicValues]);
  
  const formatCurrency = (value: number | undefined, showPlus = false) => {
    if (value === undefined || isNaN(value)) {
      value = 0;
    }

    const displayCurrency = isMounted ? currency : 'USD';
    
    const locale = currencies.find(c => c.code === displayCurrency)?.locale || 'en-US';

    const options = {
      style: 'currency',
      currency: displayCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
    const formattedValue = new Intl.NumberFormat(locale, options).format(value);
    
    if (showPlus && value > 0) {
      return `+${formattedValue}`;
    }
    return formattedValue;
  };

  const registerValue = React.useCallback((id: string, value: number, isDynamic = false) => {
      if(isDynamic) {
        setDynamicValues(prev => ({...prev, [id]: value}));
      } else {
        setOriginalValues(prev => {
          if (prev[id] === value) return prev;
          return { ...prev, [id]: value };
        });
      }
  }, []);
  
  const value = {
    currency,
    setCurrency,
    formatCurrency,
    convertedValues,
    registerValue,
    conversionRate,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = React.useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
