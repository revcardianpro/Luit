import { NextResponse } from "next/server";
import { discoverAssamEvents } from "@/lib/assam-events-feed";
import { createAdminClient } from "@/lib/supabase/admin";

// Web scraping + an LLM call comfortably clears Vercel's default 10s
// function timeout; give it real headroom. (Hobby plan caps at 60s --
// if this route needs longer, either trim the source list or move to
// a paid plan; it won't silently succeed past the plan's ceiling.)
export const maxDuration = 60;

/**
 * Vercel Cron target -- see vercel.json for the schedule. Vercel signs
 * every cron invocation with `Authorization: Bearer $CRON_SECRET`
 * automatically; verifying that header is what stops this route from
 * being a public "regenerate the whole table" endpoint anyone could hit.
 *
 * Refresh strategy is wipe-and-replace: this table is a live snapshot
 * of "what's trending/upcoming right now", not a history, so on each
 * run we delete everything and insert whatever this run discovered
 * (possibly nothing, if every source failed to fetch or the model
 * found nothing real -- see the early-return below, which leaves the
 * previous run's data in place rather than blanking the page).
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let events;
  try {
    events = await discoverAssamEvents();
  } catch (error) {
    console.error("assam-events-feed: discovery failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Discovery failed" },
      { status: 500 },
    );
  }

  if (events.length === 0) {
    // Every source failed, or the model found nothing real -- leave
    // yesterday's feed up rather than wiping it to empty.
    return NextResponse.json({ ok: true, written: 0, note: "No events discovered; feed left unchanged." });
  }

  const supabase = createAdminClient();

  const { error: deleteError } = await supabase
    .from("assam_events_feed")
    .delete()
    .not("id", "is", null); // delete-all guard: Supabase requires a filter

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  const { error: insertError } = await supabase.from("assam_events_feed").insert(events);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, written: events.length });
}
