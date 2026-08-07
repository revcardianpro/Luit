"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";

export async function updateProfile(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const fullName = formData.get("full_name") as string;
  const bio = formData.get("bio") as string;
  const avatarFile = formData.get("avatar") as File | null;

  const supabase = await createClient();

  let avatarUrl: string | undefined;

  // Only touch storage if the user actually picked a file — an empty
  // file input still shows up in FormData, but with size 0.
  if (avatarFile && avatarFile.size > 0) {
    // `accept="image/*"` on the file input is only a client-side hint —
    // the server has to verify the actual upload is image data itself,
    // since the avatars bucket is public and anyone could otherwise
    // upload an arbitrary file with a faked extension.
    if (!avatarFile.type.startsWith("image/")) {
      redirectWithError("/account", "Avatar must be an image file.");
    }

    // Fixed path (no extension in the key) so re-uploading always
    // overwrites the same object — avoids leaving old avatar.jpg files
    // orphaned in storage every time someone uploads a different image
    // format. The real content type is still stored via `contentType`.
    const filePath = `${user.id}/avatar`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, { upsert: true, contentType: avatarFile.type });

    if (uploadError) {
      redirectWithError("/account", uploadError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    // Cache-bust: since the path never changes, browsers/CDNs would
    // otherwise keep showing the previous image against this same URL.
    avatarUrl = `${publicUrl}?v=${Date.now()}`;
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      bio,
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
    })
    .eq("id", user.id);

  if (error) {
    redirectWithError("/account", error.message);
  }

  // The account page reads the profile server-side, so without this the
  // page would keep showing stale (pre-edit) data from Next.js's cache
  // after the redirect below.
  revalidatePath("/account");
  redirect("/account?success=1");
}
