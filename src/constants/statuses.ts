import { JobStatus } from "@/generated/prisma/enums";

export const statusLabels: Record<JobStatus, string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};
