import Link from "next/link";
import { searchSite, SEARCH_SECTIONS } from "@/lib/search";

export default async function SearchPage(props: PageProps<"/search">) {
  const { q } = await props.searchParams;
  const query = typeof q === "string" ? q : "";
  const results = query ? await searchSite(query) : [];

  const bySection = new Map<string, typeof results>();
  for (const result of results) {
    const existing = bySection.get(result.section) ?? [];
    existing.push(result);
    bySection.set(result.section, existing);
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Search</h1>

      <form action="/search" className="mt-6">
        <input
          type="search"
          name="q"
          defaultValue={query}
          autoFocus
          placeholder="Search destinations, people, jobs, events..."
          className="w-full rounded-lg border border-foreground/15 bg-background px-4 py-3 text-base outline-none focus:border-primary"
        />
      </form>

      {!query && (
        <p className="mt-8 text-foreground/60">
          Search across everything on LUIT — destinations, notable people, marketplace
          listings, learning resources, jobs, creator posts, and events.
        </p>
      )}

      {query && results.length === 0 && (
        <p className="mt-8 text-foreground/60">No results for &ldquo;{query}&rdquo;.</p>
      )}

      {query && results.length > 0 && (
        <div className="mt-8 flex flex-col gap-10">
          {SEARCH_SECTIONS.filter((section) => bySection.has(section)).map((section) => (
            <section key={section}>
              <h2 className="font-serif text-lg font-semibold tracking-tight">{section}</h2>
              <div className="mt-3 flex flex-col gap-1">
                {bySection.get(section)!.map((result) => (
                  <Link
                    key={result.id}
                    href={result.href}
                    className="rounded-lg px-3 py-2.5 -mx-3 transition-colors hover:bg-foreground/5"
                  >
                    <p className="font-medium">{result.title}</p>
                    <p className="text-sm text-foreground/60">{result.snippet}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
