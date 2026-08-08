"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import type { BrandAccent } from "@/lib/brand-accent";

/**
 * Simple line-art motifs, one per pillar -- specific, named cultural
 * references the user asked for by name (not generic icon-set
 * substitutes), matching each pillar's brand accent color. See the
 * module comment on PillarIcon below for why these are hand-drawn SVG
 * rather than pre-rendered 3D art.
 */
const motifs: Record<BrandAccent, React.ReactNode> = {
  "brand-blue": (
    // Culture -- a Gamusa: the woven cotton scarf with a patterned
    // border and fringed ends, one of Assam's most recognizable
    // cultural symbols.
    <>
      <rect x="10" y="4" width="12" height="22" rx="0.5" />
      <path d="M10 9.5h12M10 20.5h12" />
      <path d="M12.5 6.5h1M15.5 6.5h1M18.5 6.5h1M12.5 23h1M15.5 23h1M18.5 23h1" />
      <path d="M12 26v3M15 26v3.5M18 26v3M21 26v3.5" />
    </>
  ),
  "brand-green": (
    // People -- a Bihu dancing couple, arms raised mid-dance.
    <>
      <circle cx="11.5" cy="7.5" r="2.3" />
      <path d="M11.5 10v7.5M11.5 12.5l-4-2.5M11.5 12.5l3 1.5M11.5 17.5l-3 5M11.5 17.5l3.5 4.5" />
      <circle cx="20.5" cy="7.5" r="2.3" />
      <path d="M20.5 10v7.5M20.5 12.5l4-2.5M20.5 12.5l-3 1.5M20.5 17.5l3 5M20.5 17.5l-3.5 4.5" />
    </>
  ),
  "brand-red": (
    // Opportunities -- the Brahmaputra: three flowing river lines.
    <>
      <path d="M4 10c3-2.5 5-2.5 8 0s5 2.5 8 0" />
      <path d="M4 16c3-2.5 5-2.5 8 0s5 2.5 8 0" />
      <path d="M4 22c3-2.5 5-2.5 8 0s5 2.5 8 0" />
    </>
  ),
  "brand-gold": (
    // Future -- a tea garden: rows of bushes on a hillside with a
    // young sprout above them.
    <>
      <path d="M3 22c2.5-3 4.5-3 7 0s4.5 3 7 0 4.5-3 7 0 4.5 3 7 0" />
      <path d="M3 26.5c2.5-3 4.5-3 7 0s4.5 3 7 0 4.5-3 7 0 4.5 3 7 0" />
      <path d="M16 18v-6" />
      <path d="M16 14c-2-1-3 0-3 2M16 12c2-1 3 0 3 2" />
    </>
  ),
};

interface PillarIconProps {
  accent: BrandAccent;
  index: number;
  isActive: boolean;
}

/**
 * The "glass capsule" pillar icon. The spec calls for large HD 3D
 * glass icons — real pre-rendered 3D art, which isn't something this
 * environment can generate (no image/3D model tool available). This
 * is the CSS/SVG equivalent instead: backdrop-blur + layered
 * gradients + a specular highlight approximate genuine glass depth,
 * real 3D comes from a perspective transform that tilts toward the
 * cursor on hover rather than a pre-baked render. If real icon
 * artwork exists later, this component is a drop-in swap point.
 */
export function PillarIcon({ accent, index, isActive }: PillarIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 15, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  // Idle float: asynchronous across the four icons (each a different
  // duration/delay) so they never move in lockstep.
  const floatAnimation = shouldReduceMotion
    ? {}
    : {
        y: [0, -7, 0],
        rotate: [0, index % 2 === 0 ? 2 : -2, 0],
      };
  const floatTransition = {
    duration: 5 + index * 0.6,
    delay: index * 0.35,
    repeat: Infinity,
    ease: "easeInOut" as const,
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.12 }}
      animate={floatAnimation}
      transition={floatTransition}
      style={{ perspective: 800 }}
      className="relative shrink-0"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={{
          scale: isActive ? 1.08 : 1,
          filter: isActive ? "brightness(1.08)" : "brightness(1)",
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative flex h-24 w-24 items-center justify-center rounded-full sm:h-28 sm:w-28"
      >
        {/* Glass fill: soft color wash + backdrop blur */}
        <div
          className="absolute inset-0 rounded-full backdrop-blur-md"
          style={{
            background: `radial-gradient(circle at 32% 28%, color-mix(in srgb, var(--color-${accent}) 22%, white 78%), color-mix(in srgb, var(--color-${accent}) 10%, transparent) 70%)`,
            border: `1px solid color-mix(in srgb, var(--color-${accent}) 35%, transparent)`,
            boxShadow: isActive
              ? `0 8px 30px -6px color-mix(in srgb, var(--color-${accent}) 55%, transparent), inset 0 1px 1px rgba(255,255,255,0.6)`
              : `0 4px 16px -6px color-mix(in srgb, var(--color-${accent}) 35%, transparent), inset 0 1px 1px rgba(255,255,255,0.5)`,
          }}
        />
        {/* Specular highlight */}
        <div className="absolute top-2 left-3 h-6 w-8 rounded-full bg-white/50 blur-md" />

        <svg
          viewBox="0 0 32 32"
          className="relative h-10 w-10 sm:h-12 sm:w-12"
          fill="none"
          stroke={`var(--color-${accent})`}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {motifs[accent]}
        </svg>
      </motion.div>
    </motion.div>
  );
}
