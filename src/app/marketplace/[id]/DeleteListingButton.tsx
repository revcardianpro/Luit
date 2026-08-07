"use client";

import { Button } from "@/components/ui/Button";
import { deleteListing } from "./actions";

/**
 * Wraps the delete Server Action in a native confirm() prompt — a
 * destructive, irreversible action shouldn't fire on a single
 * accidental click. This is the one bit of this page that needs to be
 * a Client Component; the rest of the page stays server-rendered.
 */
export function DeleteListingButton({ productId }: { productId: string }) {
  return (
    <form
      action={deleteListing}
      onSubmit={(event) => {
        if (!confirm("Delete this listing? This can't be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={productId} />
      <Button type="submit" variant="outline" size="sm">
        Delete
      </Button>
    </form>
  );
}
