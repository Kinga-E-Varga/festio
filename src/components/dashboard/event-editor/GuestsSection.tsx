"use client";

import type { CSSProperties } from "react";
import { Banner } from "@/components/dashboard/event-editor/Banner";
import { EditorSection } from "@/components/dashboard/event-editor/EditorSection";
import {
  ERROR,
  INPUT,
  LABEL,
  SUBBOX,
} from "@/components/dashboard/event-editor/styles";
import { Toggle } from "@/components/dashboard/event-editor/Toggle";
import type { EventForm } from "@/components/dashboard/event-editor/useEventForm";
import { Icon } from "@/components/icons";
import type { DashboardEvent } from "@/types/dashboard";

interface SectionProps {
  event: DashboardEvent;
  form: EventForm;
}

export function GuestsSection({ event, form }: SectionProps) {
  const { values, set, derived, locked } = form;
  const fill = { "--fill": `${derived.capPercent}%` } as CSSProperties;

  return (
    <EditorSection title="Guests and replies">
      <p className={`mb-2.5 ${LABEL}`}>Maximum number of guests</p>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3.5">
        <input
          id="event-cap"
          type="number"
          min={1}
          max={1000}
          step={10}
          aria-label="Maximum number of guests"
          disabled={locked}
          value={values.cap}
          onChange={(control) => set.cap(control.target.value)}
          className={`${INPUT} basis-[180px]`}
        />

        {/* The count sits over the bar, the pair centred on the input beside it. */}
        <div className="min-w-0 flex-1 basis-[320px]">
          <p className="mb-[5px] text-[12.5px] leading-[1.4] text-neutral-700">
            <span className="align-[-1px] font-serif text-[22px] text-neutral-900 tabular-nums">
              {event.rsvp.replied}
            </span>{" "}
            replies received against a {derived.capValue} cap
          </p>
          <div
            role="img"
            aria-label={`${event.rsvp.replied} replies against a cap of ${derived.capValue}`}
            className="meter"
            style={fill}
          >
            <span aria-hidden="true" />
          </div>
        </div>

        {derived.capError ? (
          <p className={`basis-full ${ERROR}`}>{derived.capError}</p>
        ) : null}
      </div>

      <Banner
        tone="info"
        icon="shield"
        title="A technical safeguard, not a guest limit"
      >
        The maximum only guards against a flood of automated replies. Raise it
        whenever you like — it is worth setting a little above the number of
        guests you are planning for.
      </Banner>

      <div className="mt-[22px]">
        <p className={`mb-2.5 ${LABEL}`}>Who you are expecting</p>

        <Toggle
          label="Use pre-loaded guest list"
          checked={values.preloaded}
          disabled={locked}
          onChange={set.preloaded}
          description="Match incoming replies against a list of names you expect. Anything that doesn't match is tagged UNKNOWN for you to sort out."
        />

        {values.preloaded ? (
          <div className={SUBBOX}>
            <p className="font-bold text-neutral-900">
              Currently {event.preloadedCount} names on your pre-loaded list
              <button
                type="button"
                className="ml-3 inline-flex items-center gap-1.5 border border-mustard-400 bg-mustard-200 px-2.5 py-1 align-[1px] text-xs font-semibold whitespace-nowrap text-mustard-600 transition-colors hover:border-mustard-500"
              >
                <Icon name="pencil" className="size-3.5" />
                Edit list
              </button>
            </p>
          </div>
        ) : null}
      </div>
    </EditorSection>
  );
}
