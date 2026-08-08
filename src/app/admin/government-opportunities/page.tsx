import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import type { GovernmentOpportunity } from "@/lib/supabase/types";
import { Button } from "@/components/ui/Button";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { deleteGovernmentOpportunity } from "./actions";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminGovernmentOpportunitiesPage(
  props: PageProps<"/admin/government-opportunities">,
) {
  await requireAdmin();
  const { error } = await props.searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("government_opportunities")
    .select("*")
    .order("info_verified_on", { ascending: false });
  const opportunities = (data ?? []) as GovernmentOpportunity[];

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Link href="/admin" className="text-sm font-medium text-foreground/60 hover:text-foreground">
        ← Back to Admin Dashboard
      </Link>

      {error && (
        <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
          {error}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">
          Government Opportunities
        </h1>
        <Button href="/admin/government-opportunities/new" size="sm">
          New listing
        </Button>
      </div>
      <p className="mt-1 text-sm text-foreground/60">
        These are genuinely time-sensitive — re-verify dates against the official source
        periodically.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {opportunities.map((opportunity) => (
          <div
            key={opportunity.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-foreground/10 p-4"
          >
            <div>
              <p className="font-medium">{opportunity.title}</p>
              <p className="text-xs text-foreground/50">
                {opportunity.organization} · {opportunity.listing_type} · verified{" "}
                {formatDate(opportunity.info_verified_on)}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                href={`/admin/government-opportunities/${opportunity.id}/edit`}
                variant="outline"
                size="sm"
              >
                Edit
              </Button>
              <AdminDeleteButton
                action={deleteGovernmentOpportunity}
                id={opportunity.id}
                confirmMessage={`Delete "${opportunity.title}"? This can't be undone.`}
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
