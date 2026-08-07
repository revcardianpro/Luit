"use client";

import { deleteComment } from "./actions";

export function DeleteCommentButton({
  commentId,
  postId,
}: {
  commentId: string;
  postId: string;
}) {
  return (
    <form
      action={deleteComment}
      onSubmit={(event) => {
        if (!confirm("Delete this comment?")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="comment_id" value={commentId} />
      <input type="hidden" name="post_id" value={postId} />
      <button type="submit" className="text-xs text-foreground/40 hover:text-brand-red">
        Delete
      </button>
    </form>
  );
}
