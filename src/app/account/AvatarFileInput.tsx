"use client";

import { useState } from "react";

// Kept safely under the 5MB Server Action body limit set in
// next.config.ts, leaving headroom for multipart/form-data overhead
// (boundaries, part headers) so a file right at the edge doesn't still
// slip past this check and hit the server's hard limit instead.
const MAX_AVATAR_BYTES = 4 * 1024 * 1024;

/**
 * The avatar file input, split out from ProfileForm as its own Client
 * Component ("use client") because it needs to check the picked file's
 * size in the browser and show a friendly message — a Server Component
 * can't react to a file input's onChange event. The rest of the profile
 * form stays a plain Server Component; only this one field needs JS.
 */
export function AvatarFileInput() {
  const [error, setError] = useState<string | null>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file && file.size > MAX_AVATAR_BYTES) {
      setError(`"${file.name}" is too large (max 4MB). Choose a smaller image.`);
      event.target.value = "";
    } else {
      setError(null);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="avatar" className="text-sm font-medium text-foreground/80">
        Avatar
      </label>
      <input
        id="avatar"
        name="avatar"
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="text-sm text-foreground/60"
      />
      {error && <p className="text-sm text-brand-red">{error}</p>}
    </div>
  );
}
