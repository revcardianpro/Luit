"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { navLinks } from "@/lib/navigation";

/**
 * Hamburger menu shown only below the `sm` breakpoint (the desktop nav
 * in Navbar.tsx is hidden there instead). This is a Client Component —
 * note the "use client" directive above — because it needs `useState`
 * to track whether the dropdown is open. State and interactivity like
 * this only exist in the browser, so Next.js has to ship this one
 * component's JS to the client, unlike the Server Components elsewhere
 * on the page.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Toggle menu"
        className="flex h-9 w-9 items-center justify-center rounded-md text-foreground"
      >
        {open ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
            />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-foreground/10 bg-background px-6 py-4">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-foreground/70"
              >
                {link.label}
              </a>
            ))}
            <Button size="sm" disabled>
              Sign In
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
