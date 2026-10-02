import type { ModularPattern } from "@/types/modular";

/*
 * Classes the variants share, written once. Every colour is a `--m*` role;
 * the page root sets the body face, so only headings name a font.
 */

/** Headings: the pair's secondary face. Size and colour are the variant's. */
export const HEADING =
  "font-[family-name:var(--font-secondary)] font-normal text-balance";

/** The small uppercase line above a heading. */
export const KICKER =
  "text-[11px] tracking-[0.22em] uppercase text-[color:var(--m10)]";

/** Running text. */
export const BODY = "text-[16px] leading-[1.7] text-[color:var(--m9)]";

/** A section's padding: tighter on a phone, the board's on a wide page. */
export const PAD = "px-6 py-14 @3xl:px-14 @3xl:py-[72px]";

/** The solid accent button (a link in every use). 44px tall, for touch. */
export const SOLID_LINK =
  "inline-flex min-h-11 items-center justify-center bg-[var(--m13)] px-6 text-[14px] font-semibold text-[color:var(--m1)] transition-opacity hover:opacity-85";

/** The outlined accent button. It never shrinks, so its label never wraps. */
export const OUTLINE_LINK =
  "inline-flex min-h-11 shrink-0 items-center justify-center border-1 border-[var(--m13)] px-4 text-[13px] font-semibold text-[color:var(--m13)] transition-colors hover:bg-[var(--m13)] hover:text-[color:var(--m1)]";

/**
 * The invitation's ground — around its column on a wide guest screen, and
 * the editor's viewing area: `--m4`, with the template's pattern if it has one.
 */
export function groundClasses(pattern: ModularPattern | null): string {
  return `bg-[var(--m4)] ${pattern?.className ?? ""}`;
}
