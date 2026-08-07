import { createClient } from "@/lib/supabase/server";
import type { LearningResource } from "@/lib/supabase/types";
import { ResourceCard } from "./ResourceCard";

export default async function LearnPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("learning_resources").select("*").order("title");
  const resources = (data ?? []) as LearningResource[];

  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-col items-center gap-4 px-6 py-20 text-center">
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Learning Hub
        </h1>
        <p className="max-w-xl text-lg text-foreground/70">
          Scholarships, skill development, and technology learning resources — real
          opportunities to grow, curated for Assam.
        </p>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </section>
    </main>
  );
}
