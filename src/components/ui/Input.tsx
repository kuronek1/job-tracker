"use client";

import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import type { FieldVariant } from "./fieldStyles";
import { getFieldClasses } from "./fieldStyles";

type BaseFieldProps = {
  label?: string;
  error?: string;
  variant?: FieldVariant;
};

export type InputProps = BaseFieldProps & InputHTMLAttributes<HTMLInputElement>;
export type TextareaProps = BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Input(props: InputProps) {
  const { label, error, variant = "job", className, id, name, ...rest } = props;

  const fieldId = id ?? (typeof name === "string" ? name : undefined);
  const describedBy = error && fieldId ? `${fieldId}-error` : undefined;
  const base = getFieldClasses(variant, "input");
  const mergedClassName = className ? `${base} ${className}` : base;

  return (
    <label className="flex flex-col gap-2 text-sm text-slate-100" htmlFor={fieldId}>
      {label}
      <input
        id={fieldId}
        name={name}
        className={mergedClassName}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...rest}
      />
      {error ? (
        <span id={describedBy} className="text-xs text-rose-300">
          {error}
        </span>
      ) : null}
    </label>
  );
}
