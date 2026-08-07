"use client";

import { Button } from "@/components/ui/Button";
import { deletePost } from "./actions";

export function DeletePostButton({ postId }: { postId: string }) {
  return (
    <form
      action={deletePost}
      onSubmit={(event) => {
        if (!confirm("Delete this post? This can't be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={postId} />
      <Button type="submit" variant="outline" size="sm">
        Delete
      </Button>
    </form>
  );
}
