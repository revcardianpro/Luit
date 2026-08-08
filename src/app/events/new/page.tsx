import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ImageFileInput } from "@/components/ui/ImageFileInput";
import { eventCategories } from "@/lib/event-categories";
import { createEvent } from "./actions";

export default async function NewEventPage(props: PageProps<"/events/new">) {
  const { error } = await props.searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">Host an event</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Share something happening with the LUIT community.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
          {error}
        </p>
      )}

      <form action={createEvent} className="mt-8 flex flex-col gap-4">
        <Input label="Event title" name="title" required placeholder="e.g. Bihu Mela 2026" />
        <Textarea
          label="Description"
          name="description"
          rows={5}
          required
          placeholder="What's happening, who it's for, what to expect..."
        />

        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="category" className="text-sm font-medium text-foreground/80">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue=""
            className="rounded-lg border border-foreground/15 bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="" disabled>
              Select a category
            </option>
            {eventCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Location (optional)"
          name="location"
          placeholder="e.g. Guwahati, or Online via Zoom"
        />

        <Input label="Starts" name="starts_at" type="datetime-local" required />
        <Input label="Ends (optional)" name="ends_at" type="datetime-local" />
        <p className="-mt-2 text-xs text-foreground/50">
          Times are in India Standard Time (Assam local time).
        </p>

        <ImageFileInput name="image" label="Cover image (optional)" />
        <Input
          label="Registration / more info link (optional)"
          name="external_link"
          type="url"
          placeholder="https://..."
        />

        <Button type="submit">Post event</Button>
      </form>
    </main>
  );
}
