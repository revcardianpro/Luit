import { createClient } from "@/lib/supabase/server";
import type { ProductWithSeller } from "@/lib/supabase/types";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "./ProductCard";

export default async function MarketplacePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, profiles(full_name, avatar_url)")
    .order("created_at", { ascending: false });
  const products = (data ?? []) as ProductWithSeller[];

  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-col items-center gap-4 px-6 py-20 text-center">
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Marketplace
        </h1>
        <p className="max-w-xl text-lg text-foreground/70">
          Authentic products from Assamese sellers and artisans — silk, tea, handicrafts,
          and more.
        </p>
        <Button href="/marketplace/new">List a Product</Button>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-24">
        {products.length === 0 ? (
          <p className="text-center text-foreground/60">
            No listings yet — be the first to list a product.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
