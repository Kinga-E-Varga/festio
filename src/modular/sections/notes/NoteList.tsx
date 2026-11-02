import type { ReactNode } from "react";
import { DressCodeSwatches, hasSwatches } from "@/modular/cards/DressCodeCard";
import { GiftActions, hasGiftActions } from "@/modular/cards/GiftsCard";
import { text } from "@/modular/content";
import { ItemIcon, LeadMark } from "@/modular/cards/CardIcon";
import { itemMark, type IconMode, type ItemMark } from "@/modular/item-marks";
import { noteItems, twinIcon } from "@/modular/notes";
import {
  BODY_SM,
  CARD,
  GROUND,
  INNER_EYEBROW,
  ITEM_TITLE,
  MUTED,
  CARD_STACK,
  DISC_ROW,
  leadRow,
} from "@/modular/styles";
import type { SectionGround, VariantProps } from "@/types/modular";

type Note = ReturnType<typeof noteItems>[number];

/**
 * The notes beside a heading, for Icon & list and the two-line and card
 * styles: rows between hairlines, or with `cards` each a card on that
 * surface, the cards stacked. Each its label, title and text, and for
 * Dress code and Gifts their colours or account under them. Each its mark
 * (`itemMark`, Dress code's and Gifts' too): `marks="end"`, the Two-line
 * styles, on a soft disc at the row's end, under the label;
 * `marks="start"`, the Icon styles, bare before the row (`LeadMark`).
 * Spaced as Transportation's lists and cards: 16px over
 * the label, or 28px over the title without one, 16px from the label to
 * the title, 4px to the text and 24px under.
 */
export function NoteList({
  items,
  mode,
  marks,
  related,
  cards,
}: {
  items: Note[];
  /** The section's `iconMode`. */
  mode: IconMode;
  marks: "start" | "end";
  related: VariantProps["related"];
  cards?: SectionGround;
}) {
  if (items.length === 0) return null;
  const dress = related["dress-code"] ?? {};
  const gifts = related.gifts ?? {};

  return (
    <ul className={cards ? CARD_STACK : "border-t-1 border-[var(--m-line)]"}>
      {items.map((item, index) => {
        if (item.kind === "dress-code") {
          return (
            <Row
              key={index}
              cards={cards}
              mark={itemMark(mode, twinIcon(dress), index)}
              marks={marks}
              label={text(dress, "eyebrow")}
              title={text(dress, "title")}
              body={text(dress, "body")}
            >
              {hasSwatches(dress) ? <DressCodeSwatches values={dress} /> : null}
            </Row>
          );
        }
        if (item.kind === "gifts") {
          return (
            <Row
              key={index}
              cards={cards}
              mark={itemMark(mode, twinIcon(gifts), index)}
              marks={marks}
              label={text(gifts, "eyebrow")}
              title={text(gifts, "title")}
              body={text(gifts, "body")}
            >
              {hasGiftActions(gifts) ? <GiftActions values={gifts} /> : null}
            </Row>
          );
        }
        return (
          <Row
            key={index}
            cards={cards}
            mark={itemMark(mode, item.icon, index)}
            marks={marks}
            label={item.label}
            title={item.title ?? ""}
            body={item.text ?? ""}
          />
        );
      })}
    </ul>
  );
}

/**
 * One note: its label, title, text and anything under them, and its mark:
 * at the row's end under the label, or before the row.
 */
function Row({
  cards,
  mark,
  marks,
  label,
  title,
  body,
  children,
}: {
  cards?: SectionGround;
  mark: ItemMark;
  marks: "start" | "end";
  label?: string;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  const eyebrow = label ? (
    <p className={`${INNER_EYEBROW} mb-4 text-[color:var(--m-secondary)]`}>
      {label}
    </p>
  ) : null;
  const words = (
    <div className="flex min-w-0 flex-col items-start">
      {title ? <h3 className={ITEM_TITLE}>{title}</h3> : null}
      {body ? (
        <p className={`${BODY_SM} ${MUTED} mt-1 whitespace-pre-line`}>{body}</p>
      ) : null}
      {children ? (
        <div className="mt-4 flex flex-col items-start gap-3">{children}</div>
      ) : null}
    </div>
  );
  return (
    <li
      className={
        cards
          ? `${CARD} ${GROUND[cards]}`
          : "border-b-1 border-[var(--m-line)] pt-4 pb-6"
      }
    >
      <div className={`${label ? "" : "pt-3"} ${cards ? "pb-3" : ""}`}>
        {marks === "start" ? (
          <div className={leadRow(mark)}>
            <LeadMark mark={mark} />
            <div className="min-w-0">
              {eyebrow}
              {words}
            </div>
          </div>
        ) : (
          <>
            {eyebrow}
            <div className={mark ? `${DISC_ROW} items-center` : ""}>
              {words}
              <ItemIcon mark={mark} />
            </div>
          </>
        )}
      </div>
    </li>
  );
}
