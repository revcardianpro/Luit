"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { submitReport } from "@/lib/moderation-actions";
import type { ReportableContentType } from "@/lib/moderation";

export function ReportButton({
  contentType,
  contentId,
}: {
  contentType: ReportableContentType;
  contentId: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await submitReport({ contentType, contentId, reason });
      if (result.error) {
        setErrorMessage(result.error);
        setStatus("error");
      } else {
        setStatus("done");
      }
    });
  }

  if (status === "done") {
    return <p className="text-xs text-foreground/50">Thanks — our team will review this.</p>;
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-foreground/40 hover:text-foreground/70"
      >
        Report
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xs flex-col gap-2 rounded-lg border border-foreground/10 p-3"
    >
      <label className="text-xs font-medium text-foreground/70">Why are you reporting this?</label>
      <textarea
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        required
        rows={2}
        className="rounded-lg border border-foreground/15 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
      {status === "error" && <p className="text-xs text-brand-red">{errorMessage}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Submitting…" : "Submit report"}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
