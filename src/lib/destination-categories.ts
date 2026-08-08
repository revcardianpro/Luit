import type { BrandAccent } from "@/lib/brand-accent";

export const destinationCategories = [
  "national_park",
  "island",
  "temple",
  "historical_site",
] as const;

export type DestinationCategory = (typeof destinationCategories)[number];

interface CategoryMeta {
  label: string;
  accent: BrandAccent;
}

// Display label + brand accent color per category, so new destinations
// added later (via a future migration or, eventually, Phase 15's admin
// UI) automatically get consistent styling just by picking a category.
const categoryMeta: Record<DestinationCategory, CategoryMeta> = {
  national_park: { label: "National Park", accent: "brand-green" },
  island: { label: "Island", accent: "brand-blue" },
  temple: { label: "Temple", accent: "brand-gold" },
  historical_site: { label: "Historical Site", accent: "brand-red" },
};

const fallback: CategoryMeta = { label: "Destination", accent: "brand-blue" };

export function getCategoryMeta(category: string): CategoryMeta {
  return categoryMeta[category as DestinationCategory] ?? fallback;
}
