import { redirect, notFound } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import type { Event } from "@/lib/supabase/types";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ImageFileInput } from "@/components/ui/ImageFileInput";
import { eventCategories } from "@/lib/event-categories";
import { toDatetimeLocalValue } from "@/lib/format-event-date";
import { updateEvent } from "./actions";

export default async function EditEventPage(props: PageProps<"/events/[id]/edit">) {
  const { id } = await props.params;
  const { error } = await props.searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data } = await supabase.from("events").select("*").eq("id", id).single();
  const event = data as Event | null;

  if (!event) {
    notFound();
  }

  if (event.organizer_id !== user.id) {
    redirect(`/events/${id}`);
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">Edit event</h1>

      {error && (
        <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
          {error}
        </p>
      )}

      <form action={updateEvent} className="mt-8 flex flex-col gap-4">
        <input type="hidden" name="id" value={event.id} />
        <Input label="Event title" name="title" required defaultValue={event.title} />
        <Textarea
          label="Description"
          name="description"
          rows={5}
          required
          defaultValue={event.description}
        />

        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="category" className="text-sm font-medium text-foreground/80">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={event.category}
            className="rounded-lg border border-foreground/15 bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          >
            {eventCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <Input label="Location (optional)" name="location" defaultValue={event.location ?? ""} />

        <Input
          label="Starts"
          name="starts_at"
          type="datetime-local"
          required
          defaultValue={toDatetimeLocalValue(event.starts_at)}
        />
        <Input
          label="Ends (optional)"
          name="ends_at"
          type="datetime-local"
          defaultValue={event.ends_at ? toDatetimeLocalValue(event.ends_at) : ""}
        />
        <p className="-mt-2 text-xs text-foreground/50">
          Times are in India Standard Time (Assam local time).
        </p>

        <ImageFileInput name="image" label="Replace cover image (optional)" />
        <Input
          label="Registration / more info link (optional)"
          name="external_link"
          type="url"
          defaultValue={event.external_link ?? ""}
        />

        <Button type="submit">Save changes</Button>
      </form>
    </main>
  );
}
