"use client";

import type { FormActionState } from "@/types/formActions";
import NewJobModal from "./NewJobModal";
import Button from "./ui/Button";

type JobBoardEmptyStateProps = {
  createJobAction: (
    prevState: FormActionState,
    formData: FormData,
  ) => Promise<FormActionState>;
};

export default function JobBoardEmptyState(props: JobBoardEmptyStateProps) {
  const { createJobAction } = props;

  return (
    <div className="flex flex-col w-full items-center gap-4 rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-40 text-sm text-slate-300">
      <div className="flex items-center flex-col text-xl">
        <p>No items.</p>
        <p>Please add first vacancy.</p>
      </div>
      <NewJobModal createJobAction={createJobAction}>
        {(open) => (
          <Button size="sm" className="px-10!" onClick={open}>
            Add new vacancy
          </Button>
        )}
      </NewJobModal>
    </div>
  );
}
