export type BrandAccent = "brand-blue" | "brand-green" | "brand-red" | "brand-gold";

/** Maps a brand accent name to its Tailwind background class. Shared by
 * any small colored indicator across the site (Pillars cards, Explore
 * Assam category cards, ...) so the color tokens stay centralized. */
export const accentBgClass: Record<BrandAccent, string> = {
  "brand-blue": "bg-brand-blue",
  "brand-green": "bg-brand-green",
  "brand-red": "bg-brand-red",
  "brand-gold": "bg-brand-gold",
};
