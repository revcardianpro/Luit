import { accentBgClass, type BrandAccent } from "@/lib/brand-accent";

interface Pillar {
  title: string;
  description: string;
  accent: BrandAccent;
}

// The four pillars from the LUIT brief, each paired with the brand color
// that fits it best thematically (see globals.css for what each color
// represents): Culture -> the Gamosa (red), People -> Muga silk artisans
// (gold), Opportunities -> the river, always moving forward (blue),
// Future -> forests and growth (green).
const pillars: Pillar[] = [
  {
    title: "Culture",
    description:
      "Preserve and celebrate Assamese music, dance, food, crafts, and heritage for generations to come.",
    accent: "brand-red",
  },
  {
    title: "People",
    description:
      "Spotlight the artisans, creators, and communities who make Assam what it is.",
    accent: "brand-gold",
  },
  {
    title: "Opportunities",
    description:
      "Open doors to education, skills, jobs, and entrepreneurship for the next generation.",
    accent: "brand-blue",
  },
  {
    title: "Future",
    description:
      "Build a platform that grows with Assam — and, one day, all of Northeast India.",
    accent: "brand-green",
  },
];

function PillarCard({ title, description, accent }: Pillar) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-foreground/10 p-8">
      <span className={`h-2 w-10 rounded-full ${accentBgClass[accent]}`} />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-foreground/70">{description}</p>
    </div>
  );
}

export function Pillars() {
  return (
    <section id="pillars" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
      <div className="grid gap-6 sm:grid-cols-2">
        {pillars.map((pillar) => (
          <PillarCard key={pillar.title} {...pillar} />
        ))}
      </div>
    </section>
  );
}
