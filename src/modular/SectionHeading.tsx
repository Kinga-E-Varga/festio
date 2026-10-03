import type { SectionValues } from "@/types/modular";
import { text } from "./content";
import { EYEBROW, H2, LEAD, MUTED } from "./styles";

interface SectionHeadingProps {
  values: SectionValues;
  /** `start`: centred on a phone, left-aligned beside content on a wider page. */
  align?: "center" | "start";
  /** `accent`: written on the accent band, in `accent-ink`. */
  tone?: "default" | "accent";
}

/**
 * A section's eyebrow, heading, italic second line and note. Each part is
 * optional and the gaps belong to the column, not the parts, so whatever is
 * left still sits evenly; with nothing at all it draws nothing.
 */
export function SectionHeading({
  values,
  align = "center",
  tone = "default",
}: SectionHeadingProps) {
  const eyebrow = text(values, "eyebrow");
  const heading = text(values, "heading");
  const italic = text(values, "headingItalic");
  const note = text(values, "note");
  if (!eyebrow && !heading && !italic && !note) return null;

  const onAccent = tone === "accent";
  const place =
    align === "center"
      ? "items-center text-center"
      : "items-center text-center @3xl:items-start @3xl:text-left";

  return (
    <div className={`flex w-full flex-col gap-4 ${place}`}>
      {eyebrow ? (
        <p
          className={`${EYEBROW} ${onAccent ? "text-[color:var(--m-accent-ink)]" : "text-[color:var(--m-secondary)]"}`}
        >
          {eyebrow}
        </p>
      ) : null}
      {heading || italic ? (
        <h2
          className={`${H2} ${onAccent ? "text-[color:var(--m-accent-ink)]" : "text-[color:var(--m-ink)]"}`}
        >
          {heading}
          {heading && italic ? <br /> : null}
          {italic ? (
            <em
              className={`italic ${onAccent ? "" : "text-[color:var(--m-secondary)]"}`}
            >
              {italic}
            </em>
          ) : null}
        </h2>
      ) : null}
      {note ? (
        <p
          className={`${LEAD} max-w-160 whitespace-pre-line ${onAccent ? "text-[color:var(--m-accent-ink)] opacity-80" : MUTED}`}
        >
          {note}
        </p>
      ) : null}
    </div>
  );
}
