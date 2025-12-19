"use client";

import { JobStatus } from "@/generated/prisma/enums";
import { statusLabels } from "@/constants/statuses";
import type { FormActionState } from "@/types/formActions";
import type { JobCardJob } from "./JobCard";
import JobCard from "./JobCard";

type DragState = {
  jobId: string;
  fromStatus: JobStatus;
} | null;

type JobBoardColumnProps = {
  status: JobStatus;
  jobs: JobCardJob[];
  dragged: DragState;
  activeStatus: JobStatus | null;
  onActivateStatus: (status: JobStatus | null) => void;
  onDragStart: (jobId: string, fromStatus: JobStatus) => void;
  onDragEnd: () => void;
  onDrop: (status: JobStatus) => void;
  onStatusClick: (jobId: string, status: JobStatus) => void;
  onDelete: (jobId: string) => void;
  updateJobAction: (
    prevState: FormActionState,
    formData: FormData,
  ) => Promise<FormActionState>;
};

export default function JobBoardColumn(props: JobBoardColumnProps) {
  const {
    status,
    jobs,
    dragged,
    activeStatus,
    onActivateStatus,
    onDragStart,
    onDragEnd,
    onDrop,
    onStatusClick,
    onDelete,
    updateJobAction,
  } = props;

  const columnJobs = jobs;
  const label = statusLabels[status] ?? status;
  const isActive = Boolean(
    dragged &&
      activeStatus === status &&
      dragged.fromStatus !== status,
  );

  return (
    <div
      className={`flex w-full min-w-0 flex-col gap-3 rounded-2xl border p-3 transition-colors ${
        isActive
          ? "border-emerald-400/70 bg-emerald-500/10"
          : "border-white/10 bg-black/20"
      }`}
      onDragOver={(event) => {
        if (!dragged) return;
        event.preventDefault();
        if (activeStatus !== status) {
          onActivateStatus(status);
        }
      }}
      onDragLeave={() => {
        if (activeStatus === status) {
          onActivateStatus(null);
        }
      }}
      onDrop={() => onDrop(status)}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs uppercase tracking-[0.18em] text-slate-300">
            {label}
          </p>
          <p className="text-[11px] text-slate-400">
            {columnJobs.length} item(s)
          </p>
        </div>
      </div>

      <div className="flex min-h-[60px] flex-col gap-2">
        {columnJobs.length === 0 ? (
          <p className="rounded-lg border border-dashed border-white/10 bg-black/10 px-2 py-3 text-[11px] text-slate-400">
            No items.
          </p>
        ) : (
          columnJobs.map((job) => (
            <div
              key={job.id}
              draggable
              onDragStart={() => onDragStart(job.id, status)}
              onDragEnd={onDragEnd}
              className="cursor-move"
            >
              <JobCard
                job={job}
                updateJobAction={updateJobAction}
                onDelete={onDelete}
                onStatusClick={onStatusClick}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
