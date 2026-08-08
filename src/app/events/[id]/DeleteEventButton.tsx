"use client";

import { Button } from "@/components/ui/Button";
import { deleteEvent } from "./actions";

export function DeleteEventButton({ eventId }: { eventId: string }) {
  return (
    <form
      action={deleteEvent}
      onSubmit={(event) => {
        if (!confirm("Delete this event? This can't be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={eventId} />
      <Button type="submit" variant="outline" size="sm">
        Delete
      </Button>
    </form>
  );
}
