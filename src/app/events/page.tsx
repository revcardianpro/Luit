import { createClient } from "@/lib/supabase/server";
import type { AssamEventFeedItem, EventWithOrganizer } from "@/lib/supabase/types";
import { Button } from "@/components/ui/Button";
import { EventCard } from "./EventCard";
import { AssamEventFeedCard } from "./AssamEventFeedCard";

export default async function EventsPage() {
  const supabase = await createClient();
  const [{ data: feedData }, { data: eventsData }] = await Promise.all([
    supabase
      .from("assam_events_feed")
      .select("*")
      .order("starts_at", { ascending: true, nullsFirst: false }),
    supabase
      .from("events")
      .select("*, profiles(full_name, avatar_url)")
      .order("starts_at", { ascending: true }),
  ]);
  const feed = (feedData ?? []) as AssamEventFeedItem[];
  const events = (eventsData ?? []) as EventWithOrganizer[];

  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-col items-center gap-4 px-6 py-20 text-center">
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Events</h1>
        <p className="max-w-xl text-lg text-foreground/70">
          Festivals, workshops, and community gatherings happening across Assam — and
          online.
        </p>
        <Button href="/events/new">Host an Event</Button>
      </section>

      {feed.length > 0 && (
        <section className="mx-auto w-full max-w-5xl px-6 pb-16">
          <h2 className="font-serif text-2xl font-semibold tracking-tight">
            Trending & Upcoming in Assam
          </h2>
          <p className="mt-1 text-sm text-foreground/60">
            Automatically discovered from public sources — not reviewed by LUIT. Always
            verify with the linked source before making plans.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {feed.map((item) => (
              <AssamEventFeedCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto w-full max-w-5xl px-6 pb-24">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          Community Events
        </h2>
        <p className="mt-1 text-sm text-foreground/60">
          Hosted and posted by members of the LUIT community.
        </p>
        {events.length === 0 ? (
          <p className="mt-6 text-foreground/60">
            No upcoming events yet — be the first to host one.
          </p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
