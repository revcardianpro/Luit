import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import type { ReportWithReporter } from "@/lib/supabase/types";
import { contentTypeLabels, type ReportableContentType } from "@/lib/moderation";
import { lookupReportedContent } from "@/lib/admin-content-lookup";
import { Button } from "@/components/ui/Button";
import { dismissReport, removeReportedContent } from "@/lib/moderation-actions";

export default async function AdminReportsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    // Explicit FK hint required: reports has two paths to profiles
    // (reporter_id and resolved_by), so a plain "profiles(...)" embed
    // is ambiguous and PostgREST rejects the whole query with
    // PGRST201 -- the same failure mode already hit (and fixed the
    // same way) on creator_posts in Phase 12.
    .select("*, profiles!reports_reporter_id_fkey(full_name, avatar_url)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("admin/reports: failed to load queue", error.message);
  }

  const reports = (data ?? []) as ReportWithReporter[];

  // One extra query per report to resolve a title/link to show -- the
  // queue is expected to stay small (moderation happens as reports
  // come in, not in bulk), so this isn't worth batching.
  const reportsWithContent = await Promise.all(
    reports.map(async (report) => ({
      report,
      content: await lookupReportedContent(report.content_type as ReportableContentType, report.content_id),
    })),
  );

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Link href="/admin" className="text-sm font-medium text-foreground/60 hover:text-foreground">
        ← Back to Admin Dashboard
      </Link>

      <h1 className="mt-4 font-serif text-2xl font-semibold tracking-tight">Moderation Queue</h1>
      <p className="mt-1 text-sm text-foreground/60">
        {reports.length} pending report{reports.length === 1 ? "" : "s"}.
      </p>

      {reportsWithContent.length === 0 ? (
        <p className="mt-10 text-foreground/60">Nothing pending — the queue is clear.</p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {reportsWithContent.map(({ report, content }) => (
            <div key={report.id} className="rounded-2xl border border-foreground/10 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
                    {contentTypeLabels[report.content_type as ReportableContentType]}
                  </p>
                  {content.exists ? (
                    <Link
                      href={content.href}
                      target="_blank"
                      className="font-serif text-lg font-semibold hover:underline"
                    >
                      {content.title}
                    </Link>
                  ) : (
                    <p className="font-serif text-lg font-semibold text-foreground/40">
                      {content.title}
                    </p>
                  )}
                </div>
                <p className="shrink-0 text-xs text-foreground/40">
                  {new Date(report.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>

              <div className="mt-3 rounded-lg bg-foreground/5 p-3">
                <p className="text-xs font-medium text-foreground/50">
                  Reported by {report.profiles?.full_name || "a LUIT member"}
                </p>
                <p className="mt-1 text-sm text-foreground/80">{report.reason}</p>
              </div>

              <div className="mt-4 flex gap-2">
                {content.exists && (
                  <form action={removeReportedContent}>
                    <input type="hidden" name="report_id" value={report.id} />
                    <input type="hidden" name="content_type" value={report.content_type} />
                    <input type="hidden" name="content_id" value={report.content_id} />
                    <Button type="submit" variant="outline" size="sm">
                      Remove content
                    </Button>
                  </form>
                )}
                <form action={dismissReport}>
                  <input type="hidden" name="report_id" value={report.id} />
                  <Button type="submit" variant="outline" size="sm">
                    Dismiss report
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
