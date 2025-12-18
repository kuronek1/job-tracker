import { FiLogOut } from "react-icons/fi";
import { revalidatePath } from "next/cache";
import { requireUser, getCurrentUser } from "@/lib/auth";
import { createJob, listJobs, updateJob, deleteJob } from "@/lib/jobs";
import { JobStatus } from "@/generated/prisma/enums";
import type { FormActionState } from "@/types/formActions";
import { signOutAction } from "./(auth)/actions";
import LandingPage from "@/components/LandingPage";
import Button from "@/components/ui/Button";
import PageLayout from "@/components/ui/PageLayout";
import JobBoard from "@/components/JobBoard";

type CreateJobResult = {
  ok: boolean;
  message?: string;
};

async function handleCreateJob(formData: FormData): Promise<CreateJobResult> {
  // TODO: extract validation + normalization into a shared helper to keep this function smaller.
  const user = await requireUser();
  const title = (formData.get("title") as string | null)?.trim();
  const company = (formData.get("company") as string | null)?.trim();
  const status = formData.get("status") as keyof typeof JobStatus | null;
  const notes = (formData.get("notes") as string | null)?.trim() || undefined;
  const companyLink = (formData.get("companyLink") as string | null)?.trim() || undefined;
  const vacancyLink = (formData.get("vacancyLink") as string | null)?.trim() || undefined;
  const salary = (formData.get("salary") as string | null)?.trim() || undefined;
  const location = (formData.get("location") as string | null)?.trim() || undefined;
  const contact = (formData.get("contact") as string | null)?.trim() || undefined;
  const nextStep = (formData.get("nextStep") as string | null)?.trim() || undefined;

  if (!title || !company) {
    return { ok: false, message: "Title and company are required" };
  }

  await createJob({
    userId: user.id,
    title,
    company,
    status: status && JobStatus[status] ? JobStatus[status] : JobStatus.APPLIED,
    notes,
    companyLink,
    vacancyLink,
    salary,
    location,
    contact,
    nextStep,
  });

  revalidatePath("/");

  return { ok: true };
}

async function createJobAction(formData: FormData) {
  "use server";

  await handleCreateJob(formData);
}

async function createJobFormAction(
  prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  "use server";

  const result = await handleCreateJob(formData);
  const submissionId = prevState.submissionId + 1;

  if (!result.ok) {
    return {
      status: "error",
      message: result.message ?? "Failed to create vacancy",
      submissionId,
    };
  }

  return {
    status: "success",
    message: "Vacancy created",
    submissionId,
  };
}

type UpdateJobResult = {
  ok: boolean;
  message?: string;
};

async function handleUpdateJob(formData: FormData): Promise<UpdateJobResult> {
  // TODO: extract validation + normalization into a shared helper to keep this function smaller.
  const user = await requireUser();
  const jobId = (formData.get("jobId") as string | null)?.trim();
  if (!jobId) {
    return { ok: false, message: "Missing job id" };
  }

  const title = (formData.get("title") as string | null)?.trim();
  const company = (formData.get("company") as string | null)?.trim();
  const status = formData.get("status") as keyof typeof JobStatus | null;
  const notes = (formData.get("notes") as string | null)?.trim() || null;
  const companyLink = (formData.get("companyLink") as string | null)?.trim() || null;
  const vacancyLink = (formData.get("vacancyLink") as string | null)?.trim() || null;
  const salary = (formData.get("salary") as string | null)?.trim() || null;
  const location = (formData.get("location") as string | null)?.trim() || null;
  const contact = (formData.get("contact") as string | null)?.trim() || null;
  const nextStep = (formData.get("nextStep") as string | null)?.trim() || null;

  await updateJob(user.id, jobId, {
    title: title || undefined,
    company: company || undefined,
    status: status && JobStatus[status] ? JobStatus[status] : undefined,
    notes,
    companyLink,
    vacancyLink,
    salary,
    location,
    contact,
    nextStep,
  });

  revalidatePath("/");

  return { ok: true };
}

async function updateJobAction(formData: FormData) {
  "use server";

  const user = await requireUser();
  const jobId = (formData.get("jobId") as string | null)?.trim();
  if (!jobId) return;

  const status = formData.get("status") as keyof typeof JobStatus | null;

  await updateJob(user.id, jobId, {
    status: status && JobStatus[status] ? JobStatus[status] : undefined,
  });

  revalidatePath("/");
}

async function updateJobFormAction(
  prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  "use server";

  const result = await handleUpdateJob(formData);
  const submissionId = prevState.submissionId + 1;

  if (!result.ok) {
    return {
      status: "error",
      message: result.message ?? "Failed to update vacancy",
      submissionId,
    };
  }

  return {
    status: "success",
    message: "Vacancy updated",
    submissionId,
  };
}

async function deleteJobAction(formData: FormData) {
  "use server";

  const user = await requireUser();
  const jobId = (formData.get("jobId") as string | null)?.trim();
  if (!jobId) return;

  await deleteJob(user.id, jobId);
  revalidatePath("/");
}

type DeleteJobResult = {
  ok: boolean;
  message?: string;
};

async function handleDeleteJob(formData: FormData): Promise<DeleteJobResult> {
  const user = await requireUser();
  const jobId = (formData.get("jobId") as string | null)?.trim();
  if (!jobId) {
    return { ok: false, message: "Missing job id" };
  }

  await deleteJob(user.id, jobId);
  revalidatePath("/");

  return { ok: true };
}

async function deleteJobFormAction(
  prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  "use server";

  const result = await handleDeleteJob(formData);
  const submissionId = prevState.submissionId + 1;

  if (!result.ok) {
    return {
      status: "error",
      message: result.message ?? "Failed to delete vacancy",
      submissionId,
    };
  }

  return {
    status: "success",
    message: "Vacancy deleted",
    submissionId,
  };
}

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    return <LandingPage />;
  }

  const jobs = await listJobs(user.id);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-50">
      <PageLayout
        contentClassName="flex flex-col gap-10 pb-12"
        rightSlot={
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-white/10 px-4 py-2 text-sm text-slate-100">
              {user.username ?? user.email}
            </span>
            <form action={signOutAction}>
              <Button type="submit" size="sm">
                <span className="flex items-center gap-2">
                  <span>Log out</span>
                  <FiLogOut className="h-3.5 w-3.5" />
                </span>
              </Button>
            </form>
          </div>
        }
      >
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Job Tracker CRM</p>
              <h1 className="text-3xl font-semibold leading-tight">
                Control your job pipeline with Supabase + Next.js
              </h1>
            </div>
          </div>
          <p className="max-w-3xl text-slate-200">
            Auth stores password hashes and session tokens in Postgres. Supabase/Postgres keeps your job and pipeline
            data.
          </p>
        </header>

        <JobBoard
          jobs={jobs}
          updateJobAction={updateJobFormAction}
          updateJobStatusAction={updateJobAction}
          deleteJobAction={deleteJobFormAction}
          createJobAction={createJobFormAction}
        />
      </PageLayout>
    </div>
  );
}

