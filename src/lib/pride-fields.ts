import type { BrandAccent } from "@/lib/brand-accent";

// Display accent color per field, keyed by the exact `field` values used
// in supabase/migrations/0003_notable_people.sql. Falls back to a
// default for any future field not yet mapped here.
const fieldAccent: Record<string, BrandAccent> = {
  "Music & Cinema": "brand-gold",
  "Military History": "brand-red",
  "Spirituality & Arts": "brand-green",
  Sports: "brand-blue",
  "Cinema & Literature": "brand-gold",
};

export function getFieldAccent(field: string): BrandAccent {
  return fieldAccent[field] ?? "brand-blue";
}
