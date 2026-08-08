import type { SupabaseClient } from "@supabase/supabase-js";
import type { Notification } from "@/lib/supabase/types";

export type NotificationType = Notification["type"];

/**
 * Creates one notification row. Takes an already-created Supabase
 * client (the caller's own RLS-respecting one, from createClient() in
 * a Server Action) rather than making its own, since it always runs
 * inside a mutation that already has one open.
 *
 * Silently no-ops when the recipient is the actor -- liking or
 * commenting on your own post, for instance, shouldn't notify you
 * about yourself. Errors are logged, not thrown: a failed notification
 * insert should never take down the like/comment/removal it's
 * attached to (the same "don't let a side effect break the main
 * action" reasoning as elsewhere in this codebase).
 */
export async function createNotification(
  supabase: SupabaseClient,
  input: {
    recipientId: string;
    actorId: string;
    type: NotificationType;
    message: string;
    contentHref: string;
  },
) {
  if (input.recipientId === input.actorId) {
    return;
  }

  const { error } = await supabase.from("notifications").insert({
    recipient_id: input.recipientId,
    actor_id: input.actorId,
    type: input.type,
    message: input.message,
    content_href: input.contentHref,
  });

  if (error) {
    console.error("createNotification: insert failed", input.type, error.message);
  }
}

/** Display name to use in a notification message -- profiles.full_name is nullable. */
export function actorDisplayName(fullName: string | null) {
  return fullName?.trim() || "Someone";
}
