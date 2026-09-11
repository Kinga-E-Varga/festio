"use client";

import type { ReactNode } from "react";

interface ToggleProps {
  label: string;
  description: ReactNode;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}

export function Toggle({
  label,
  description,
  checked,
  disabled = false,
  onChange,
}: ToggleProps) {
  return (
    <div className="flex items-center gap-3 border border-mustard-300 bg-neutral-50 px-4 py-3.5">
      <div className="flex-1">
        <b className="mb-0.5 block text-neutral-900">{label}</b>
        <span className="text-xs leading-[1.45] text-neutral-700">
          {description}
        </span>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-[42px] shrink-0 rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          checked
            ? "border-mustard-600 bg-mustard-500"
            : "border-mustard-400 bg-mustard-200"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-0.5 left-0.5 size-[18px] rounded-full border border-mustard-400 bg-neutral-50 shadow-[0_1px_3px_rgba(47,40,31,0.3)] transition-transform ${
            checked ? "translate-x-[18px]" : ""
          }`}
        />
      </button>
    </div>
  );
}
