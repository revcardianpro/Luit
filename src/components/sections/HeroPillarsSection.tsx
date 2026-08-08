import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/site-settings";
import { getEmbedUrl, getThumbnailUrl } from "@/lib/video-embed";
import { HeroPillars } from "./HeroPillars";

/**
 * Thin Server Component wrapper around the Client Component
 * HeroPillars -- resolves the admin-configured story video URL
 * (site_settings.story_video_url) into an embed/thumbnail URL here,
 * server-side, so HeroPillars itself only ever deals with
 * already-resolved props.
 */
export async function HeroPillarsSection() {
  const supabase = await createClient();
  const settings = await getSiteSettings(supabase);
  const embedUrl = settings.story_video_url ? getEmbedUrl(settings.story_video_url) : null;
  const thumbnailUrl = embedUrl ? getThumbnailUrl(embedUrl) : null;

  return <HeroPillars storyVideoEmbedUrl={embedUrl} storyVideoThumbnailUrl={thumbnailUrl} />;
}
