import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requireUser, getCurrentUser } from "@/lib/auth";
import { createJob, listJobs, updateJob, deleteJob } from "@/lib/jobs";
import { JobStatus } from "@/generated/prisma/enums";
import { signOutAction } from "./(auth)/actions";
import LandingPage from "@/components/LandingPage";
import Button from "@/components/Button";
import PageLayout from "@/components/PageLayout";
import { statusLabels } from "@/constants/statuses";

async function createJobAction(formData: FormData) {
  "use server";

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
    return;
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
}

function formatStatus(status: JobStatus) {
  return statusLabels[status] ?? status;
}

async function updateJobAction(formData: FormData) {
  "use server";

  const user = await requireUser();
  const jobId = (formData.get("jobId") as string | null)?.trim();
  if (!jobId) return;

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
}

async function deleteJobAction(formData: FormData) {
  "use server";

  const user = await requireUser();
  const jobId = (formData.get("jobId") as string | null)?.trim();
  if (!jobId) return;

  await deleteJob(user.id, jobId);
  revalidatePath("/");
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
            <span className="rounded-lg bg-white/10 px-4 py-2 text-sm text-slate-100">{user.username ?? user.email}</span>
            <form action={signOutAction}>
              <Button type="submit" size="sm">
                Log out
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
                Контролируйте воронку вакансий на Supabase + Next.js
              </h1>
            </div>
          </div>
          <p className="max-w-3xl text-slate-200">
            Авторизация хранит hash пароля и сессионный токен в Postgres. Supabase/Postgres хранит данные по вакансиям.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Your vacancies</p>
                  <h2 className="text-xl font-semibold">Job board</h2>
                </div>
                <span className="rounded-lg bg-white/10 px-3 py-1 text-xs text-slate-200">{jobs.length} item(s)</span>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                {jobs.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-300">
                    No items. Please add first vacancy on right side.
                  </p>
                ) : (
                  jobs.map((job) => (
                    <article
                      key={job.id}
                      className="flex items-start justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                    >
                      <div className="flex w-full flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{job.title}</h3>
                            <span className="rounded-lg bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-200">
                              {formatStatus(job.status)}
                            </span>
                          </div>
                          <form action={deleteJobAction}>
                            <input type="hidden" name="jobId" value={job.id} />
                            <Button type="submit" variant="danger" size="xs">
                              Delete
                            </Button>
                          </form>
                        </div>
                        <p className="text-sm text-slate-300">{job.company}</p>
                        {job.location ? <p className="text-xs text-slate-400">Локация: {job.location}</p> : null}
                        {job.salary ? <p className="text-xs text-slate-400">Вилка: {job.salary}</p> : null}
                        {job.notes ? <p className="text-xs text-slate-400">{job.notes}</p> : null}
                        <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-300">
                          {job.companyLink ? (
                            <Link href={job.companyLink} className="underline decoration-dotted underline-offset-4" target="_blank">
                              Компания →
                            </Link>
                          ) : null}
                          {job.vacancyLink ? (
                            <Link href={job.vacancyLink} className="underline decoration-dotted underline-offset-4" target="_blank">
                              Вакансия →
                            </Link>
                          ) : null}
                          {job.contact ? <span>Контакт: {job.contact}</span> : null}
                          {job.nextStep ? <span>След. шаг: {job.nextStep}</span> : null}
                        </div>

                        <details className="mt-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100">
                          <summary className="cursor-pointer select-none text-xs uppercase tracking-[0.15em] text-slate-300">
                            Edit
                          </summary>
                          <form action={updateJobAction} className="mt-3 flex flex-col gap-2">
                            <input type="hidden" name="jobId" value={job.id} />
                            <label className="flex flex-col gap-1 text-xs text-slate-200">
                              Title
                              <input
                                name="title"
                                defaultValue={job.title}
                                className="rounded-md border border-white/15 bg-black/30 px-2 py-1 text-sm text-white outline-none focus:border-white/40"
                              />
                            </label>
                            <label className="flex flex-col gap-1 text-xs text-slate-200">
                              Company
                              <input
                                name="company"
                                defaultValue={job.company}
                                className="rounded-md border border-white/15 bg-black/30 px-2 py-1 text-sm text-white outline-none focus:border-white/40"
                              />
                            </label>
                            <label className="flex flex-col gap-1 text-xs text-slate-200">
                              Status
                              <select
                                name="status"
                                defaultValue={job.status}
                                className="rounded-md border border-white/15 bg-black/30 px-2 py-1 text-sm text-white outline-none focus:border-white/40"
                              >
                                {Object.keys(JobStatus).map((status) => (
                                  <option key={status} value={status} className="bg-slate-900 text-white">
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label className="flex flex-col gap-1 text-xs text-slate-200">
                              Comment
                              <textarea
                                name="notes"
                                defaultValue={job.notes ?? ""}
                                rows={2}
                                className="rounded-md border border-white/15 bg-black/30 px-2 py-1 text-sm text-white outline-none focus:border-white/40"
                              />
                            </label>
                            <label className="flex flex-col gap-1 text-xs text-slate-200">
                              Company Link
                              <input
                                name="companyLink"
                                defaultValue={job.companyLink ?? ""}
                                className="rounded-md border border-white/15 bg-black/30 px-2 py-1 text-sm text-white outline-none focus:border-white/40"
                              />
                            </label>
                            <label className="flex flex-col gap-1 text-xs text-slate-200">
                              Vacancy Link
                              <input
                                name="vacancyLink"
                                defaultValue={job.vacancyLink ?? ""}
                                className="rounded-md border border-white/15 bg-black/30 px-2 py-1 text-sm text-white outline-none focus:border-white/40"
                              />
                            </label>
                            <label className="flex flex-col gap-1 text-xs text-slate-200">
                              Salary
                              <input
                                name="salary"
                                defaultValue={job.salary ?? ""}
                                className="rounded-md border border-white/15 bg-black/30 px-2 py-1 text-sm text-white outline-none focus:border-white/40"
                              />
                            </label>
                            <label className="flex flex-col gap-1 text-xs text-slate-200">
                              Location
                              <input
                                name="location"
                                defaultValue={job.location ?? ""}
                                className="rounded-md border border-white/15 bg-black/30 px-2 py-1 text-sm text-white outline-none focus:border-white/40"
                              />
                            </label>
                            <label className="flex flex-col gap-1 text-xs text-slate-200">
                              Contact
                              <input
                                name="contact"
                                defaultValue={job.contact ?? ""}
                                className="rounded-md border border-white/15 bg-black/30 px-2 py-1 text-sm text-white outline-none focus:border-white/40"
                              />
                            </label>
                            <label className="flex flex-col gap-1 text-xs text-slate-200">
                              Next step
                              <input
                                name="nextStep"
                                defaultValue={job.nextStep ?? ""}
                                className="rounded-md border border-white/15 bg-black/30 px-2 py-1 text-sm text-white outline-none focus:border-white/40"
                              />
                            </label>
                            <Button type="submit" size="xs" className="mt-1 self-start">
                              Save changes
                            </Button>
                          </form>
                        </details>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">New vacancy</p>
              <h2 className="text-xl font-semibold">Add card</h2>

              <form action={createJobAction} className="mt-4 flex flex-col gap-3">
                <label className="flex flex-col gap-2 text-sm text-slate-100">
                  Role name
                  <input
                    required
                    name="title"
                    className="rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/30"
                    placeholder="Frontend developer"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-100">
                  Company
                  <input
                    required
                    name="company"
                    className="rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/30"
                    placeholder="Acme Corp"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-100">
                  Status
                  <select
                    name="status"
                    className="rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/30"
                    defaultValue="APPLIED"
                  >
                    {Object.keys(JobStatus).map((status) => (
                      <option key={status} value={status} className="bg-slate-900 text-white">
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-100">
                  Comment
                  <textarea
                    name="notes"
                    rows={3}
                    className="rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/30"
                    placeholder="Call on next week"
                  />
                </label>

                <details className="rounded-xl border border-white/15 bg-black/10 px-4 py-3 text-sm text-slate-100">
                  <summary className="cursor-pointer select-none font-semibold text-slate-50">
                    Optional fields
                  </summary>
                  <div className="mt-3 flex flex-col gap-3">
                    <label className="flex flex-col gap-2 text-sm text-slate-100">
                      Company Link
                      <input
                        type="url"
                        name="companyLink"
                        className="rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/30"
                        placeholder="https://company.com"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-slate-100">
                      Vacancy Link
                      <input
                        type="url"
                        name="vacancyLink"
                        className="rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/30"
                        placeholder="https://company.com/jobs/frontend"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-slate-100">
                      Salary
                      <input
                        type="text"
                        name="salary"
                        className="rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/30"
                        placeholder="$4-5k / 2.2k"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-slate-100">
                      Location / Format
                      <input
                        type="text"
                        name="location"
                        className="rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/30"
                        placeholder="Remote, Berlin, Hybrid"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-slate-100">
                      Contact info
                      <input
                        type="text"
                        name="contact"
                        className="rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/30"
                        placeholder="Ann, ann@company.com"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-slate-100">
                      Next step
                      <input
                        type="text"
                        name="nextStep"
                        className="rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/30"
                        placeholder="Onboarding, final, test task"
                      />
                    </label>
                  </div>
                </details>

                <Button type="submit" size="sm" className="mt-2">
                  Save
                </Button>
              </form>
            </section>
          </div>
      </PageLayout>
    </div>
  );
}
