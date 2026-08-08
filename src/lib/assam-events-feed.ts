import { GoogleGenAI } from "@google/genai";
import { eventCategories } from "@/lib/event-categories";

/**
 * Discovers trending/upcoming Assam events for free, without any paid
 * search API. This deliberately does NOT use Gemini's Google Search
 * grounding tool -- that tool is paid-only ($14/1,000 requests), even
 * though plain text generation on the same models is free. Instead:
 *
 *   1. We do the "searching" ourselves -- a plain `fetch()` against a
 *      small, curated list of real Assam tourism/festival sources
 *      (see SOURCES below). No API, no vendor, no cost.
 *   2. We hand the scraped page text to Gemini's free-tier
 *      `generateContent` (no tools at all) and ask it to extract and
 *      structure whatever real events it finds into JSON.
 *
 * This keeps the whole pipeline at $0: source fetching is just HTTP,
 * and the only paid-adjacent step (the LLM call) uses the genuinely
 * free tier. See src/app/api/cron/refresh-assam-events/route.ts for
 * how this gets called and written to the database.
 */

export interface DiscoveredEvent {
  title: string;
  description: string;
  category: string;
  location: string | null;
  date_text: string;
  starts_at: string | null;
  source_url: string;
  source_name: string;
}

interface Source {
  name: string;
  url: string;
}

/**
 * Deliberately small and hand-picked rather than a broad crawl -- each
 * one is a real, verified-working page as of Phase 13. This list is a
 * starting point, not exhaustive; expand it later (e.g. via a Phase 15
 * admin UI) rather than growing an automated crawler, which would be
 * far more fragile than it's worth for this feature's scope.
 */
function getSources(): Source[] {
  const now = new Date();
  // Assam Tourism's official calendar is organized one static page per
  // month (january.php ... december.php) -- pull the current month and
  // the next one so "upcoming" actually means something.
  const months = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december",
  ];
  const thisMonth = months[now.getMonth()];
  const nextMonth = months[(now.getMonth() + 1) % 12];

  return [
    {
      name: "Assam Tourism",
      url: `https://assamtourism.gov.in/${thisMonth}.php`,
    },
    {
      name: "Assam Tourism",
      url: `https://assamtourism.gov.in/${nextMonth}.php`,
    },
    {
      name: "Wikipedia",
      url: "https://en.wikipedia.org/wiki/List_of_festivals_in_Assam",
    },
  ];
}

/** Strips tags/scripts down to plain text and caps length, so each
 * source contributes a bounded amount to the prompt. */
function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12000);
}

async function fetchSourceText(source: Source): Promise<string | null> {
  try {
    const res = await fetch(source.url, {
      headers: { "User-Agent": "LUIT-events-feed/1.0 (+https://luit.vercel.app)" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    return stripHtml(await res.text());
  } catch {
    return null;
  }
}

function buildPrompt(sources: { name: string; url: string; text: string }[], todayIso: string): string {
  const sourceBlocks = sources
    .map((s, i) => `--- SOURCE ${i + 1}: ${s.name} (${s.url}) ---\n${s.text}`)
    .join("\n\n");

  return `Today's date is ${todayIso} (India Standard Time). You are extracting real, currently-relevant festivals, fairs, and events happening in Assam, India, from the raw scraped web page text below.

${sourceBlocks}

Read the source text above and list every distinct real event you can find. For each one, output an object with exactly these fields:
- "title": short event name
- "description": 1-2 sentences, factual, based only on what the source text says
- "category": pick the single best match from this exact list: ${eventCategories.join(", ")}
- "location": place/district if mentioned, else null
- "date_text": how the source describes timing, in your own words (e.g. "Mid-August, annual" or "Dates vary by year") -- always fill this in, even if approximate
- "starts_at": an ISO 8601 date (YYYY-MM-DD) ONLY if the source gives a specific, unambiguous date for the NEXT occurrence of this event on or after today; otherwise null
- "source_url": the exact URL of the source it came from (one of the URLs listed above)
- "source_name": the source name it came from (one of the names listed above)

Rules:
- Only include events you can actually find evidence for in the text above. Do not invent or assume events.
- Skip generic tourist attractions, places, or destinations that are not actual events/festivals/fairs with some kind of occurrence.
- If the same event appears in more than one source, include it once, preferring the more specific source.
- Return AT MOST 12 events.
- Respond with ONLY a JSON array, no markdown code fences, no commentary before or after.`;
}

function isValidCategory(value: unknown): value is string {
  return typeof value === "string" && (eventCategories as readonly string[]).includes(value);
}

function parseEvents(rawText: string, sources: { name: string; url: string }[]): DiscoveredEvent[] {
  // Models sometimes wrap JSON in ```json fences despite instructions --
  // strip fences, then take the outermost [...] slice defensively.
  const stripped = rawText.replace(/```json|```/gi, "").trim();
  const start = stripped.indexOf("[");
  const end = stripped.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripped.slice(start, end + 1));
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  const validSourceUrls = new Set(sources.map((s) => s.url));

  const events: DiscoveredEvent[] = [];
  for (const item of parsed) {
    if (typeof item !== "object" || item === null) continue;
    const obj = item as Record<string, unknown>;
    if (typeof obj.title !== "string" || !obj.title.trim()) continue;
    if (typeof obj.description !== "string" || !obj.description.trim()) continue;
    if (typeof obj.date_text !== "string" || !obj.date_text.trim()) continue;
    if (typeof obj.source_url !== "string" || !validSourceUrls.has(obj.source_url)) continue;

    const startsAt =
      typeof obj.starts_at === "string" && /^\d{4}-\d{2}-\d{2}$/.test(obj.starts_at)
        ? new Date(`${obj.starts_at}T00:00:00+05:30`).toISOString()
        : null;

    events.push({
      title: obj.title.trim().slice(0, 200),
      description: obj.description.trim().slice(0, 2000),
      category: isValidCategory(obj.category) ? obj.category : "Cultural",
      location: typeof obj.location === "string" && obj.location.trim() ? obj.location.trim() : null,
      date_text: obj.date_text.trim().slice(0, 200),
      starts_at: startsAt,
      source_url: obj.source_url,
      source_name: typeof obj.source_name === "string" ? obj.source_name : "Unknown",
    });
  }
  return events;
}

export async function discoverAssamEvents(): Promise<DiscoveredEvent[]> {
  const sources = getSources();
  const fetched = await Promise.all(
    sources.map(async (source) => ({ ...source, text: await fetchSourceText(source) })),
  );
  const usable = fetched.filter((s): s is Source & { text: string } => s.text !== null && s.text.length > 0);
  if (usable.length === 0) {
    return [];
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const ai = new GoogleGenAI({ apiKey });
  const todayIso = new Date().toISOString().slice(0, 10);
  const prompt = buildPrompt(usable, todayIso);

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  return parseEvents(response.text ?? "", usable);
}
