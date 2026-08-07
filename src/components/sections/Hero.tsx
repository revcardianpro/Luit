import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="flex flex-col items-center gap-6 px-6 py-28 text-center sm:py-36">
      <span className="text-sm font-medium uppercase tracking-[0.2em] text-brand-blue">
        Luit — the Assamese name for the Brahmaputra
      </span>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
        The Digital Home of Assam
      </h1>
      <p className="max-w-xl text-lg text-foreground/70 sm:text-xl">
        LUIT blends modern opportunity with timeless culture — helping
        Assam&rsquo;s people embrace the future without losing their
        identity, and inviting the world to discover it.
      </p>
      <Button href="#pillars">Explore Assam</Button>
    </section>
  );
}
