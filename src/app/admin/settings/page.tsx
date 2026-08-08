import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/site-settings";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { updateSiteSettings } from "./actions";

export default async function AdminSettingsPage(props: PageProps<"/admin/settings">) {
  await requireAdmin();
  const { error } = await props.searchParams;

  const supabase = await createClient();
  const settings = await getSiteSettings(supabase);

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">Site Settings</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Controls the homepage &ldquo;Watch Our Story&rdquo; video and the footer&rsquo;s social
        links. Anything left blank simply doesn&rsquo;t show up on the site.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
          {error}
        </p>
      )}

      <form action={updateSiteSettings} className="mt-8 flex flex-col gap-4">
        <input type="hidden" name="id" value={settings.id} />

        <Input
          label="Story video URL"
          name="story_video_url"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          defaultValue={settings.story_video_url ?? ""}
        />
        <p className="-mt-2.5 text-xs text-foreground/50">
          A YouTube or Vimeo link. Upload the video there first, then paste its share link here.
        </p>

        <Input
          label="Facebook URL"
          name="facebook_url"
          type="url"
          placeholder="https://facebook.com/..."
          defaultValue={settings.facebook_url ?? ""}
        />
        <Input
          label="Instagram URL"
          name="instagram_url"
          type="url"
          placeholder="https://instagram.com/..."
          defaultValue={settings.instagram_url ?? ""}
        />
        <Input
          label="Twitter / X URL"
          name="twitter_url"
          type="url"
          placeholder="https://x.com/..."
          defaultValue={settings.twitter_url ?? ""}
        />
        <Input
          label="YouTube channel URL"
          name="youtube_url"
          type="url"
          placeholder="https://youtube.com/@..."
          defaultValue={settings.youtube_url ?? ""}
        />

        <Button type="submit">Save changes</Button>
      </form>
    </main>
  );
}
