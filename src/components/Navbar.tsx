"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "All Stars", href: "#all-stars" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-blur border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon to-emerald flex items-center justify-center text-base font-black text-void shadow-lg shadow-neon/20">
            T
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-neon transition-colors">
            TEMPO
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a href="#get-started" className="text-sm font-medium text-muted hover:text-white transition-colors">
            Sign In
          </a>
          <a
            href="#get-started"
            className="btn-primary px-5 py-2.5 rounded-full text-sm"
          >
            Get Started
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg text-white"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-void/95">
          <div className="flex flex-col p-4 gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium rounded-lg text-muted hover:text-white hover:bg-white/5 transition-all"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 mt-3 border-t border-white/5">
              <a href="#get-started" className="block w-full text-center px-4 py-3 text-sm font-bold rounded-lg btn-primary">
                Get Started
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
