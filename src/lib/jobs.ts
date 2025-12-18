import { prisma } from "./prisma";
import { JobStatus } from "../generated/prisma/enums";

export async function listJobs(userId: string) {
  return prisma.job.findMany({
    where: { userId },
    // TODO: consider adding pagination (skip/take) and optional filters (status/search) for large job lists.
    orderBy: { createdAt: "desc" },
  });
}

export async function createJob(params: {
  userId: string;
  title: string;
  company: string;
  status?: JobStatus;
  notes?: string;
  companyLink?: string;
  vacancyLink?: string;
  salary?: string;
  location?: string;
  contact?: string;
  nextStep?: string;
}) {
  const {
    userId,
    title,
    company,
    status = JobStatus.APPLIED,
    notes,
    companyLink,
    vacancyLink,
    salary,
    location,
    contact,
    nextStep,
  } = params;
  return prisma.job.create({
    data: {
      title,
      company,
      status,
      notes,
      userId,
      companyLink,
      vacancyLink,
      salary,
      location,
      contact,
      nextStep,
    },
  });
}

export async function updateJob(
  userId: string,
  jobId: string,
  data: Partial<{
    title: string;
    company: string;
    status: JobStatus;
    notes: string | null;
    companyLink: string | null;
    vacancyLink: string | null;
    salary: string | null;
    location: string | null;
    contact: string | null;
    nextStep: string | null;
  }>
) {
  const result = await prisma.job.updateMany({
    where: { id: jobId, userId },
    data,
  });
  if (result.count === 0) {
    throw new Error("Job not found");
  }
}

export async function deleteJob(userId: string, jobId: string) {
  const result = await prisma.job.deleteMany({
    where: { id: jobId, userId },
  });
  if (result.count === 0) {
    throw new Error("Job not found");
  }
}
