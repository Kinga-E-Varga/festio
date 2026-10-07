"use client";

import { useLocale, useTranslations } from "next-intl";
import { memo, useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import {
  GOLD_BTN,
  INPUT,
  LABEL,
} from "@/components/dashboard/event-editor/styles";
import { localized, type Language } from "@/lib/language";
import {
  emptyItem,
  fieldId,
  itemTitle,
  removeAt,
  replaceAt,
  shownItems,
} from "@/modular/fields";
import type {
  Group,
  GroupListField,
  ItemField,
  ListField,
  ListItem,
} from "@/types/modular";
import { Icon } from "@/components/icons";
import { FieldInput } from "./FieldInput";

/** One item: its head, then its fields. */
const ITEM = "flex flex-col gap-3";
/** An item's head: a bar filled with the inputs' border colour. */
const HEAD_BAR = "flex items-center gap-3 px-3 py-2";

/** A list's box. */
const LIST = "flex flex-col gap-4";
const REMOVE =
  "cursor-pointer text-[11.5px] font-medium text-neutral-800 transition-colors hover:text-rust-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-neutral-800";

/** An item's numbered name, with Remove at the right — or `end` in its place. */
export function ItemHead({
  title,
  canRemove = false,
  onRemove,
  end,
}: {
  title: string;
  canRemove?: boolean;
  onRemove?: () => void;
  /** Drawn instead of Remove: Helpful notes' part switches. */
  end?: ReactNode;
}) {
  const t = useTranslations("ContentTab");
  return (
    // Filled with the inputs' border colour: the bar that heads each item.
    <div className={`${HEAD_BAR} w-full justify-between bg-mustard-300`}>
      <span className={`${LABEL} text-neutral-900!`}>{title}</span>
      {end ?? (
        <button
          type="button"
          disabled={!canRemove}
          aria-label={`${t("remove")}: ${title}`}
          onClick={onRemove}
          className={REMOVE}
        >
          {t("remove")}
        </button>
      )}
    </div>
  );
}

/** Add, an item head's bar and type in the gold action's colours; greyed out once the list is full. */
function AddButton({
  label,
  text,
  disabled,
  onAdd,
}: {
  /** What is added — the list's name, for screen readers. */
  label: string;
  /** The button's own words; left out, just "Add". */
  text?: string;
  disabled: boolean;
  onAdd: () => void;
}) {
  const t = useTranslations("ContentTab");
  return (
    <button
      type="button"
      disabled={disabled}
      // Its own words already say what it adds.
      aria-label={text ? undefined : `${t("add")}: ${label}`}
      onClick={onAdd}
      className={`${HEAD_BAR} ${LABEL} cursor-pointer border text-mustard-600! transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${GOLD_BTN} w-full`}
    >
      <Icon name="plus" className="size-3.5" strokeWidth={2} />
      {text ?? t("add")}
    </button>
  );
}

/**
 * A `lines` field, one input per line under a numbered label with Remove,
 * then Add. Remove stops at one line, Add at `maxLines`.
 */
function LinesField({
  id,
  field,
  value,
  onChange,
}: {
  id: string;
  field: ItemField;
  value: string;
  onChange: (value: string) => void;
}) {
  const t = useTranslations("ContentTab");
  const host = useLocale() as Language;
  const label = localized(field.label, host);
  const lines = value.split("\n");
  const set = (next: string[]) => onChange(next.join("\n"));

  return (
    <div role="group" aria-label={label} className="flex flex-col gap-3">
      {lines.map((line, index) => {
        const title = `${label} ${index + 1}`;
        // The first line keeps the field's own id: what Save focuses.
        const lineId = index === 0 ? id : `${id}-${index}`;
        return (
          <div key={index} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor={lineId} className={LABEL}>
                {title}
              </label>
              <button
                type="button"
                disabled={lines.length <= 1}
                aria-label={`${t("remove")}: ${title}`}
                onClick={() => set(removeAt(lines, index))}
                className={REMOVE}
              >
                {t("remove")}
              </button>
            </div>
            <input
              id={lineId}
              type="text"
              value={line}
              maxLength={field.maxLength}
              onChange={(event) =>
                set(replaceAt(lines, index, event.target.value))
              }
              className={INPUT}
            />
          </div>
        );
      })}
      <AddButton
        label={label}
        text={field.addLabel ? localized(field.addLabel, host) : undefined}
        disabled={lines.length >= (field.maxLines ?? 1)}
        onAdd={() => set([...lines, ""])}
      />
    </div>
  );
}

/** One item's shown fields. */
function ItemInputs({
  idBase,
  fields,
  item,
  showErrors,
  onItem,
}: {
  /** The item's element id; each field's is it plus the field's id. */
  idBase: string;
  fields: ItemField[];
  item: ListItem;
  showErrors: boolean;
  onItem: (item: ListItem) => void;
}) {
  // Inset as far as the head's name, so the fields line up under it.
  return (
    <div className="flex flex-col gap-3 px-3">
      {fields.map((field) =>
        field.type === "lines" && (field.maxLines ?? 1) > 1 ? (
          <LinesField
            key={field.id}
            id={`${idBase}-${field.id}`}
            field={field}
            value={item[field.id] ?? ""}
            onChange={(value) => onItem({ ...item, [field.id]: value })}
          />
        ) : (
          <FieldInput
            key={field.id}
            id={`${idBase}-${field.id}`}
            field={field}
            value={item[field.id] ?? ""}
            showErrors={showErrors}
            onChange={(value) => onItem({ ...item, [field.id]: String(value) })}
          />
        ),
      )}
    </div>
  );
}

/**
 * A list's Replace and Remove, the same functions every render: they read
 * the latest list when called, so a row that skipped a redraw never writes
 * back an old list.
 */
function useListEdit<T>(items: T[], onItems: (items: T[]) => void) {
  const latest = useRef({ items, onItems });
  useLayoutEffect(() => {
    latest.current = { items, onItems };
  });
  return useMemo(
    () => ({
      replace: (index: number, value: T) =>
        latest.current.onItems(replaceAt(latest.current.items, index, value)),
      remove: (index: number) =>
        latest.current.onItems(removeAt(latest.current.items, index)),
    }),
    [],
  );
}

/**
 * One item: its head with Remove, then its fields. Redrawn only when its
 * own values change, not on every key typed in another item.
 */
const ItemRow = memo(function ItemRow({
  index,
  idBase,
  title,
  canRemove,
  fields,
  item,
  showErrors,
  onReplace,
  onRemove,
}: {
  index: number;
  idBase: string;
  title: string;
  canRemove: boolean;
  fields: ItemField[];
  item: ListItem;
  showErrors: boolean;
  onReplace: (index: number, item: ListItem) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className={ITEM}>
      <ItemHead
        title={title}
        canRemove={canRemove}
        onRemove={() => onRemove(index)}
      />
      <ItemInputs
        idBase={idBase}
        fields={fields}
        item={item}
        showErrors={showErrors}
        onItem={(next) => onReplace(index, next)}
      />
    </div>
  );
});

/**
 * A list's rows, then Add, laid into the caller's box. Each list says how
 * its rows are named, numbered and given ids, whether Remove is allowed,
 * and — Helpful notes — which items are its own (`keep`); the rest are
 * left in place, unshown.
 */
export function ItemList({
  items,
  fields,
  showErrors,
  idBase,
  title,
  canRemove,
  keep,
  add,
  onItems,
}: {
  items: ListItem[];
  fields: ItemField[];
  showErrors: boolean;
  idBase: (index: number) => string;
  title: (index: number) => string;
  canRemove: boolean;
  keep?: (item: ListItem) => boolean;
  add: { label: string; text?: string; disabled: boolean; item: ListItem };
  onItems: (items: ListItem[]) => void;
}) {
  const edit = useListEdit(items, onItems);
  return (
    <>
      {items.map((item, index) =>
        !keep || keep(item) ? (
          <ItemRow
            key={index}
            index={index}
            idBase={idBase(index)}
            title={title(index)}
            canRemove={canRemove}
            fields={fields}
            item={item}
            showErrors={showErrors}
            onReplace={edit.replace}
            onRemove={edit.remove}
          />
        ) : null,
      )}
      <AddButton
        label={add.label}
        text={add.text}
        disabled={add.disabled}
        onAdd={() => onItems([...items, add.item])}
      />
    </>
  );
}

/**
 * A list's items, each under a numbered rule with Remove, then Add. Add
 * stops at `maxItems`, Remove at `minItems`; neither asks. Items have no
 * ids of their own, so they are keyed by place: every input is controlled,
 * so the ones after a removed item simply show their new values.
 */
export function ListFields({
  section,
  field,
  items,
  shown,
  showErrors,
  onItems,
}: {
  section: string;
  field: ListField;
  items: ListItem[];
  /** The item fields the variant shows. */
  shown: ItemField[];
  showErrors: boolean;
  onItems: (items: ListItem[]) => void;
}) {
  const host = useLocale() as Language;
  const label = localized(field.label, host);

  return (
    <div role="group" aria-label={label} className={LIST}>
      <ItemList
        items={items}
        fields={shown}
        showErrors={showErrors}
        idBase={(index) => fieldId(section, field.id, index)}
        title={(index) => itemTitle(field, index + 1, host)}
        canRemove={items.length > (field.minItems ?? 0)}
        add={{
          label,
          text: field.addLabel ? localized(field.addLabel, host) : undefined,
          disabled: items.length >= field.maxItems,
          item: emptyItem(field.item),
        }}
        onItems={onItems}
      />
    </div>
  );
}

/**
 * A schedule's days: each day's own fields and its events as a list, with
 * Add and Remove at both levels.
 */
export function GroupFields({
  section,
  field,
  groups,
  shows,
  showErrors,
  onGroups,
}: {
  section: string;
  field: GroupListField;
  groups: Group[];
  shows: Set<string>;
  showErrors: boolean;
  onGroups: (groups: Group[]) => void;
}) {
  const host = useLocale() as Language;
  const label = localized(field.label, host);
  const edit = useListEdit(groups, onGroups);

  return (
    <div role="group" aria-label={label} className={LIST}>
      {groups.map((group, g) => (
        <DayRow
          key={g}
          index={g}
          section={section}
          field={field}
          group={group}
          shows={shows}
          showErrors={showErrors}
          onReplace={edit.replace}
          onRemove={edit.remove}
        />
      ))}
      <AddButton
        label={label}
        text={localized(field.addLabel, host)}
        disabled={groups.length >= field.maxGroups}
        onAdd={() =>
          onGroups([...groups, { values: emptyItem(field.group), items: [] }])
        }
      />
    </div>
  );
}

/** One day: its own fields, then its events. Redrawn only when it changes. */
const DayRow = memo(function DayRow({
  index,
  section,
  field,
  group,
  shows,
  showErrors,
  onReplace,
  onRemove,
}: {
  index: number;
  section: string;
  field: GroupListField;
  group: Group;
  shows: Set<string>;
  showErrors: boolean;
  onReplace: (index: number, group: Group) => void;
  onRemove: (index: number) => void;
}) {
  const host = useLocale() as Language;
  const itemsLabel = localized(field.items.label, host);
  const groupTitle = localized(field.groupLabel, host);
  const eventTitle = localized(field.items.itemLabel, host);
  const addItem = localized(field.items.addLabel, host);
  const own = shownItems(shows, field.id, field.group);
  const inner = shownItems(shows, `${field.id}.items`, field.items.item);

  return (
    <div className={ITEM}>
      <ItemHead
        title={`${groupTitle} ${index + 1}`}
        canRemove
        onRemove={() => onRemove(index)}
      />
      <ItemInputs
        idBase={fieldId(section, field.id, index)}
        fields={own}
        item={group.values}
        showErrors={showErrors}
        onItem={(values) => onReplace(index, { ...group, values })}
      />
      {/* Inset like the date input, so each event reads as part of its day. */}
      <div className="flex flex-col gap-4 px-3">
        <ItemList
          items={group.items}
          fields={inner}
          showErrors={showErrors}
          idBase={(at) => fieldId(section, field.id, index, "items", at)}
          title={(at) => `${eventTitle} ${at + 1}`}
          canRemove
          add={{
            label: itemsLabel,
            text: addItem.replace("{n}", String(index + 1)),
            disabled: group.items.length >= field.items.maxItems,
            item: emptyItem(field.items.item),
          }}
          onItems={(items) => onReplace(index, { ...group, items })}
        />
      </div>
    </div>
  );
});
