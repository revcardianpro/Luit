import { Hero } from "@/components/sections/Hero";
import { PillarJourney } from "@/components/sections/PillarJourney";
import { AssamMapSection } from "@/components/sections/AssamMapSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { StoryVideoSection } from "@/components/sections/StoryVideoSection";
import { ClosingCta } from "@/components/sections/ClosingCta";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <PillarJourney />
      <AssamMapSection />
      <AboutSection />
      <FeaturesSection />
      <CommunitySection />
      <StoryVideoSection />
      <ClosingCta />
    </main>
  );
}
