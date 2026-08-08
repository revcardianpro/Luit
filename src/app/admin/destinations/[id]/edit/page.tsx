import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import type { Destination } from "@/lib/supabase/types";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { destinationCategories, getCategoryMeta } from "@/lib/destination-categories";
import { updateDestination } from "./actions";

export default async function EditDestinationPage(props: PageProps<"/admin/destinations/[id]/edit">) {
  await requireAdmin();
  const { id } = await props.params;
  const { error } = await props.searchParams;

  const supabase = await createClient();
  const { data } = await supabase.from("destinations").select("*").eq("id", id).single();
  const destination = data as Destination | null;

  if (!destination) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">Edit destination</h1>

      {error && (
        <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
          {error}
        </p>
      )}

      <form action={updateDestination} className="mt-8 flex flex-col gap-4">
        <input type="hidden" name="id" value={destination.id} />
        <Input label="Name" name="name" required defaultValue={destination.name} />
        <Input
          label="Slug"
          name="slug"
          required
          defaultValue={destination.slug}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          title="Lowercase letters, numbers, and hyphens only"
        />

        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="category" className="text-sm font-medium text-foreground/80">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={destination.category}
            className="rounded-lg border border-foreground/15 bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          >
            {destinationCategories.map((c) => (
              <option key={c} value={c}>
                {getCategoryMeta(c).label}
              </option>
            ))}
          </select>
        </div>

        <Input label="District" name="district" required defaultValue={destination.district} />
        <Textarea
          label="Short description"
          name="short_description"
          rows={2}
          required
          defaultValue={destination.short_description}
        />
        <Textarea
          label="Full description"
          name="description"
          rows={6}
          required
          defaultValue={destination.description}
        />

        <Button type="submit">Save changes</Button>
      </form>
    </main>
  );
}
