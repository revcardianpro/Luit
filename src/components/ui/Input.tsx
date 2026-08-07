interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

/**
 * Shared labeled text input, used by the login/signup forms (and any
 * future form on the site).
 */
export function Input({ label, id, name, ...props }: InputProps) {
  const inputId = id ?? name;

  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label htmlFor={inputId} className="text-sm font-medium text-foreground/80">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        className="rounded-lg border border-foreground/15 bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
        {...props}
      />
    </div>
  );
}
