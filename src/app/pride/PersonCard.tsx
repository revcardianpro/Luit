import Link from "next/link";
import Image from "next/image";
import type { NotablePerson } from "@/lib/supabase/types";
import { getFieldAccent } from "@/lib/pride-fields";
import { accentBgClass } from "@/lib/brand-accent";

export function PersonCard({ person }: { person: NotablePerson }) {
  const accent = getFieldAccent(person.field);

  return (
    <Link
      href={`/pride/${person.slug}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-foreground/10 transition-colors hover:border-foreground/20"
    >
      <div className="relative aspect-[3/4] w-full bg-foreground/5">
        <Image
          src={person.photo_path}
          alt={`Portrait of ${person.name}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 p-6">
        <span className={`h-2 w-10 rounded-full ${accentBgClass[accent]}`} />
        <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
          {person.field} · {person.lifespan}
        </p>
        <h3 className="font-serif text-xl font-semibold">{person.name}</h3>
        <p className="text-foreground/70">{person.short_description}</p>
      </div>
    </Link>
  );
}
