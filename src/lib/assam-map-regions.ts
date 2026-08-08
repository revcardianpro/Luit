/**
 * Maps a `destinations.district` value (free text, e.g. "Golaghat &
 * Nagaon districts") to a labeled point on AssamMap's background
 * image (public/images/map/assam-district-map.png, a district map the
 * user generated and provided directly). `district` isn't a clean
 * enum -- it's written for humans on a destination's own page -- so
 * matching is substring-based against `matches`, not an exact-
 * equality lookup.
 *
 * `x`/`y` are percentages (0-100) of the map image's width/height,
 * positioned by eye against each named district's label/headquarters
 * dot in that image -- a best-effort visual match, not measured from
 * exact source pixel coordinates, so treat these as approximate.
 * Majuli isn't its own labeled district on this map (it's a river
 * sub-division near Jorhat) -- placed just north of Jorhat, in the
 * river bend, rather than exactly on a labeled point.
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
  { id: "manas", label: "Manas", x: 21, y: 37, matches: ["chirang", "baksa", "bongaigaon"] },
  { id: "guwahati", label: "Guwahati", x: 39, y: 54, matches: ["kamrup"] },
  { id: "kaziranga", label: "Kaziranga", x: 60, y: 40, matches: ["golaghat", "nagaon"] },
  { id: "majuli", label: "Majuli", x: 66, y: 28, matches: ["majuli"] },
  { id: "sivasagar", label: "Sivasagar", x: 77, y: 32, matches: ["sivasagar"] },
];

/** Finds the region a destination's `district` text belongs to, if any. */
export function matchRegion(district: string): AssamMapRegion | undefined {
  const lower = district.toLowerCase();
  return assamMapRegions.find((region) => region.matches.some((m) => lower.includes(m)));
}
