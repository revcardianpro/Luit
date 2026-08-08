import Image from "next/image";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import type { NotablePerson } from "@/lib/supabase/types";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ImageFileInput } from "@/components/ui/ImageFileInput";
import { updateNotablePerson } from "./actions";

export default async function EditNotablePersonPage(props: PageProps<"/admin/notable-people/[id]/edit">) {
  await requireAdmin();
  const { id } = await props.params;
  const { error } = await props.searchParams;

  const supabase = await createClient();
  const { data } = await supabase.from("notable_people").select("*").eq("id", id).single();
  const person = data as NotablePerson | null;

  if (!person) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">Edit notable person</h1>

      {error && (
        <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
          {error}
        </p>
      )}

      <div className="relative mt-6 h-32 w-32 overflow-hidden rounded-full bg-foreground/5">
        <Image src={person.photo_path} alt={person.name} fill sizes="128px" className="object-cover" />
      </div>

      <form action={updateNotablePerson} className="mt-6 flex flex-col gap-4">
        <input type="hidden" name="id" value={person.id} />
        <Input label="Name" name="name" required defaultValue={person.name} />
        <Input
          label="Slug"
          name="slug"
          required
          defaultValue={person.slug}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          title="Lowercase letters, numbers, and hyphens only"
        />
        <Input label="Field" name="field" required defaultValue={person.field} />
        <Input label="Lifespan" name="lifespan" required defaultValue={person.lifespan} />

        <Textarea
          label="Short description"
          name="short_description"
          rows={2}
          required
          defaultValue={person.short_description}
        />
        <Textarea
          label="Full description"
          name="description"
          rows={6}
          required
          defaultValue={person.description}
        />

        <ImageFileInput name="photo" label="Replace photo (optional)" />
        <Input label="Photo credit" name="photo_credit" required defaultValue={person.photo_credit} />
        <Input
          label="Photo license"
          name="photo_license"
          required
          defaultValue={person.photo_license}
        />
        <Input
          label="Photo license URL (optional)"
          name="photo_license_url"
          type="url"
          defaultValue={person.photo_license_url ?? ""}
        />

        <Button type="submit">Save changes</Button>
      </form>
    </main>
  );
}
