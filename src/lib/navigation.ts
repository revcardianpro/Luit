export interface NavLink {
  label: string;
  href: string;
}

// Single source of truth for nav links, shared by the desktop nav and
// the mobile menu so they can never drift out of sync. Only list links
// to sections/pages that actually exist today — as real pages ship in
// later phases (Explore Assam, Marketplace, etc.), they get added here.
export const navLinks: NavLink[] = [
  { label: "Explore", href: "/explore" },
  // Absolute path + hash, not just "#pillars" -- that section only
  // exists on the homepage, so a bare hash would try to scroll
  // *whatever page you're currently on* instead of navigating back.
  { label: "Pillars", href: "/#pillars" },
];
