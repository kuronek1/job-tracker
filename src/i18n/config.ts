import { JobStatus } from "@/generated/prisma/enums";

export type Locale = "default";
export const defaultLocale: Locale = "default";

type Dictionary = {
  appName: string;
  heroTitle: string;
  heroDesc: string;
  navLogin: string;
  navLogout: string;
  jobsTitle: string;
  jobsBoard: string;
  jobsCountLabel: (count: number) => string;
  jobsEmpty: string;
  jobsEmptyCta: string;
  form: {
    title: string;
    company: string;
    status: string;
    notes: string;
    submit: string;
    optionalTitle: string;
    companyLink: string;
    vacancyLink: string;
    salary: string;
    location: string;
    contact: string;
    nextStep: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    username: string;
    email: string;
    password: string;
    loginCta: string;
    registerCta: string;
    backHome: string;
    errors: {
      needEmailPass: string;
      shortPassword: string;
      alreadyExists: string;
      needUsername: string;
      usernameTaken: string;
      invalid: string;
      unknown: string;
    };
  };
  statuses: Record<JobStatus, string>;
};

const dictionary: Dictionary = {
  appName: "Job Tracker CRM",
  heroTitle: "Control your job pipeline with Supabase + Next.js",
  heroDesc: "Auth stores password hashes and session tokens in Postgres. Supabase/Postgres keeps your job data.",
  navLogin: "Log in",
  navLogout: "Log out",
  jobsTitle: "Your vacancies",
  jobsBoard: "Job board",
  jobsCountLabel: (count) => `${count} item(s)`,
  jobsEmpty: "No items. Please add the first vacancy on the right.",
  jobsEmptyCta: "Go to login",
  form: {
    title: "Role name",
    company: "Company",
    status: "Status",
    notes: "Comment",
    submit: "Save",
    optionalTitle: "Optional fields",
    companyLink: "Company link",
    vacancyLink: "Vacancy link",
    salary: "Salary range",
    location: "Location / format",
    contact: "Contact / recruiter",
    nextStep: "Next step",
  },
  auth: {
    loginTitle: "Log in",
    loginSubtitle: "Use email and password to enter the CRM.",
    registerTitle: "Register",
    registerSubtitle: "Create an account, password is stored as a hash.",
    username: "Username",
    email: "E-mail",
    password: "Password",
    loginCta: "Log in",
    registerCta: "Sign up",
    backHome: "Back home",
    errors: {
      needEmailPass: "Email and password are required.",
      shortPassword: "Email and password (at least 6 characters).",
      alreadyExists: "Email already registered.",
      needUsername: "Username is required.",
      usernameTaken: "Username already taken.",
      invalid: "Invalid credentials.",
      unknown: "Unknown error",
    },
  },
  statuses: {
    APPLIED: "Applied",
    INTERVIEW: "Interview",
    OFFER: "Offer",
    REJECTED: "Rejected",
  },
};

export function getDictionary(): { locale: Locale; dict: Dictionary } {
  return { locale: defaultLocale, dict: dictionary };
}
