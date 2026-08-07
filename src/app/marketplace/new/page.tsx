import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ImageFileInput } from "@/components/ui/ImageFileInput";
import { marketplaceCategories } from "@/lib/marketplace-categories";
import { createListing } from "./actions";

export default async function NewListingPage(props: PageProps<"/marketplace/new">) {
  const { error } = await props.searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">List a product</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Share what you&rsquo;re selling with the LUIT community.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
          {error}
        </p>
      )}

      <form action={createListing} className="mt-8 flex flex-col gap-4">
        <Input label="Title" name="title" required placeholder="e.g. Handwoven Muga Silk Gamosa" />
        <Textarea
          label="Description"
          name="description"
          rows={5}
          required
          placeholder="Describe your product — materials, size, how it's made..."
        />

        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="category" className="text-sm font-medium text-foreground/80">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue=""
            className="rounded-lg border border-foreground/15 bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="" disabled>
              Select a category
            </option>
            {marketplaceCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <Input label="Price (₹)" name="price" type="number" min="0" step="0.01" required />
        <Input label="District (optional)" name="district" placeholder="e.g. Kamrup Metropolitan" />

        <ImageFileInput name="image" label="Photo (optional)" />

        <Input label="Contact email (optional)" name="contact_email" type="email" />
        <Input label="Contact phone (optional)" name="contact_phone" type="tel" />
        <p className="text-xs text-foreground/50">
          Provide at least one contact method so buyers can reach you.
        </p>

        <Button type="submit">List product</Button>
      </form>
    </main>
  );
}
