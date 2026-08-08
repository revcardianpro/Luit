import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import type { Notification } from "@/lib/supabase/types";
import { Button } from "@/components/ui/Button";
import { markAllRead } from "./actions";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const notifications = (data ?? []) as Notification[];
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Notifications</h1>
        {unreadCount > 0 && (
          <form action={markAllRead}>
            <Button type="submit" variant="outline" size="sm">
              Mark all as read
            </Button>
          </form>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="mt-10 text-foreground/60">
          Nothing yet — you&rsquo;ll see it here when someone likes or comments on your posts.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-2">
          {notifications.map((notification) => (
            <Link
              key={notification.id}
              href={`/notifications/open/${notification.id}`}
              className={`flex items-start gap-3 rounded-xl border p-4 transition-colors ${
                notification.read_at
                  ? "border-foreground/10 hover:border-foreground/20"
                  : "border-primary/30 bg-primary/5 hover:border-primary/50"
              }`}
            >
              {!notification.read_at && (
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
              )}
              <div className={notification.read_at ? "pl-5" : ""}>
                <p className="text-sm text-foreground/90">{notification.message}</p>
                <p className="mt-1 text-xs text-foreground/50">
                  {new Date(notification.created_at).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
