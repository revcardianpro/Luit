import { createClient } from "@/lib/supabase/server";
import type { JobWithPoster } from "@/lib/supabase/types";
import { Button } from "@/components/ui/Button";
import { JobCard } from "./JobCard";

export default async function JobsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("jobs")
    .select("*, profiles(full_name, avatar_url)")
    .order("created_at", { ascending: false });
  const jobs = (data ?? []) as JobWithPoster[];

  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-col items-center gap-4 px-6 py-20 text-center">
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Jobs & Opportunities
        </h1>
        <p className="max-w-xl text-lg text-foreground/70">
          Full-time roles, internships, and gigs — posted by employers and organizations
          in and around Assam.
        </p>
        <Button href="/jobs/new">Post a Job</Button>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-24">
        {jobs.length === 0 ? (
          <p className="text-center text-foreground/60">
            No listings yet — be the first to post an opportunity.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
