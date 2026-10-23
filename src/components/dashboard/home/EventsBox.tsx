"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { BoxHead } from "@/components/dashboard/BoxHead";
import { RepliesBar } from "@/components/dashboard/RepliesSummary";
import { RowLines } from "@/components/dashboard/RowLines";
import { SearchField } from "@/components/dashboard/SearchField";
import { Select } from "@/components/dashboard/event-editor/Select";
import { ICON_BTN } from "@/components/dashboard/guest-list/styles";
import { StatusTag } from "@/components/dashboard/StatusTag";
import { BOX_ROWS, PAGE_BOX, ROW_LINK } from "@/components/dashboard/styles";
import { Icon } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import { eventPath, formatDay, formatRelative } from "@/lib/event";
import { plainText, type Language } from "@/lib/language";
import type { HomeEventRow } from "@/types/dashboard";

/** Events on one page of the box. */
const PAGE_SIZE = 6;

const FILTERS = ["upcoming", "live", "hidden", "past", "all"] as const;
type Filter = (typeof FILTERS)[number];

/** A page arrow: the quiet icon button, faded where there is no page to go to. */
const ARROW = `${ICON_BTN} disabled:cursor-default disabled:text-neutral-400 disabled:hover:bg-transparent`;

/** Each filter's events, in the order `homeRows` gives them: the upcoming soonest first, then the past latest first. */
function piles(events: HomeEventRow[]): Record<Filter, HomeEventRow[]> {
  const upcoming = events.filter((event) => event.status !== "past");
  return {
    upcoming,
    live: upcoming.filter((event) => event.status === "active"),
    hidden: upcoming.filter((event) => event.status === "hidden"),
    past: events.filter((event) => event.status === "past"),
    all: events,
  };
}

/**
 * Home's one list of every event: a search, a filter, a page of rows at a
 * time. Searching or changing the filter goes back to the first page.
 */
export function EventsBox({ events }: { events: HomeEventRow[] }) {
  const t = useTranslations("Dashboard");
  const tNav = useTranslations("Nav");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("upcoming");
  const [page, setPage] = useState(0);
  const lists = piles(events);
  const shown = lists[filter].filter((event) =>
    plainText(event.title).includes(plainText(query.trim())),
  );
  const last = Math.max(0, Math.ceil(shown.length / PAGE_SIZE) - 1);
  const current = Math.min(page, last);
  const first = current * PAGE_SIZE;
  const rows = shown.slice(first, first + PAGE_SIZE);

  return (
    <section className={`@container flex flex-col ${PAGE_BOX}`}>
      <BoxHead title={t("events")} count={events.length} />
      <SearchField
        query={query}
        onQuery={(value) => {
          setQuery(value);
          setPage(0);
        }}
        label={tNav("searchEvents")}
      />
      <div className="mt-2.5 w-fit min-w-[200px]">
        <Select
          aria-label={t("filter")}
          value={filter}
          onChange={(control) => {
            setFilter(control.target.value as Filter);
            setPage(0);
          }}
        >
          {FILTERS.map((option) => (
            <option key={option} value={option}>
              {t(`filters.${option}`, { count: lists[option].length })}
            </option>
          ))}
        </Select>
      </div>

      {rows.length === 0 ? (
        <p className="py-10 text-center muted-text">
          {events.length === 0 ? t("emptyUpcoming") : tNav("noMatches")}
        </p>
      ) : (
        <>
          <ul className={`mt-2 ${BOX_ROWS}`}>
            {rows.map((event) => (
              <li key={event.id}>
                <EventRow event={event} />
              </li>
            ))}
          </ul>

          <div className="mt-auto flex items-center justify-end gap-3 border-t border-neutral-200 pt-3">
            <span className="meta-text tabular-nums">
              {t("pageRange", {
                from: first + 1,
                to: first + rows.length,
                total: shown.length,
              })}
            </span>
            <span className="flex gap-1">
              <button
                type="button"
                className={ARROW}
                disabled={current === 0}
                onClick={() => setPage(current - 1)}
                aria-label={t("previousPage")}
              >
                <Icon name="chevron" className="size-5 rotate-90" />
              </button>
              <button
                type="button"
                className={ARROW}
                disabled={current === last}
                onClick={() => setPage(current + 1)}
                aria-label={t("nextPage")}
              >
                <Icon name="chevron" className="size-5 -rotate-90" />
              </button>
            </span>
          </div>
        </>
      )}
    </section>
  );
}

/**
 * One event: its tag, its name over its day, and how the replies stand (how
 * many came, once it is over). It opens the Overview, unless its data is gone.
 */
function EventRow({ event }: { event: HomeEventRow }) {
  const t = useTranslations("Dashboard");
  const tEvent = useTranslations("Event");
  const locale = useLocale() as Language;
  const { status, archived } = event;
  const row = "flex items-center gap-4 py-3.5";
  const cells = (
    <>
      <StatusTag status={status} className="w-19 shrink-0 text-center" />
      <RowLines
        title={event.title}
        detail={`${formatDay(event.date, locale)} · ${formatRelative(event.countdown, locale)}`}
      />
      <span className="hidden shrink-0 items-center gap-3 @min-[520px]:flex">
        {status === "past" ? (
          <span className="meta-text">
            {archived
              ? tEvent("recordDeleted")
              : t("came", { count: event.rsvp.attending })}
          </span>
        ) : (
          <>
            <RepliesBar event={event} className="w-[72px]" />
            <span className="meta-text tabular-nums">
              {t("repliedShort", {
                replied: event.rsvp.replied,
                expected: event.expectedGuests,
              })}
            </span>
          </>
        )}
      </span>
    </>
  );

  return archived ? (
    <div className={row}>{cells}</div>
  ) : (
    <Link href={eventPath(event.id)} className={`${row} ${ROW_LINK}`}>
      {cells}
    </Link>
  );
}
