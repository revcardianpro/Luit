"use server";

import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { reportableContentTypes, type ReportableContentType } from "@/lib/moderation";

/**
 * Called directly as an async function from ReportButton (a client
 * component), not via a <form action={...}> submission -- unlike
 * every other mutation in this codebase, which redirects back to a
 * page with a `?error=` query param on failure. That pattern fits a
 * dedicated form page; it doesn't fit a small report modal overlaid
 * on a page the user wants to keep reading. Returning a plain result
 * object lets the button show inline success/error state instead of
 * navigating away.
 */
export async function submitReport(input: {
  contentType: ReportableContentType;
  contentId: string;
  reason: string;
}): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Sign in to report content." };
  }

  const reason = input.reason.trim();
  if (!reportableContentTypes.includes(input.contentType) || !input.contentId || !reason) {
    return { error: "Please provide a reason." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    content_type: input.contentType,
    content_id: input.contentId,
    reason,
  });

  if (error) {
    return { error: error.message };
  }

  return {};
}

/** Admin-only: dismiss a report without touching the reported content. */
export async function dismissReport(formData: FormData) {
  const admin = await requireAdmin();
  const reportId = formData.get("report_id") as string;

  const supabase = await createClient();
  await supabase
    .from("reports")
    .update({ status: "dismissed", resolved_at: new Date().toISOString(), resolved_by: admin.id })
    .eq("id", reportId);

  redirect("/admin/reports");
}

/**
 * Admin-only: delete the reported row from its own table (relying on
 * the admin-override delete policies from migration 0014) and mark
 * the report resolved. content_type is trusted from the form's own
 * hidden field rather than re-validated against reportableContentTypes
 * here, since it's set by the moderation queue page itself, not user
 * input -- the same trust level as any other admin form on this site.
 */
export async function removeReportedContent(formData: FormData) {
  const admin = await requireAdmin();
  const reportId = formData.get("report_id") as string;
  const contentType = formData.get("content_type") as ReportableContentType;
  const contentId = formData.get("content_id") as string;

  const supabase = await createClient();

  const table =
    contentType === "creator_post"
      ? "creator_posts"
      : contentType === "creator_post_comment"
        ? "creator_post_comments"
        : contentType === "product"
          ? "products"
          : contentType === "job"
            ? "jobs"
            : "events";

  await supabase.from(table).delete().eq("id", contentId);

  await supabase
    .from("reports")
    .update({ status: "resolved", resolved_at: new Date().toISOString(), resolved_by: admin.id })
    .eq("id", reportId);

  redirect("/admin/reports");
}
