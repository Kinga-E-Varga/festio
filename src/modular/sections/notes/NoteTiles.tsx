import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { DressCodeSwatches, hasSwatches } from "@/modular/cards/DressCodeCard";
import { GiftActions, hasGiftActions } from "@/modular/cards/GiftsCard";
import { text } from "@/modular/content";
import { otherGround } from "@/modular/ground";
import { Icon, isIconName, type IconName } from "@/modular/icons";
import { noteItems, twinIcon } from "@/modular/notes";
import {
  BODY,
  CARD,
  CARD_DISC,
  COLUMN,
  GROUND,
  H3_ITEM,
  INNER_EYEBROW,
  LINED_CELL,
  LINED_GRID,
  MUTED,
  SECTION_GROUND,
  TONES,
  cardColumns,
  centredWhenStacked,
  columnsFor,
  turnTone,
} from "@/modular/styles";
import type { SectionGround, VariantProps } from "@/types/modular";

type Note = ReturnType<typeof noteItems>[number];

/**
 * The notes side by side under a centred heading, for Grid and Cards, as
 * Transportation's: `grid`, cells between hairlines (`LINED_GRID`), each
 * note centred down its cell, no icons; `cards`, a card on the other
 * surface each (`cardColumns`), centred while they stack, its icon on a
 * soft disc over its label — Dress code's and Gifts' their own (`twinIcon`) — the discs
 * taking turns, the 1st, 3rd… in the accent, the 2nd, 4th… in the
 * secondary; `list`, Full card & list (`9`): one under another, a line
 * across between each, each centred, its icon as on the cards, the gift
 * buttons side by side while they fit. Each its
 * label, title and text, and for Dress code and Gifts their colours or
 * account under them.
 */
export function NoteTiles({
  items,
  related,
  ground,
  look,
}: {
  items: Note[];
  related: VariantProps["related"];
  ground: SectionGround;
  look: "grid" | "cards" | "list";
}) {
  const t = useTranslations("Sections");
  if (items.length === 0) return null;
  const dress = related["dress-code"] ?? {};
  const gifts = related.gifts ?? {};
  const grid = look === "grid";
  const place =
    look === "cards"
      ? centredWhenStacked(items.length)
      : "items-center text-center";

  return (
    <ul
      className={
        {
          grid: `${LINED_GRID} ${columnsFor(items.length)}`,
          cards: `grid gap-3 @3xl:gap-4 ${cardColumns(items.length)}`,
          list: "divide-y-1 divide-[var(--m-line)]",
        }[look]
      }
    >
      {items.map((item, index) => {
        const tile = {
          className: `flex flex-col ${place} ${
            {
              grid: `${LINED_CELL} ${SECTION_GROUND[ground]} px-6 py-8 @3xl:px-8 @3xl:py-10`,
              cards: `${CARD} ${COLUMN} ${GROUND[otherGround(ground)]}`,
              list: "py-8 @3xl:py-10",
            }[look]
          }`,
          tone: TONES[turnTone(index)],
          icons: !grid,
          place,
        };
        if (item.kind === "dress-code") {
          return (
            <Tile
              key={index}
              {...tile}
              icon={twinIcon(dress)}
              label={t("dressCode")}
              title={text(dress, "title")}
              body={text(dress, "body")}
            >
              {hasSwatches(dress) ? <DressCodeSwatches values={dress} /> : null}
            </Tile>
          );
        }
        if (item.kind === "gifts") {
          return (
            <Tile
              key={index}
              {...tile}
              icon={twinIcon(gifts)}
              label={t("gifts")}
              title={text(gifts, "title")}
              body={text(gifts, "body")}
            >
              {hasGiftActions(gifts) ? (
                <GiftActions values={gifts} stacked={look !== "list"} />
              ) : null}
            </Tile>
          );
        }
        return (
          <Tile
            key={index}
            {...tile}
            icon={isIconName(item.icon) ? item.icon : undefined}
            label={item.label ?? ""}
            title={item.title ?? ""}
            body={item.text ?? ""}
          />
        );
      })}
    </ul>
  );
}

/** One note: its icon, label, title, text and anything under them. */
function Tile({
  className,
  tone,
  icons,
  place,
  icon,
  label,
  title,
  body,
  children,
}: {
  className: string;
  tone: string;
  icons: boolean;
  place: string;
  icon?: IconName;
  label: string;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <li className={className}>
      {icons && icon ? (
        <span className={`${CARD_DISC} mb-5 ${tone}`}>
          <Icon name={icon} className="size-5.5" />
        </span>
      ) : null}
      {label ? (
        <span className={`${INNER_EYEBROW} text-[color:var(--m-secondary)]`}>
          {label}
        </span>
      ) : null}
      {title ? (
        <h3 className={`${H3_ITEM} ${label ? "mt-4" : ""} mb-1`}>{title}</h3>
      ) : null}
      {body ? (
        <p className={`${BODY} ${MUTED} whitespace-pre-line`}>{body}</p>
      ) : null}
      {children ? (
        <div className={`mt-4 flex flex-col ${place}`}>{children}</div>
      ) : null}
    </li>
  );
}
