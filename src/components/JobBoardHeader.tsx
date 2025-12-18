"use client";

import type { FormActionState } from "@/types/formActions";
import NewJobModal from "./NewJobModal";
import Button from "./ui/Button";

type JobBoardHeaderProps = {
  totalJobs: number;
  createJobAction: (
    prevState: FormActionState,
    formData: FormData,
  ) => Promise<FormActionState>;
};

export default function JobBoardHeader(props: JobBoardHeaderProps) {
  const { totalJobs, createJobAction } = props;

  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-xl font-semibold">Job board</h2>
      {totalJobs !== 0 && (
        <NewJobModal createJobAction={createJobAction}>
          {(open) => (
            <Button size="sm" onClick={open}>
              Add
            </Button>
          )}
        </NewJobModal>
      )}
    </div>
  );
}
