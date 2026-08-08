import { requireAdmin } from "@/lib/admin";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { destinationCategories, getCategoryMeta } from "@/lib/destination-categories";
import { createDestination } from "./actions";

export default async function NewDestinationPage(props: PageProps<"/admin/destinations/new">) {
  await requireAdmin();
  const { error } = await props.searchParams;

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">New destination</h1>

      {error && (
        <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
          {error}
        </p>
      )}

      <form action={createDestination} className="mt-8 flex flex-col gap-4">
        <Input label="Name" name="name" required placeholder="e.g. Kaziranga National Park" />
        <Input
          label="Slug"
          name="slug"
          required
          placeholder="e.g. kaziranga-national-park"
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
            defaultValue=""
            className="rounded-lg border border-foreground/15 bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="" disabled>
              Select a category
            </option>
            {destinationCategories.map((c) => (
              <option key={c} value={c}>
                {getCategoryMeta(c).label}
              </option>
            ))}
          </select>
        </div>

        <Input label="District" name="district" required placeholder="e.g. Golaghat & Nagaon" />
        <Textarea
          label="Short description"
          name="short_description"
          rows={2}
          required
          placeholder="One sentence, shown on the listing card"
        />
        <Textarea
          label="Full description"
          name="description"
          rows={6}
          required
          placeholder="Shown on the destination's own page"
        />

        <Button type="submit">Create destination</Button>
      </form>
    </main>
  );
}
