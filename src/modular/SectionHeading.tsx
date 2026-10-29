import type { ReactNode } from "react";
import type { SectionValues } from "@/types/modular";
import { text } from "./content";
import { EYEBROW, H2, BODY, MUTED } from "./styles";

interface SectionHeadingProps {
  values: SectionValues;
  /**
   * `start`: centred on a phone, left-aligned beside content on a wider page.
   * `start-late`: the same, but only from `@6xl`, for a split that stacks longer.
   */
  align?: "center" | "start" | "start-late";
  /**
   * Drawn left of the heading, on its first line (an icon disc); the note starts in line with the heading.
   * With `center`, the mark sits at the start of the heading's first line, and all stays centred at every width.
   */
  mark?: ReactNode;
  /** With a mark: content under the heading, a heading's distance below, in line with it from `@3xl`. */
  below?: ReactNode;
  /** The heading's type: `H2` unless a variant sets a smaller one. */
  headingClass?: string;
}

/**
 * A section's eyebrow, heading, italic second line and note. Each part is
 * optional and the gaps belong to the column, not the parts, so whatever is
 * left still sits evenly; with nothing at all it draws nothing.
 */
export function SectionHeading({
  values,
  align = "center",
  mark,
  below,
  headingClass = H2,
}: SectionHeadingProps) {
  const eyebrow = text(values, "eyebrow");
  const heading = text(values, "heading");
  const italic = text(values, "headingItalic");
  const note = text(values, "note");
  // With no heading at all, what comes below still shows, without the mark.
  if (!eyebrow && !heading && !italic && !note) return below ?? null;

  const place = {
    center: "items-center text-center",
    start: "items-center text-center @3xl:items-start @3xl:text-left",
    "start-late": "items-center text-center @6xl:items-start @6xl:text-left",
  }[align];

  /*
   * Centred, the mark rides inside the heading at the start of its first
   * line, so a heading that wraps stays centred with the mark beside it.
   */
  const inlineMark = mark && align === "center";
  const title =
    heading || italic ? (
      <h2 className={`${headingClass} text-[color:var(--m-ink)]`}>
        {inlineMark ? <span className="mr-4">{mark}</span> : null}
        {heading}
        {heading && italic ? <br /> : null}
        {italic ? (
          <em className="italic text-[color:var(--m-secondary)]">{italic}</em>
        ) : null}
      </h2>
    ) : null;
  // The note's lines balanced while it is centred, so none is left short; left-aligned, they run full.
  const balance =
    mark && !inlineMark
      ? "text-balance @3xl:text-wrap"
      : {
          center: "text-balance",
          start: "text-balance @3xl:text-wrap",
          "start-late": "text-balance @6xl:text-wrap",
        }[align];
  const lead = note ? (
    <p className={`${BODY} whitespace-pre-line ${balance} ${MUTED}`}>{note}</p>
  ) : null;

  return (
    <div className={`flex w-full flex-col gap-4 ${place}`}>
      {eyebrow ? (
        <p className={`${EYEBROW} text-[color:var(--m-secondary)]`}>
          {eyebrow}
        </p>
      ) : null}
      {inlineMark ? (
        <>
          {title ?? mark}
          {lead}
          {below ? <div className="mt-4 w-full @3xl:mt-7">{below}</div> : null}
        </>
      ) : mark ? (
        /*
         * On a phone, where the heading is smaller, the mark and the heading
         * centred side by side, the note centred under them and what comes
         * below across the full width. From `@3xl` a grid: the heading, the
         * note and what comes below in one column right of the mark, so all
         * start in line, and with content below an empty column as wide as
         * the mark balancing it on the right. `STACK`'s gap above what comes
         * below.
         */
        <div
          className={`flex flex-col items-center gap-4 text-center @3xl:grid @3xl:grid-cols-[auto_minmax(0,1fr)] @3xl:items-start @3xl:gap-x-4 @3xl:text-left ${below ? "w-full @3xl:grid-cols-[auto_minmax(0,1fr)_auto]" : ""}`}
        >
          <div className="flex items-start gap-4 @3xl:contents">
            <span className="flex @3xl:col-start-1 @3xl:row-start-1">
              {mark}
            </span>
            {title ? (
              <div className="@3xl:col-start-2 @3xl:row-start-1">{title}</div>
            ) : null}
          </div>
          {lead ? (
            <div className="@3xl:col-start-2 @3xl:row-start-2">{lead}</div>
          ) : null}
          {below ? (
            <span
              aria-hidden="true"
              className="invisible hidden @3xl:col-start-3 @3xl:row-start-1 @3xl:block"
            >
              {mark}
            </span>
          ) : null}
          {below ? (
            <div className="mt-4 w-full @3xl:col-start-2 @3xl:row-start-3 @3xl:mt-7">
              {below}
            </div>
          ) : null}
        </div>
      ) : (
        <>
          {title}
          {lead}
        </>
      )}
    </div>
  );
}
