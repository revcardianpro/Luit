"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll } from "motion/react";
import { Button } from "@/components/ui/Button";
import { HeroBackground } from "@/components/sections/HeroBackground";
import { PillarIcon } from "@/components/sections/PillarIcon";
import { PillarDescription } from "@/components/sections/PillarDescription";
import { SilkThread } from "@/components/sections/SilkThread";
import { StoryVideo } from "@/components/sections/StoryVideo";
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
  const inView = useInView(ref, { margin: "-30% 0px -30% 0px" });

  useEffect(() => {
    if (inView) onInView();
  }, [inView, onInView]);

  return (
    <div
      ref={ref}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className="flex items-start gap-5 sm:gap-6"
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

interface HeroPillarsProps {
  /** Resolved server-side (src/lib/video-embed.ts) by the page itself
   * from site_settings.story_video_url -- null when the admin hasn't
   * configured one yet, in which case StoryVideo renders nothing. */
  storyVideoEmbedUrl: string | null;
  storyVideoThumbnailUrl: string | null;
}

/**
 * Merged hero + four-pillar journey, per the homepage redesign
 * reference: pillars run down the left as a numbered column connected
 * by a gold cord, the hero statement sits on the right, both over the
 * same rotating photo background -- replaces the previous separate
 * Hero + PillarJourney sections.
 *
 * A Client Component (like the Hero/PillarJourney it replaces) for
 * Motion's animation hooks and the hover/scroll-active pillar state.
 */
export function HeroPillars({ storyVideoEmbedUrl, storyVideoThumbnailUrl }: HeroPillarsProps) {
  const pillarsRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [inViewIndex, setInViewIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: pillarsRef,
    offset: ["start 0.9", "end 0.5"],
  });

  const activeIndex = hoveredIndex ?? inViewIndex;

  return (
    <section className="relative overflow-hidden px-6 pt-24 pb-16 sm:pt-32 sm:pb-24">
      <HeroBackground />

      <div className="relative mx-auto grid max-w-5xl gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12">
        {/* Left: the four-pillar column. */}
        <div ref={pillarsRef} className="relative flex flex-col gap-10 sm:gap-12">
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

        {/* Right: the hero statement. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-start gap-4 text-left"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-primary shadow">
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
              <path d="M10 1l1.9 5.9L18 9l-6.1 2.1L10 17l-1.9-5.9L2 9l6.1-2.1Z" />
            </svg>
            Digital Home of Assam
          </span>

          <h1 className="flex flex-col font-serif text-5xl leading-[1.05] font-semibold tracking-tight text-white sm:text-6xl">
            <span>Modernize.</span>
            <span>Connect.</span>
            <span className="text-[#7ec3ff]">Preserve.</span>
          </h1>

          <p className="max-w-lg text-lg text-white/85">
            Uniting culture, people, opportunities and future on one platform. Together, let&rsquo;s build a
            stronger, smarter and more proud Assam.
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button href="/explore">Explore Assam →</Button>
            </motion.div>
            {storyVideoEmbedUrl && (
              <div className="w-40 sm:w-48">
                <StoryVideo embedUrl={storyVideoEmbedUrl} thumbnailUrl={storyVideoThumbnailUrl} />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
