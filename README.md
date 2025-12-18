# Job Tracker CRM

Personal CRM for tracking job applications, built with **Next.js App Router**, **React 19**, **Tailwind 4**, **Prisma** and **Postgres**.

Modern kanban-style board with columns per status, rich modals for job details, and a small landing page on top.

## Screenshots

![Landing](public/screenshots/landing.png)
![Board](public/screenshots/board.png)
![Modal](public/screenshots/modal.png)

---

## Features

- **Auth + personal data**
  - Separate data per user.
  - All mutations go through Next.js Server Actions.

- **Job board**
  - Columns for `APPLIED`, `INTERVIEW`, `OFFER`, `REJECTED`.
  - Drag & drop between columns with optimistic UI.
  - Quick status change from `JobCard` via a colored status button.

- **Modals**
  - `NewJobModal` is used for both creating and editing a job (driven by props and URL state).
  - Modal open/close state is synchronized with the URL query (`?modal=...`).
  - Large form with optional fields (links, salary, location, contact, next step).

- **UI / UX**
  - Custom components: `Button`, `Modal`, `JobCard`, `JobBoard`.
  - Animations via `framer-motion`.
  - Column highlighting while dragging.
  - Toasts (`ToastProvider`) for success/error feedback on create/update/delete.

- **Tech Stack**
  - **Frontend**: Next.js 16 (App Router), React 19, Tailwind 4.
  - **Animations**: Framer Motion.
  - **DB**: Postgres + Prisma ORM.
  - **Styles**: Tailwind + custom components.

---

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

- Create `.env` (for example from `.env.example` if you add one).
- Set your `DATABASE_URL` for Postgres.
- Run migrations / `prisma generate` if needed (`npm run postinstall` already calls `prisma generate`).

3. Run dev server:

```bash
npm run dev
```

Open `http://localhost:3000` to see the app.

## Development Notes

- The main authenticated page is `src/app/page.tsx`.
- Core UI components live in `src/components/`:
  - `JobBoard.tsx`, `JobCard.tsx`
- `Modal.tsx`, `NewJobModal.tsx`
  - `ToastProvider.tsx`, `FormSubmitButton.tsx`, `Button.tsx`
- Server-side logic for jobs is in `src/lib/jobs.ts`.

## Ideas for Future Work

- Filters / search by company, title, location.
- Tagging (stack, seniority, region).
- Analytics (conversion per stage, time in status).
- Import/export CSV.
- Demo user / seeded data for public demo.
