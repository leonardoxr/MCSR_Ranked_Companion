"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input, Button } from "@/components/ui";
import * as React from 'react';
import LanguageSwitcher from "@/components/features/LanguageSwitcher";
import { useLeaderboardCachedFilter } from '@/lib/api/hooks/useLeaderboard';
import { useQueryClient } from '@tanstack/react-query';
import { getLeaderboard } from '@/lib/api/endpoints';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { LogOut, User, Menu, X, Search } from 'lucide-react';

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

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const { username, isAuthenticated, logout } = useAuthStore();

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
      } catch {}
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
      <header className="sticky top-0 z-40 w-full border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/40">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center gap-2 sm:gap-3">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white/80 hover:text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="icon-minecraft-grass block text-xl sm:text-2xl glow-emerald" />
              <span className="font-monocraft text-sm sm:text-base text-white group-hover:glow-diamond transition">
                MCSR Ranked
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="ml-4 hidden md:flex items-center gap-1">
              <NavLink href="/" label="Home" />
              <NavLink href="/leaderboard" label="Leaderboard" />
              <NavLink href="/live" label="Live" />
              {isAuthenticated && <NavLink href="/my-stats" label="My Stats" />}
            </nav>

            {/* Desktop Search & Actions */}
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden sm:flex items-center">
                <div className="relative">
                  <Input
                    placeholder="Search player..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch(query);
                    }}
                    className="h-9 w-40 sm:w-56 bg-white/5 text-white placeholder:text-white/50 border-white/10 font-monocraft text-sm"
                  />
                  {/* Autosuggest dropdown */}
                  {query.trim() && (
                    <HeaderSuggestions query={query} onPick={(name) => { setQuery(name); handleSearch(name); }} />)
                  }
                </div>
              </div>

              {/* Desktop Auth Buttons */}
              {isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm text-white/80 hidden lg:inline">
                    <User className="inline h-4 w-4 mr-1" />
                    {username}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white/80 hover:text-white"
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
                  className="hidden sm:flex text-white/80 hover:text-white"
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
        <div className="h-[2px] w-full bg-gradient-to-r from-minecraft-emerald/60 via-cyan-400/60 to-minecraft-diamond/60" />
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
          <div className="absolute top-0 left-0 right-0 bg-black/95 border-b border-white/10 shadow-xl">
            <div className="container mx-auto px-4">
              {/* Header with close button */}
              <div className="flex h-14 items-center justify-between border-b border-white/10">
                <span className="font-monocraft text-white flex items-center gap-2">
                  <span className="icon-minecraft-grass block text-xl glow-emerald" />
                  Menu
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Mobile Search */}
              <div className="py-4 border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    placeholder="Search player..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch(query);
                    }}
                    className="h-10 pl-10 bg-white/5 text-white placeholder:text-white/50 border-white/10 font-monocraft"
                  />
                  {query.trim() && (
                    <HeaderSuggestions query={query} onPick={(name) => { setQuery(name); handleSearch(name); }} />)
                  }
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="py-4 space-y-2">
                <MobileNavLink href="/" label="Home" />
                <MobileNavLink href="/leaderboard" label="Leaderboard" />
                <MobileNavLink href="/live" label="Live Matches" />
                {isAuthenticated && <MobileNavLink href="/my-stats" label="My Stats" />}
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

function HeaderSuggestions({ query, onPick }: { query: string; onPick: (name: string) => void }) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Debounce the query, then filter from cache (no network)
  const [debounced, setDebounced] = React.useState('');
  React.useEffect(() => {
    setLoading(true);
    const id = setTimeout(() => { setDebounced(query); setLoading(false); setOpen(true); }, 200);
    return () => clearTimeout(id);
  }, [query]);

  const results = useLeaderboardCachedFilter(debounced, 8);

  // Close on outside click
  React.useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, []);

  if (!open && !loading) return null;
  return (
    <div ref={containerRef} className="absolute mt-1 w-56 z-50">
      <div className="mc-card border border-border rounded-md overflow-hidden">
        {loading && (
          <div className="px-3 py-2 text-sm text-white/70 font-monocraft">Loading…</div>
        )}
        {!loading && results.map((u, idx) => (
          <div
            key={`${u.nickname}-${idx}`}
            className="px-3 py-2 text-sm hover:bg-accent cursor-pointer flex items-center gap-2 font-monocraft"
            onClick={() => onPick(u.nickname)}
          >
            <span className="icon-minecraft-steve text-lg image-pixelated" />
            <span className="flex-1 truncate">{u.nickname}</span>
            {typeof (u as any).eloRate === 'number' && (
              <span className="text-xs text-white/60 ml-2">{(u as any).eloRate}</span>
            )}
          </div>
        ))}
        {!loading && results.length === 0 && debounced.trim() && (
          <div className="px-3 py-2 text-sm text-white/60 font-monocraft">No results in Top 150</div>
        )}
      </div>
    </div>
  );
}
