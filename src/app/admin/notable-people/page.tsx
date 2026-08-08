import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import type { NotablePerson } from "@/lib/supabase/types";
import { Button } from "@/components/ui/Button";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { deleteNotablePerson } from "./actions";

export default async function AdminNotablePeoplePage(props: PageProps<"/admin/notable-people">) {
  await requireAdmin();
  const { error } = await props.searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from("notable_people").select("*").order("name");
  const people = (data ?? []) as NotablePerson[];

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Link href="/admin" className="text-sm font-medium text-foreground/60 hover:text-foreground">
        ← Back to Admin Dashboard
      </Link>

      {error && (
        <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
          {error}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Pride of Assam</h1>
        <Button href="/admin/notable-people/new" size="sm">
          New person
        </Button>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {people.map((person) => (
          <div
            key={person.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-foreground/10 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-foreground/5">
                <Image src={person.photo_path} alt="" fill sizes="40px" className="object-cover" />
              </div>
              <div>
                <p className="font-medium">{person.name}</p>
                <p className="text-xs text-foreground/50">
                  {person.field} · {person.lifespan}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button href={`/admin/notable-people/${person.id}/edit`} variant="outline" size="sm">
                Edit
              </Button>
              <AdminDeleteButton
                action={deleteNotablePerson}
                id={person.id}
                confirmMessage={`Delete "${person.name}"? This can't be undone.`}
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
