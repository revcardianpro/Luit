"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * "Share" here means "copy this post's link" -- deliberately the
 * simplest possible version (see the luit-feature-backlog project
 * memory: richer sharing/reposting was scoped out of this phase). Uses
 * the Web Share API on devices that support it (mobile browsers, where
 * it opens the native share sheet), falling back to copying the link
 * to the clipboard everywhere else.
 */
export function ShareButton({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled the native share sheet -- not an error.
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleShare}>
      {copied ? "Link copied!" : "Share"}
    </Button>
  );
}
