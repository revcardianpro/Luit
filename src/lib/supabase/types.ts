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

/**
 * Shape of a row in the `products` table (see
 * supabase/migrations/0004_products.sql). Unlike Destination/
 * NotablePerson, these are user-generated, not seeded by us.
 */
export interface Product {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  district: string | null;
  image_path: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
  updated_at: string;
}

/** Product with its seller's public profile fields joined in — what
 * listing/detail pages actually query, via Supabase's nested select
 * (`*, profiles(full_name, avatar_url)`). */
export interface ProductWithSeller extends Product {
  profiles: Pick<Profile, "full_name" | "avatar_url"> | null;
}

/**
 * Shape of a row in the `learning_resources` table (see
 * supabase/migrations/0005_learning_resources.sql). Curated external
 * resources -- `url` points off-site to the actual provider.
 */
export interface LearningResource {
  id: string;
  slug: string;
  title: string;
  provider: string;
  category: string;
  short_description: string;
  description: string;
  url: string;
  created_at: string;
  updated_at: string;
}

/**
 * Shape of a row in the `jobs` table (see
 * supabase/migrations/0006_jobs.sql). User-generated, like Product.
 */
export interface Job {
  id: string;
  poster_id: string;
  title: string;
  company: string;
  description: string;
  job_type: string;
  location: string | null;
  salary_range: string | null;
  apply_url: string | null;
  apply_email: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Job with its poster's public profile fields joined in. */
export interface JobWithPoster extends Job {
  profiles: Pick<Profile, "full_name" | "avatar_url"> | null;
}

/**
 * Shape of a row in the `government_opportunities` table (see
 * supabase/migrations/0007_government_opportunities.sql). Curated, but
 * unlike Destination/NotablePerson/LearningResource, genuinely
 * time-sensitive -- info_verified_on drives an "as of" note in the UI
 * rather than presenting dates as permanently accurate.
 */
export interface GovernmentOpportunity {
  id: string;
  title: string;
  organization: string;
  listing_type: string;
  key_dates: string;
  description: string;
  source_url: string;
  info_verified_on: string;
  created_at: string;
  updated_at: string;
}

/**
 * Shape of a row in the `creator_posts` table (see
 * supabase/migrations/0008_creator_posts.sql). User-generated, like
 * Product/Job.
 */
export interface CreatorPost {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  category: string;
  image_path: string | null;
  external_link: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Post with its creator's public profile fields joined in, plus
 * aggregate like/comment counts. Used for the listing grid, where
 * computing "has *this viewer* liked each post" would mean an N+1
 * query across every card -- that per-viewer check only happens on the
 * single-post detail page instead (src/app/community/[id]/page.tsx),
 * where it's just one extra query for one post.
 */
export interface CreatorPostWithMeta extends CreatorPost {
  profiles: Pick<Profile, "full_name" | "avatar_url"> | null;
  like_count: number;
  comment_count: number;
}

/** Shape of a row in `creator_post_comments`, with the commenter's
 * public profile fields joined in. */
export interface CreatorPostComment {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
  profiles: Pick<Profile, "full_name" | "avatar_url"> | null;
}

/**
 * Shape of a row in the `events` table (see
 * supabase/migrations/0010_events.sql). User-generated, like Job/
 * CreatorPost. Directory only, no in-app RSVP tracking.
 */
export interface Event {
  id: string;
  organizer_id: string;
  title: string;
  description: string;
  category: string;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  image_path: string | null;
  external_link: string | null;
  created_at: string;
  updated_at: string;
}

/** Event with its organizer's public profile fields joined in. */
export interface EventWithOrganizer extends Event {
  profiles: Pick<Profile, "full_name" | "avatar_url"> | null;
}
