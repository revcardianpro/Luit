import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import type { LearningResource } from "@/lib/supabase/types";
import { getLearningCategoryAccent } from "@/lib/learning-categories";
import { accentBgClass } from "@/lib/brand-accent";
import { Button } from "@/components/ui/Button";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { deleteLearningResource } from "./actions";

export default async function AdminLearningResourcesPage(
  props: PageProps<"/admin/learning-resources">,
) {
  await requireAdmin();
  const { error } = await props.searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from("learning_resources").select("*").order("title");
  const resources = (data ?? []) as LearningResource[];

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Link href="/admin" className="text-sm font-medium text-foreground/60 hover:text-foreground">
        ← Back to Admin Dashboard
      </Link>

      {error && (
        <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
          {error}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Learning Hub</h1>
        <Button href="/admin/learning-resources/new" size="sm">
          New resource
        </Button>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-foreground/10 p-4"
          >
            <div className="flex items-center gap-3">
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${accentBgClass[getLearningCategoryAccent(resource.category)]}`}
              />
              <div>
                <p className="font-medium">{resource.title}</p>
                <p className="text-xs text-foreground/50">
                  {resource.provider} · {resource.category}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button href={`/admin/learning-resources/${resource.id}/edit`} variant="outline" size="sm">
                Edit
              </Button>
              <AdminDeleteButton
                action={deleteLearningResource}
                id={resource.id}
                confirmMessage={`Delete "${resource.title}"? This can't be undone.`}
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
