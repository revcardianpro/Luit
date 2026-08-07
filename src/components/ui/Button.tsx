type ButtonVariant = "primary" | "outline";
type ButtonSize = "sm" | "md";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Renders as a real link. */
  href?: string;
  /** Renders as a real <button> — use inside a <form action={...}> for
   * Server Actions (e.g. a Sign Out button), or "button" with onClick
   * in a Client Component. */
  type?: "button" | "submit";
  /** Omit both `href` and `type` (or pass `disabled`) for a
   * not-yet-functional CTA — it renders as an inert, visually
   * "disabled" element instead of a link/button that does nothing. */
  disabled?: boolean;
}

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
 */
export function Button({
  href,
  type,
  variant = "primary",
  size = "md",
  disabled = false,
  children,
}: ButtonProps) {
  const className = `inline-flex items-center justify-center rounded-full font-medium transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${
    disabled ? "cursor-not-allowed opacity-50" : ""
  }`;

  if (type) {
    return (
      <button type={type} disabled={disabled} className={className}>
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
    <a href={href} className={className}>
      {children}
    </a>
  );
}
