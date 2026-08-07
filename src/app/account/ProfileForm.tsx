import { Avatar } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ImageFileInput } from "@/components/ui/ImageFileInput";
import type { Profile } from "@/lib/supabase/types";
import { updateProfile } from "./actions";

interface ProfileFormProps {
  profile: Profile | null;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  return (
    <form action={updateProfile} className="mt-8 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar src={profile?.avatar_url} name={profile?.full_name} size={64} />
        <ImageFileInput name="avatar" label="Avatar" />
      </div>

      <Input
        label="Full name"
        name="full_name"
        defaultValue={profile?.full_name ?? ""}
        placeholder="Your name"
      />
      <Textarea
        label="Bio"
        name="bio"
        rows={4}
        defaultValue={profile?.bio ?? ""}
        placeholder="A short line about yourself"
      />

      <Button type="submit">Save changes</Button>
    </form>
  );
}
