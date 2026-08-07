import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Destination } from "@/lib/supabase/types";
import { getCategoryMeta } from "@/lib/destination-categories";
import { accentBgClass } from "@/lib/brand-accent";

export default async function DestinationPage(props: PageProps<"/explore/[slug]">) {
  const { slug } = await props.params;
  const supabase = await createClient();
  const { data } = await supabase.from("destinations").select("*").eq("slug", slug).single();
  const destination = data as Destination | null;

  if (!destination) {
    notFound();
  }

  const { label, accent } = getCategoryMeta(destination.category);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Link
        href="/explore"
        className="text-sm font-medium text-foreground/60 hover:text-foreground"
      >
        ← Back to Explore Assam
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <span className={`h-2 w-10 rounded-full ${accentBgClass[accent]}`} />
        <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">{label}</p>
      </div>

      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
        {destination.name}
      </h1>
      <p className="mt-1 text-sm text-foreground/60">{destination.district}</p>

      <p className="mt-8 text-lg leading-relaxed text-foreground/80">
        {destination.description}
      </p>
    </main>
  );
}
