import type { BrandAccent } from "@/lib/brand-accent";

export const marketplaceCategories = [
  "Handloom & Textiles",
  "Tea",
  "Handicrafts",
  "Food & Spices",
  "Other",
] as const;

export type MarketplaceCategory = (typeof marketplaceCategories)[number];

const categoryAccent: Record<MarketplaceCategory, BrandAccent> = {
  "Handloom & Textiles": "brand-red",
  Tea: "brand-green",
  Handicrafts: "brand-gold",
  "Food & Spices": "brand-blue",
  Other: "brand-blue",
};

export function getCategoryAccent(category: string): BrandAccent {
  return categoryAccent[category as MarketplaceCategory] ?? "brand-blue";
}
