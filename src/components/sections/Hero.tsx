"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { HillsDivider } from "@/components/ui/HillsDivider";
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
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/70">
          The Assamese name for the Brahmaputra
        </p>

        <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          The Digital Home of Assam
        </h1>
        <p className="max-w-xl text-lg text-white/85 sm:text-xl">
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

      <div className="relative mt-16 sm:mt-20">
        <HillsDivider />
      </div>
    </section>
  );
}
