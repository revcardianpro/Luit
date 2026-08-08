import { requireAdmin } from "@/lib/admin";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { listingTypes } from "@/lib/government-opportunity-types";
import { createGovernmentOpportunity } from "./actions";

export default async function NewGovernmentOpportunityPage(
  props: PageProps<"/admin/government-opportunities/new">,
) {
  await requireAdmin();
  const { error } = await props.searchParams;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">
        New government opportunity
      </h1>

      {error && (
        <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
          {error}
        </p>
      )}

      <form action={createGovernmentOpportunity} className="mt-8 flex flex-col gap-4">
        <Input
          label="Title"
          name="title"
          required
          placeholder="e.g. Combined Competitive Examination (CCE) 2026"
        />
        <Input
          label="Organization"
          name="organization"
          required
          placeholder="e.g. Assam Public Service Commission (APSC)"
        />

        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="listing_type" className="text-sm font-medium text-foreground/80">
            Listing type
          </label>
          <select
            id="listing_type"
            name="listing_type"
            required
            defaultValue=""
            className="rounded-lg border border-foreground/15 bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="" disabled>
              Select a type
            </option>
            {listingTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <Textarea
          label="Key dates"
          name="key_dates"
          rows={2}
          required
          placeholder="e.g. Application window: August 4–24, 2026"
        />
        <Textarea
          label="Description"
          name="description"
          rows={4}
          required
          placeholder="What this recruitment/exam is for"
        />
        <Input label="Source URL" name="source_url" type="url" required placeholder="https://..." />
        <Input
          label="Info verified on"
          name="info_verified_on"
          type="date"
          required
          defaultValue={today}
        />

        <Button type="submit">Create listing</Button>
      </form>
    </main>
  );
}
