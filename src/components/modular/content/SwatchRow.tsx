"use client";

import { useLocale, useTranslations } from "next-intl";
import { localized, type Language } from "@/lib/language";
import {
  emptyItem,
  fieldId,
  itemTitle,
  removeAt,
  replaceAt,
} from "@/modular/fields";
import type { ListField, ListItem } from "@/types/modular";
import { GOLD_BTN } from "@/components/dashboard/event-editor/styles";
import { Icon } from "@/components/icons";
import { ColorWell } from "./ColorWell";

/** A new colour: the palette's accent, so it follows the palette until picked. */
const NEW_COLOUR = "accent";

/**
 * A list of colours as one row of round pickers, each with a small × to
 * remove it, and a round + to add one, up to `maxItems`. `color` is the
 * item field the picker sets.
 */
export function SwatchRow({
  section,
  field,
  color,
  items,
  onItems,
}: {
  section: string;
  field: ListField;
  color: string;
  items: ListItem[];
  onItems: (items: ListItem[]) => void;
}) {
  const t = useTranslations("ContentTab");
  const host = useLocale() as Language;
  const label = localized(field.label, host);
  const name = (n: number) => itemTitle(field, n, host);

  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-3">
      {items.map((item, index) => (
        <div key={index} className="relative">
          <ColorWell
            id={fieldId(section, field.id, index, color)}
            label={name(index + 1)}
            value={item[color] ?? ""}
            onChange={(value) =>
              onItems(replaceAt(items, index, { ...item, [color]: value }))
            }
          />
          <button
            type="button"
            aria-label={`${t("remove")}: ${name(index + 1)}`}
            onClick={() => onItems(removeAt(items, index))}
            className="absolute -top-1 -right-1 grid size-5 cursor-pointer place-items-center rounded-full border border-mustard-300 bg-neutral-50 text-neutral-800 transition-colors before:absolute before:-inset-2 before:content-[''] hover:border-rust-500 hover:bg-rust-500 hover:text-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-mustard-500"
          >
            <Icon name="close" className="size-3" strokeWidth={2} />
          </button>
        </div>
      ))}
      {items.length < field.maxItems ? (
        <button
          type="button"
          aria-label={
            field.addLabel
              ? localized(field.addLabel, host)
              : `${t("add")}: ${label}`
          }
          onClick={() =>
            onItems([
              ...items,
              { ...emptyItem(field.item), [color]: NEW_COLOUR },
            ])
          }
          className={`grid size-10 cursor-pointer place-items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mustard-500 ${GOLD_BTN}`}
        >
          <Icon name="plus" className="size-4" strokeWidth={2} />
        </button>
      ) : null}
    </div>
  );
}
