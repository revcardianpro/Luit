/**
 * Resolves the app's own base URL for building absolute links (e.g. the
 * email confirmation redirect in src/app/signup/actions.ts). Server-only
 * — this is never sent to the browser, so unlike the Supabase URL/key it
 * deliberately has no NEXT_PUBLIC_ prefix.
 *
 * Priority:
 *  1. SITE_URL, if explicitly set — for pinning to a real custom domain
 *     once Phase 20 (Deployment) sets one up.
 *  2. VERCEL_URL — automatically provided by Vercel on every deployment
 *     (preview or production), so preview URLs work correctly without
 *     needing manual env var updates on every deploy.
 *  3. http://localhost:3000 — local development fallback.
 */
export function getSiteUrl() {
  if (process.env.SITE_URL) {
    return process.env.SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

/**
 * True only for same-origin relative paths like "/account". Used to
 * validate a `next` redirect target that came from a URL query param
 * before using it, so a crafted link can't send a logged-in user off to
 * an attacker's site. Rejects absolute URLs ("https://evil.com") and
 * protocol-relative URLs ("//evil.com" — browsers treat the double
 * slash as "same protocol, different host").
 */
export function isSafeRedirectPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}
