import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import type { GovernmentOpportunity } from "@/lib/supabase/types";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { listingTypes } from "@/lib/government-opportunity-types";
import { updateGovernmentOpportunity } from "./actions";

export default async function EditGovernmentOpportunityPage(
  props: PageProps<"/admin/government-opportunities/[id]/edit">,
) {
  await requireAdmin();
  const { id } = await props.params;
  const { error } = await props.searchParams;

  const supabase = await createClient();
  const { data } = await supabase.from("government_opportunities").select("*").eq("id", id).single();
  const opportunity = data as GovernmentOpportunity | null;

  if (!opportunity) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">
        Edit government opportunity
      </h1>

      {error && (
        <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
          {error}
        </p>
      )}

      <form action={updateGovernmentOpportunity} className="mt-8 flex flex-col gap-4">
        <input type="hidden" name="id" value={opportunity.id} />
        <Input label="Title" name="title" required defaultValue={opportunity.title} />
        <Input label="Organization" name="organization" required defaultValue={opportunity.organization} />

        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="listing_type" className="text-sm font-medium text-foreground/80">
            Listing type
          </label>
          <select
            id="listing_type"
            name="listing_type"
            required
            defaultValue={opportunity.listing_type}
            className="rounded-lg border border-foreground/15 bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          >
            {listingTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <Textarea label="Key dates" name="key_dates" rows={2} required defaultValue={opportunity.key_dates} />
        <Textarea
          label="Description"
          name="description"
          rows={4}
          required
          defaultValue={opportunity.description}
        />
        <Input
          label="Source URL"
          name="source_url"
          type="url"
          required
          defaultValue={opportunity.source_url}
        />
        <Input
          label="Info verified on"
          name="info_verified_on"
          type="date"
          required
          defaultValue={opportunity.info_verified_on}
        />

        <Button type="submit">Save changes</Button>
      </form>
    </main>
  );
}
