'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { locales, defaultLocale, type Locale } from './config';

const LOCALE_STORAGE_KEY = 'mcsr-locale';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize locale from localStorage or browser language
  useEffect(() => {
    const initializeLocale = () => {
      // Try to get from localStorage first
      const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);

      if (storedLocale && locales.includes(storedLocale as Locale)) {
        return storedLocale as Locale;
      }

      // Fallback to browser language
      const browserLang = navigator.language;

      // Check for exact match
      if (locales.includes(browserLang as Locale)) {
        return browserLang as Locale;
      }

      // Check for partial match (e.g., 'pt' -> 'pt-BR')
      const partialMatch = locales.find(loc =>
        loc.startsWith(browserLang.split('-')[0])
      );

      if (partialMatch) {
        return partialMatch;
      }

      // Fallback to default
      return defaultLocale;
    };

    const initialLocale = initializeLocale();
    setLocaleState(initialLocale);
  }, []);

  // Load messages when locale changes
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const msgs = await import(`../../messages/${locale}.json`);
        setMessages(msgs.default);
      } catch (error) {
        console.error(`Failed to load messages for locale ${locale}:`, error);
        // Fallback to default locale messages
        const fallbackMsgs = await import(`../../messages/${defaultLocale}.json`);
        setMessages(fallbackMsgs.default);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    if (locales.includes(newLocale)) {
      setLocaleState(newLocale);
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    }
  };

  if (isLoading || !messages) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
