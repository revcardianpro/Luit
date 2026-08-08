import { createClient } from "@/lib/supabase/server";
import type { EventWithOrganizer } from "@/lib/supabase/types";
import { Button } from "@/components/ui/Button";
import { EventCard } from "./EventCard";

export default async function EventsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*, profiles(full_name, avatar_url)")
    .order("starts_at", { ascending: true });

  const events = (data ?? []) as EventWithOrganizer[];

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

      <section className="mx-auto w-full max-w-5xl px-6 pb-24">
        {events.length === 0 ? (
          <p className="text-center text-foreground/60">
            No upcoming events yet — be the first to host one.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
