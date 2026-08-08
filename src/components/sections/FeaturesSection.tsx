import Link from "next/link";

/** Every entry links to a real, already-built section of the site —
 * this is a map of what LUIT actually is today, not a features roadmap. */
const features = [
  {
    title: "Explore Assam",
    description: "Destinations worth discovering — from Kaziranga to Majuli.",
    href: "/explore",
  },
  {
    title: "Pride of Assam",
    description: "The people whose lives and work define Assam's story.",
    href: "/pride",
  },
  {
    title: "Marketplace",
    description: "Buy and sell directly with makers, artisans, and sellers across Assam.",
    href: "/marketplace",
  },
  {
    title: "Learning Hub",
    description: "Scholarships, courses, and skill programs, curated in one place.",
    href: "/learn",
  },
  {
    title: "Jobs & Opportunities",
    description: "Government recruitment, exams, and community-posted openings.",
    href: "/jobs",
  },
  {
    title: "Creator Community",
    description: "Photographers, musicians, writers, and artists sharing their work.",
    href: "/community",
  },
  {
    title: "Events",
    description: "Festivals and gatherings happening across Assam — curated and community-hosted.",
    href: "/events",
  },
  {
    title: "Search",
    description: "One search box across everything on LUIT.",
    href: "/search",
  },
];

export function FeaturesSection() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-lg">
          <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            One platform, all of Assam
          </h2>
          <p className="mt-2 text-foreground/60">
            Everything LUIT offers today — built section by section, each one real and
            already live.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="group flex flex-col gap-3 rounded-2xl border border-foreground/10 p-6 transition-all hover:border-primary/30 hover:bg-primary/[0.03] hover:shadow-lg hover:shadow-primary/5"
            >
              <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-primary to-secondary transition-all group-hover:w-12" />
              <h3 className="font-serif text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-foreground/60">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
