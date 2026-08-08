import Link from "next/link";
import Image from "next/image";
import type { EventWithOrganizer } from "@/lib/supabase/types";
import { getEventCategoryAccent } from "@/lib/event-categories";
import { accentBgClass } from "@/lib/brand-accent";
import { formatEventDateTime } from "@/lib/format-event-date";

export function EventCard({ event }: { event: EventWithOrganizer }) {
  const accent = getEventCategoryAccent(event.category);

  return (
    <Link
      href={`/events/${event.id}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-foreground/10 transition-colors hover:border-foreground/20"
    >
      <div className="relative aspect-video w-full bg-foreground/5">
        {event.image_path ? (
          <Image
            src={event.image_path}
            alt={event.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-foreground/40">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 p-6">
        <span className={`h-2 w-10 rounded-full ${accentBgClass[accent]}`} />
        <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
          {event.category}
          {event.location ? ` · ${event.location}` : ""}
        </p>
        <h3 className="font-serif text-xl font-semibold">{event.title}</h3>
        <p className="text-sm text-primary">{formatEventDateTime(event.starts_at)}</p>
        {event.profiles?.full_name && (
          <p className="text-sm text-foreground/60">by {event.profiles.full_name}</p>
        )}
      </div>
    </Link>
  );
}
