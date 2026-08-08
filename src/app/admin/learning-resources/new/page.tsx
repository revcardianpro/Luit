import { requireAdmin } from "@/lib/admin";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { learningCategories } from "@/lib/learning-categories";
import { createLearningResource } from "./actions";

export default async function NewLearningResourcePage(props: PageProps<"/admin/learning-resources/new">) {
  await requireAdmin();
  const { error } = await props.searchParams;

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">New learning resource</h1>

      {error && (
        <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
          {error}
        </p>
      )}

      <form action={createLearningResource} className="mt-8 flex flex-col gap-4">
        <Input label="Title" name="title" required placeholder="e.g. National Scholarship Portal" />
        <Input
          label="Slug"
          name="slug"
          required
          placeholder="e.g. national-scholarship-portal"
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          title="Lowercase letters, numbers, and hyphens only"
        />
        <Input label="Provider" name="provider" required placeholder="e.g. Government of India" />

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
            {learningCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

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
          rows={5}
          required
          placeholder="Shown on the resource's own page"
        />
        <Input label="URL" name="url" type="url" required placeholder="https://..." />

        <Button type="submit">Create resource</Button>
      </form>
    </main>
  );
}
