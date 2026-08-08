import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import type { EventWithOrganizer } from "@/lib/supabase/types";
import { getEventCategoryAccent } from "@/lib/event-categories";
import { accentBgClass } from "@/lib/brand-accent";
import { formatEventDateTime } from "@/lib/format-event-date";
import { Button } from "@/components/ui/Button";
import { ReportButton } from "@/components/moderation/ReportButton";
import { DeleteEventButton } from "./DeleteEventButton";

export default async function EventPage(props: PageProps<"/events/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();
  const [{ data }, user] = await Promise.all([
    supabase.from("events").select("*, profiles(full_name, avatar_url)").eq("id", id).single(),
    getCurrentUser(),
  ]);
  const event = data as EventWithOrganizer | null;

  if (!event) {
    notFound();
  }

  const accent = getEventCategoryAccent(event.category);
  const isOwner = user?.id === event.organizer_id;
  const isPast = new Date(event.ends_at ?? event.starts_at) < new Date();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Link href="/events" className="text-sm font-medium text-foreground/60 hover:text-foreground">
        ← Back to Events
      </Link>

      {isPast && (
        <p className="mt-6 rounded-lg bg-foreground/5 px-3.5 py-2.5 text-sm text-foreground/60">
          This event has already happened. {isOwner && "Only you can see it now — visitors can't."}
        </p>
      )}

      {event.image_path && (
        <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-2xl bg-foreground/5">
          <Image
            src={event.image_path}
            alt={event.title}
            fill
            sizes="768px"
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <span className={`h-2 w-10 rounded-full ${accentBgClass[accent]}`} />
        <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
          {event.category}
          {event.location ? ` · ${event.location}` : ""}
        </p>
      </div>

      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
        {event.title}
      </h1>
      <p className="mt-1 text-lg text-primary">
        {formatEventDateTime(event.starts_at)}
        {event.ends_at ? ` – ${formatEventDateTime(event.ends_at)}` : ""}
      </p>
      {event.profiles?.full_name && (
        <p className="mt-1 text-sm text-foreground/60">Hosted by {event.profiles.full_name}</p>
      )}

      <p className="mt-8 whitespace-pre-line text-foreground/80">{event.description}</p>

      {event.external_link && (
        <div className="mt-6">
          <Button href={event.external_link} external>
            Register / More info ↗
          </Button>
        </div>
      )}

      {isOwner ? (
        <div className="mt-6 flex gap-3">
          <Button href={`/events/${event.id}/edit`} variant="outline" size="sm">
            Edit event
          </Button>
          <DeleteEventButton eventId={event.id} />
        </div>
      ) : (
        user && (
          <div className="mt-6">
            <ReportButton contentType="event" contentId={event.id} />
          </div>
        )
      )}
    </main>
  );
}
