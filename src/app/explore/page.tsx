import { createClient } from "@/lib/supabase/server";
import type { Destination } from "@/lib/supabase/types";
import { DestinationCard } from "./DestinationCard";

export default async function ExplorePage() {
  const supabase = await createClient();
  const { data } = await supabase.from("destinations").select("*").order("name");
  const destinations = (data ?? []) as Destination[];

  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-col items-center gap-4 px-6 py-20 text-center">
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Explore Assam
        </h1>
        <p className="max-w-xl text-lg text-foreground/70">
          Places worth discovering across the state — from ancient temples to national parks.
        </p>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      </section>
    </main>
  );
}
