import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client -- bypasses Row Level Security entirely.
 * Only for trusted server-only code with no user session to speak of
 * (currently: the assam-events-feed cron route). Never import this from
 * anything reachable by a browser request on behalf of a specific user;
 * use src/lib/supabase/server.ts's `createClient()` for that, which
 * respects RLS via the signed-in user's own session.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must both be set");
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
