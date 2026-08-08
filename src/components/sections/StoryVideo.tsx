"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

/**
 * The homepage's "Watch Our Story" video (its own section, between
 * CommunitySection and ClosingCta -- see StoryVideoSection.tsx).
 * Renders nothing when there's no `embedUrl` (i.e. the admin hasn't
 * configured one yet via /admin/settings) -- a safe empty state so
 * nothing broken shows to visitors before then, same rule the rest of
 * this redesign follows for admin-controlled content.
 *
 * Two states: a 16:9 box at whatever width its container gives it
 * (sized by StoryVideoSection's wrapper, not hardcoded here -- this
 * component doesn't assume where it's placed), and a fullscreen
 * lightbox opened on click with the actual embedded player.
 * `embedUrl`/`thumbnailUrl` are resolved server-side by the caller
 * (src/lib/video-embed.ts) -- this component only renders.
 */
export function StoryVideo({
  embedUrl,
  thumbnailUrl,
}: {
  embedUrl: string | null;
  thumbnailUrl: string | null;
}) {
  const [open, setOpen] = useState(false);

  if (!embedUrl) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative aspect-video w-full overflow-hidden rounded-xl border border-white/20 bg-black/40 shadow-lg"
      >
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt=""
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover opacity-80 transition-opacity group-hover:opacity-100"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-brand-blue/60" />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/20 transition-colors group-hover:bg-black/10">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary shadow">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor">
              <path d="M8 5v14l11-7Z" />
            </svg>
          </span>
          <span className="text-xs font-semibold tracking-wide text-white uppercase">Watch Our Story</span>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-6"
            onClick={() => setOpen(false)}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close video"
              className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="aspect-video w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`${embedUrl}?autoplay=1`}
                title="LUIT — Our Story"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="h-full w-full rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
