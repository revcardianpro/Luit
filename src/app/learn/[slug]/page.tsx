import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { LearningResource } from "@/lib/supabase/types";
import { getLearningCategoryAccent } from "@/lib/learning-categories";
import { accentBgClass } from "@/lib/brand-accent";
import { Button } from "@/components/ui/Button";

export default async function ResourcePage(props: PageProps<"/learn/[slug]">) {
  const { slug } = await props.params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("learning_resources")
    .select("*")
    .eq("slug", slug)
    .single();
  const resource = data as LearningResource | null;

  if (!resource) {
    notFound();
  }

  const accent = getLearningCategoryAccent(resource.category);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Link href="/learn" className="text-sm font-medium text-foreground/60 hover:text-foreground">
        ← Back to Learning Hub
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <span className={`h-2 w-10 rounded-full ${accentBgClass[accent]}`} />
        <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
          {resource.category} · {resource.provider}
        </p>
      </div>

      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
        {resource.title}
      </h1>

      <p className="mt-8 text-lg leading-relaxed text-foreground/80">{resource.description}</p>

      <div className="mt-8">
        <Button href={resource.url} external>
          Visit {resource.provider} ↗
        </Button>
      </div>
      <p className="mt-3 text-xs text-foreground/50">
        Opens the official {resource.provider} site — deadlines, eligibility, and details
        change over time, so always check there for what&rsquo;s currently available.
      </p>
    </main>
  );
}
