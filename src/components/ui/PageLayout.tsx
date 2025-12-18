"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type PageLayoutProps = {
  children: ReactNode;
  rightSlot?: ReactNode;
  contentClassName?: string;
};

export default function PageLayout({ children, rightSlot, contentClassName }: PageLayoutProps) {
  return (
    <div className="relative mx-auto w-full max-w-[1350px] px-6">
      <header className="flex items-center justify-between gap-4 py-8">
        <Link href="/" className="group flex items-center gap-3 duration-300 hover:scale-90">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-black via-black to-emerald-400 text-base font-semibold text-whitre shadow-lg shadow-emerald-500/25 transition">
            JT
          </div>
          <div className="leading-tight">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-200">Job Tracker</p>
            <p className="text-lg font-semibold text-white">CRM</p>
          </div>
        </Link>

        {rightSlot ? <div className="flex items-center gap-3">{rightSlot}</div> : null}
      </header>

      <main className={contentClassName}>{children}</main>
    </div>
  );
}
