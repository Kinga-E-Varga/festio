import type { ReactNode } from "react";
import { BOX_GAP, SECTION_NAME } from "./styles";

/**
 * A section card's top row: its mark (a lock, or a page number), its name,
 * and the arrow at the far end. Shared by the Design and Content tabs.
 */
export function SectionBar({
  mark,
  name,
  arrow,
}: {
  mark: ReactNode;
  name: string;
  arrow: ReactNode;
}) {
  return (
    <div className="flex min-h-10 items-center justify-between gap-3">
      <div className={`flex min-w-0 items-center ${BOX_GAP}`}>
        {mark}
        <span className={SECTION_NAME}>{name}</span>
      </div>
      {arrow}
    </div>
  );
}
