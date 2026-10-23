"use client";

import { INPUT } from "@/components/dashboard/styles";
import { SearchClear } from "@/components/dashboard/SearchClear";
import { Icon } from "@/components/icons";

interface SearchFieldProps {
  query: string;
  onQuery: (value: string) => void;
  /** Its placeholder, and its name for screen readers. */
  label: string;
}

/** A search box with the app's magnifier: the guest list's and Home's events'. */
export function SearchField({ query, onQuery, label }: SearchFieldProps) {
  return (
    <label className="relative block w-full">
      <span className="sr-only">{label}</span>
      {/* Raised: every input is `relative` (for the date icon), so it would paint over it. */}
      <Icon
        name="search"
        className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-neutral-700"
      />
      <input
        type="search"
        value={query}
        onChange={(control) => onQuery(control.target.value)}
        placeholder={label}
        className={`${INPUT} pr-9 pl-9`}
      />
      <SearchClear query={query} onClear={() => onQuery("")} />
    </label>
  );
}
