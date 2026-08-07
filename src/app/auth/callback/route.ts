import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSafeRedirectPath } from "@/lib/site-url";

/**
 * Where Supabase sends the browser after a user clicks the confirmation
 * link in their signup email. The link carries a one-time `code`, which
 * we exchange here for a real logged-in session (setting the session
 * cookies), then redirect the user into the app.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next");
  // Validated even though we don't set `next` ourselves today — this
  // route reads it straight from the URL, so a crafted link could
  // otherwise redirect a just-authenticated user to an attacker's site.
  const next = rawNext && isSafeRedirectPath(rawNext) ? rawNext : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Confirmation link is invalid or expired`);
}
