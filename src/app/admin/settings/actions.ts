"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";
import { getEmbedUrl } from "@/lib/video-embed";

/** Every field here is optional -- an empty submitted value clears the
 * setting (stored as null), rather than being rejected as "required". */
export async function updateSiteSettings(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;

  const storyVideoUrl = (formData.get("story_video_url") as string)?.trim() || null;
  const facebookUrl = (formData.get("facebook_url") as string)?.trim() || null;
  const instagramUrl = (formData.get("instagram_url") as string)?.trim() || null;
  const twitterUrl = (formData.get("twitter_url") as string)?.trim() || null;
  const youtubeUrl = (formData.get("youtube_url") as string)?.trim() || null;

  // Validated at save time (rather than only at render time) so a
  // typo'd link fails loudly here instead of silently just not
  // showing up on the homepage later.
  if (storyVideoUrl && !getEmbedUrl(storyVideoUrl)) {
    redirectWithError("/admin/settings", "Story video URL must be a YouTube or Vimeo link.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      story_video_url: storyVideoUrl,
      facebook_url: facebookUrl,
      instagram_url: instagramUrl,
      twitter_url: twitterUrl,
      youtube_url: youtubeUrl,
    })
    .eq("id", id);

  if (error) {
    redirectWithError("/admin/settings", error.message);
  }

  redirect("/admin/settings");
}
