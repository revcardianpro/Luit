"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";
import { listingTypes } from "@/lib/government-opportunity-types";

export async function updateGovernmentOpportunity(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  const editPath = `/admin/government-opportunities/${id}/edit`;

  const title = (formData.get("title") as string)?.trim();
  const organization = (formData.get("organization") as string)?.trim();
  const listingType = formData.get("listing_type") as string;
  const keyDates = (formData.get("key_dates") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const sourceUrl = (formData.get("source_url") as string)?.trim();
  const infoVerifiedOn = formData.get("info_verified_on") as string;

  if (
    !title ||
    !organization ||
    !listingType ||
    !keyDates ||
    !description ||
    !sourceUrl ||
    !infoVerifiedOn
  ) {
    redirectWithError(editPath, "Please fill in all fields.");
  }

  if (!listingTypes.includes(listingType as (typeof listingTypes)[number])) {
    redirectWithError(editPath, "Invalid listing type.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("government_opportunities")
    .update({
      title,
      organization,
      listing_type: listingType,
      key_dates: keyDates,
      description,
      source_url: sourceUrl,
      info_verified_on: infoVerifiedOn,
    })
    .eq("id", id);

  if (error) {
    redirectWithError(editPath, error.message);
  }

  redirect("/admin/government-opportunities");
}
