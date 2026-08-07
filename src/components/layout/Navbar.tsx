import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { navLinks } from "@/lib/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { signOut } from "@/lib/supabase/actions";

/**
 * Site header, rendered once in the root layout so it appears on every
 * page. `sticky top-0` keeps it pinned while scrolling; the translucent
 * `bg-background/80 backdrop-blur` keeps content readable underneath it
 * without needing a hard, opaque bar.
 *
 * This is an `async` Server Component — it queries Supabase directly on
 * the server to find out whether anyone is signed in, and renders
 * "Sign In" or "Sign Out" accordingly. No client-side fetch or loading
 * flicker needed, since this runs before any HTML reaches the browser.
 * Uses getCurrentUser() (not the raw Supabase client) so that on pages
 * which also check the user themselves — like /account — the check
 * only actually hits Supabase's Auth server once per request, not
 * twice.
 */
export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur">
      <div className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          LUIT
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/70 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/account"
                className="text-sm font-medium text-foreground/70 hover:text-foreground"
              >
                Account
              </Link>
              <form action={signOut}>
                <Button type="submit" variant="outline" size="sm">
                  Sign Out
                </Button>
              </form>
            </div>
          ) : (
            <Button href="/login" size="sm">
              Sign In
            </Button>
          )}
        </nav>

        <MobileMenu isSignedIn={!!user} />
      </div>
    </header>
  );
}
