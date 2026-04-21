import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

// Cache for exchange rates to avoid redundant API calls
let cachedRates: Record<string, number> | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 3600000; // 1 hour

export const useCurrency = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const [rates, setRates] = useState<Record<string, number>>(cachedRates || { USD: 1, VND: 25450 });

  useEffect(() => {
    const fetchRates = async () => {
      const now = Date.now();
      if (cachedRates && (now - lastFetchTime < CACHE_DURATION)) {
        return;
      }

      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        
        if (data && data.rates) {
          const newRates = {
            USD: 1,
            VND: data.rates.VND || 25450,
          };
          cachedRates = newRates;
          lastFetchTime = now;
          setRates(newRates);
        }
      } catch (error) {
        console.error('Failed to fetch exchange rates, using fallback:', error);
      }
    };

    fetchRates();
  }, []);

  const convertAmount = (amount: number, from: string, to: string, customRate?: number) => {
    // If customRate is provided in metadata, use it for the source (from) conversion if it's VND 
    // or use the live rates
    const fromRate = rates[from as keyof typeof rates] || 1;
    const toRate = rates[to as keyof typeof rates] || 1;
    
    // Convert to Base (USD) first, then to Target
    return (amount / fromRate) * toRate;
  };

  const formatCurrency = (amount: number, sourceCurrency: string = 'USD', customRate?: number) => {
    const targetCurrency = currentLang.startsWith('en') ? 'USD' : 'VND';
    const targetLocale = currentLang.startsWith('en') ? 'en-US' : 'vi-VN';
    
    const targetAmount = convertAmount(amount, sourceCurrency, targetCurrency, customRate);

    return new Intl.NumberFormat(targetLocale, {
      style: 'currency',
      currency: targetCurrency,
      maximumFractionDigits: targetCurrency === 'VND' ? 0 : 2,
    }).format(targetAmount);
  };

  return { formatCurrency, currentLang, convertAmount, rates };
};
