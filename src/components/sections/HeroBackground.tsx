"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// Decorative (alt="") -- these are a rotating background, not content;
// the real information is in the headline/body text rendered on top.
const images = [
  "/images/hero/majuli-sunset.jpg",
  "/images/hero/brahmaputra-ferry.jpg",
  "/images/hero/kaziranga-rhino.jpg",
  "/images/hero/assamese-weaving.jpg",
];

const DISPLAY_SECONDS = 6;

/**
 * Rotating Ken Burns-style photo background for the Hero, sourced from
 * Pixabay (see public/images/hero/CREDITS.md). Each photo cross-fades
 * into the next while slowly zooming in.
 *
 * Respects prefers-reduced-motion via Motion's useReducedMotion(): the
 * rotation stops entirely and the zoom is skipped, rather than just
 * slowing down, since a still-cycling background can be as motion-
 * triggering as the zoom itself for some users.
 */
export function HeroBackground() {
  // Starts at a fixed index (0) so server-rendered HTML and the
  // client's first render agree -- picking randomly in useState's
  // initializer would run independently on the server and the client
  // and almost certainly disagree, causing a hydration mismatch. The
  // effect below re-rolls it immediately after mount instead, which is
  // client-only by definition and can't mismatch anything.
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // "Subtly change whenever the site reloads" -- one random pick per
    // real page load, applied right after mount (crossfades in via the
    // same transition as the regular rotation below, not a hard cut).
    // Deferred via setTimeout rather than called directly in the effect
    // body: an immediate synchronous setState here would still be
    // correct, but React's linter flags it as effect/render coupling
    // that's easy to get wrong elsewhere, so this keeps the pattern
    // consistent with what the rest of the codebase should follow.
    const timeout = setTimeout(() => {
      setIndex(Math.floor(Math.random() * images.length));
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, DISPLAY_SECONDS * 1000);
    return () => clearInterval(id);
  }, [shouldReduceMotion]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-black">
      <AnimatePresence>
        <motion.div
          key={images[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: shouldReduceMotion ? 1 : 1.08 }}
            transition={{ duration: DISPLAY_SECONDS + 1.2, ease: "linear" }}
            className="absolute inset-0"
          >
            <Image
              src={images[index]}
              alt=""
              fill
              // Always priority, not just index===0: AnimatePresence
              // only ever mounts one of these at a time, so whichever
              // is currently rendered *is* the LCP candidate -- now
              // that the starting index is randomized (not always 0),
              // hardcoding this to the first array entry left every
              // other starting image loading without eager priority.
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Scrim: keeps the overlaid white text readable no matter which
          photo (or which part of it) is showing underneath. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/70" />
    </div>
  );
}
