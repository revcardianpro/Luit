import { redirect, notFound } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import type { Product } from "@/lib/supabase/types";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ImageFileInput } from "@/components/ui/ImageFileInput";
import { marketplaceCategories } from "@/lib/marketplace-categories";
import { updateListing } from "./actions";

export default async function EditListingPage(props: PageProps<"/marketplace/[id]/edit">) {
  const { id } = await props.params;
  const { error } = await props.searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").eq("id", id).single();
  const product = data as Product | null;

  if (!product) {
    notFound();
  }

  if (product.seller_id !== user.id) {
    redirect(`/marketplace/${id}`);
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">Edit listing</h1>

      {error && (
        <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
          {error}
        </p>
      )}

      <form action={updateListing} className="mt-8 flex flex-col gap-4">
        <input type="hidden" name="id" value={product.id} />
        <Input label="Title" name="title" required defaultValue={product.title} />
        <Textarea
          label="Description"
          name="description"
          rows={5}
          required
          defaultValue={product.description}
        />

        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="category" className="text-sm font-medium text-foreground/80">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={product.category}
            className="rounded-lg border border-foreground/15 bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          >
            {marketplaceCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Price (₹)"
          name="price"
          type="number"
          min="0"
          step="0.01"
          required
          defaultValue={product.price}
        />
        <Input label="District (optional)" name="district" defaultValue={product.district ?? ""} />

        <ImageFileInput name="image" label="Replace photo (optional)" />

        <Input
          label="Contact email (optional)"
          name="contact_email"
          type="email"
          defaultValue={product.contact_email ?? ""}
        />
        <Input
          label="Contact phone (optional)"
          name="contact_phone"
          type="tel"
          defaultValue={product.contact_phone ?? ""}
        />

        <Button type="submit">Save changes</Button>
      </form>
    </main>
  );
}
