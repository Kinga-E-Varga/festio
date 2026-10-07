"use client";

import { useLocale, useTranslations } from "next-intl";
import { localized, type Language } from "@/lib/language";
import { list } from "@/modular/content";
import {
  contentParts,
  emptyItem,
  fieldId,
  setValue,
  shownItems,
} from "@/modular/fields";
import { Switch } from "@/components/invitation/PanelSwitch";
import {
  MAX_NOTES,
  NOTE_KINDS,
  NOTE_SWITCH,
  type NoteKind,
} from "@/modular/notes";
import { customNoteSample } from "@/modular/samples";
import { NOTES_ID, noteSwitchOn, setNoteSwitch } from "@/modular/state";
import type { ListField, ListItem } from "@/types/modular";
import { ItemHead, ItemList } from "./ListFields";
import { FieldList, type SectionFieldsProps } from "./SectionFields";

/** Dress code and Gifts: standalone sections with a Helpful notes card each. */
const TWINS = NOTE_KINDS.filter(
  (kind): kind is Exclude<NoteKind, "custom"> => kind !== "custom",
);

/** Each part of Helpful notes: its head bar, then its fields. */
const PART = "flex flex-col gap-3";
/** A part's fields, inset as far as the head's name, like an item's. */
const PART_FIELDS = "flex flex-col gap-4 px-3";

/** A custom note's number among the custom notes only, from 1. */
function customNumber(items: ListItem[], index: number): number {
  return items.slice(0, index + 1).filter((item) => item.kind === "custom")
    .length;
}

/**
 * Helpful notes' fields: its heading as its variant shows it; Dress code's
 * and Gifts' own fields while their switch is on here (the same values as
 * the standalone sections, without their heading); the custom notes while
 * Custom is on, with Add up to `MAX_NOTES` cards of every kind. Each part
 * heads its fields with a bar holding its switch — the only place they are
 * switched; turning the last one off turns Helpful notes off too.
 */
export function NotesFields({
  library,
  definition,
  variant,
  state,
  basics,
  language,
  showErrors,
  onChange,
}: SectionFieldsProps) {
  const t = useTranslations("ContentTab");
  const host = useLocale() as Language;
  const [own, ...parts] = contentParts(state, library, definition, variant);
  const shows = own.shows;
  const values = state.values[NOTES_ID] ?? {};
  const items = list(values, "items");
  const itemsField = definition.fields.find(
    (field): field is ListField =>
      field.id === "items" && field.type === "list",
  );
  const noteFields = itemsField
    ? shownItems(shows, "items", itemsField.item)
    : [];
  /* Custom notes are on screen when `contentParts` lists their part. */
  const customOn = parts.some((part) => part.keep);
  const setItems = (next: ListItem[]) =>
    onChange(setValue(state, NOTES_ID, "items", next));
  /* Each part is named by its switch, set once on the section. */
  const partName = (kind: NoteKind) => {
    const field = definition.fields.find(({ id }) => id === NOTE_SWITCH[kind]);
    return field ? localized(field.label, host) : "";
  };
  /** A part's head: its name and its switch. */
  const head = (kind: NoteKind, title: string) => {
    const on = noteSwitchOn(state, kind);
    return (
      <ItemHead
        title={title}
        end={
          <Switch
            size="sm"
            label={title}
            checked={on}
            onChange={(next) =>
              onChange(
                setNoteSwitch(
                  state,
                  kind,
                  next,
                  customNoteSample(definition, language),
                ),
              )
            }
          />
        }
      />
    );
  };

  return (
    <>
      <FieldList
        section={NOTES_ID}
        fields={own.fields}
        shows={shows}
        values={values}
        basics={basics}
        language={language}
        showErrors={showErrors}
        onSet={(field, value) =>
          onChange(setValue(state, NOTES_ID, field, value))
        }
      />
      {TWINS.map((id) => {
        if (!library.sections.some((each) => each.id === id)) return null;
        const part = parts.find((each) => each.section === id);
        return (
          <div key={id} className={PART}>
            {head(id, partName(id))}
            {part ? (
              <div className={PART_FIELDS}>
                <FieldList
                  section={id}
                  fields={part.fields}
                  shows={part.shows}
                  values={state.values[id] ?? {}}
                  basics={basics}
                  language={language}
                  showErrors={showErrors}
                  onSet={(field, value) =>
                    onChange(setValue(state, id, field, value))
                  }
                />
              </div>
            ) : null}
          </div>
        );
      })}
      {itemsField ? (
        <div className={PART}>
          {head("custom", partName("custom"))}
          {customOn ? (
            <div className={PART_FIELDS}>
              <ItemList
                items={items}
                fields={noteFields}
                showErrors={showErrors}
                idBase={(index) => fieldId(NOTES_ID, "items", index)}
                title={(index) =>
                  t("customNote", { n: customNumber(items, index) })
                }
                canRemove
                keep={(item) => item.kind === "custom"}
                add={{
                  label: partName("custom"),
                  text: t("addNote"),
                  disabled: items.length >= MAX_NOTES,
                  item: { ...emptyItem(itemsField.item), kind: "custom" },
                }}
                onItems={setItems}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
