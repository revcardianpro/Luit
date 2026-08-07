import type { BrandAccent } from "@/lib/brand-accent";

export const creatorCategories = [
  "Photography",
  "Music",
  "Visual Art",
  "Writing",
  "Craft",
  "Video",
  "Other",
] as const;

export type CreatorCategory = (typeof creatorCategories)[number];

const categoryAccent: Record<CreatorCategory, BrandAccent> = {
  Photography: "brand-blue",
  Music: "brand-gold",
  "Visual Art": "brand-red",
  Writing: "brand-green",
  Craft: "brand-gold",
  Video: "brand-blue",
  Other: "brand-blue",
};

export function getCreatorCategoryAccent(category: string): BrandAccent {
  return categoryAccent[category as CreatorCategory] ?? "brand-blue";
}
