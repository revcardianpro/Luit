import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { jobTypes } from "@/lib/job-types";
import { createJob } from "./actions";

export default async function NewJobPage(props: PageProps<"/jobs/new">) {
  const { error } = await props.searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">Post a job</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Share an opening with the LUIT community.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
          {error}
        </p>
      )}

      <form action={createJob} className="mt-8 flex flex-col gap-4">
        <Input label="Job title" name="title" required placeholder="e.g. Frontend Developer" />
        <Input label="Company / Organization" name="company" required />
        <Textarea
          label="Description"
          name="description"
          rows={5}
          required
          placeholder="Responsibilities, requirements, what makes this role a good fit..."
        />

        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="job_type" className="text-sm font-medium text-foreground/80">
            Job type
          </label>
          <select
            id="job_type"
            name="job_type"
            required
            defaultValue=""
            className="rounded-lg border border-foreground/15 bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="" disabled>
              Select a job type
            </option>
            {jobTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <Input label="Location (optional)" name="location" placeholder="e.g. Guwahati, or Remote" />
        <Input label="Salary range (optional)" name="salary_range" placeholder="e.g. ₹25,000–35,000/month" />

        <Input label="Apply URL (optional)" name="apply_url" type="url" placeholder="https://..." />
        <Input label="Apply email (optional)" name="apply_email" type="email" />
        <p className="text-xs text-foreground/50">
          Provide at least one way for applicants to reach you.
        </p>

        <Input label="Listing closes on (optional)" name="expires_at" type="date" />

        <Button type="submit">Post job</Button>
      </form>
    </main>
  );
}
