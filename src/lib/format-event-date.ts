/**
 * LUIT is an Assam-focused platform, so event times are always entered
 * and displayed in India Standard Time (Asia/Kolkata, UTC+5:30) —
 * regardless of the organizer's or a viewer's own device timezone. A
 * diaspora member checking an event from another timezone should still
 * see "6:00 pm IST", not a silently-converted local time that no
 * longer matches what the venue/livestream schedule says.
 *
 * `<input type="datetime-local">` submits a plain "YYYY-MM-DDTHH:mm"
 * string with no timezone info attached. If that string were sent to
 * Postgres as-is, it would be interpreted using the database
 * connection's timezone (UTC on Supabase) instead of IST — silently
 * shifting every event by 5 hours 30 minutes. `toIstIsoString` fixes
 * that by attaching the IST offset explicitly before the value is
 * ever sent to the database.
 */
export function toIstIsoString(localDateTimeValue: string): string {
  return `${localDateTimeValue}:00+05:30`;
}

/** Inverse of `toIstIsoString`, for pre-filling an edit form's
 * `datetime-local` input from a stored timestamptz value. */
export function toDatetimeLocalValue(isoString: string): string {
  // "sv-SE" is a convenient trick for an ISO-ordered "YYYY-MM-DD HH:mm:ss"
  // string; swap the space for "T" to match datetime-local's format.
  return new Date(isoString)
    .toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" })
    .slice(0, 16)
    .replace(" ", "T");
}

/** Formats a stored timestamp for display, always in IST regardless of
 * the viewer's own timezone — see the module comment above. */
export function formatEventDateTime(isoString: string): string {
  const formatted = new Date(isoString).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${formatted} IST`;
}
