"use client";

import { useMemo, useState } from "react";
import type { SelectHTMLAttributes, ChangeEvent } from "react";
import type { FieldVariant } from "./fieldStyles";
import { getFieldClasses } from "./fieldStyles";

type Option = {
  value: string;
  label: string;
};

type BaseSelectProps = {
  label?: string;
  error?: string;
  variant?: FieldVariant;
  options: Option[];
  searchable?: boolean;
};

export type SelectInputProps = BaseSelectProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "children">;

export default function SelectInput(props: SelectInputProps) {
  const {
    label,
    error,
    variant = "job",
    className,
    id,
    name,
    options,
    searchable,
    onChange,
    ...rest
  } = props;

  const [search, setSearch] = useState("");

  const fieldId = id ?? (typeof name === "string" ? name : undefined);
  const describedBy = error && fieldId ? `${fieldId}-error` : undefined;
  const base = getFieldClasses(variant, "select");
  const mergedClassName = className ? `${base} ${className}` : base;

  const filteredOptions = useMemo(
    () =>
      !search
        ? options
        : options.filter((opt) => {
            const haystack = `${opt.label} ${opt.value}`.toLowerCase();
            return haystack.includes(search.toLowerCase());
          }),
    [options, search],
  );

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <label className="flex flex-col gap-2 text-sm text-slate-100" htmlFor={fieldId}>
      {label}
      {searchable ? (
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="rounded-lg border border-white/15 bg-black/20 px-3 py-1.5 text-xs text-slate-100 outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/30"
        />
      ) : null}

      <select
        id={fieldId}
        name={name}
        className={mergedClassName}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        onChange={handleSelectChange}
        {...rest}
      >
        {filteredOptions.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>

      {error ? (
        <span id={describedBy} className="text-xs text-rose-300">
          {error}
        </span>
      ) : null}
    </label>
  );
}

