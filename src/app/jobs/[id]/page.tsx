import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import type { JobWithPoster } from "@/lib/supabase/types";
import { getJobTypeAccent } from "@/lib/job-types";
import { accentBgClass } from "@/lib/brand-accent";
import { Button } from "@/components/ui/Button";
import { ReportButton } from "@/components/moderation/ReportButton";
import { DeleteJobButton } from "./DeleteJobButton";

export default async function JobPage(props: PageProps<"/jobs/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();
  const [{ data }, user] = await Promise.all([
    supabase.from("jobs").select("*, profiles(full_name, avatar_url)").eq("id", id).single(),
    getCurrentUser(),
  ]);
  const job = data as JobWithPoster | null;

  if (!job) {
    notFound();
  }

  const accent = getJobTypeAccent(job.job_type);
  const isOwner = user?.id === job.poster_id;
  const isExpired = job.expires_at ? new Date(job.expires_at) < new Date() : false;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Link href="/jobs" className="text-sm font-medium text-foreground/60 hover:text-foreground">
        ← Back to Jobs & Opportunities
      </Link>

      {isExpired && (
        <p className="mt-6 rounded-lg bg-foreground/5 px-3.5 py-2.5 text-sm text-foreground/60">
          This listing has closed. {isOwner && "Only you can see it now — visitors can't."}
        </p>
      )}

      <div className="mt-6 flex items-center gap-3">
        <span className={`h-2 w-10 rounded-full ${accentBgClass[accent]}`} />
        <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
          {job.job_type}
          {job.location ? ` · ${job.location}` : ""}
        </p>
      </div>

      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
        {job.title}
      </h1>
      <p className="mt-1 text-lg text-foreground/70">{job.company}</p>
      {job.salary_range && <p className="mt-1 text-primary">{job.salary_range}</p>}

      <p className="mt-8 whitespace-pre-line text-foreground/80">{job.description}</p>

      <div className="mt-8 rounded-2xl border border-foreground/10 p-6">
        <p className="text-sm font-medium text-foreground/80">How to apply</p>
        <div className="mt-3 flex flex-col gap-2 text-sm">
          {job.apply_url && (
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {job.apply_url} ↗
            </a>
          )}
          {job.apply_email && (
            <a href={`mailto:${job.apply_email}`} className="text-primary hover:underline">
              {job.apply_email}
            </a>
          )}
        </div>
      </div>

      {isOwner ? (
        <div className="mt-6 flex gap-3">
          <Button href={`/jobs/${job.id}/edit`} variant="outline" size="sm">
            Edit listing
          </Button>
          <DeleteJobButton jobId={job.id} />
        </div>
      ) : (
        user && (
          <div className="mt-6">
            <ReportButton contentType="job" contentId={job.id} />
          </div>
        )
      )}
    </main>
  );
}
