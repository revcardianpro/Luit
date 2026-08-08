import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/site-settings";
import { getEmbedUrl, getThumbnailUrl } from "@/lib/video-embed";
import { StoryVideo } from "./StoryVideo";

/**
 * The homepage's "Watch Our Story" video, its own section between
 * CommunitySection and ClosingCta -- at the user's request, larger
 * and more prominent than the compact box that originally sat inline
 * in the Hero. Resolves the admin-configured story video URL
 * (site_settings.story_video_url) into an embed/thumbnail URL
 * server-side, same pattern as every other admin-editable-content
 * lookup on this page.
 *
 * Renders nothing at all -- not even the heading -- when no video is
 * configured, so an empty section never appears between two real
 * ones.
 */
export async function StoryVideoSection() {
  const supabase = await createClient();
  const settings = await getSiteSettings(supabase);
  const embedUrl = settings.story_video_url ? getEmbedUrl(settings.story_video_url) : null;

  if (!embedUrl) {
    return null;
  }

  const thumbnailUrl = getThumbnailUrl(embedUrl);

  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          Watch Our Story
        </h2>
        <div className="mt-10">
          <StoryVideo embedUrl={embedUrl} thumbnailUrl={thumbnailUrl} />
        </div>
      </div>
    </section>
  );
}
