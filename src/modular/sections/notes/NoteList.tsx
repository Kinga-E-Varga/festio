import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { DressCodeSwatches, hasSwatches } from "@/modular/cards/DressCodeCard";
import { GiftActions, hasGiftActions } from "@/modular/cards/GiftsCard";
import { text } from "@/modular/content";
import { noteItems } from "@/modular/notes";
import {
  BODY_SM,
  CARD,
  GROUND,
  INNER_EYEBROW,
  ITEM_TITLE,
  MUTED,
  CARD_STACK,
} from "@/modular/styles";
import type { SectionGround, VariantProps } from "@/types/modular";

type Note = ReturnType<typeof noteItems>[number];

/**
 * The notes beside a heading, for Icon & list and the two-line and card
 * styles: rows between hairlines, or with `cards` each a card on that
 * surface, the cards stacked. Each its label, title and text, and for
 * Dress code and Gifts their colours or account under them. No icons.
 * Spaced as Transportation's lists and cards: 16px over
 * the label, or 28px over the title without one, 16px from the label to
 * the title, 4px to the text and 24px under.
 */
export function NoteList({
  items,
  related,
  cards,
}: {
  items: Note[];
  related: VariantProps["related"];
  cards?: SectionGround;
}) {
  const t = useTranslations("Sections");
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
              label={t("dressCode")}
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
              label={t("gifts")}
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
            label={item.label}
            title={item.title ?? ""}
            body={item.text ?? ""}
          />
        );
      })}
    </ul>
  );
}

/** One note: its label, title, text and anything under them. */
function Row({
  cards,
  label,
  title,
  body,
  children,
}: {
  cards?: SectionGround;
  label?: string;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <li
      className={
        cards
          ? `${CARD} ${GROUND[cards]}`
          : "border-b-1 border-[var(--m-line)] pt-4 pb-6"
      }
    >
      <div
        className={`flex min-w-0 flex-col items-start ${label ? "" : "pt-3"} ${cards ? "pb-3" : ""}`}
      >
        {label ? (
          <p
            className={`${INNER_EYEBROW} mb-4 text-[color:var(--m-secondary)]`}
          >
            {label}
          </p>
        ) : null}
        {title ? <h3 className={ITEM_TITLE}>{title}</h3> : null}
        {body ? (
          <p className={`${BODY_SM} ${MUTED} mt-1 whitespace-pre-line`}>
            {body}
          </p>
        ) : null}
        {children ? (
          <div className="mt-4 flex flex-col items-start gap-3">{children}</div>
        ) : null}
      </div>
    </li>
  );
}
