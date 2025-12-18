"use client";

import Link from "next/link";
import { FiEdit2, FiTrash2, FiChevronRight } from "react-icons/fi";
import type { JobStatus } from "@/generated/prisma/enums";
import type { FormActionState } from "@/types/formActions";
import { statusLabels } from "@/constants/statuses";
import NewJobModal from "./NewJobModal";
import Button from "./ui/Button";

export type JobCardJob = {
  id: string;
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
};

type JobCardProps = {
  job: JobCardJob;
  updateJobAction: (
    prevState: FormActionState,
    formData: FormData
  ) => Promise<FormActionState>;
  onDelete?: (jobId: string) => void;
  onStatusClick?: (jobId: string, status: JobStatus) => void;
};

const statusTheme: Record<JobStatus, { container: string; arrow: string }> = {
  APPLIED: {
    container: "border-emerald-400/40 bg-emerald-500/10 text-emerald-100",
    arrow: "bg-emerald-500/40 text-emerald-50",
  },
  INTERVIEW: {
    container: "border-sky-400/40 bg-sky-500/12 text-sky-100",
    arrow: "bg-sky-500/45 text-sky-50",
  },
  OFFER: {
    container: "border-amber-400/45 bg-amber-500/12 text-amber-50",
    arrow: "bg-amber-500/45 text-amber-50",
  },
  REJECTED: {
    container: "border-rose-400/45 bg-rose-500/12 text-rose-50",
    arrow: "bg-rose-500/45 text-rose-50",
  },
};

function cn(...values: Array<string | undefined | false | null>) {
  return values.filter(Boolean).join(" ");
}

export default function JobCard({
  job,
  updateJobAction,
  onDelete,
  onStatusClick,
}: JobCardProps) {
  const formattedStatus = statusLabels[job.status] ?? job.status;
  const theme = statusTheme[job.status];

  return (
    <article className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/25 p-3 text-sm text-slate-100">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold">{job.title}</h3>
          <p className="truncate text-xs text-slate-300">{job.company}</p>
        </div>
        {onStatusClick ? (
          <button
            type="button"
            onClick={() => onStatusClick(job.id, job.status)}
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-lg border px-1.5 py-1 text-[11px] cursor-pointer transition-colors hover:brightness-110",
              theme.container
            )}
            aria-label={`Change status from ${formattedStatus}`}
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-md",
                theme.arrow
              )}
            >
              <FiChevronRight className="h-3.5 w-3.5" />
            </span>
          </button>
        ) : (
          <div
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-lg border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              theme.container
            )}
          >
            <span className="max-w-20 truncate">{formattedStatus}</span>
          </div>
        )}
      </div>

      {job.notes && (
        <p className="truncate text-[11px] text-slate-300">{job.notes}</p>
      )}

      {job.location && (
        <p className="truncate text-[11px] text-slate-400">
          Location: {job.location}
        </p>
      )}
      {job.salary && (
        <p className="truncate text-[11px] text-slate-400">
          Salary: {job.salary}
        </p>
      )}
      {job.contact && (
        <p className="truncate text-[11px] text-slate-400">
          Contact: {job.contact}
        </p>
      )}
      {job.nextStep && (
        <p className="truncate text-[11px] text-slate-400">
          Next: {job.nextStep}
        </p>
      )}

      <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-slate-300">
        {job.companyLink && (
          <Link
            href={job.companyLink}
            target="_blank"
            className="underline decoration-dotted underline-offset-4"
          >
            Company
          </Link>
        )}
        {job.vacancyLink && (
          <Link
            href={job.vacancyLink}
            target="_blank"
            className="underline decoration-dotted underline-offset-4"
          >
            Vacancy
          </Link>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <NewJobModal job={job} updateJobAction={updateJobAction}>
          {(open) => (
            <Button
              type="button"
              size="xs"
              variant="secondary"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px]"
              onClick={open}
              aria-label="Edit job"
            >
              <FiEdit2 className="h-3.5 w-3.5" />
              <span>Edit</span>
            </Button>
          )}
        </NewJobModal>

        <Button
          type="button"
          size="xs"
          variant="danger"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px]"
          aria-label="Delete job"
          onClick={() => onDelete?.(job.id)}
        >
          <FiTrash2 className="h-3.5 w-3.5" />
          <span>Delete</span>
        </Button>
      </div>
    </article>
  );
}
