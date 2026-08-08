"use client";

import { motion, useReducedMotion, type MotionValue } from "motion/react";

/**
 * The vertical connective cord running through the four pillar icons
 * -- an organic, gently curving line (never straight, so it reads as
 * a cord rather than a wire or a corporate timeline), restyled per
 * the homepage redesign reference as a thicker gold cord with a small
 * tasseled knot at each pillar junction, rather than the earlier thin
 * multi-color gradient thread.
 *
 * Positioned as an absolutely-filled SVG behind the icon column;
 * viewBox is percentage-based (100 wide × 400 tall, one 100-unit band
 * per pillar) so it scales with the column regardless of exact pixel
 * height rather than needing pixel-perfect coordination with
 * PillarIcon's layout.
 */

const PATH =
  "M 50 0 C 65 30, 35 70, 50 100 C 65 130, 35 170, 50 200 C 65 230, 35 270, 50 300 C 65 330, 35 370, 50 400";

// One knot per pillar center -- the path above passes through x=50 at
// y=0/100/200/300 (each pillar's own icon sits at the top of its
// 100-unit band), so the knots line up with the icons themselves.
const KNOT_Y = [0, 100, 200, 300];

export function SilkThread({ progress }: { progress: MotionValue<number> }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 100 400"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {/* Faint full-length guide, always visible. */}
      <path
        d={PATH}
        fill="none"
        stroke="var(--color-brand-gold)"
        strokeOpacity="0.35"
        strokeWidth="3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* Drawn-in overlay, tracking scroll progress through the section
          -- gives the "traveling downward through the pillars" feel
          the spec asks for, without a separate scroll listener here
          (the shared `progress` value comes from PillarJourney's
          useScroll, so all four icons and the cord stay in sync). */}
      <motion.path
        d={PATH}
        fill="none"
        stroke="var(--color-brand-gold)"
        strokeWidth="3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: progress }}
        strokeOpacity={shouldReduceMotion ? 0.7 : 1}
      />

      {/* Tasseled knots at each pillar junction. */}
      {KNOT_Y.map((y) => (
        <circle
          key={y}
          cx="50"
          cy={y}
          r="4"
          fill="var(--color-brand-gold)"
          fillOpacity="0.9"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
