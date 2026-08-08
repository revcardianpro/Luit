"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { NavLink } from "@/lib/navigation";

/**
 * "Explore Assam ▾" / "Opportunities ▾" style nav dropdown. A Client
 * Component so Navbar itself can stay a Server Component (same
 * trade-off already made for MobileMenu) -- this is the only part of
 * the desktop nav that needs open/close state.
 *
 * Click-to-toggle rather than hover-only: hover-only dropdowns don't
 * work on touch devices and are awkward with keyboard navigation
 * (there's no "hover" to tab into). A click outside closes it, same
 * as any standard menu.
 */
export function NavDropdown({ label, links }: { label: string; links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-1 text-sm font-medium whitespace-nowrap text-foreground/70 hover:text-foreground"
      >
        {label}
        <svg
          viewBox="0 0 12 12"
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.5 4.5 3.5 3.5 3.5-3.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-2 min-w-40 rounded-xl border border-foreground/10 bg-background p-1.5 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
