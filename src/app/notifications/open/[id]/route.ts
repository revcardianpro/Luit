import { NextResponse } from "next/server";
import { createClient, getCurrentUser } from "@/lib/supabase/server";

/**
 * What a notification's link actually points at. This is a GET route
 * handler rather than a Server Action so that clicking a notification
 * is a plain navigation (works with "open in new tab", no JS required)
 * that also happens to mark the row read on the way through -- an
 * `UPDATE ... RETURNING content_href` lets one query do both.
 */
export async function GET(request: Request, ctx: RouteContext<"/notifications/open/[id]">) {
  const { origin } = new URL(request.url);
  const { id } = await ctx.params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id)
    .eq("recipient_id", user.id)
    .select("content_href")
    .maybeSingle();

  return NextResponse.redirect(`${origin}${data?.content_href ?? "/notifications"}`);
}
