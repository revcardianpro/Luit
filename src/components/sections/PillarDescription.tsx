"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { BrandAccent } from "@/lib/brand-accent";

interface PillarDescriptionProps {
  number: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  accent: BrandAccent;
  isActive: boolean;
}

export function PillarDescription({
  number,
  title,
  description,
  ctaLabel,
  href,
  accent,
  isActive,
}: PillarDescriptionProps) {
  return (
    <motion.div
      animate={{ opacity: isActive ? 1 : 0.6 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col gap-2"
    >
      <span
        className="text-xs font-semibold tracking-[0.2em]"
        style={{ color: `var(--color-${accent})` }}
      >
        {number}
      </span>
      <motion.h3
        animate={{ scale: isActive ? 1 : 0.97 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="font-serif text-2xl font-semibold tracking-tight text-white origin-left sm:text-3xl"
      >
        {title}
      </motion.h3>
      {/* Fixed white text, not the theme foreground tokens -- this now
          lives in HeroPillars, over the same dark photo backdrop as
          the rest of the Hero content (see Hero.tsx's own comment on
          why that section uses a fixed white/gold palette). */}
      <p className="max-w-md text-white/75">{description}</p>
      <Link
        href={href}
        className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        style={{ color: `var(--color-${accent})` }}
      >
        {ctaLabel}
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </Link>
    </motion.div>
  );
}
