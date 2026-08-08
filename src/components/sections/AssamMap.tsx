"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import type { AssamMapRegion } from "@/lib/assam-map-regions";
import type { Destination } from "@/lib/supabase/types";
import { getCategoryMeta } from "@/lib/destination-categories";
import { accentBgClass } from "@/lib/brand-accent";

interface RegionGroup {
  region: AssamMapRegion;
  destinations: Destination[];
}

/**
 * A simplified, schematic outline of Assam's Brahmaputra valley --
 * hand-authored, not traced from any specific third-party map. No
 * freely-reusable, clearly-licensed, *per-district-clickable* Assam
 * map exists (checked: a Wikimedia Commons district map is CC-BY-SA
 * but is one fused traced path, not separable district shapes; a
 * promising GitHub geojson repo carries no license at all). This is
 * illustrative -- consistent with the site's existing "stylized, not
 * literal" illustration language (glass pillar icons, decorative
 * dividers) -- not a survey-accurate boundary map. Region pins
 * (AssamMapRegion, in assam-map-regions.ts) are placed at each area's
 * real approximate relative position within it, not GPS coordinates.
 */
const OUTLINE_PATH =
  "M40 165c-6-8-8-20 4-30 30-25 90-45 150-42 55 2 100 20 140 5 45-16 95-20 150 5 45 20 85 45 90 75 3 18-10 32-30 35-45 8-90 2-125 20-30 16-50 42-55 70-4 22 2 48-15 65-20 20-55 22-75 2-14-14-14-35-8-52 10-28 32-48 30-72-2-20-25-30-55-28-40 2-75 25-115 22-42-3-78-28-95-55-4-6-8-13-16-20Z";

export function AssamMap({ groups }: { groups: RegionGroup[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(groups[0]?.region.id ?? null);
  const selected = groups.find((g) => g.region.id === selectedId);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
      <div className="relative">
        <svg viewBox="0 0 640 380" className="w-full" role="img" aria-label="Map of Assam">
          <path
            d={OUTLINE_PATH}
            fill="color-mix(in srgb, var(--color-primary) 8%, transparent)"
            stroke="var(--color-primary)"
            strokeOpacity="0.35"
            strokeWidth="2"
          />
          {groups.map(({ region }) => {
            const isActive = region.id === selectedId;
            return (
              <g key={region.id}>
                {isActive && (
                  // Animated via a scale transform, not the `r`
                  // attribute directly -- Motion's SVG attribute
                  // animation for plain numeric geometry props like
                  // `r` is unreliable across versions; a transform is
                  // the standard, safe way to animate an SVG shape.
                  // `transformBox: fill-box` centers the scale on the
                  // circle's own bounds instead of the SVG viewport's
                  // origin.
                  <motion.circle
                    cx={region.x}
                    cy={region.y}
                    r={16}
                    fill="var(--color-primary)"
                    fillOpacity="0.18"
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Pins as real absolutely-positioned <button> elements (not
            bare SVG click handlers) so they're keyboard-focusable and
            screen-reader friendly -- percentage-based so they track
            the SVG's own responsive scaling without a resize
            listener. */}
        {groups.map(({ region, destinations }) => (
          <button
            key={region.id}
            type="button"
            onClick={() => setSelectedId(region.id)}
            aria-pressed={region.id === selectedId}
            style={{ left: `${(region.x / 640) * 100}%`, top: `${(region.y / 380) * 100}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 transition-transform hover:scale-110 ${
              region.id === selectedId ? "scale-110" : ""
            }`}
          >
            <span
              className={`h-4 w-4 rounded-full border-2 border-white shadow ${
                region.id === selectedId ? "bg-primary" : "bg-brand-gold"
              }`}
            />
            <span className="rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-foreground/80 shadow-sm">
              {region.label}
              {destinations.length > 1 ? ` (${destinations.length})` : ""}
            </span>
          </button>
        ))}
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
