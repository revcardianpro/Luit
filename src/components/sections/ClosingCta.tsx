import { Button } from "@/components/ui/Button";

export function ClosingCta() {
  return (
    <section className="flex flex-col items-center gap-6 px-6 py-24 text-center">
      <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
        Be part of Assam&rsquo;s digital future.
      </h2>
      <Button href="/explore">Explore Assam</Button>
    </section>
  );
}
