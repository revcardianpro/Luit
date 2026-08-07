import Link from "next/link";
import type { Destination } from "@/lib/supabase/types";
import { getCategoryMeta } from "@/lib/destination-categories";
import { accentBgClass } from "@/lib/brand-accent";

export function DestinationCard({ destination }: { destination: Destination }) {
  const { label, accent } = getCategoryMeta(destination.category);

  return (
    <Link
      href={`/explore/${destination.slug}`}
      className="flex flex-col gap-4 rounded-2xl border border-foreground/10 p-8 transition-colors hover:border-foreground/20"
    >
      <span className={`h-2 w-10 rounded-full ${accentBgClass[accent]}`} />
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">{label}</p>
        <h3 className="mt-1 font-serif text-xl font-semibold">{destination.name}</h3>
      </div>
      <p className="text-foreground/70">{destination.short_description}</p>
    </Link>
  );
}
