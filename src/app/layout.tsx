import '../styles/globals.css';
import { locales } from '@/i18n/config';
import type { ReactNode } from 'react';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
