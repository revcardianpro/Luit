interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

/** Labeled textarea, styled to match Input.tsx. */
export function Textarea({ label, id, name, ...props }: TextareaProps) {
  const inputId = id ?? name;

  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label htmlFor={inputId} className="text-sm font-medium text-foreground/80">
        {label}
      </label>
      <textarea
        id={inputId}
        name={name}
        className="rounded-lg border border-foreground/15 bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
        {...props}
      />
    </div>
  );
}
