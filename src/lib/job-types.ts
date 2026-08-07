import type { BrandAccent } from "@/lib/brand-accent";

export const jobTypes = ["Full-time", "Part-time", "Internship", "Contract", "Volunteer"] as const;

export type JobType = (typeof jobTypes)[number];

const jobTypeAccent: Record<JobType, BrandAccent> = {
  "Full-time": "brand-blue",
  "Part-time": "brand-green",
  Internship: "brand-gold",
  Contract: "brand-red",
  Volunteer: "brand-green",
};

export function getJobTypeAccent(jobType: string): BrandAccent {
  return jobTypeAccent[jobType as JobType] ?? "brand-blue";
}
