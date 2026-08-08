import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import type { LearningResource } from "@/lib/supabase/types";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { learningCategories } from "@/lib/learning-categories";
import { updateLearningResource } from "./actions";

export default async function EditLearningResourcePage(
  props: PageProps<"/admin/learning-resources/[id]/edit">,
) {
  await requireAdmin();
  const { id } = await props.params;
  const { error } = await props.searchParams;

  const supabase = await createClient();
  const { data } = await supabase.from("learning_resources").select("*").eq("id", id).single();
  const resource = data as LearningResource | null;

  if (!resource) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">Edit learning resource</h1>

      {error && (
        <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
          {error}
        </p>
      )}

      <form action={updateLearningResource} className="mt-8 flex flex-col gap-4">
        <input type="hidden" name="id" value={resource.id} />
        <Input label="Title" name="title" required defaultValue={resource.title} />
        <Input
          label="Slug"
          name="slug"
          required
          defaultValue={resource.slug}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          title="Lowercase letters, numbers, and hyphens only"
        />
        <Input label="Provider" name="provider" required defaultValue={resource.provider} />

        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="category" className="text-sm font-medium text-foreground/80">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={resource.category}
            className="rounded-lg border border-foreground/15 bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          >
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
          defaultValue={resource.short_description}
        />
        <Textarea
          label="Full description"
          name="description"
          rows={5}
          required
          defaultValue={resource.description}
        />
        <Input label="URL" name="url" type="url" required defaultValue={resource.url} />

        <Button type="submit">Save changes</Button>
      </form>
    </main>
  );
}
