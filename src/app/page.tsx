import { Hero } from "@/components/sections/Hero";
import { Pillars } from "@/components/sections/Pillars";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Marquee } from "@/components/ui/Marquee";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Marquee items={["Culture", "People", "Opportunities", "Future"]} />
      <Pillars />
      <ClosingCta />
    </main>
  );
}
