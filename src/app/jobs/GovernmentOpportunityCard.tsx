import type { GovernmentOpportunity } from "@/lib/supabase/types";
import { accentBgClass } from "@/lib/brand-accent";

const typeAccent = {
  "Job Recruitment": "brand-blue",
  "Competitive Exam": "brand-gold",
} as const;

function formatVerifiedDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function GovernmentOpportunityCard({
  opportunity,
}: {
  opportunity: GovernmentOpportunity;
}) {
  const accent = typeAccent[opportunity.listing_type as keyof typeof typeAccent] ?? "brand-blue";

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-foreground/10 p-8">
      <span className={`h-2 w-10 rounded-full ${accentBgClass[accent]}`} />
      <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
        {opportunity.listing_type} · {opportunity.organization}
      </p>
      <h3 className="font-serif text-xl font-semibold">{opportunity.title}</h3>
      <p className="text-sm text-foreground/70">{opportunity.key_dates}</p>
      <p className="text-sm text-foreground/70">{opportunity.description}</p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-foreground/10 pt-3">
        <p className="text-xs text-foreground/40">
          As of {formatVerifiedDate(opportunity.info_verified_on)} — verify current status
          before relying on these dates.
        </p>
        <a
          href={opportunity.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-primary hover:underline"
        >
          Official source ↗
        </a>
      </div>
    </div>
  );
}
