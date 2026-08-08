import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { navLinks } from "@/lib/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
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

  // Only signed-in users can possibly be admins, so skip the extra
  // query entirely for signed-out visitors.
  let isAdmin = false;
  if (user) {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.is_admin ?? false;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur">
      <div className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-xl font-semibold tracking-tight">
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
          <Link
            href="/search"
            aria-label="Search"
            className="text-foreground/70 hover:text-foreground"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-5 w-5"
            >
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="m20 20-3.5-3.5" />
            </svg>
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-foreground/70 hover:text-foreground"
                >
                  Admin
                </Link>
              )}
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

        <MobileMenu isSignedIn={!!user} isAdmin={isAdmin} />
      </div>
    </header>
  );
}
