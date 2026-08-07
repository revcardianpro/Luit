"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { HillsDivider } from "@/components/ui/HillsDivider";

/**
 * A Client Component ("use client") — unlike the other landing
 * sections, which stay Server Components with zero shipped JS, this one
 * needs Motion's animation hooks to run in the browser. That's a real
 * trade-off (this section's JS now reaches the browser), accepted here
 * because the entrance animation and hover interaction are the point.
 */
export function Hero() {
  return (
    <section className="px-6 pt-24 text-center sm:pt-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-3"
      >
        <span className="font-script text-4xl text-brand-blue sm:text-5xl">Luit</span>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/50">
          The Assamese name for the Brahmaputra
        </p>

        <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold tracking-tight sm:text-6xl">
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
          className="mt-2 inline-block"
        >
          <Button href="/explore">Explore Assam</Button>
        </motion.div>
      </motion.div>

      <div className="mt-16 sm:mt-20">
        <HillsDivider />
      </div>
    </section>
  );
}
