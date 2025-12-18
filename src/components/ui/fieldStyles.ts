"use client";

export type FieldVariant = "job" | "auth";

export const jobInputClasses =
  "rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/30";

export const authInputClasses =
  "w-full rounded-xl bg-white/5 px-3 py-3 text-base text-white outline-none ring-1 ring-inset ring-white/15 transition focus:ring-white/40";

const jobTextareaClasses = `min-h-[80px] max-h-40 ${jobInputClasses}`;

export function getFieldClasses(variant: FieldVariant, kind: "input" | "textarea" | "select") {
  if (variant === "auth") {
    return authInputClasses;
  }
  if (kind === "textarea") {
    return jobTextareaClasses;
  }
  return jobInputClasses;
}

