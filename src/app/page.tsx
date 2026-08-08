import { HeroPillarsSection } from "@/components/sections/HeroPillarsSection";
import { AssamMapSection } from "@/components/sections/AssamMapSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { ClosingCta } from "@/components/sections/ClosingCta";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroPillarsSection />
      <AssamMapSection />
      <AboutSection />
      <FeaturesSection />
      <CommunitySection />
      <ClosingCta />
    </main>
  );
}
