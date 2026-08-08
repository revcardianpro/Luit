import type { BrandAccent } from "@/lib/brand-accent";

export const eventCategories = [
  "Cultural",
  "Festival",
  "Music & Dance",
  "Workshop",
  "Community",
  "Sports",
  "Business",
  "Other",
] as const;

export type EventCategory = (typeof eventCategories)[number];

const categoryAccent: Record<EventCategory, BrandAccent> = {
  Cultural: "brand-red",
  Festival: "brand-gold",
  "Music & Dance": "brand-gold",
  Workshop: "brand-blue",
  Community: "brand-green",
  Sports: "brand-green",
  Business: "brand-blue",
  Other: "brand-blue",
};

export function getEventCategoryAccent(category: string): BrandAccent {
  return categoryAccent[category as EventCategory] ?? "brand-blue";
}
