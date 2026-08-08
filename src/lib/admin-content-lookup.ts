import { createClient } from "@/lib/supabase/server";
import type { ReportableContentType } from "@/lib/moderation";

export interface ContentSummary {
  /** False when the underlying row is already gone (deleted by its
   * owner, or by an earlier moderation action) -- the report is still
   * shown, just with nothing left to act on besides dismissing it. */
  exists: boolean;
  title: string;
  href: string;
}

/**
 * Resolves a report's `content_type` + `content_id` into something the
 * moderation queue can actually show -- a title and a link to look at
 * before deciding whether to remove it. Runs through the signed-in
 * admin's own RLS-respecting client; the admin SELECT-override
 * policies from migration 0014 (jobs/events) are what let this see
 * expired/past rows an ordinary visitor wouldn't.
 */
export async function lookupReportedContent(
  contentType: ReportableContentType,
  contentId: string,
): Promise<ContentSummary> {
  const supabase = await createClient();

  switch (contentType) {
    case "creator_post": {
      const { data } = await supabase
        .from("creator_posts")
        .select("title")
        .eq("id", contentId)
        .maybeSingle();
      return data
        ? { exists: true, title: data.title, href: `/community/${contentId}` }
        : { exists: false, title: "(post no longer exists)", href: "/community" };
    }
    case "creator_post_comment": {
      const { data } = await supabase
        .from("creator_post_comments")
        .select("body, post_id")
        .eq("id", contentId)
        .maybeSingle();
      return data
        ? { exists: true, title: `"${data.body.slice(0, 80)}"`, href: `/community/${data.post_id}` }
        : { exists: false, title: "(comment no longer exists)", href: "/community" };
    }
    case "product": {
      const { data } = await supabase.from("products").select("title").eq("id", contentId).maybeSingle();
      return data
        ? { exists: true, title: data.title, href: `/marketplace/${contentId}` }
        : { exists: false, title: "(listing no longer exists)", href: "/marketplace" };
    }
    case "job": {
      const { data } = await supabase.from("jobs").select("title").eq("id", contentId).maybeSingle();
      return data
        ? { exists: true, title: data.title, href: `/jobs/${contentId}` }
        : { exists: false, title: "(listing no longer exists)", href: "/jobs" };
    }
    case "event": {
      const { data } = await supabase.from("events").select("title").eq("id", contentId).maybeSingle();
      return data
        ? { exists: true, title: data.title, href: `/events/${contentId}` }
        : { exists: false, title: "(event no longer exists)", href: "/events" };
    }
  }
}
