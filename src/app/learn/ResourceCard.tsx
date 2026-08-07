import Link from "next/link";
import type { LearningResource } from "@/lib/supabase/types";
import { getLearningCategoryAccent } from "@/lib/learning-categories";
import { accentBgClass } from "@/lib/brand-accent";

export function ResourceCard({ resource }: { resource: LearningResource }) {
  const accent = getLearningCategoryAccent(resource.category);

  return (
    <Link
      href={`/learn/${resource.slug}`}
      className="flex flex-col gap-4 rounded-2xl border border-foreground/10 p-8 transition-colors hover:border-foreground/20"
    >
      <span className={`h-2 w-10 rounded-full ${accentBgClass[accent]}`} />
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
          {resource.category} · {resource.provider}
        </p>
        <h3 className="mt-1 font-serif text-xl font-semibold">{resource.title}</h3>
      </div>
      <p className="text-foreground/70">{resource.short_description}</p>
    </Link>
  );
}
