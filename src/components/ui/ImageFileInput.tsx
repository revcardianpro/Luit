"use client";

import { useState } from "react";

interface ImageFileInputProps {
  name: string;
  label: string;
  /** Kept comfortably under the 5MB Server Action body limit set in
   * next.config.ts, leaving headroom for multipart/form-data overhead
   * (boundaries, part headers) so a file right at the edge doesn't
   * still slip past this check and hit the server's hard limit
   * instead. */
  maxSizeMB?: number;
  required?: boolean;
}

/**
 * A labeled image file input that validates the picked file's size in
 * the browser, showing a friendly message instead of letting an
 * oversized file hit the server's hard limit and crash. A Client
 * Component ("use client") for that reason — a Server Component can't
 * react to a file input's onChange event — while the form it lives in
 * otherwise stays a plain Server Component.
 *
 * Generalized from the account page's original avatar-only version
 * (AvatarFileInput) once the marketplace listing form needed the exact
 * same behavior for a different field.
 */
export function ImageFileInput({ name, label, maxSizeMB = 4, required }: ImageFileInputProps) {
  const [error, setError] = useState<string | null>(null);
  const maxBytes = maxSizeMB * 1024 * 1024;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file && file.size > maxBytes) {
      setError(`"${file.name}" is too large (max ${maxSizeMB}MB). Choose a smaller image.`);
      event.target.value = "";
    } else {
      setError(null);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-foreground/80">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="file"
        accept="image/*"
        required={required}
        onChange={handleChange}
        className="text-sm text-foreground/60"
      />
      {error && <p className="text-sm text-brand-red">{error}</p>}
    </div>
  );
}
