import Link from "next/link";
import Image from "next/image";
import { exploreLinks, opportunityLinks } from "@/lib/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/site-settings";

/** One (platform, url, icon) tuple per social link -- only rendered
 * when the admin has actually set that URL (src/app/admin/settings),
 * same "don't show what isn't real" rule the rest of this redesign
 * follows. Simple stroke-icon glyphs, matching the line-icon language
 * already used for the navbar's search/notification icons rather than
 * brand wordmark logos (which would need real licensed assets this
 * environment can't generate). */
function SocialIcon({ platform }: { platform: "facebook" | "instagram" | "twitter" | "youtube" }) {
  const paths: Record<typeof platform, React.ReactNode> = {
    facebook: <path d="M14 8.5h-2a1 1 0 0 0-1 1V12h3l-.4 3H11v7h-3v-7H6v-3h2V9.2A3.7 3.7 0 0 1 11.9 5H14v3.5Z" />,
    instagram: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="4.5" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="16.2" cy="7.8" r="0.8" fill="currentColor" stroke="none" />
      </>
    ),
    twitter: <path d="M5 5l14 14M19 5 5 19" />,
    youtube: (
      <>
        <rect x="3" y="6.5" width="18" height="11" rx="3" />
        <path d="M10.5 9.8v4.4l4-2.2-4-2.2Z" fill="currentColor" stroke="none" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
      {paths[platform]}
    </svg>
  );
}

/** Decorative bottom border strip -- a repeating brand-colored diamond
 * motif evoking a gamusa's woven pattern, hand-authored (no image-
 * generation tool available in this environment, same constraint
 * PillarIcon.tsx documents) rather than traced from any specific
 * reference. Purely decorative, hence aria-hidden. */
function PatternBorder() {
  return (
    <svg
      viewBox="0 0 160 20"
      preserveAspectRatio="none"
      className="h-5 w-full"
      aria-hidden="true"
    >
      <pattern id="footer-pattern" width="40" height="20" patternUnits="userSpaceOnUse">
        <rect width="40" height="20" fill="var(--color-primary)" />
        <path d="M0 10 10 0 20 10 10 20Z" fill="var(--color-brand-gold)" />
        <path d="M20 10 30 0 40 10 30 20Z" fill="var(--color-brand-red)" />
      </pattern>
      <rect width="160" height="20" fill="url(#footer-pattern)" />
    </svg>
  );
}

export async function Footer() {
  // Computed rather than hardcoded, so the copyright year never goes
  // stale — no "© 2026" left behind after the calendar turns over.
  const year = new Date().getFullYear();
  const supabase = await createClient();
  const settings = await getSiteSettings(supabase);

  const socials: { platform: "facebook" | "instagram" | "twitter" | "youtube"; url: string | null }[] = [
    { platform: "facebook", url: settings.facebook_url },
    { platform: "instagram", url: settings.instagram_url },
    { platform: "twitter", url: settings.twitter_url },
    { platform: "youtube", url: settings.youtube_url },
  ];
  const activeSocials = socials.filter((s): s is { platform: typeof s.platform; url: string } => !!s.url);

  return (
    <footer className="relative overflow-hidden border-t border-foreground/10 bg-gradient-to-b from-transparent to-primary/[0.03]">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-14 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-3">
          {/* The full logo artwork (not the navbar's cropped-down
              version) -- the footer has room for it, unlike the tight
              nav bar. Same transparent-background treatment. */}
          <Image
            src="/luit-logo-full.png"
            alt="LUIT — Project Luit"
            width={1536}
            height={1024}
            className="w-56 sm:w-64"
          />
          <p className="max-w-xs text-sm text-foreground/60">
            The digital home of Assam — modern technology with an Assamese soul.
          </p>
          {activeSocials.length > 0 && (
            <div className="mt-1 flex items-center gap-4">
              {activeSocials.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="text-foreground/50 hover:text-primary"
                >
                  <SocialIcon platform={s.platform} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold tracking-[0.15em] text-foreground/40 uppercase">
            Explore Assam
          </span>
          <nav className="flex flex-col gap-2">
            {exploreLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-foreground/70 hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold tracking-[0.15em] text-foreground/40 uppercase">
            Opportunities
          </span>
          <nav className="flex flex-col gap-2">
            {opportunityLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-foreground/70 hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-foreground/10 px-6 py-6">
        <p className="mx-auto max-w-5xl text-center text-xs text-foreground/50">
          &copy; {year} LUIT. All rights reserved.
        </p>
      </div>

      <PatternBorder />
    </footer>
  );
}
