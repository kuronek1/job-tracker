import { JobStatus } from "@/generated/prisma/enums";

export const statusLabels: Record<JobStatus, string> = {
  APPLIED: "Отклик",
  INTERVIEW: "Собеседование",
  OFFER: "Оффер",
  REJECTED: "Отказ",
};
