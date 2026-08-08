import type { AssamEventFeedItem } from "@/lib/supabase/types";
import { getEventCategoryAccent } from "@/lib/event-categories";
import { accentBgClass } from "@/lib/brand-accent";

/**
 * Renders one row from the machine-discovered `assam_events_feed` table
 * -- see src/lib/assam-events-feed.ts for how it gets populated. Not a
 * link to a detail page (there isn't one); the card itself links out to
 * the source, same spirit as GovernmentOpportunityCard's "verify before
 * relying on these dates" disclaimer, since this is scraped + summarized
 * content, not something a human reviewed.
 */
export function AssamEventFeedCard({ item }: { item: AssamEventFeedItem }) {
  const accent = getEventCategoryAccent(item.category);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-foreground/10 p-8">
      <span className={`h-2 w-10 rounded-full ${accentBgClass[accent]}`} />
      <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
        {item.category}
        {item.location ? ` · ${item.location}` : ""}
      </p>
      <h3 className="font-serif text-xl font-semibold">{item.title}</h3>
      <p className="text-sm text-primary">{item.date_text}</p>
      <p className="text-sm text-foreground/70">{item.description}</p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-foreground/10 pt-3">
        <p className="text-xs text-foreground/40">
          Found via {item.source_name} — verify details before making plans.
        </p>
        <a
          href={item.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-primary hover:underline"
        >
          Source ↗
        </a>
      </div>
    </div>
  );
}
