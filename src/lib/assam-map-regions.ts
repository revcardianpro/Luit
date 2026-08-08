/**
 * Maps a `destinations.district` value (free text, e.g. "Golaghat &
 * Nagaon districts") to a labeled point on AssamMap's schematic
 * outline. `district` isn't a clean enum -- it's written for humans on
 * a destination's own page -- so matching is substring-based against
 * `matches`, not an exact-equality lookup.
 *
 * `x`/`y` are coordinates in AssamMap's viewBox (0 0 640 380), placed
 * at each area's real *approximate relative* position (west-to-east
 * along the Brahmaputra valley, Manas up near the Bhutan border) --
 * this is a schematic map, not a survey-accurate one (see
 * AssamMap.tsx's own comment for why), so these are illustrative, not
 * GPS coordinates.
 *
 * A district with no match here simply gets no pin -- safe fallback,
 * and the natural place to add one line when a destination lands in a
 * new area (e.g. via /admin/destinations) that isn't covered yet.
 */
export interface AssamMapRegion {
  id: string;
  label: string;
  x: number;
  y: number;
  matches: string[];
}

export const assamMapRegions: AssamMapRegion[] = [
  { id: "manas", label: "Manas", x: 110, y: 140, matches: ["chirang", "baksa", "bongaigaon"] },
  { id: "guwahati", label: "Guwahati", x: 190, y: 195, matches: ["kamrup"] },
  { id: "kaziranga", label: "Kaziranga", x: 345, y: 175, matches: ["golaghat", "nagaon"] },
  { id: "majuli", label: "Majuli", x: 415, y: 130, matches: ["majuli"] },
  { id: "sivasagar", label: "Sivasagar", x: 520, y: 150, matches: ["sivasagar"] },
];

/** Finds the region a destination's `district` text belongs to, if any. */
export function matchRegion(district: string): AssamMapRegion | undefined {
  const lower = district.toLowerCase();
  return assamMapRegions.find((region) => region.matches.some((m) => lower.includes(m)));
}
