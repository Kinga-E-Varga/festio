"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { FoldChevron } from "@/components/icons";
import { NAV_HOVER } from "@/components/dashboard/NavLink";
import { EventPickerList } from "@/components/dashboard/event-nav/EventPickerList";
import { formatDay, PICKER_DATE_PARTS } from "@/lib/event";
import { useDismiss } from "@/components/dashboard/event-nav/useDismiss";
import type { PickerEvent } from "@/types/dashboard";

interface EventPickerProps {
  /** Every event, soonest first; the list offers the upcoming ones. */
  events: PickerEvent[];
  picked: PickerEvent | undefined;
}

/**
 * The event being worked on, and the way to another, like a workspace
 * switcher: its name in the current nav link's text and its date under it,
 * no box, so it reads as part of the nav. The list floats under it, over the
 * event's pages, as wide as the picker, so the nav's edges never clip it; on a
 * very short window the nav scrolls to the rest of it.
 */
export function EventPicker({ events, picked }: EventPickerProps) {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useDismiss(open, rootRef, () => setOpen(false));

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={`block w-full rounded-ui px-3 py-2 text-left transition-colors wide:px-4 ${NAV_HOVER}`}
      >
        {/* Read out with the event it is on, so the button says both. */}
        <span className="sr-only">{`${t("picker")}: `}</span>
        {/* The chevron on the name's line, the date under both. */}
        <span className="flex items-center gap-4">
          <span
            className={`min-w-0 flex-1 overflow-hidden whitespace-nowrap ${
              picked ? "nav-current" : "nav-text text-neutral-700"
            }`}
          >
            {picked
              ? picked.title
              : events.length === 0
                ? t("noEvents")
                : t("noUpcoming")}
          </span>
          <FoldChevron
            open={open}
            className="size-4 text-neutral-700"
            strokeWidth={2}
          />
        </span>
        {picked ? (
          /* The short date, as the list writes it. */
          <span className="mt-0.5 block muted-text leading-[1.4]">
            {formatDay(picked.date, locale, PICKER_DATE_PARTS)}
          </span>
        ) : null}
      </button>

      {open ? (
        <EventPickerList
          events={events}
          picked={picked}
          onPick={() => setOpen(false)}
          className="absolute inset-x-0 top-full z-30 mt-1.5"
        />
      ) : null}
    </div>
  );
}
