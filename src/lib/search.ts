import { createClient } from "@/lib/supabase/server";
import type {
  AssamEventFeedItem,
  CreatorPost,
  Destination,
  Event,
  GovernmentOpportunity,
  Job,
  LearningResource,
  NotablePerson,
  Product,
} from "@/lib/supabase/types";

export interface SearchResult {
  id: string;
  section: string;
  title: string;
  snippet: string;
  href: string;
}

/** Order sections should render in on the results page -- roughly the
 * order these phases were built in. */
export const SEARCH_SECTIONS = [
  "Explore Assam",
  "Pride of Assam",
  "Marketplace",
  "Learning Hub",
  "Jobs",
  "Creator Community",
  "Events",
] as const;

function truncate(text: string, max = 140): string {
  const trimmed = text.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max).trimEnd()}…` : trimmed;
}

/**
 * Site-wide search across every content table, using each table's
 * `search_vector` column (see supabase/migrations/0012_search.sql).
 * Runs through the regular RLS-respecting client (not the admin one),
 * so a search never surfaces a row its own listing page wouldn't --
 * expired jobs, past events, etc. are excluded automatically by the
 * same policies those pages already rely on.
 *
 * "websearch" query type accepts natural, Google-style input (quotes,
 * OR, a leading `-` to exclude a word) without ever raising a syntax
 * error on odd user input, unlike the stricter "plain"/"phrase" modes.
 *
 * Two tables (government_opportunities, assam_events_feed) have no
 * detail page of their own -- their results link back to the section
 * page they're already displayed on (/jobs, /events) rather than a
 * route that doesn't exist.
 */
export async function searchSite(query: string): Promise<SearchResult[]> {
  const q = query.trim();
  if (!q) return [];

  const supabase = await createClient();
  const opts = { type: "websearch" as const, config: "english" };
  const LIMIT = 8;

  const [
    destinations,
    notablePeople,
    products,
    learningResources,
    jobs,
    governmentOpportunities,
    creatorPosts,
    events,
    assamEventsFeed,
  ] = await Promise.all([
    supabase.from("destinations").select("*").textSearch("search_vector", q, opts).limit(LIMIT),
    supabase.from("notable_people").select("*").textSearch("search_vector", q, opts).limit(LIMIT),
    supabase.from("products").select("*").textSearch("search_vector", q, opts).limit(LIMIT),
    supabase.from("learning_resources").select("*").textSearch("search_vector", q, opts).limit(LIMIT),
    supabase.from("jobs").select("*").textSearch("search_vector", q, opts).limit(LIMIT),
    supabase.from("government_opportunities").select("*").textSearch("search_vector", q, opts).limit(LIMIT),
    supabase.from("creator_posts").select("*").textSearch("search_vector", q, opts).limit(LIMIT),
    supabase.from("events").select("*").textSearch("search_vector", q, opts).limit(LIMIT),
    supabase.from("assam_events_feed").select("*").textSearch("search_vector", q, opts).limit(LIMIT),
  ]);

  const results: SearchResult[] = [];

  for (const row of (destinations.data ?? []) as Destination[]) {
    results.push({
      id: `destination-${row.id}`,
      section: "Explore Assam",
      title: row.name,
      snippet: truncate(row.short_description),
      href: `/explore/${row.slug}`,
    });
  }

  for (const row of (notablePeople.data ?? []) as NotablePerson[]) {
    results.push({
      id: `person-${row.id}`,
      section: "Pride of Assam",
      title: row.name,
      snippet: truncate(row.short_description),
      href: `/pride/${row.slug}`,
    });
  }

  for (const row of (products.data ?? []) as Product[]) {
    results.push({
      id: `product-${row.id}`,
      section: "Marketplace",
      title: row.title,
      snippet: truncate(row.description),
      href: `/marketplace/${row.id}`,
    });
  }

  for (const row of (learningResources.data ?? []) as LearningResource[]) {
    results.push({
      id: `learning-${row.id}`,
      section: "Learning Hub",
      title: row.title,
      snippet: truncate(row.short_description),
      href: `/learn/${row.slug}`,
    });
  }

  for (const row of (jobs.data ?? []) as Job[]) {
    results.push({
      id: `job-${row.id}`,
      section: "Jobs",
      title: row.title,
      snippet: `${row.company} — ${truncate(row.description, 100)}`,
      href: `/jobs/${row.id}`,
    });
  }

  for (const row of (governmentOpportunities.data ?? []) as GovernmentOpportunity[]) {
    results.push({
      id: `govopp-${row.id}`,
      section: "Jobs",
      title: row.title,
      snippet: `${row.organization} — ${truncate(row.description, 100)}`,
      href: `/jobs`,
    });
  }

  for (const row of (creatorPosts.data ?? []) as CreatorPost[]) {
    results.push({
      id: `post-${row.id}`,
      section: "Creator Community",
      title: row.title,
      snippet: truncate(row.description),
      href: `/community/${row.id}`,
    });
  }

  for (const row of (events.data ?? []) as Event[]) {
    results.push({
      id: `event-${row.id}`,
      section: "Events",
      title: row.title,
      snippet: truncate(row.description),
      href: `/events/${row.id}`,
    });
  }

  for (const row of (assamEventsFeed.data ?? []) as AssamEventFeedItem[]) {
    results.push({
      id: `feed-${row.id}`,
      section: "Events",
      title: row.title,
      snippet: truncate(row.description),
      href: `/events`,
    });
  }

  return results;
}
