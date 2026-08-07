import type { BrandAccent } from "@/lib/brand-accent";

export const learningCategories = [
  "Scholarships",
  "Technology & Learning",
  "Skill Development",
  "Entrepreneurship",
] as const;

export type LearningCategory = (typeof learningCategories)[number];

const categoryAccent: Record<LearningCategory, BrandAccent> = {
  Scholarships: "brand-gold",
  "Technology & Learning": "brand-blue",
  "Skill Development": "brand-green",
  Entrepreneurship: "brand-red",
};

export function getLearningCategoryAccent(category: string): BrandAccent {
  return categoryAccent[category as LearningCategory] ?? "brand-blue";
}
