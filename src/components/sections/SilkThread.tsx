"use client";

import { motion, useReducedMotion, type MotionValue } from "motion/react";

/**
 * The vertical connective thread running through the four pillar icons
 * -- an organic, gently curving line (never straight, never thick, so
 * it reads as fine silk rather than a wire or a corporate timeline).
 *
 * Positioned as an absolutely-filled SVG behind the icon column;
 * viewBox is percentage-based (100 wide × 400 tall, one 100-unit band
 * per pillar) so it scales with the column regardless of exact pixel
 * height rather than needing pixel-perfect coordination with
 * PillarIcon's layout.
 */

const PATH =
  "M 50 0 C 65 30, 35 70, 50 100 C 65 130, 35 170, 50 200 C 65 230, 35 270, 50 300 C 65 330, 35 370, 50 400";

export function SilkThread({ progress }: { progress: MotionValue<number> }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 100 400"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="silk-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-brand-blue)" stopOpacity="0.5" />
          <stop offset="33%" stopColor="var(--color-brand-green)" stopOpacity="0.5" />
          <stop offset="66%" stopColor="var(--color-brand-red)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--color-brand-gold)" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Faint full-length guide, always visible. */}
      <path
        d={PATH}
        fill="none"
        stroke="url(#silk-gradient)"
        strokeWidth="1.25"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* Drawn-in overlay, tracking scroll progress through the section
          -- gives the "traveling downward through the pillars" feel
          the spec asks for, without a separate scroll listener here
          (the shared `progress` value comes from PillarJourney's
          useScroll, so all four icons and the thread stay in sync). */}
      <motion.path
        d={PATH}
        fill="none"
        stroke="var(--color-brand-gold)"
        strokeWidth="1.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: progress }}
        strokeOpacity={shouldReduceMotion ? 0.6 : 0.9}
      />
    </svg>
  );
}
