type ButtonVariant = "primary" | "outline";

interface ButtonProps {
  href: string;
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  outline: "border border-foreground/15 text-foreground hover:bg-foreground/5",
};

/**
 * Shared call-to-action button. Every "primary action" across the site
 * (hero, closing CTA, and later the navbar) renders through this one
 * component, so changing the button style once updates it everywhere
 * instead of drifting out of sync across pages.
 */
export function Button({ href, variant = "primary", children }: ButtonProps) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors ${variantStyles[variant]}`}
    >
      {children}
    </a>
  );
}
