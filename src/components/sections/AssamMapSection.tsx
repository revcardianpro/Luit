import { createClient } from "@/lib/supabase/server";
import type { Destination } from "@/lib/supabase/types";
import { assamMapRegions, matchRegion } from "@/lib/assam-map-regions";
import { AssamMap } from "./AssamMap";

/**
 * Server Component wrapper: fetches the real `destinations` table
 * (same public-read query as /explore) and groups rows by region via
 * matchRegion(), so AssamMap itself only ever deals with already-
 * grouped data. Reuses live content rather than authoring anything
 * new -- grows automatically as admins add destinations via
 * /admin/destinations.
 */
export async function AssamMapSection() {
  const supabase = await createClient();
  const { data } = await supabase.from("destinations").select("*").order("name");
  const destinations = (data ?? []) as Destination[];

  const groups = assamMapRegions
    .map((region) => ({
      region,
      destinations: destinations.filter((d) => matchRegion(d.district)?.id === region.id),
    }))
    .filter((group) => group.destinations.length > 0);

  if (groups.length === 0) {
    return null;
  }

  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 max-w-lg">
          <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Discover Assam, area by area
          </h2>
          <p className="mt-2 text-foreground/60">
            Click a highlighted area on the map to see what makes it worth visiting.
          </p>
        </div>

        <AssamMap groups={groups} />
      </div>
    </section>
  );
}
