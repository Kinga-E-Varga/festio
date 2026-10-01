import type { ReactNode } from "react";
import { list, text } from "@/modular/content";
import { HEADING, PAD } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/* The board's line icons, keyed by a way's `icon` field. `pin` stands in for anything else. */
const ICONS: Record<string, ReactNode> = {
  shuttle: (
    <>
      <rect x="4" y="3" width="16" height="15" rx="2" />
      <path d="M4 11h16M8 18v3M16 18v3" />
      <circle cx="8" cy="14.5" r="1" />
      <circle cx="16" cy="14.5" r="1" />
    </>
  ),
  car: (
    <>
      <path d="M5 16V11l2-5h10l2 5v5M3 16h18v3H3Z" />
      <circle cx="7.5" cy="13" r="1" />
      <circle cx="16.5" cy="13" r="1" />
    </>
  ),
  taxi: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />
  ),
  plane: (
    <>
      <path d="M2 16l20-6-2-3-6 2-6-5-2 1 4 6-5 2-2-2-2 1Z" />
      <path d="M3 21h18" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
};

/** One card per way of arriving, each with its icon. */
export function Variant({ values }: VariantProps) {
  return (
    <div className={`flex flex-col gap-8 bg-[var(--m2)] ${PAD}`}>
      <h2
        className={`${HEADING} text-center text-[28px] text-[color:var(--m8)] @3xl:text-[34px]`}
      >
        {text(values, "heading")}
      </h2>
      <ul className="grid gap-5 @3xl:grid-cols-2 @5xl:grid-cols-4">
        {list(values, "ways").map((way, index) => (
          <li
            key={index}
            className="flex flex-col gap-2.5 border-1 border-[var(--m5)] bg-[var(--m1)] p-6"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="stroke-[var(--m13)]"
            >
              {ICONS[way.icon] ?? ICONS.pin}
            </svg>
            <span className="text-[17px] font-semibold text-[color:var(--m8)]">
              {way.title}
            </span>
            <span className="text-[15px] leading-[1.6] whitespace-pre-line text-[color:var(--m9)]">
              {way.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
