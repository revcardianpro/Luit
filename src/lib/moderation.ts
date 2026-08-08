export const reportableContentTypes = [
  "creator_post",
  "creator_post_comment",
  "product",
  "job",
  "event",
] as const;

export type ReportableContentType = (typeof reportableContentTypes)[number];

export const contentTypeLabels: Record<ReportableContentType, string> = {
  creator_post: "Creator post",
  creator_post_comment: "Comment",
  product: "Marketplace listing",
  job: "Job listing",
  event: "Event",
};
