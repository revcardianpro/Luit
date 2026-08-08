import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

const SECTIONS = [
  {
    href: "/admin/destinations",
    label: "Explore Assam",
    table: "destinations" as const,
    description: "Destinations worth discovering in Assam.",
  },
  {
    href: "/admin/notable-people",
    label: "Pride of Assam",
    table: "notable_people" as const,
    description: "Notable people from Assam's history and present.",
  },
  {
    href: "/admin/learning-resources",
    label: "Learning Hub",
    table: "learning_resources" as const,
    description: "Curated scholarships, courses, and skill programs.",
  },
  {
    href: "/admin/government-opportunities",
    label: "Government Opportunities",
    table: "government_opportunities" as const,
    description: "Government job/exam listings shown on the Jobs page.",
  },
];

export default async function AdminPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [counts, { count: pendingReports }] = await Promise.all([
    Promise.all(SECTIONS.map((section) => supabase.from(section.table).select("*", { count: "exact", head: true }))),
    supabase.from("reports").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
        Admin Dashboard
      </h1>
      <p className="mt-2 text-foreground/60">
        Manage LUIT&rsquo;s curated content — everything here was previously editable only
        via a database migration.
      </p>

      <Link
        href="/admin/reports"
        className="mt-8 flex items-center justify-between rounded-2xl border border-foreground/10 bg-brand-red/5 p-6 transition-colors hover:border-brand-red/30"
      >
        <div>
          <h2 className="font-serif text-lg font-semibold">Moderation Queue</h2>
          <p className="text-sm text-foreground/60">Reports on user-generated content.</p>
        </div>
        <span className="rounded-full bg-brand-red px-3 py-1 text-sm font-semibold text-white">
          {pendingReports ?? 0} pending
        </span>
      </Link>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((section, i) => (
          <Link
            key={section.href}
            href={section.href}
            className="flex flex-col gap-1 rounded-2xl border border-foreground/10 p-6 transition-colors hover:border-foreground/20"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
              {counts[i].count ?? 0} entries
            </p>
            <h2 className="font-serif text-lg font-semibold">{section.label}</h2>
            <p className="text-sm text-foreground/60">{section.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
