import { Hero } from "@/components/sections/Hero";
import { PillarJourney } from "@/components/sections/PillarJourney";
import { AboutSection } from "@/components/sections/AboutSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { ClosingCta } from "@/components/sections/ClosingCta";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <PillarJourney />
      <AboutSection />
      <FeaturesSection />
      <CommunitySection />
      <ClosingCta />
    </main>
  );
}
