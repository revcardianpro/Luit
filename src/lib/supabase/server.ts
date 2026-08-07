import { cache } from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for use inside Server Components, Server Actions, and
 * Route Handlers — anything running on the server. Reads/writes the
 * user's session via Next.js's cookie store instead of browser storage,
 * since server code has no access to the browser.
 *
 * Must be called fresh on every request (not cached at module scope),
 * because `cookies()` is tied to the current request.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // `setAll` can be called from a Server Component, which
            // isn't allowed to write cookies directly. Safe to ignore
            // here because middleware.ts (below) refreshes the session
            // on every request instead.
          }
        },
      },
    },
  );
}

/**
 * Gets the current signed-in user, memoized per request via React's
 * `cache()`. `auth.getUser()` isn't a local check — it's a real network
 * round-trip that re-validates the token against Supabase's Auth
 * server. Without this, the Navbar (rendered in the root layout on
 * every page) and that page's own content would each pay for a
 * separate round-trip for the exact same request. `cache()` makes the
 * second call reuse the first call's in-flight/resolved result instead
 * of firing again — it only dedupes within a single render, not across
 * separate requests (e.g. a page load vs. a later Server Action call).
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
