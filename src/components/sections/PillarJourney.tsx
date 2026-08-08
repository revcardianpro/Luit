"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll } from "motion/react";
import { PillarIcon } from "./PillarIcon";
import { PillarDescription } from "./PillarDescription";
import { SilkThread } from "./SilkThread";
import type { BrandAccent } from "@/lib/brand-accent";

interface Pillar {
  id: string;
  number: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  accent: BrandAccent;
}

// Pillar -> color mapping matches the official logo artwork exactly
// (public/luit-logo.png): Culture=blue/river, People=green/tree,
// Opportunities=red/dhol, Future=gold/sun. Each pillar links to the
// site section that most literally embodies it.
const pillars: Pillar[] = [
  {
    id: "culture",
    number: "01",
    title: "Culture",
    description:
      "Celebrate and preserve Assam's rich heritage, art, language, music, dance and traditions for generations to come.",
    ctaLabel: "Explore Culture",
    href: "/explore",
    accent: "brand-blue",
  },
  {
    id: "people",
    number: "02",
    title: "People",
    description: "Empower every Assamese by connecting communities, creators, change-makers and dreamers.",
    ctaLabel: "Meet Our People",
    href: "/pride",
    accent: "brand-green",
  },
  {
    id: "opportunities",
    number: "03",
    title: "Opportunities",
    description: "Bringing opportunities to every doorstep through jobs, entrepreneurship, education and innovation.",
    ctaLabel: "Find Opportunities",
    href: "/jobs",
    accent: "brand-red",
  },
  {
    id: "future",
    number: "04",
    title: "Future",
    description: "Building a future where Assam leads with pride and becomes a beacon for the entire Northeast.",
    ctaLabel: "Build the Future",
    href: "/learn",
    accent: "brand-gold",
  },
];

interface PillarRowProps {
  pillar: Pillar;
  index: number;
  isActive: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onInView: () => void;
}

function PillarRow({ pillar, index, isActive, onHoverStart, onHoverEnd, onInView }: PillarRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Counts a pillar "in view" once it's within the middle 20% of the
  // viewport -- narrow on purpose, so scrolling clearly hands off from
  // one active pillar to the next rather than several counting as
  // active at once.
  const inView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (inView) onInView();
  }, [inView, onInView]);

  return (
    <div
      ref={ref}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className="flex items-start gap-6 sm:gap-8"
    >
      <PillarIcon accent={pillar.accent} index={index} isActive={isActive} />
      <PillarDescription
        number={pillar.number}
        title={pillar.title}
        description={pillar.description}
        ctaLabel={pillar.ctaLabel}
        href={pillar.href}
        accent={pillar.accent}
        isActive={isActive}
      />
    </div>
  );
}

/**
 * The four-pillar journey: a vertically-stacked, left-anchored column
 * (per spec -- explicitly not a horizontal row) of glass icons
 * connected by a gold cord, with the active pillar driven by either
 * hover or scroll position, and a very subtle background color
 * response to whichever pillar is active.
 *
 * Its own section, directly below Hero -- not sharing space with it.
 * A homepage redesign v2 pass briefly merged the two into one
 * two-column section; the user corrected that back to this original
 * stacked structure, while keeping that pass's gold-cord SilkThread
 * and restyled PillarIcon motifs.
 */
export function PillarJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [inViewIndex, setInViewIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.3"],
  });

  const activeIndex = hoveredIndex ?? inViewIndex;
  const activeAccent = pillars[activeIndex].accent;

  return (
    <section
      id="pillars"
      ref={containerRef}
      className="relative scroll-mt-24 overflow-hidden px-6 py-24 sm:py-32"
    >
      {/* Background atmosphere: a soft, low-opacity radial tint toward
          the active pillar's color. The off-white base always stays
          dominant -- this is a wash, never a full-screen color swap. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        animate={{
          background: `radial-gradient(ellipse 65% 55% at 15% 50%, color-mix(in srgb, var(--color-${activeAccent}) 9%, transparent), transparent 70%)`,
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      <div className="mx-auto max-w-5xl">
        <div className="mb-14 max-w-lg">
          <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Four pillars, one journey
          </h2>
          <p className="mt-2 text-foreground/60">
            Everything on LUIT grows out of these four ideas, connected like a single
            thread of Muga silk.
          </p>
        </div>

        <div className="relative flex flex-col gap-16 sm:gap-20">
          <div className="pointer-events-none absolute inset-y-0 left-11 hidden w-6 sm:block">
            <SilkThread progress={scrollYProgress} />
          </div>

          {pillars.map((pillar, index) => (
            <PillarRow
              key={pillar.id}
              pillar={pillar}
              index={index}
              isActive={activeIndex === index}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              onInView={() => setInViewIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
