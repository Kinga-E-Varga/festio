import type { ReactNode } from "react";
import {
  JOINED_PULL,
  PAD_BOTTOM,
  PAD_X,
  SECTION_GROUND,
  SPLIT,
} from "@/modular/styles";
import type { SectionGround } from "@/types/modular";

/**
 * The joined countdowns' frame: their content in a centred column, and
 * under a section drawn in two columns (`afterSplit`) the same `SPLIT`
 * grid, the content in the second column, so it lines up with what is
 * above it. The first column stays empty, and is left out on a phone,
 * where the grid is one column. On the date's band (`ground`), no top
 * padding of its own, pulled up to the date (`JOINED_PULL`).
 */
export function JoinedColumn({
  afterSplit = false,
  ground,
  children,
}: {
  afterSplit?: boolean;
  ground: SectionGround;
  children: ReactNode;
}) {
  const column = "flex flex-col items-center gap-7";
  const className = `${SECTION_GROUND[ground]} ${PAD_X} ${PAD_BOTTOM} ${JOINED_PULL}`;
  if (!afterSplit) {
    return <div className={`${column} ${className}`}>{children}</div>;
  }
  return (
    <div className={`${SPLIT} ${className}`}>
      <div aria-hidden="true" className="hidden @3xl:block" />
      <div className={column}>{children}</div>
    </div>
  );
}
