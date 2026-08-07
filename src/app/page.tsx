import { Hero } from "@/components/sections/Hero";
import { Pillars } from "@/components/sections/Pillars";
import { ClosingCta } from "@/components/sections/ClosingCta";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Pillars />
      <ClosingCta />
    </main>
  );
}
