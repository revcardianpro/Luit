import { requireAdmin } from "@/lib/admin";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ImageFileInput } from "@/components/ui/ImageFileInput";
import { createNotablePerson } from "./actions";

export default async function NewNotablePersonPage(props: PageProps<"/admin/notable-people/new">) {
  await requireAdmin();
  const { error } = await props.searchParams;

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">New notable person</h1>

      {error && (
        <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
          {error}
        </p>
      )}

      <form action={createNotablePerson} className="mt-8 flex flex-col gap-4">
        <Input label="Name" name="name" required placeholder="e.g. Bhupen Hazarika" />
        <Input
          label="Slug"
          name="slug"
          required
          placeholder="e.g. bhupen-hazarika"
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          title="Lowercase letters, numbers, and hyphens only"
        />
        <Input label="Field" name="field" required placeholder="e.g. Music & Cinema" />
        <Input label="Lifespan" name="lifespan" required placeholder="e.g. 1926–2011 or b. 2000" />

        <Textarea
          label="Short description"
          name="short_description"
          rows={2}
          required
          placeholder="One sentence, shown on the listing card"
        />
        <Textarea
          label="Full description"
          name="description"
          rows={6}
          required
          placeholder="Shown on their own page"
        />

        <ImageFileInput name="photo" label="Photo" required />
        <Input
          label="Photo credit"
          name="photo_credit"
          required
          placeholder="e.g. Utpal Baruah / UB Photos"
        />
        <Input label="Photo license" name="photo_license" required placeholder="e.g. CC BY-SA 4.0" />
        <Input
          label="Photo license URL (optional)"
          name="photo_license_url"
          type="url"
          placeholder="https://creativecommons.org/licenses/..."
        />
        <p className="-mt-2 text-xs text-foreground/50">
          Unlike Explore Assam&rsquo;s photos, these need visible credit — check the
          source&rsquo;s license before uploading.
        </p>

        <Button type="submit">Create person</Button>
      </form>
    </main>
  );
}
