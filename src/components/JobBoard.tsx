"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { JobStatus } from "@/generated/prisma/enums";
import type { FormActionState } from "@/types/formActions";
import type { JobCardJob } from "./JobCard";
import { useToast } from "./ui/ToastProvider";
import JobBoardHeader from "./JobBoardHeader";
import JobBoardEmptyState from "./JobBoardEmptyState";
import JobBoardColumn from "./JobBoardColumn";

type JobBoardProps = {
  jobs: JobCardJob[];
  updateJobAction: (prevState: FormActionState, formData: FormData) => Promise<FormActionState>;
  updateJobStatusAction: (formData: FormData) => void | Promise<void>;
  deleteJobAction: (prevState: FormActionState, formData: FormData) => Promise<FormActionState>;
  createJobAction: (prevState: FormActionState, formData: FormData) => Promise<FormActionState>;
};

type ColumnsState = Record<JobStatus, JobCardJob[]>;

type DragState = {
  jobId: string;
  fromStatus: JobStatus;
} | null;

function createInitialColumns(jobs: JobCardJob[]): ColumnsState {
  return jobs.reduce<ColumnsState>(
    (acc, job) => {
      acc[job.status].push(job);
      return acc;
    },
    {
      [JobStatus.APPLIED]: [],
      [JobStatus.INTERVIEW]: [],
      [JobStatus.OFFER]: [],
      [JobStatus.REJECTED]: [],
    }
  );
}

export default function JobBoard(props: JobBoardProps) {
  const { jobs, updateJobAction, updateJobStatusAction, deleteJobAction, createJobAction } =
    props;
  const { addToast } = useToast();
  // TODO: this component is still relatively large; consider further splitting if responsibilities grow.

  const [columns, setColumns] = useState<ColumnsState>(() =>
    createInitialColumns(jobs)
  );
  const [dragged, setDragged] = useState<DragState>(null);
  const [activeStatus, setActiveStatus] = useState<JobStatus | null>(null);

  useEffect(() => {
    setColumns(createInitialColumns(jobs));
  }, [jobs]);

  const updateStatusFormRef = useRef<HTMLFormElement | null>(null);
  const deleteFormRef = useRef<HTMLFormElement | null>(null);

  const initialFormState: FormActionState = {
    status: "idle",
    message: null,
    submissionId: 0,
  };

  const [deleteState, deleteFormAction] = useActionState(deleteJobAction, initialFormState);
  const lastHandledDeleteIdRef = useRef(0);

  useEffect(() => {
    if (!deleteState.submissionId) return;
    if (deleteState.submissionId === lastHandledDeleteIdRef.current) return;

    lastHandledDeleteIdRef.current = deleteState.submissionId;

    if (deleteState.status === "success") {
      addToast(deleteState.message ?? "Vacancy deleted", "success");
    } else if (deleteState.status === "error") {
      addToast(deleteState.message ?? "Failed to delete vacancy", "error");
    }
  }, [deleteState.submissionId, deleteState.status, deleteState.message, addToast]);

  const orderedStatuses = useMemo(
    () => [
      JobStatus.APPLIED,
      JobStatus.INTERVIEW,
      JobStatus.OFFER,
      JobStatus.REJECTED,
    ],
    []
  );

  const totalJobs = jobs.length;

  const handleDragStart = (jobId: string, fromStatus: JobStatus) => {
    setDragged({ jobId, fromStatus });
  };

  const handleDragEnd = () => {
    setDragged(null);
    setActiveStatus(null);
  };

  const handleDrop = (targetStatus: JobStatus) => {
    if (!dragged) return;
    if (dragged.fromStatus === targetStatus) {
      setDragged(null);
      setActiveStatus(null);
      return;
    }

    setColumns((prev) => {
      const next: ColumnsState = {
        [JobStatus.APPLIED]: [...prev[JobStatus.APPLIED]],
        [JobStatus.INTERVIEW]: [...prev[JobStatus.INTERVIEW]],
        [JobStatus.OFFER]: [...prev[JobStatus.OFFER]],
        [JobStatus.REJECTED]: [...prev[JobStatus.REJECTED]],
      };

      const sourceJobs = next[dragged.fromStatus];
      const index = sourceJobs.findIndex((job) => job.id === dragged.jobId);
      if (index === -1) {
        return prev;
      }

      const [movedJob] = sourceJobs.splice(index, 1);
      next[targetStatus].unshift({ ...movedJob, status: targetStatus });

      return next;
    });

    const form = updateStatusFormRef.current;
    if (form) {
      const jobIdInput = form.elements.namedItem(
        "jobId"
      ) as HTMLInputElement | null;
      const statusInput = form.elements.namedItem(
        "status"
      ) as HTMLInputElement | null;

      if (jobIdInput && statusInput) {
        jobIdInput.value = dragged.jobId;
        statusInput.value = targetStatus;
        form.requestSubmit();
      }
    }

    setDragged(null);
    setActiveStatus(null);
  };

  const handleActivateStatus = (status: JobStatus | null) => {
    setActiveStatus(status);
  };

  const handleDelete = (jobId: string) => {
    const form = deleteFormRef.current;
    if (!form) return;

    const jobIdInput = form.elements.namedItem("jobId") as HTMLInputElement | null;
    if (!jobIdInput) return;

    jobIdInput.value = jobId;
    form.requestSubmit();
  };

  const handleStatusClick = (jobId: string, currentStatus: JobStatus) => {
    const order = orderedStatuses;
    const index = order.indexOf(currentStatus);
    if (index === -1) return;

    const nextStatus = order[(index + 1) % order.length];

    setColumns((prev) => {
      const next: ColumnsState = {
        [JobStatus.APPLIED]: [...prev[JobStatus.APPLIED]],
        [JobStatus.INTERVIEW]: [...prev[JobStatus.INTERVIEW]],
        [JobStatus.OFFER]: [...prev[JobStatus.OFFER]],
        [JobStatus.REJECTED]: [...prev[JobStatus.REJECTED]],
      };

      const sourceJobs = next[currentStatus];
      const indexInSource = sourceJobs.findIndex((job) => job.id === jobId);
      if (indexInSource === -1) {
        return prev;
      }

      const [movedJob] = sourceJobs.splice(indexInSource, 1);
      next[nextStatus].unshift({ ...movedJob, status: nextStatus });

      return next;
    });

    const form = updateStatusFormRef.current;
    if (form) {
      const jobIdInput = form.elements.namedItem(
        "jobId"
      ) as HTMLInputElement | null;
      const statusInput = form.elements.namedItem(
        "status"
      ) as HTMLInputElement | null;

      if (jobIdInput && statusInput) {
        jobIdInput.value = jobId;
        statusInput.value = nextStatus;
        form.requestSubmit();
      }
    }
  };

  return (
    <section className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur gap-4">
      <JobBoardHeader
        totalJobs={totalJobs}
        createJobAction={createJobAction}
      />

      {totalJobs === 0 ? (
        <JobBoardEmptyState
          createJobAction={createJobAction}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {orderedStatuses.map((status) => (
            <JobBoardColumn
              key={status}
              status={status}
              jobs={columns[status]}
              dragged={dragged}
              activeStatus={activeStatus}
              onActivateStatus={handleActivateStatus}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              onStatusClick={handleStatusClick}
              onDelete={handleDelete}
              updateJobAction={updateJobAction}
            />
          ))}
        </div>
      )}

      <form ref={updateStatusFormRef} action={updateJobStatusAction} className="hidden">
        <input type="hidden" name="jobId" />
        <input type="hidden" name="status" />
      </form>

      <form ref={deleteFormRef} action={deleteFormAction} className="hidden">
        <input type="hidden" name="jobId" />
      </form>
    </section>
  );
}
