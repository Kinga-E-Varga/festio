"use client";

import { useLocale, useTranslations } from "next-intl";
import { Fragment } from "react";
import { HINT, LABEL } from "@/components/dashboard/event-editor/styles";
import { DateFormatSelect } from "@/components/invitation/DateFormatSelect";
import { localized, type Language } from "@/lib/language";
import { groups, isOn, list, longDate, text } from "@/modular/content";
import { contentParts, fieldId, setValue, shownItems } from "@/modular/fields";
import { NOTES_ID } from "@/modular/state";
import type {
  EventDateField,
  InvitationBasics,
  ModularLibrary,
  ModularState,
  SectionDefinition,
  SectionField,
  SectionValues,
} from "@/types/modular";
import { FieldInput } from "./FieldInput";
import { GroupFields, ListFields } from "./ListFields";
import { NotesFields } from "./NotesFields";
import { SwatchRow } from "./SwatchRow";

export interface SectionFieldsProps {
  /** Helpful notes reads Dress code's and Gifts' definitions from it. */
  library: ModularLibrary;
  definition: SectionDefinition;
  variant: string;
  state: ModularState;
  basics: InvitationBasics;
  /** The invitation's language: what a date format is previewed in. */
  language: Language;
  /** Save was tried with an empty required field: show every such error. */
  showErrors: boolean;
  onChange: (next: ModularState) => void;
}

/**
 * A section's fields, as its variant shows them: values the variant leaves
 * out stay in the state, for a variant that shows them. Helpful notes has
 * its own layout.
 */
export function SectionFields({
  library,
  definition,
  variant,
  state,
  basics,
  language,
  showErrors,
  onChange,
}: SectionFieldsProps) {
  if (definition.id === NOTES_ID) {
    return (
      <NotesFields
        library={library}
        definition={definition}
        variant={variant}
        state={state}
        basics={basics}
        language={language}
        showErrors={showErrors}
        onChange={onChange}
      />
    );
  }
  const [{ shows, fields }] = contentParts(state, library, definition, variant);

  return (
    <FieldList
      section={definition.id}
      fields={fields}
      shows={shows}
      values={state.values[definition.id] ?? {}}
      basics={basics}
      language={language}
      showErrors={showErrors}
      onSet={(field, value) =>
        onChange(setValue(state, definition.id, field, value))
      }
    />
  );
}

/**
 * Fields of any type, one after another: scalars, switches, lists, groups.
 * `fields` are those on screen (`contentParts`): a switch's fields are
 * there only while it is on.
 */
export function FieldList({
  section,
  fields,
  shows,
  values,
  basics,
  language,
  showErrors,
  onSet,
}: {
  section: string;
  fields: SectionField[];
  shows: Set<string>;
  values: SectionValues;
  /** The event's date, for the date and date-format fields. */
  basics: InvitationBasics;
  /** The invitation's language: what a date format is previewed in. */
  language: Language;
  showErrors: boolean;
  onSet: (field: string, value: SectionValues[string]) => void;
}) {
  const host = useLocale() as Language;
  /* Fields a switch controls are drawn after it, not in their own place. */
  const headed = new Set(
    fields.flatMap((field) =>
      field.type === "toggle" ? (field.controls ?? []) : [],
    ),
  );
  return fields.map((field) => {
    if (headed.has(field.id)) return null;
    /* A switch with fields under it, drawn right after it. */
    if (field.type === "toggle" && field.controls) {
      const controls = field.controls;
      return (
        <Fragment key={field.id}>
          <FieldInput
            id={fieldId(section, field.id)}
            field={field}
            value={isOn(values, field.id)}
            showErrors={showErrors}
            onChange={(value) => onSet(field.id, value)}
          />
          <FieldList
            section={section}
            fields={fields.filter(({ id }) => controls.includes(id))}
            shows={shows}
            values={values}
            basics={basics}
            language={language}
            showErrors={showErrors}
            onSet={onSet}
          />
        </Fragment>
      );
    }
    if (field.type === "list") {
      const shown = shownItems(shows, field.id, field.item);
      /* A list of colours alone: one row of round pickers. */
      if (shown.length === 1 && shown[0].type === "color") {
        return (
          <SwatchRow
            key={field.id}
            section={section}
            field={field}
            color={shown[0].id}
            items={list(values, field.id)}
            onItems={(items) => onSet(field.id, items)}
          />
        );
      }
      return (
        <ListFields
          key={field.id}
          section={section}
          field={field}
          items={list(values, field.id)}
          shown={shown}
          showErrors={showErrors}
          onItems={(items) => onSet(field.id, items)}
        />
      );
    }
    if (field.type === "groups") {
      return (
        <GroupFields
          key={field.id}
          section={section}
          field={field}
          groups={groups(values, field.id)}
          shows={shows}
          showErrors={showErrors}
          onGroups={(next) => onSet(field.id, next)}
        />
      );
    }
    if (field.type === "eventDate") {
      return <EventDateLine key={field.id} field={field} date={basics.date} />;
    }
    if (field.type === "dateFormat") {
      const id = fieldId(section, field.id);
      return (
        <div key={field.id} className="flex flex-col gap-1.5">
          <label htmlFor={id} className={LABEL}>
            {localized(field.label, host)}
          </label>
          <DateFormatSelect
            id={id}
            value={text(values, field.id)}
            eventDate={basics.date}
            language={language}
            onChange={(value) => onSet(field.id, value)}
          />
        </div>
      );
    }
    return (
      <FieldInput
        key={field.id}
        id={fieldId(section, field.id)}
        field={field}
        value={
          field.type === "toggle"
            ? isOn(values, field.id)
            : text(values, field.id)
        }
        showErrors={showErrors}
        onChange={(value) => onSet(field.id, value)}
      />
    );
  });
}

/** The event's date, read-only, with where to change it. */
function EventDateLine({
  field,
  date,
}: {
  field: EventDateField;
  date: string;
}) {
  const t = useTranslations("HostEditor");
  const host = useLocale() as Language;
  return (
    <div className="flex flex-col gap-1.5">
      <span className={LABEL}>{localized(field.label, host)}</span>
      <p className="text-[13.5px] text-neutral-900">{longDate(date, host)}</p>
      <p className={HINT}>{t("dateHint")}</p>
    </div>
  );
}
