"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import * as React from 'react';
import LanguageSwitcher from "@/components/features/LanguageSwitcher";
import { PlayerNameInput } from "@/components/features/PlayerNameInput";
import { useQueryClient } from '@tanstack/react-query';
import { getLeaderboard } from '@/lib/api/endpoints';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { LogOut, User, Menu, X, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

const NavLink = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active
          ? "bg-white/10 text-white"
          : "text-white/80 hover:text-white hover:bg-white/10"
      )}
    >
      {label}
    </Link>
  );
};

const MobileNavLink = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
  return (
    <Link
      href={href}
      className={cn(
        "block px-4 py-3 rounded-md font-monocraft text-base transition-colors",
        active
          ? "bg-white/10 text-white"
          : "text-white/80 hover:text-white hover:bg-white/10"
      )}
    >
      {label}
    </Link>
  );
};

const LiveNavLink = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
  return (
    <Link
      href={href}
      className={cn(
        "relative px-3 py-2 rounded-md text-sm font-medium transition-colors group",
        active
          ? "bg-red-500/20 text-red-400"
          : "text-white/80 hover:text-white hover:bg-white/10"
      )}
    >
      <span className="relative z-10 flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        {label}
      </span>
      <span className={cn(
        "absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        "bg-gradient-to-r from-red-500/10 via-red-400/5 to-red-500/10",
        "animate-pulse"
      )} />
    </Link>
  );
};

const MobileLiveNavLink = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
  return (
    <Link
      href={href}
      className={cn(
        "block px-4 py-3 rounded-md font-monocraft text-base transition-colors relative group",
        active
          ? "bg-red-500/20 text-red-400"
          : "text-white/80 hover:text-white hover:bg-white/10"
      )}
    >
      <span className="relative z-10 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
        {label}
      </span>
    </Link>
  );
};

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const { username, isAuthenticated, logout } = useAuthStore();
  const t = useTranslations();

  // Background prefetch first 3 pages to enrich local search cache (no-ops if cached)
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        for (let page = 1; page <= 3; page++) {
          const key = ['leaderboard', 'list', { page, count: 100 }];
          const cached = queryClient.getQueryData(key as any);
          if (!cached && !cancelled) {
            const data = await getLeaderboard({ page, count: 100 });
            if (!cancelled) queryClient.setQueryData(key as any, data);
          }
        }
      } catch { }
    })();
    return () => { cancelled = true; };
  }, [queryClient]);
  const handleSearch = (value: string) => {
    const q = value.trim();
    if (!q) return;
    setMobileMenuOpen(false);
    router.push(`/player/${encodeURIComponent(q)}`);
  };

  // Close mobile menu when route changes
  const pathname = usePathname();
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);
  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-obsidian/80 backdrop-blur-md supports-[backdrop-filter]:bg-obsidian/60">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex h-16 items-center gap-2 sm:gap-3">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white/80 hover:text-white p-2 min-w-[44px] min-h-[44px]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:scale-110 duration-300">
                <img
                  src="/logo.png"
                  alt="MCSR Ranked"
                  className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]"
                />
              </div>
              <span className="font-monocraft text-sm sm:text-lg text-white group-hover:text-minecraft-diamond transition-colors drop-shadow-md">
                MCSR Ranked
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="ml-6 hidden md:flex items-center gap-1">
              <NavLink href="/" label={t('nav.leaderboard')} />
              <NavLink href="/elo-timeline" label={t('nav.eloTimeline')} />
              <NavLink href="/compare" label={t('nav.playerComparison')} />
              {isAuthenticated && <NavLink href="/my-stats" label="My Stats" />}
              <LiveNavLink href="/live" label={t('nav.whosLive')} />
            </nav>

            {/* Desktop Search & Actions */}
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden sm:flex items-center w-64 transition-all focus-within:w-72">
                <PlayerNameInput
                  value={query}
                  onChange={setQuery}
                  onSelect={handleSearch}
                  placeholder="Search player..."
                  variant="header"
                  showSuggestions={true}
                />
              </div>

              {/* Desktop Auth Buttons */}
              {isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm text-white/80 hidden lg:inline font-monocraft text-xs">
                    <User className="inline h-3 w-3 mr-1" />
                    {username}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white/70 hover:text-white hover:bg-white/5"
                    onClick={() => {
                      logout();
                      router.push('/');
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Logout</span>
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  className="hidden sm:flex text-white/80 hover:text-white hover:bg-white/5"
                  onClick={() => router.push('/login')}
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Login</span>
                </Button>
              )}

              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
        {/* Decorative thin gradient bar */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-minecraft-diamond/50 to-transparent shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute top-0 left-0 right-0 bg-black/95 border-b border-white/10 shadow-xl max-h-[100vh] overflow-y-auto">
            <div className="container mx-auto px-3 sm:px-4">
              {/* Header with close button */}
              <div className="flex h-14 items-center justify-between border-b border-white/10">
                <span className="font-monocraft text-white flex items-center gap-2">
                  <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]" />
                  Menu
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white p-2 min-w-[44px] min-h-[44px]"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Mobile Search */}
              <div className="py-4 border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none z-10" />
                  <PlayerNameInput
                    value={query}
                    onChange={setQuery}
                    onSelect={handleSearch}
                    placeholder="Search player..."
                    variant="header"
                    showSuggestions={true}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="py-4 space-y-2">
                <MobileNavLink href="/" label={t('nav.leaderboard')} />
                <MobileNavLink href="/elo-timeline" label={t('nav.eloTimeline')} />
                <MobileNavLink href="/compare" label={t('nav.playerComparison')} />
                {isAuthenticated && <MobileNavLink href="/my-stats" label="My Stats" />}
                <MobileLiveNavLink href="/live" label={t('nav.whosLive')} />
              </nav>

              {/* Mobile Auth Section */}
              <div className="py-4 border-t border-white/10">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-4 py-2 text-white/80 font-monocraft">
                      <User className="h-5 w-5" />
                      <span className="text-sm">{username}</span>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 font-monocraft"
                      onClick={() => {
                        logout();
                        router.push('/');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 font-monocraft"
                    onClick={() => {
                      router.push('/login');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <User className="h-5 w-5 mr-2" />
                    Login
                  </Button>
                )}
              </div>

              {/* Language Switcher */}
              <div className="py-4 border-t border-white/10 flex justify-center">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
