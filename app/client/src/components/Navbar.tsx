/*
 * Design: Obsidian Atlas — Dark Cartographic Intelligence Platform
 * Navbar: Sticky top nav with teal accent, clean links, institutional feel
 */
import { Link, useLocation } from "wouter";
import { Building2, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/properties", label: "Properties" },
  { href: "/attributes", label: "Attributes" },
  { href: "/profiles", label: "UBO Directory" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-teal/10 border border-teal/30 group-hover:border-teal/60 transition-colors">
            <Building2 className="h-5 w-5 text-teal" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wide text-foreground">
              CRE PREDICTION ENGINE
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Manhattan Off-Market Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-sm ${
                  isActive
                    ? "text-teal bg-teal/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          {navLinks.map((link) => {
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-6 py-3 text-sm font-medium border-b border-border/30 ${
                  isActive
                    ? "text-teal bg-teal/5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
