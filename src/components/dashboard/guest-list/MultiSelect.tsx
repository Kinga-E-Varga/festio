"use client";

import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import {
  ERROR,
  INPUT,
  LABEL,
} from "@/components/dashboard/event-editor/styles";
import { Icon } from "@/components/icons";

interface MultiSelectProps<T extends string> {
  label: string;
  placeholder: string;
  options: { value: T; label: string }[];
  value: T[];
  /** Ticks or unticks one option; the caller decides what else changes with it. */
  onPick: (value: T) => void;
  error?: string;
}

/**
 * A dropdown that holds several picks, as ticks. Opening moves focus to the
 * first option; ↑ ↓ Home End move between them, Space ticks, Escape closes
 * back to the dropdown, and a click or Tab outside closes it.
 */
export function MultiSelect<T extends string>({
  label,
  placeholder,
  options,
  value,
  onPick,
  error,
}: MultiSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const list = useId();
  const title = useId();
  const shown = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label);

  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    panel.current?.querySelector("input")?.focus();
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  function move(event: KeyboardEvent<HTMLDivElement>) {
    const inputs = [...(panel.current?.querySelectorAll("input") ?? [])];
    const at = inputs.indexOf(document.activeElement as HTMLInputElement);
    const to = {
      ArrowDown: Math.min(at + 1, inputs.length - 1),
      ArrowUp: Math.max(at - 1, 0),
      Home: 0,
      End: inputs.length - 1,
    }[event.key];
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      toggle.current?.focus();
    } else if (to !== undefined) {
      event.preventDefault();
      inputs[to]?.focus();
    }
  }

  return (
    <div ref={box} className="relative min-w-0">
      <span id={title} className={`mb-1.5 block ${LABEL}`}>
        {label}
      </span>
      <button
        ref={toggle}
        type="button"
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown" || open) return;
          event.preventDefault();
          setOpen(true);
        }}
        aria-expanded={open}
        aria-controls={list}
        aria-labelledby={title}
        onClick={() => setOpen(!open)}
        className={`${INPUT} flex cursor-pointer items-center justify-between gap-2 text-left`}
      >
        <span
          className={`truncate ${shown.length > 0 ? "" : "text-neutral-600"}`}
        >
          {shown.length > 0 ? shown.join(", ") : placeholder}
        </span>
        <Icon
          name="chevron"
          className={`size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <div
          ref={panel}
          id={list}
          role="group"
          onKeyDown={move}
          onBlur={(event) => {
            if (!box.current?.contains(event.relatedTarget)) setOpen(false);
          }}
          aria-labelledby={title}
          className="absolute inset-x-0 top-full z-10 mt-1 border border-mustard-300 bg-neutral-50 py-1 shadow-sm"
        >
          {options.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2.5 px-3 py-1.5 text-[13px] text-neutral-900 transition-colors hover:bg-mustard-100"
            >
              <input
                type="checkbox"
                checked={value.includes(option.value)}
                onChange={() => onPick(option.value)}
                className="size-4 accent-mustard-600"
              />
              {option.label}
            </label>
          ))}
        </div>
      ) : null}
      {error ? <p className={`mt-1 ${ERROR}`}>{error}</p> : null}
    </div>
  );
}
