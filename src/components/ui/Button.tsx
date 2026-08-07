type ButtonVariant = "primary" | "outline";
type ButtonSize = "sm" | "md";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Omit `href` (or pass `disabled`) for a not-yet-functional CTA — it
   * renders as an inert, visually "disabled" button instead of a link
   * that goes nowhere. Used for things like "Sign In" before Phase 5
   * (Authentication) exists. */
  href?: string;
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
 * Shared call-to-action button. Every "primary action" across the site
 * (hero, closing CTA, navbar) renders through this one component, so
 * changing the button style once updates it everywhere instead of
 * drifting out of sync across pages.
 */
export function Button({
  href,
  variant = "primary",
  size = "md",
  disabled = false,
  children,
}: ButtonProps) {
  const className = `inline-flex items-center justify-center rounded-full font-medium transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${
    disabled ? "cursor-not-allowed opacity-50" : ""
  }`;

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
