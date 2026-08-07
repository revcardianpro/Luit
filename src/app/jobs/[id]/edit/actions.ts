"use server";

import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";
import { jobTypes, type JobType } from "@/lib/job-types";

export async function updateJob(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const id = formData.get("id") as string;
  const editPath = `/jobs/${id}/edit`;

  const title = formData.get("title") as string;
  const company = formData.get("company") as string;
  const description = formData.get("description") as string;
  const jobType = formData.get("job_type") as string;
  const location = (formData.get("location") as string) || null;
  const salaryRange = (formData.get("salary_range") as string) || null;
  const applyUrl = (formData.get("apply_url") as string) || null;
  const applyEmail = (formData.get("apply_email") as string) || null;
  const expiresAt = (formData.get("expires_at") as string) || null;

  if (!title || !company || !description || !jobType) {
    redirectWithError(editPath, "Please fill in all required fields.");
  }

  if (!jobTypes.includes(jobType as JobType)) {
    redirectWithError(editPath, "Invalid job type.");
  }

  if (!applyUrl && !applyEmail) {
    redirectWithError(editPath, "Provide at least one way to apply (URL or email).");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("jobs")
    .update({
      title,
      company,
      description,
      job_type: jobType,
      location,
      salary_range: salaryRange,
      apply_url: applyUrl,
      apply_email: applyEmail,
      expires_at: expiresAt,
    })
    .eq("id", id)
    .eq("poster_id", user.id);

  if (error) {
    redirectWithError(editPath, error.message);
  }

  redirect(`/jobs/${id}`);
}
