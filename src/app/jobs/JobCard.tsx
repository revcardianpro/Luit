import Link from "next/link";
import type { JobWithPoster } from "@/lib/supabase/types";
import { getJobTypeAccent } from "@/lib/job-types";
import { accentBgClass } from "@/lib/brand-accent";

export function JobCard({ job }: { job: JobWithPoster }) {
  const accent = getJobTypeAccent(job.job_type);

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="flex flex-col gap-3 rounded-2xl border border-foreground/10 p-8 transition-colors hover:border-foreground/20"
    >
      <span className={`h-2 w-10 rounded-full ${accentBgClass[accent]}`} />
      <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
        {job.job_type}
        {job.location ? ` · ${job.location}` : ""}
      </p>
      <h3 className="font-serif text-xl font-semibold">{job.title}</h3>
      <p className="text-sm font-medium text-foreground/70">{job.company}</p>
      {job.salary_range && <p className="text-sm text-primary">{job.salary_range}</p>}
    </Link>
  );
}
