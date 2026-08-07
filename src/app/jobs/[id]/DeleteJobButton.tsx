"use client";

import { Button } from "@/components/ui/Button";
import { deleteJob } from "./actions";

export function DeleteJobButton({ jobId }: { jobId: string }) {
  return (
    <form
      action={deleteJob}
      onSubmit={(event) => {
        if (!confirm("Delete this job listing? This can't be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={jobId} />
      <Button type="submit" variant="outline" size="sm">
        Delete
      </Button>
    </form>
  );
}
