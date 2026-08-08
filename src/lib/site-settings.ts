import type { SupabaseClient } from "@supabase/supabase-js";
import type { SiteSettings } from "@/lib/supabase/types";

/**
 * Reads the one `site_settings` row. Takes an already-created Supabase
 * client (the caller's own, from `createClient()`) rather than making
 * its own -- callers span both the Hero (needs `story_video_url`) and
 * the Footer (needs the social URLs), each of which already opens a
 * client for its own other queries.
 *
 * Falls back to an all-null row if the table is somehow empty (should
 * never happen -- the migration seeds exactly one row -- but every
 * caller already treats every field as nullable, so this is a safe
 * default rather than a special "not configured" branch every caller
 * would otherwise need).
 */
export async function getSiteSettings(supabase: SupabaseClient): Promise<SiteSettings> {
  const { data } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();

  return (
    (data as SiteSettings | null) ?? {
      id: "",
      story_video_url: null,
      facebook_url: null,
      instagram_url: null,
      twitter_url: null,
      youtube_url: null,
      updated_at: new Date(0).toISOString(),
    }
  );
}
