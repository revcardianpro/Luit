/**
 * Copy here is adapted from LUIT's original project brief (mission +
 * "problems we're solving" — see the luit-master-brief project memory),
 * not invented for this section. Three value props map directly to the
 * brief's three named problems: opportunity gap, cultural preservation,
 * visibility.
 */
const values = [
  {
    title: "Opportunity",
    body: "Many young people in Assam lack easy visibility into modern opportunities — technology, jobs, startups, scholarships, and skills. LUIT puts them in one place.",
    accent: "brand-blue" as const,
  },
  {
    title: "Preservation",
    body: "Modernizing shouldn't mean losing what makes Assam Assam. Traditional music, dance, food, crafts, and heritage stay accessible to the generations who come next.",
    accent: "brand-green" as const,
  },
  {
    title: "Visibility",
    body: "Most of the world knows very little about Assam. LUIT is built to be the easiest place to actually discover it — its culture, people, and history.",
    accent: "brand-gold" as const,
  },
];

export function AboutSection() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-32">
      {/* Cultural detail, kept deliberately faint per spec — a flowing
          river-curve motif behind the copy, not a literal illustration. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 w-full text-primary/[0.04]"
      >
        <path
          d="M0 120 C 80 60, 160 180, 240 100 S 400 40, 400 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="40"
        />
      </svg>

      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          Why LUIT exists
        </h2>
        <p className="mt-4 text-lg text-foreground/70">
          LUIT is the digital home of Assam — a place where modern opportunity and
          timeless culture grow together instead of trading places. Built for the
          people of Assam first, and as a window into Assam for everyone else.
        </p>
      </div>

      <div className="relative mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-3">
        {values.map((value) => (
          <div
            key={value.title}
            className="flex flex-col gap-3 rounded-2xl border border-foreground/10 bg-background/60 p-7 backdrop-blur-sm"
          >
            <span
              className="h-2 w-10 rounded-full"
              style={{ backgroundColor: `var(--color-${value.accent})` }}
            />
            <h3 className="font-serif text-lg font-semibold">{value.title}</h3>
            <p className="text-sm text-foreground/70">{value.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
