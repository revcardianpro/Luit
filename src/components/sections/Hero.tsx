"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { HeroBackground } from "@/components/sections/HeroBackground";

/**
 * A Client Component ("use client") — unlike the other landing
 * sections, which stay Server Components with zero shipped JS, this one
 * needs Motion's animation hooks to run in the browser. That's a real
 * trade-off (this section's JS now reaches the browser), accepted here
 * because the entrance animation, hover interaction, and photo
 * background rotation are the point.
 *
 * Text here uses a fixed white/gold palette instead of the theme
 * tokens (--foreground etc.) used everywhere else on the site. That's
 * deliberate: this section's background is always a dark photo
 * (HeroBackground), regardless of whether the site itself is in light
 * or dark mode, so its text needs to stay legible against that fixed
 * dark backdrop rather than following the site theme.
 *
 * Stands alone (no pillars sharing this section) per the user's own
 * correction after the homepage redesign v2 pass first merged this
 * with PillarJourney into one two-column section -- PillarJourney is
 * its own section again, directly below this one. The "Watch Our
 * Story" video also moved out of here into its own section further
 * down the page (see StoryVideoSection.tsx) at the user's request for
 * a larger, more prominent placement than fit well inline in the
 * Hero.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-24 pb-16 text-center sm:pt-32 sm:pb-20">
      <HeroBackground />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative flex flex-col items-center gap-3"
      >
        <span className="font-script text-[#e0b04a] text-4xl sm:text-5xl">Luit</span>

        <h1 className="mt-4 flex flex-col font-serif text-5xl leading-[1.05] font-semibold tracking-tight text-white sm:text-7xl">
          <span>Modernize.</span>
          <span>Connect.</span>
          <span>Preserve.</span>
        </h1>
        <p className="mt-2 text-xs font-medium uppercase tracking-[0.3em] text-white/60">
          Culture · People · Opportunities · Future
        </p>
        <p className="mt-2 max-w-xl text-lg text-white/85 sm:text-xl">
          LUIT blends modern opportunity with timeless culture — helping
          Assam&rsquo;s people embrace the future without losing their
          identity, and inviting the world to discover it.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-2 inline-block"
        >
          <Button href="/explore">Explore Assam</Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
