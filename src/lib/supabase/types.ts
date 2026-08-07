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
