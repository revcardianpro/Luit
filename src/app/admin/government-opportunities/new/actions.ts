"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";
import { listingTypes } from "@/lib/government-opportunity-types";

export async function createGovernmentOpportunity(formData: FormData) {
  await requireAdmin();

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
    redirectWithError("/admin/government-opportunities/new", "Please fill in all fields.");
  }

  if (!listingTypes.includes(listingType as (typeof listingTypes)[number])) {
    redirectWithError("/admin/government-opportunities/new", "Invalid listing type.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("government_opportunities").insert({
    title,
    organization,
    listing_type: listingType,
    key_dates: keyDates,
    description,
    source_url: sourceUrl,
    info_verified_on: infoVerifiedOn,
  });

  if (error) {
    redirectWithError("/admin/government-opportunities/new", error.message);
  }

  redirect("/admin/government-opportunities");
}
