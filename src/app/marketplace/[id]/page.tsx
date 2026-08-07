import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import type { ProductWithSeller } from "@/lib/supabase/types";
import { getCategoryAccent } from "@/lib/marketplace-categories";
import { accentBgClass } from "@/lib/brand-accent";
import { formatPrice } from "@/lib/format-price";
import { Button } from "@/components/ui/Button";
import { DeleteListingButton } from "./DeleteListingButton";

export default async function ProductPage(props: PageProps<"/marketplace/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();
  const [{ data }, user] = await Promise.all([
    supabase.from("products").select("*, profiles(full_name, avatar_url)").eq("id", id).single(),
    getCurrentUser(),
  ]);
  const product = data as ProductWithSeller | null;

  if (!product) {
    notFound();
  }

  const accent = getCategoryAccent(product.category);
  const isOwner = user?.id === product.seller_id;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
      <Link
        href="/marketplace"
        className="text-sm font-medium text-foreground/60 hover:text-foreground"
      >
        ← Back to Marketplace
      </Link>

      <div className="mt-8 grid gap-10 sm:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-foreground/5">
          {product.image_path ? (
            <Image
              src={product.image_path}
              alt={product.title}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-foreground/40">
              No photo
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3">
            <span className={`h-2 w-10 rounded-full ${accentBgClass[accent]}`} />
            <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
              {product.category}
              {product.district ? ` · ${product.district}` : ""}
            </p>
          </div>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
            {product.title}
          </h1>
          <p className="mt-2 text-2xl font-semibold text-primary">
            {formatPrice(product.price)}
          </p>

          <p className="mt-6 whitespace-pre-line text-foreground/80">{product.description}</p>

          <div className="mt-8 rounded-2xl border border-foreground/10 p-6">
            <p className="text-sm font-medium text-foreground/80">
              Sold by {product.profiles?.full_name || "a LUIT seller"}
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              {product.contact_email && (
                <a
                  href={`mailto:${product.contact_email}`}
                  className="text-primary hover:underline"
                >
                  {product.contact_email}
                </a>
              )}
              {product.contact_phone && (
                <a href={`tel:${product.contact_phone}`} className="text-primary hover:underline">
                  {product.contact_phone}
                </a>
              )}
            </div>
          </div>

          {isOwner && (
            <div className="mt-6 flex gap-3">
              <Button href={`/marketplace/${product.id}/edit`} variant="outline" size="sm">
                Edit listing
              </Button>
              <DeleteListingButton productId={product.id} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
