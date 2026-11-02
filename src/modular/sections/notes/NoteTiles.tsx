import type { ReactNode } from "react";
import { DressCodeSwatches, hasSwatches } from "@/modular/cards/DressCodeCard";
import { GiftActions, hasGiftActions } from "@/modular/cards/GiftsCard";
import { list, text } from "@/modular/content";
import { otherGround } from "@/modular/ground";
import { MarkGlyph } from "@/modular/cards/CardIcon";
import {
  iconMode,
  itemMark,
  type IconMode,
  type ItemMark,
} from "@/modular/item-marks";
import { noteItems, twinIcon } from "@/modular/notes";
import { SectionHeading } from "@/modular/SectionHeading";
import { FullCard } from "@/modular/FullCard";
import {
  BODY,
  CARD,
  CARD_DISC,
  COLUMN,
  GROUND,
  H3_ITEM,
  INNER_EYEBROW,
  UNLINED_PULL,
  MUTED,
  PAD,
  PAGE_SECONDARY,
  SECTION_GROUND,
  STACK,
  TONES,
  cardColumns,
  centredWhenStacked,
  columnsFor,
} from "@/modular/styles";
import type { SectionGround, VariantProps } from "@/types/modular";

type Note = ReturnType<typeof noteItems>[number];

/**
 * Transportation's Full card for the notes: the heading centred,
 * the notes under it (`FullCard`), one under another, no lines, each
 * centred as a Cards (`8`) card's content. Full card (`9`); with `accent`,
 * the card on the accent, every disc in the palette's secondary: Full card
 * accent (`12`).
 */
export function NoteFullCard({
  values,
  related,
  ground,
  accent = false,
}: VariantProps & { accent?: boolean }) {
  const items = noteItems(list(values, "items"), values);
  if (items.length === 0) return null;
  const card = accent ? "accent" : ground;

  return (
    <FullCard values={values} ground={ground} accent={accent}>
      <NoteTiles
        items={items}
        mode={iconMode(values)}
        related={related}
        ground={card}
        look="list"
        accent={accent}
      />
    </FullCard>
  );
}

/**
 * A section of note tiles: the heading centred — no italic line — over the
 * notes (`NoteTiles`). Grid (`7`), Cards (`8`), Cards accent (`10`) and
 * Accent (`11`).
 */
export function NoteTilesSection({
  values,
  related,
  ground,
  look,
  accent = false,
}: VariantProps & { look: "grid" | "cards"; accent?: boolean }) {
  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      <NoteTiles
        items={noteItems(list(values, "items"), values)}
        mode={iconMode(values)}
        related={related}
        ground={ground}
        look={look}
        accent={accent}
      />
    </div>
  );
}

/**
 * The notes side by side under a centred heading, for Grid and Cards, as
 * Transportation's: `grid`, cells side by side, no lines, each note
 * centred down its cell, its icon as on the cards; `cards`, a card on the other
 * surface each (`cardColumns`), centred while they stack, its icon on a
 * soft disc over its label — Dress code's and Gifts' their own (`twinIcon`) — every disc in the secondary; `list`, Full card (`9`): one under another, a line
 * across between each, each centred, its icon as on the cards, the gift
 * buttons side by side while they fit. Each its
 * label, title and text, and for Dress code and Gifts their colours or
 * account under them. With `accent`, on the accent: `cards`, the cards
 * filled with it (Cards accent, `10`); `grid` on the accent band (Grid
 * accent, `11`); `list` in the accent full card (Full card accent,
 * `12`).
 * Either way every disc in the palette's own secondary.
 */
export function NoteTiles({
  items,
  mode,
  related,
  ground,
  look,
  accent = false,
}: {
  items: Note[];
  /** The section's `iconMode`: each note's mark, Dress code's and Gifts' too. */
  mode: IconMode;
  related: VariantProps["related"];
  ground: SectionGround;
  look: "grid" | "cards" | "list";
  accent?: boolean;
}) {
  if (items.length === 0) return null;
  const dress = related["dress-code"] ?? {};
  const gifts = related.gifts ?? {};
  const place =
    look === "cards"
      ? centredWhenStacked(items.length)
      : "items-center text-center";

  return (
    <ul
      className={
        {
          grid: `grid ${UNLINED_PULL} ${columnsFor(items.length)}`,
          cards: `grid gap-3 @3xl:gap-4 ${cardColumns(items.length)}`,
          list: UNLINED_PULL,
        }[look]
      }
    >
      {items.map((item, index) => {
        const tile = {
          className: `flex flex-col ${place} ${
            {
              grid: `${SECTION_GROUND[ground]} px-6 py-8 @3xl:px-8 @3xl:py-10`,
              cards: `${CARD} ${COLUMN} ${GROUND[accent ? "accent" : otherGround(ground)]}`,
              list: "py-8 @3xl:py-10",
            }[look]
          }`,
          tone: accent
            ? `${TONES.secondary} ${PAGE_SECONDARY}`
            : TONES.secondary,
          place,
        };
        if (item.kind === "dress-code") {
          return (
            <Tile
              key={index}
              {...tile}
              mark={itemMark(mode, twinIcon(dress), index)}
              label={text(dress, "eyebrow")}
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
              mark={itemMark(mode, twinIcon(gifts), index)}
              label={text(gifts, "eyebrow")}
              title={text(gifts, "title")}
              body={text(gifts, "body")}
            >
              {hasGiftActions(gifts) ? (
                <GiftActions
                  values={gifts}
                  stacked={look !== "list"}
                  accent={accent}
                />
              ) : null}
            </Tile>
          );
        }
        return (
          <Tile
            key={index}
            {...tile}
            mark={itemMark(mode, item.icon, index)}
            label={item.label ?? ""}
            title={item.title ?? ""}
            body={item.text ?? ""}
          />
        );
      })}
    </ul>
  );
}

/** One note: its mark (icon or number), label, title, text and anything under them. */
function Tile({
  className,
  tone,
  place,
  mark,
  label,
  title,
  body,
  children,
}: {
  className: string;
  tone: string;
  place: string;
  mark: ItemMark;
  label: string;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <li className={className}>
      {mark ? (
        <span className={`${CARD_DISC} mb-5 ${tone}`}>
          <MarkGlyph mark={mark} iconClass="size-5.5" />
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
