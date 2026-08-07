/**
 * Shape of a row in the `profiles` table (see
 * supabase/migrations/0001_profiles_and_avatars.sql). Hand-written for
 * now rather than generated — fine while the schema is this small. Once
 * there are several tables, it's worth switching to
 * `supabase gen types typescript` (via the Supabase CLI) to generate
 * this automatically from the real schema instead of by hand.
 */
export interface Profile {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Shape of a row in the `destinations` table (see
 * supabase/migrations/0002_destinations.sql).
 */
export interface Destination {
  id: string;
  slug: string;
  name: string;
  category: string;
  district: string;
  short_description: string;
  description: string;
  created_at: string;
  updated_at: string;
}

/**
 * Shape of a row in the `notable_people` table (see
 * supabase/migrations/0003_notable_people.sql). The photo_* fields
 * exist because these photos are sourced under licenses (CC BY-SA,
 * GODL-India) that legally require visible attribution, unlike the
 * Explore Assam destination photos.
 */
export interface NotablePerson {
  id: string;
  slug: string;
  name: string;
  field: string;
  lifespan: string;
  short_description: string;
  description: string;
  photo_path: string;
  photo_credit: string;
  photo_license: string;
  photo_license_url: string | null;
  created_at: string;
  updated_at: string;
}
