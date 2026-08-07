import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ImageFileInput } from "@/components/ui/ImageFileInput";
import { creatorCategories } from "@/lib/creator-categories";
import { createPost } from "./actions";

export default async function NewPostPage(props: PageProps<"/community/new">) {
  const { error } = await props.searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">Share your work</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Post something you&rsquo;ve made to the LUIT community.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
          {error}
        </p>
      )}

      <form action={createPost} className="mt-8 flex flex-col gap-4">
        <Input label="Title" name="title" required placeholder="e.g. Sunset over Kaziranga" />
        <Textarea
          label="Description"
          name="description"
          rows={5}
          required
          placeholder="Tell people about this work..."
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
            {creatorCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <ImageFileInput name="image" label="Image (optional)" />
        <Input
          label="External link (optional)"
          name="external_link"
          type="url"
          placeholder="YouTube, Spotify, Instagram..."
        />

        <Button type="submit">Post</Button>
      </form>
    </main>
  );
}
