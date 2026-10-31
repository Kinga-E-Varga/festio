import { Fragment, type ReactNode } from "react";
import { isOn, text } from "./content";
import { AMPERSAND } from "./styles";
import type { SectionValues } from "@/types/modular";

/**
 * A line the host writes in three fields — `<name>Start`, `<name>Middle`,
 * `<name>End` — such as the header's mark (`mark`) or the title's names
 * (`names`): the first and last parts in the text around it, the middle one
 * in `middleClass`. A part the host left empty is left out; with none, there
 * is no line.
 */
export function markParts(
  values: SectionValues,
  name: "mark" | "names",
  /** The middle part's style; `AMPERSAND` unless a variant sets its own. */
  middleClass: string = AMPERSAND,
): ReactNode[] {
  const start = text(values, `${name}Start`).trim();
  const middle = text(values, `${name}Middle`).trim();
  const end = text(values, `${name}End`).trim();
  return [
    start,
    middle ? <span className={middleClass}>{middle}</span> : "",
    end,
  ].filter(Boolean);
}

/**
 * The header's mark, drawn by the header and the footer: its three parts
 * (`markParts`) while `monogram` is on, else its `markText` alone.
 */
export function headerMark(
  values: SectionValues,
  middleClass?: string,
): ReactNode[] {
  if (isOn(values, "monogram")) return markParts(values, "mark", middleClass);
  const words = text(values, "markText").trim();
  return words ? [words] : [];
}

/** The parts, a space between each. */
export function Mark({ parts }: { parts: ReactNode[] }) {
  return parts.map((part, index) => (
    <Fragment key={index}>
      {index > 0 ? " " : null}
      {part}
    </Fragment>
  ));
}
