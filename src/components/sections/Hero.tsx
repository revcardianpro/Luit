"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";

/**
 * A Client Component ("use client") — unlike the other landing
 * sections, which stay Server Components with zero shipped JS, this one
 * needs Motion's animation hooks to run in the browser. That's a real
 * trade-off (this section's JS now reaches the browser), accepted here
 * because the entrance animation and hover interaction are the point.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-28 text-center sm:py-40">
      <div aria-hidden className="hero-glow-bg pointer-events-none absolute inset-0 -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <span className="text-sm font-medium uppercase tracking-[0.2em] text-brand-blue">
          Luit — the Assamese name for the Brahmaputra
        </span>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          The Digital Home of Assam
        </h1>
        <p className="max-w-xl text-lg text-foreground/70 sm:text-xl">
          LUIT blends modern opportunity with timeless culture — helping
          Assam&rsquo;s people embrace the future without losing their
          identity, and inviting the world to discover it.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block"
        >
          <Button href="/explore">Explore Assam</Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
