/**
 * Turns a YouTube or Vimeo URL (whatever an admin would naturally
 * paste -- a watch link, a share link, an already-embeddable link)
 * into an iframe-embeddable URL. Returns null for anything else --
 * used both to actually render the embed (StoryVideo.tsx) and to
 * reject an unrecognized URL server-side when the admin saves it
 * (admin/settings/actions.ts), so a typo fails loudly at save time
 * instead of silently rendering nothing on the homepage.
 *
 * Deliberately narrow (just these two hosts) rather than a generic
 * oEmbed lookup -- that would mean a runtime fetch to a third party
 * just to validate a settings form, for a site with exactly one video
 * slot.
 */
export function getEmbedUrl(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "");

  if (host === "youtube.com" || host === "m.youtube.com") {
    const videoId =
      parsed.pathname === "/watch"
        ? parsed.searchParams.get("v")
        : (parsed.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] ?? null);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }

  if (host === "youtu.be") {
    const videoId = parsed.pathname.slice(1);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }

  if (host === "vimeo.com") {
    const videoId = parsed.pathname.match(/^\/(\d+)/)?.[1];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
  }

  if (host === "player.vimeo.com") {
    return parsed.pathname.match(/^\/video\/\d+/) ? parsed.toString() : null;
  }

  return null;
}

/**
 * A real preview thumbnail for the given embed URL, when one's
 * available for free without an extra API call -- YouTube serves
 * thumbnails at a predictable, unauthenticated URL keyed by video ID.
 * Vimeo has no equivalent without a signed/authenticated request, so
 * this returns null for Vimeo embeds; StoryVideo.tsx falls back to a
 * styled placeholder in that case rather than fetching one at render
 * time.
 */
export function getThumbnailUrl(embedUrl: string): string | null {
  const match = embedUrl.match(/^https:\/\/www\.youtube\.com\/embed\/([^/?]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}
