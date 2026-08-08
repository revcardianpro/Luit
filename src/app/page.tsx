import { HeroSection } from "@/components/sections/HeroSection";
import { PillarJourney } from "@/components/sections/PillarJourney";
import { AssamMapSection } from "@/components/sections/AssamMapSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { ClosingCta } from "@/components/sections/ClosingCta";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <PillarJourney />
      <AssamMapSection />
      <AboutSection />
      <FeaturesSection />
      <CommunitySection />
      <ClosingCta />
    </main>
  );
}
