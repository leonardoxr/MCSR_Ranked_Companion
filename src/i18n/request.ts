import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, defaultLocale, type Locale } from './config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  // locale is provided by the middleware, but fallback to defaultLocale for safety
  const resolvedLocale = (locale || defaultLocale) as Locale;

  if (!locales.includes(resolvedLocale)) {
    notFound();
  }

  // Dynamic import with error handling
  let messages;
  try {
    messages = (await import(`../../messages/${resolvedLocale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale ${resolvedLocale}:`, error);
    // Fallback to default locale messages if loading fails
    messages = (await import(`../../messages/${defaultLocale}.json`)).default;
  }

  return {
    locale: resolvedLocale,
    messages,
  };
});
