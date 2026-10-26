"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/icons";
import { SearchClear } from "@/components/dashboard/SearchClear";
import { MENU_SURFACE } from "@/components/dashboard/styles";
import { switchHref } from "@/components/dashboard/event-nav/pages";
import { formatDay, PICKER_DATE_PARTS } from "@/lib/event";
import { plainText } from "@/lib/language";
import { writePickedEvent } from "@/lib/picked-event";
import type { EventStatus, PickerEvent } from "@/types/dashboard";
import { STATUS_FILL } from "@/components/dashboard/styles";

/** Each event's dot: live (the guest list's Coming dot), Hidden, or over. */
export const DOT: Record<EventStatus, string> = {
  active: STATUS_FILL.going,
  hidden: "bg-warning-400",
  past: "bg-neutral-500",
};

interface EventPickerListProps {
  /** Every event, soonest first; the list offers the upcoming ones, and the past ones a search finds. */
  events: PickerEvent[];
  picked: PickerEvent | undefined;
  /** Called as an event is picked, to close whatever opened the list. */
  onPick: () => void;
  /** Its placement, from whatever opened it. */
  className?: string;
}

/**
 * The picker's list: a search, the upcoming events, New event. A search also
 * finds past events, latest first under a Past label, leaving out the ones
 * whose data is gone. Mounted only while open, so the search starts empty
 * each time.
 */
export function EventPickerList({
  events,
  picked,
  onPick,
  className = "",
}: EventPickerListProps) {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const search = plainText(query.trim());
  const matches = (event: PickerEvent) =>
    plainText(event.title).includes(search);
  const upcoming = events.filter((event) => event.status !== "past");
  const shown = upcoming.filter(matches);
  const past = search
    ? events
        .filter(
          (event) =>
            event.status === "past" && !event.archived && matches(event),
        )
        .reverse()
    : [];

  /** One event: its dot, name and short date; the picked one in the nav's current-link fill. */
  const item = (event: PickerEvent) => {
    const current = event.id === picked?.id;
    return (
      <li key={event.id}>
        <Link
          href={switchHref(pathname, event)}
          aria-current={current || undefined}
          onClick={() => {
            writePickedEvent(event.id);
            onPick();
          }}
          className={`flex items-center gap-2 rounded-ui px-2 py-2 meta-face transition-colors ${
            current
              ? "bg-secondary-400 text-neutral-950"
              : "text-neutral-800 hover:bg-secondary-400/30"
          }`}
        >
          <span
            aria-hidden="true"
            className={`size-2 shrink-0 rounded-full ${DOT[event.status]}`}
          />
          <span className="min-w-0 flex-1 overflow-hidden whitespace-nowrap">
            {event.title}
          </span>
          <span className="ml-4 shrink-0 font-normal hint-text">
            {formatDay(event.date, locale, PICKER_DATE_PARTS)}
          </span>
        </Link>
      </li>
    );
  };

  return (
    <div className={`${className} ${MENU_SURFACE} p-1.5`}>
      {events.length > 0 ? (
        <div className="relative mb-1">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchEvents")}
            aria-label={t("searchEvents")}
            className="h-9 w-full border-b border-neutral-200 bg-transparent pr-8 pl-2 meta-face text-neutral-950 outline-none placeholder:text-neutral-700 focus:border-neutral-500"
          />
          <SearchClear query={query} onClear={() => setQuery("")} />
        </div>
      ) : null}

      {/*
       * About six events, then it scrolls, the next one cut in half so it
       * shows there is more; half the screen pushed the nav's pages too far.
       */}
      <ul className="side-scroll max-h-[220px] overflow-y-auto [--scroll-track:var(--color-neutral-50)]">
        {shown.map(item)}
        {past.length > 0 ? (
          <li aria-hidden="true" className="px-2 pt-2.5 pb-1 label-caps">
            {t("past")}
          </li>
        ) : null}
        {past.map(item)}
        {search && shown.length === 0 && past.length === 0 ? (
          <li className="px-2 py-2 muted-text">{t("noMatches")}</li>
        ) : null}
      </ul>

      {/* No action behind it yet, as on Home. */}
      <button
        type="button"
        className="mt-1 flex w-full items-center gap-2 rounded-ui border-t border-neutral-200 px-2 py-2 meta-face font-semibold text-accent-700 transition-colors hover:bg-secondary-400/30"
      >
        <Icon name="plus" className="size-3.5" strokeWidth={2.25} />
        {t("newEvent")}
      </button>
    </div>
  );
}
