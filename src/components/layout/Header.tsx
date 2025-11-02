"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input, Button } from "@/components/ui";
import LanguageSwitcher from "@/components/features/LanguageSwitcher";

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

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/40">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="icon-minecraft-grass block text-2xl glow-emerald" />
            <span className="font-monocraft text-white group-hover:glow-diamond transition">
              MCSR Ranked
            </span>
          </Link>

          <nav className="ml-4 hidden md:flex items-center gap-1">
            <NavLink href="/" label="Home" />
            <NavLink href="/leaderboard" label="Leaderboard" />
            <NavLink href="/live" label="Live" />
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex items-center">
              <Input
                placeholder="Search player..."
                className="h-9 w-48 bg-white/5 text-white placeholder:text-white/50 border-white/10"
              />
            </div>
            <Button size="sm" variant="ghost" className="text-white/80 hover:text-white">
              Sign In
            </Button>
            <div className="ml-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
      {/* Decorative thin gradient bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-minecraft-emerald/60 via-cyan-400/60 to-minecraft-diamond/60" />
    </header>
  );
}

