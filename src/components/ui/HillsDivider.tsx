/**
 * A simple layered SVG silhouette (hills fading into a river) used as a
 * section divider. This is a flat/line-art stand-in for real illustrated
 * artwork — see the design-direction memory: proper painterly or 3D
 * illustration needs external assets (commissioned or AI-generated)
 * that no one has sourced yet. Swap this component's contents for a
 * real illustration whenever those assets exist; nothing else needs to
 * change since it's used as a single drop-in component.
 */
export function HillsDivider() {
  return (
    <svg
      viewBox="0 0 1440 220"
      preserveAspectRatio="none"
      className="block h-20 w-full sm:h-28"
      aria-hidden
    >
      <path
        d="M0,120 C240,60 480,180 720,110 C960,40 1200,150 1440,90 L1440,220 L0,220 Z"
        className="fill-brand-green/25"
      />
      <path
        d="M0,160 C280,110 520,190 760,140 C1000,90 1240,170 1440,130 L1440,220 L0,220 Z"
        className="fill-brand-green/45"
      />
      <path
        d="M0,190 C300,160 600,210 900,180 C1150,155 1300,195 1440,175 L1440,220 L0,220 Z"
        className="fill-brand-blue/60"
      />
    </svg>
  );
}
