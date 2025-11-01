import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, defaultLocale, type Locale } from './config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  // Use defaultLocale if locale is not set (initial request before middleware)
  const requestLocale = locale || defaultLocale;

  if (!locales.includes(requestLocale as Locale)) {
    notFound();
  }

  return {
    locale: requestLocale as string,
    messages: (await import(`../../messages/${requestLocale}.json`)).default,
  };
});
