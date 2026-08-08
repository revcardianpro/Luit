import Link from "next/link";
import Image from "next/image";
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

  // Only signed-in users can possibly be admins or have notifications,
  // so skip both extra queries entirely for signed-out visitors.
  let isAdmin = false;
  let unreadCount = 0;
  if (user) {
    const supabase = await createClient();
    const [{ data: profile }, { count }] = await Promise.all([
      supabase.from("profiles").select("is_admin").eq("id", user.id).single(),
      supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("recipient_id", user.id)
        .is("read_at", null),
    ]);
    isAdmin = profile?.is_admin ?? false;
    unreadCount = count ?? 0;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur">
      <div className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="shrink-0" aria-label="LUIT home">
          {/* Cropped from the official logo (public/luit-logo.png) --
              just the illustrated "LUIT" wordmark, background keyed to
              transparent, since the full asset (which also carries a
              "PROJECT" label and the four-pillar legend) is sized for
              poster use, not a compact nav slot. */}
          <Image
            src="/luit-logo-navbar.png"
            alt="LUIT"
            width={1326}
            height={530}
            priority
            className="h-9 w-auto"
          />
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
              <Link href="/notifications" aria-label="Notifications" className="relative text-foreground/70 hover:text-foreground">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.85 23.85 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
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

        <MobileMenu isSignedIn={!!user} isAdmin={isAdmin} unreadCount={unreadCount} />
      </div>
    </header>
  );
}
