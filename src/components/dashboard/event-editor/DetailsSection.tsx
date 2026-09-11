"use client";

import { ChangeWarning } from "@/components/dashboard/event-editor/ChangeWarning";
import { EditorSection } from "@/components/dashboard/event-editor/EditorSection";
import { Field } from "@/components/dashboard/event-editor/Field";
import {
  ERROR,
  FIELD_GRID,
  INPUT,
  LABEL,
  SUBBOX,
} from "@/components/dashboard/event-editor/styles";
import { Toggle } from "@/components/dashboard/event-editor/Toggle";
import type { EventForm } from "@/components/dashboard/event-editor/useEventForm";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import { EVENT_KINDS } from "@/mock/dashboard";
import type { DashboardEvent, EventKind } from "@/types/dashboard";

/** Dates the platform works out; they are never typed in. */
function Derived({
  items,
}: {
  items: { term: string; value: string; note: string }[];
}) {
  return (
    <dl className="mt-[22px] grid grid-cols-1 gap-px border border-forest-500 border-l-[3px] bg-forest-500 @min-[820px]:grid-cols-3">
      {items.map((item) => (
        <div key={item.term} className="bg-forest-100 px-4 py-[13px]">
          <dt className="text-[12.5px] leading-[1.3] font-bold text-forest-500">
            {item.term}
          </dt>
          <dd className="mt-[5px] text-base leading-[1.3] text-forest-600">
            {item.value}
            <small className="mt-1 block text-[11.5px] leading-[1.45]">
              {item.note}
            </small>
          </dd>
        </div>
      ))}
    </dl>
  );
}

interface SectionProps {
  event: DashboardEvent;
  form: EventForm;
}

export function DetailsSection({ event, form }: SectionProps) {
  const { values, set, derived, locked } = form;
  const replied = event.rsvp.replied;

  return (
    <EditorSection title="Details">
      <div className={FIELD_GRID}>
        <Field
          htmlFor="event-name"
          label="Event name"
          className="@min-[820px]:col-span-2"
          hint="Your own label for this event. The only place a guest meets it is the browser tab title."
        >
          <input
            id="event-name"
            type="text"
            maxLength={80}
            disabled={locked}
            value={values.title}
            onChange={(control) => set.title(control.target.value)}
            className={INPUT}
          />
        </Field>

        <Field
          htmlFor="event-kind"
          label="Occasion"
          hint="Sets which templates Festio offers first."
        >
          <select
            id="event-kind"
            disabled={locked}
            value={values.kind}
            onChange={(control) => set.kind(control.target.value as EventKind)}
            className={INPUT}
          >
            {EVENT_KINDS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          htmlFor="event-date"
          label="Date"
          hint="The date of your event, and the one shown on the invitation."
        >
          <input
            id="event-date"
            type="date"
            disabled={locked}
            value={values.date}
            onChange={(control) => set.date(control.target.value)}
            className={INPUT}
          />
        </Field>
      </div>

      <ChangeWarning title="Moving the date" warning={form.warnings.date}>
        Your invitation will show the new date, but Festio will not tell your
        guests — that part is yours to do.{" "}
        {replied > 0 ? (
          <>
            <b>
              {replied} {replied === 1 ? "guest has" : "guests have"} already
              replied
            </b>{" "}
            for this event.
          </>
        ) : (
          "No one has replied for this event yet."
        )}
      </ChangeWarning>

      <p className={`mt-[22px] mb-2.5 ${LABEL}`}>When the reply form closes</p>

      <Toggle
        label="Close the replies earlier"
        checked={values.closeEarly}
        disabled={locked}
        onChange={set.closeEarly}
        description={
          <>
            Replies close on <b>{derived.closeDefaultLabel}</b> — the day before
            the event. Switch this on to close sooner.
          </>
        }
      />

      {values.closeEarly ? (
        <div className={SUBBOX}>
          <Field htmlFor="event-close" label="Close the form at">
            <input
              id="event-close"
              type="datetime-local"
              max={derived.closeLimit}
              disabled={locked}
              value={values.closeAt}
              onChange={(control) => set.closeAt(control.target.value)}
              className={`${INPUT} max-w-[280px]`}
            />
          </Field>
          {derived.closeTooLate ? (
            <p className={`mt-[7px] ${ERROR}`}>
              Pick a time no later than the 24-hour cut-off.
            </p>
          ) : null}
        </div>
      ) : null}

      <Derived
        items={[
          {
            term: "Replies close",
            value: derived.closeLabel,
            note: derived.closesEarly
              ? "Your own time, ahead of the cut-off."
              : "The day before the event.",
          },
          {
            term: "Editing freezes",
            value: derived.freezeLabel,
            note: "Event and invitation editing close the day before the event.",
          },
          {
            term: "Data deleted",
            value: derived.deletionLabel,
            note: `${event.dataDeleted ? "Already done. " : ""}For GDPR reasons, guest and event data are kept only ${GUEST_DATA_RETENTION_DAYS} days after the event date.`,
          },
        ]}
      />
    </EditorSection>
  );
}
