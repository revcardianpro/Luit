import { redirect, notFound } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import type { Job } from "@/lib/supabase/types";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { jobTypes } from "@/lib/job-types";
import { updateJob } from "./actions";

export default async function EditJobPage(props: PageProps<"/jobs/[id]/edit">) {
  const { id } = await props.params;
  const { error } = await props.searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data } = await supabase.from("jobs").select("*").eq("id", id).single();
  const job = data as Job | null;

  if (!job) {
    notFound();
  }

  if (job.poster_id !== user.id) {
    redirect(`/jobs/${id}`);
  }

  // Date input wants "YYYY-MM-DD" -- the DB value is a full ISO
  // timestamp, so just take its date portion.
  const expiresAtValue = job.expires_at ? job.expires_at.slice(0, 10) : "";

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">Edit listing</h1>

      {error && (
        <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
          {error}
        </p>
      )}

      <form action={updateJob} className="mt-8 flex flex-col gap-4">
        <input type="hidden" name="id" value={job.id} />
        <Input label="Job title" name="title" required defaultValue={job.title} />
        <Input label="Company / Organization" name="company" required defaultValue={job.company} />
        <Textarea
          label="Description"
          name="description"
          rows={5}
          required
          defaultValue={job.description}
        />

        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="job_type" className="text-sm font-medium text-foreground/80">
            Job type
          </label>
          <select
            id="job_type"
            name="job_type"
            required
            defaultValue={job.job_type}
            className="rounded-lg border border-foreground/15 bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          >
            {jobTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <Input label="Location (optional)" name="location" defaultValue={job.location ?? ""} />
        <Input
          label="Salary range (optional)"
          name="salary_range"
          defaultValue={job.salary_range ?? ""}
        />

        <Input
          label="Apply URL (optional)"
          name="apply_url"
          type="url"
          defaultValue={job.apply_url ?? ""}
        />
        <Input
          label="Apply email (optional)"
          name="apply_email"
          type="email"
          defaultValue={job.apply_email ?? ""}
        />

        <Input
          label="Listing closes on (optional)"
          name="expires_at"
          type="date"
          defaultValue={expiresAtValue}
        />

        <Button type="submit">Save changes</Button>
      </form>
    </main>
  );
}
