"use client";

import { Button } from "@/components/ui/Button";

/**
 * Shared delete-confirmation button for every admin CRUD page. One
 * component instead of a near-identical DeleteXButton per table (unlike
 * the user-facing Delete*Button components elsewhere, which each bind
 * to a specific Server Action with a hardcoded "id" field) — here the
 * action itself varies by table, so it's passed in directly.
 */
export function AdminDeleteButton({
  action,
  id,
  confirmMessage,
}: {
  action: (formData: FormData) => void;
  id: string;
  confirmMessage: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="outline" size="sm">
        Delete
      </Button>
    </form>
  );
}
