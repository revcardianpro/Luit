import { createClient } from "@/lib/supabase/server";
import type { JobWithPoster, GovernmentOpportunity } from "@/lib/supabase/types";
import { Button } from "@/components/ui/Button";
import { JobCard } from "./JobCard";
import { GovernmentOpportunityCard } from "./GovernmentOpportunityCard";

export default async function JobsPage() {
  const supabase = await createClient();
  const [{ data: govData }, { data: jobsData }] = await Promise.all([
    supabase
      .from("government_opportunities")
      .select("*")
      .order("info_verified_on", { ascending: false }),
    supabase
      .from("jobs")
      .select("*, profiles(full_name, avatar_url)")
      .order("created_at", { ascending: false }),
  ]);
  const opportunities = (govData ?? []) as GovernmentOpportunity[];
  const jobs = (jobsData ?? []) as JobWithPoster[];

  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-col items-center gap-4 px-6 py-20 text-center">
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Jobs & Opportunities
        </h1>
        <p className="max-w-xl text-lg text-foreground/70">
          Government recruitment, competitive exams, and community-posted openings — all
          in one place.
        </p>
        <Button href="/jobs/new">Post a Job</Button>
      </section>

      {opportunities.length > 0 && (
        <section className="mx-auto w-full max-w-5xl px-6 pb-16">
          <h2 className="font-serif text-2xl font-semibold tracking-tight">
            Government & Competitive Exams
          </h2>
          <p className="mt-1 text-sm text-foreground/60">
            Curated by LUIT. Application windows and exam dates change — always confirm
            with the official source before applying.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opportunity) => (
              <GovernmentOpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto w-full max-w-5xl px-6 pb-24">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          Community Job Listings
        </h2>
        <p className="mt-1 text-sm text-foreground/60">
          Posted by employers and organizations in the LUIT community.
        </p>
        {jobs.length === 0 ? (
          <p className="mt-6 text-foreground/60">
            No listings yet — be the first to post an opportunity.
          </p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
