import { text } from "@/modular/content";
import { ITALIC_LINE, MUTED } from "@/modular/styles";
import type { SectionValues } from "@/types/modular";

/** The story itself, set as the title's caption (`ITALIC_LINE`, muted), its line breaks kept; nothing when empty. */
export function StoryText({
  values,
  className = "",
}: {
  values: SectionValues;
  className?: string;
}) {
  const story = text(values, "story");
  if (!story) return null;

  return (
    <p
      className={`${ITALIC_LINE} ${MUTED} whitespace-pre-line [overflow-wrap:anywhere] ${className}`}
    >
      {story}
    </p>
  );
}
