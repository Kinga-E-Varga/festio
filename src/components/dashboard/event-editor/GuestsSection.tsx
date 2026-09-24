"use client";

import { useTranslations } from "next-intl";
import { EditorSection } from "@/components/dashboard/event-editor/EditorSection";
import {
  ERROR,
  HINT,
  INPUT,
  LABEL,
  SUBBOX,
} from "@/components/dashboard/event-editor/styles";
import { Toggle } from "@/components/dashboard/event-editor/Toggle";
import { RepliesMeter } from "@/components/dashboard/RepliesMeter";
import type { EventForm } from "@/components/dashboard/event-editor/useEventForm";
import { Icon } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import type { DashboardEvent } from "@/types/dashboard";

interface SectionProps {
  event: DashboardEvent;
  form: EventForm;
}

export function GuestsSection({ event, form }: SectionProps) {
  const t = useTranslations("EventEditor");
  const { values, set, derived, locked } = form;

  return (
    <EditorSection title={t("guests")}>
      <label htmlFor="event-expected" className={`mb-2.5 block ${LABEL}`}>
        {t("expected")}
      </label>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3.5">
        <input
          id="event-expected"
          type="number"
          required
          min={1}
          max={1000}
          step={1}
          disabled={locked}
          value={values.expected}
          onChange={(control) => set.expected(control.target.value)}
          className={`${INPUT} basis-[180px]`}
        />

        {/* The count sits over the bar, the pair centred on the input beside it. */}
        <div className="flex-1 basis-[320px]">
          <RepliesMeter
            replied={event.rsvp.replied}
            expected={derived.expectedValue}
          />
        </div>

        {derived.expectedError ? (
          <p className={`basis-full ${ERROR}`}>{derived.expectedError}</p>
        ) : null}
        <p className={`basis-full ${HINT}`}>{t("expectedHint")}</p>
      </div>

      <div className="mt-[22px]">
        <p className={`mb-2.5 ${LABEL}`}>{t("expecting")}</p>

        <Toggle
          label={t("preloaded")}
          checked={values.preloaded}
          disabled={locked}
          onChange={set.preloaded}
          description={t("preloadedNote")}
        />

        {values.preloaded ? (
          <div className={SUBBOX}>
            <p className="font-bold text-neutral-900">
              {t("preloadedCount", { count: event.preloadedCount })}
              {/* A new tab, so unsaved changes in this editor stay put. */}
              <Link
                href={`/dashboard/events/${event.id}/guests#list`}
                target="_blank"
                rel="noopener"
                className="ml-3 inline-flex items-center gap-1.5 border border-mustard-400 bg-mustard-200 px-2.5 py-1 align-[1px] text-xs font-semibold whitespace-nowrap text-mustard-600 transition-colors hover:border-mustard-500"
              >
                <Icon name="pencil" className="size-3.5" />
                {t("editList")}
              </Link>
            </p>
          </div>
        ) : null}
      </div>
    </EditorSection>
  );
}
