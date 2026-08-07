import { redirect, notFound } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import type { CreatorPost } from "@/lib/supabase/types";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ImageFileInput } from "@/components/ui/ImageFileInput";
import { creatorCategories } from "@/lib/creator-categories";
import { updatePost } from "./actions";

export default async function EditPostPage(props: PageProps<"/community/[id]/edit">) {
  const { id } = await props.params;
  const { error } = await props.searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data } = await supabase.from("creator_posts").select("*").eq("id", id).single();
  const post = data as CreatorPost | null;

  if (!post) {
    notFound();
  }

  if (post.creator_id !== user.id) {
    redirect(`/community/${id}`);
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">Edit post</h1>

      {error && (
        <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
          {error}
        </p>
      )}

      <form action={updatePost} className="mt-8 flex flex-col gap-4">
        <input type="hidden" name="id" value={post.id} />
        <Input label="Title" name="title" required defaultValue={post.title} />
        <Textarea
          label="Description"
          name="description"
          rows={5}
          required
          defaultValue={post.description}
        />

        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="category" className="text-sm font-medium text-foreground/80">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={post.category}
            className="rounded-lg border border-foreground/15 bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          >
            {creatorCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <ImageFileInput name="image" label="Replace image (optional)" />
        <Input
          label="External link (optional)"
          name="external_link"
          type="url"
          defaultValue={post.external_link ?? ""}
        />

        <Button type="submit">Save changes</Button>
      </form>
    </main>
  );
}
