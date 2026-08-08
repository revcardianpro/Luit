"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import type { AssamMapRegion } from "@/lib/assam-map-regions";
import type { Destination } from "@/lib/supabase/types";
import { getCategoryMeta } from "@/lib/destination-categories";
import { accentBgClass } from "@/lib/brand-accent";

interface RegionGroup {
  region: AssamMapRegion;
  destinations: Destination[];
}

export function AssamMap({ groups }: { groups: RegionGroup[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(groups[0]?.region.id ?? null);
  const selected = groups.find((g) => g.region.id === selectedId);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
      {/* aspect-[3/2] matches the source image's real 1536x1024
          dimensions, so the percentage-positioned pins below always
          line up with it regardless of the rendered width. */}
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl border border-foreground/10">
        <Image
          src="/images/map/assam-district-map.png"
          alt="District map of Assam"
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />

        {groups.map(({ region, destinations }) => {
          const isActive = region.id === selectedId;
          return (
            <div
              key={region.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${region.x}%`, top: `${region.y}%` }}
            >
              {isActive && (
                <motion.span
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40"
                  animate={{ scale: [1, 2.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              {/* The pin itself is a real <button>, not a bare SVG/div
                  click handler, so it's keyboard-focusable and
                  screen-reader friendly. */}
              <button
                type="button"
                onClick={() => setSelectedId(region.id)}
                aria-pressed={isActive}
                className={`relative flex flex-col items-center gap-1 transition-transform hover:scale-110 ${
                  isActive ? "scale-110" : ""
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full border-2 border-white shadow ${
                    isActive ? "bg-primary" : "bg-brand-gold"
                  }`}
                />
                <span className="rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-foreground/80 shadow-sm">
                  {region.label}
                  {destinations.length > 1 ? ` (${destinations.length})` : ""}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6">
        {!selected ? (
          <p className="text-sm text-foreground/60">Click a highlighted area to learn more.</p>
        ) : (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] text-primary uppercase">
                {selected.region.label}
              </p>
              <p className="mt-1 text-sm text-foreground/50">
                {selected.destinations.length} place{selected.destinations.length === 1 ? "" : "s"} worth
                discovering
              </p>
            </div>

            {selected.destinations.map((destination) => {
              const meta = getCategoryMeta(destination.category);
              return (
                <Link
                  key={destination.id}
                  href={`/explore/${destination.slug}`}
                  className="flex flex-col gap-1.5 rounded-xl border border-foreground/10 p-4 transition-colors hover:border-primary/30"
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${accentBgClass[meta.accent]}`} />
                    <span className="text-xs font-medium text-foreground/50">{meta.label}</span>
                  </div>
                  <p className="font-serif text-lg font-semibold">{destination.name}</p>
                  <p className="text-sm text-foreground/60">{destination.short_description}</p>
                  <span className="mt-1 text-sm font-medium text-primary">View details →</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
