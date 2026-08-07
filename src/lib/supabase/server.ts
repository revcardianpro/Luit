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
