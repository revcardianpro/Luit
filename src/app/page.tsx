import { Hero } from "@/components/sections/Hero";
import { PillarJourney } from "@/components/sections/PillarJourney";
import { ClosingCta } from "@/components/sections/ClosingCta";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <PillarJourney />
      <ClosingCta />
    </main>
  );
}
