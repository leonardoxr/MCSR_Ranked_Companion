'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params.locale as Locale) || 'en';
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    startTransition(() => {
      // Replace the locale in the pathname
      // Handle root path and paths with locale prefix
      let newPathname: string;
      if (pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`) {
        newPathname = `/${newLocale}`;
      } else {
        newPathname = pathname.replace(`/${currentLocale}/`, `/${newLocale}/`).replace(`/${currentLocale}`, `/${newLocale}`);
      }
      router.push(newPathname);
      setIsOpen(false);
    });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          className="gap-2 bg-background/80 backdrop-blur-sm"
        >
          <span className="text-lg">{localeFlags[currentLocale]}</span>
          <span className="hidden sm:inline">{localeNames[currentLocale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => switchLocale(locale)}
            className={`gap-3 cursor-pointer ${
              locale === currentLocale ? 'bg-accent' : ''
            }`}
          >
            <span className="text-lg">{localeFlags[locale]}</span>
            <span>{localeNames[locale]}</span>
            {locale === currentLocale && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
