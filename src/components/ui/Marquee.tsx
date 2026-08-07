interface MarqueeProps {
  items: string[];
}

/**
 * A continuously scrolling text band (the "Natural ingredients /
 * Gluten-free" ticker style from the bakinatajna.com reference). Pure
 * CSS animation (see .animate-marquee in globals.css) — no JS needed,
 * so this stays a Server Component.
 *
 * The trick to a seamless loop: render the item list twice back-to-back
 * and animate exactly -50% (one full copy's width). aria-hidden on the
 * duplicate since it's decorative repetition, not new content.
 */
export function Marquee({ items }: MarqueeProps) {
  const content = (
    <>
      {items.map((item, i) => (
        <span key={i} className="mx-6 whitespace-nowrap">
          {item}
        </span>
      ))}
    </>
  );

  return (
    <div className="overflow-hidden border-y border-foreground/10 py-4">
      <div className="flex w-max animate-marquee font-serif text-2xl sm:text-3xl">
        {content}
        <span aria-hidden className="flex">
          {content}
        </span>
      </div>
    </div>
  );
}
