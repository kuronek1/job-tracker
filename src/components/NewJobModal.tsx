"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useRef, type ReactNode } from "react";
import { JobStatus } from "@/generated/prisma/enums";
import type { FormActionState } from "@/types/formActions";
import type { JobCardJob } from "./JobCard";
import { useToast } from "./ui/ToastProvider";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import SelectInput from "./ui/SelectInput";

type NewJobModalProps = {
  job?: JobCardJob;
  createJobAction?: (
    prevState: FormActionState,
    formData: FormData,
  ) => Promise<FormActionState>;
  updateJobAction?: (
    prevState: FormActionState,
    formData: FormData,
  ) => Promise<FormActionState>;
  children?: (open: () => void) => ReactNode;
};

const initialState: FormActionState = {
  status: "idle",
  message: null,
  submissionId: 0,
};

export default function NewJobModal(props: NewJobModalProps) {
  const { job, createJobAction, updateJobAction, children } = props;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { addToast } = useToast();

  const isEdit = Boolean(job && updateJobAction);
  const modalKey = isEdit ? "edit-job" : "new-job";

  const actionFn = isEdit ? updateJobAction : createJobAction;
  // TODO: avoid non-null assertion by enforcing that the correct action is always passed for each mode at the type level.
  const [formState, formAction] = useActionState(actionFn!, initialState);
  const lastHandledSubmissionIdRef = useRef(0);

  const isOpen =
    searchParams.get("modal") === modalKey &&
    (!isEdit || searchParams.get("jobId") === job?.id);

  const openModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", modalKey);
    if (isEdit && job) {
      params.set("jobId", job.id);
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    params.delete("jobId");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  useEffect(() => {
    if (!formState.submissionId) return;
    if (formState.submissionId === lastHandledSubmissionIdRef.current) return;

    lastHandledSubmissionIdRef.current = formState.submissionId;

    if (formState.status === "success") {
      addToast(formState.message ?? (isEdit ? "Vacancy updated" : "Vacancy created"), "success");
      closeModal();
    } else if (formState.status === "error") {
      addToast(
        formState.message ?? (isEdit ? "Failed to update vacancy" : "Failed to create vacancy"),
        "error",
      );
    }
  }, [formState.submissionId, formState.status, formState.message, addToast, isEdit]);

  if (!actionFn) {
    return null;
  }

  const statusOptions = Object.values(JobStatus);

  const title = isEdit ? "Edit vacancy" : "Add new vacancy";
  const description = isEdit
    ? "Update the fields and save changes."
    : "Fill in the fields to create a new vacancy.";
  const submitLabel = isEdit ? "Save changes" : "Save";

  return (
    <>
      {children ? (
        children(openModal)
      ) : (
        <Button size="sm" onClick={openModal}>
          Add
        </Button>
      )}

      <Modal open={isOpen} onClose={closeModal} title={title} description={description} size="lg">
        <form action={formAction} className="mt-2 flex max-h-[min(70vh,560px)] flex-col">
          {isEdit && job ? <input type="hidden" name="jobId" value={job.id} /> : null}

          <div className="custom-scrollbar -mx-1 flex-1 space-y-3 overflow-y-auto px-1">
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                label="Title"
                name="title"
                required
                defaultValue={isEdit ? job?.title : undefined}
                placeholder="Frontend developer"
              />
              <Input
                label="Company"
                name="company"
                required
                defaultValue={isEdit ? job?.company : undefined}
                placeholder="Acme Corp"
              />
            </div>

            <SelectInput
              label="Status"
              name="status"
              defaultValue={isEdit ? String(job?.status) : JobStatus.APPLIED}
              options={statusOptions.map((status) => ({ value: status, label: status }))}
              searchable={false}
            />

            <Textarea
              label="Comment"
              name="notes"
              defaultValue={isEdit ? job?.notes ?? "" : undefined}
              rows={3}
              placeholder="Call on next week"
            />

            <details className="rounded-xl border border-white/15 bg-black/10 px-4 py-3 text-sm text-slate-100">
              <summary className="cursor-pointer select-none font-semibold text-slate-50">
                Optional fields
              </summary>
              <div className="mt-3 flex flex-col gap-3">
                <Input
                  label="Company Link"
                  type="url"
                  name="companyLink"
                  defaultValue={isEdit ? job?.companyLink ?? "" : undefined}
                  placeholder="https://company.com"
                />
                <Input
                  label="Vacancy Link"
                  type="url"
                  name="vacancyLink"
                  defaultValue={isEdit ? job?.vacancyLink ?? "" : undefined}
                  placeholder="https://company.com/jobs/frontend"
                />
                <Input
                  label="Salary"
                  type="text"
                  name="salary"
                  defaultValue={isEdit ? job?.salary ?? "" : undefined}
                  placeholder="$4-5k / 2.2k"
                />
                <Input
                  label="Location / Format"
                  type="text"
                  name="location"
                  defaultValue={isEdit ? job?.location ?? "" : undefined}
                  placeholder="Remote, Berlin, Hybrid"
                />
                <Input
                  label="Contact info"
                  type="text"
                  name="contact"
                  defaultValue={isEdit ? job?.contact ?? "" : undefined}
                  placeholder="Ann, ann@company.com"
                />
                <Input
                  label="Next step"
                  type="text"
                  name="nextStep"
                  defaultValue={isEdit ? job?.nextStep ?? "" : undefined}
                  placeholder="Onboarding, final, test task"
                />
              </div>
            </details>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" size="sm" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {submitLabel}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
