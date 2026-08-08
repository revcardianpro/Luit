import Link from "next/link";

type ButtonVariant = "primary" | "outline";
type ButtonSize = "sm" | "md";

interface BaseProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
}

// A discriminated union instead of one interface with two optional,
// independent `href`/`type` props — that older shape let a call site
// accidentally pass both at once (e.g. `<Button href="/x" type="submit">`),
// which silently rendered a <button> that ignored `href` entirely. Here,
// each variant explicitly forbids the other's prop (`type?: never` /
// `href?: never`), so passing both is a compile error instead of a
// silent runtime surprise.
type ButtonProps =
  | (BaseProps & { href: string; external?: boolean; type?: never })
  | (BaseProps & {
      type: "button" | "submit";
      href?: never;
      external?: never;
      onClick?: () => void;
    })
  | (BaseProps & { href?: never; type?: never; external?: never });

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  outline: "border border-foreground/15 text-foreground hover:bg-foreground/5",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
};

/**
 * Shared call-to-action button/link. Every "action" across the site —
 * links (hero, navbar), form submissions (login, sign out), and
 * not-yet-functional placeholders — renders through this one component,
 * so its visual style only has to be changed in one place.
 *
 * - Pass `href` for a real link (add `external` for a link that leaves
 *   the site, e.g. out to a Learning Hub resource — opens in a new tab
 *   so the visitor doesn't lose their place on LUIT).
 * - Pass `type="button" | "submit"` for a real <button> (e.g. inside a
 *   Server Action <form>, or with `onClick` for client-side behavior
 *   like the community post's Share button).
 * - Pass neither (optionally with `disabled`) for a not-yet-functional
 *   placeholder — it renders as an inert, visually "disabled" element.
 */
export function Button({
  href,
  type,
  external = false,
  variant = "primary",
  size = "md",
  disabled = false,
  children,
  ...rest
}: ButtonProps) {
  const className = `inline-flex shrink-0 items-center justify-center rounded-full font-medium whitespace-nowrap transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${
    disabled ? "cursor-not-allowed opacity-50" : ""
  }`;

  if (type) {
    const onClick = "onClick" in rest ? rest.onClick : undefined;
    return (
      <button type={type} disabled={disabled} onClick={onClick} className={className}>
        {children}
      </button>
    );
  }

  if (disabled || !href) {
    return (
      <span className={className} aria-disabled="true">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </Link>
  );
}
