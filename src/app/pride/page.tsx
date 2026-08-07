import { createClient } from "@/lib/supabase/server";
import type { NotablePerson } from "@/lib/supabase/types";
import { PersonCard } from "./PersonCard";

export default async function PridePage() {
  const supabase = await createClient();
  const { data } = await supabase.from("notable_people").select("*").order("name");
  const people = (data ?? []) as NotablePerson[];

  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-col items-center gap-4 px-6 py-20 text-center">
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Pride of Assam
        </h1>
        <p className="max-w-xl text-lg text-foreground/70">
          The people whose lives and work have shaped Assam&rsquo;s culture, history, and
          standing in the world.
        </p>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      </section>
    </main>
  );
}
