import type { ReactNode } from "react";
import {
  BODY,
  H3_ITEM,
  MUTED,
  SPLIT,
  PAD,
  SECTION_GROUND,
  otherCard,
} from "@/modular/styles";
import type { SectionGround } from "@/types/modular";

/**
 * A heading beside one card, for Dress code's and Gifts' Icon & card and
 * Two-line & card: the card on the other surface, its title, text and,
 * 16px under them, what the section adds (the colours, the gift buttons).
 * No label: the heading beside it already names it.
 */
export function SoloCard({
  heading,
  title,
  body,
  ground,
  children,
}: {
  heading: ReactNode;
  title: string;
  body: string;
  ground: SectionGround;
  children?: ReactNode;
}) {
  return (
    <div className={`${SPLIT} items-start ${SECTION_GROUND[ground]} ${PAD}`}>
      {heading}
      {title || body || children ? (
        <div className={`${otherCard(ground)} flex flex-col items-start`}>
          {title ? <h3 className={`${H3_ITEM} mb-1`}>{title}</h3> : null}
          {body ? (
            <p className={`${BODY} ${MUTED} whitespace-pre-line`}>{body}</p>
          ) : null}
          {children ? (
            <div className="mt-4 flex flex-col items-start gap-3">
              {children}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
