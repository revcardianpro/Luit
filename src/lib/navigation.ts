export interface NavLink {
  label: string;
  href: string;
}

// Single source of truth for nav structure, shared by the desktop nav,
// mobile menu, and footer so they can never drift out of sync. Split
// into three groups (matching the navbar's own layout: two dropdowns +
// a handful of flat top-level links) rather than one flat list --
// only ever add a link here once its page actually exists; the two
// dropdowns are deliberately allowed to be short (Opportunities has
// just one entry today) rather than padded with items that don't link
// anywhere real yet.

/** Flat links shown directly in the nav bar, no dropdown. */
export const topLevelLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Learning", href: "/learn" },
  { label: "Pride of Assam", href: "/pride" },
  // Absolute path + hash, not just "#pillars" -- that section only
  // exists on the homepage, so a bare hash would try to scroll
  // *whatever page you're currently on* instead of navigating back.
  // Valid again now that PillarJourney is its own homepage section
  // (id="pillars") rather than merged into Hero.
  { label: "Pillars", href: "/#pillars" },
];

/** "Explore Assam ▾" dropdown contents. */
export const exploreLinks: NavLink[] = [
  { label: "Explore Assam", href: "/explore" },
  { label: "Events", href: "/events" },
  { label: "Community", href: "/community" },
];

/** "Opportunities ▾" dropdown contents. */
export const opportunityLinks: NavLink[] = [{ label: "Jobs", href: "/jobs" }];
