import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { NotablePerson } from "@/lib/supabase/types";
import { getFieldAccent } from "@/lib/pride-fields";
import { accentBgClass } from "@/lib/brand-accent";

export default async function PersonPage(props: PageProps<"/pride/[slug]">) {
  const { slug } = await props.params;
  const supabase = await createClient();
  const { data } = await supabase.from("notable_people").select("*").eq("slug", slug).single();
  const person = data as NotablePerson | null;

  if (!person) {
    notFound();
  }

  const accent = getFieldAccent(person.field);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Link
        href="/pride"
        className="text-sm font-medium text-foreground/60 hover:text-foreground"
      >
        ← Back to Pride of Assam
      </Link>

      <div className="mt-8 flex flex-col gap-8 sm:flex-row">
        <div className="relative aspect-[3/4] w-full max-w-[240px] shrink-0 overflow-hidden rounded-2xl bg-foreground/5">
          <Image
            src={person.photo_path}
            alt={`Portrait of ${person.name}`}
            fill
            sizes="240px"
            className="object-cover"
          />
        </div>

        <div>
          <div className="flex items-center gap-3">
            <span className={`h-2 w-10 rounded-full ${accentBgClass[accent]}`} />
            <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
              {person.field} · {person.lifespan}
            </p>
          </div>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            {person.name}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-foreground/80">{person.description}</p>
        </div>
      </div>

      {/* Legally required by the photo's license (CC BY-SA / GODL-India) --
          not optional decoration. */}
      <p className="mt-10 text-xs text-foreground/40">
        Photo credit: {person.photo_credit}
        {person.photo_license_url ? (
          <>
            {" · "}
            <a
              href={person.photo_license_url}
              className="underline hover:text-foreground/60"
              target="_blank"
              rel="noopener noreferrer"
            >
              {person.photo_license}
            </a>
          </>
        ) : (
          <> · {person.photo_license}</>
        )}
      </p>
    </main>
  );
}
