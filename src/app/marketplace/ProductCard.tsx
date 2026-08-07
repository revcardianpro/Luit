import Link from "next/link";
import Image from "next/image";
import type { ProductWithSeller } from "@/lib/supabase/types";
import { getCategoryAccent } from "@/lib/marketplace-categories";
import { accentBgClass } from "@/lib/brand-accent";
import { formatPrice } from "@/lib/format-price";

export function ProductCard({ product }: { product: ProductWithSeller }) {
  const accent = getCategoryAccent(product.category);

  return (
    <Link
      href={`/marketplace/${product.id}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-foreground/10 transition-colors hover:border-foreground/20"
    >
      <div className="relative aspect-square w-full bg-foreground/5">
        {product.image_path ? (
          <Image
            src={product.image_path}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-foreground/40">
            No photo
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 p-6">
        <span className={`h-2 w-10 rounded-full ${accentBgClass[accent]}`} />
        <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
          {product.category}
        </p>
        <h3 className="font-serif text-xl font-semibold">{product.title}</h3>
        <p className="text-lg font-semibold text-primary">{formatPrice(product.price)}</p>
        {product.profiles?.full_name && (
          <p className="text-sm text-foreground/60">by {product.profiles.full_name}</p>
        )}
      </div>
    </Link>
  );
}
