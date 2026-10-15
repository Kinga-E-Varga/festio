import { Fragment } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  countdownNow,
  deletionDate,
  formatEventDate,
  replyClose,
  replyWindow,
} from "@/lib/event";
import type { DashboardEvent } from "@/types/dashboard";

type StopKind = "today" | "deadline" | "event" | "later";

interface Stop {
  key: string;
  kind: StopKind;
  at: Date;
  label: string;
}

/** Day and short month, no year: the timeline's dates. */
const STOP_DATE: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
};

/**
 * Each kind of stop's dot. The event and the record's deletion stand out
 * with a light ring, the event a size up; today is a plain dot, as the
 * deadlines are. A stop already behind today is greyed out.
 */
const DOT: Record<StopKind | "passed", string> = {
  today: "size-2.5 bg-neutral-950",
  deadline: "size-2.5 bg-neutral-950",
  event: "size-4 bg-primary-700 ring-4 ring-primary-200",
  later: "size-3 bg-accent-800 ring-4 ring-accent-200",
  passed: "size-2.5 bg-neutral-400",
};

/**
 * How much of the track's spare room the gap after each stop takes: half
 * shared evenly, half by the days it spans, so a long wait looks longer
 * without crowding the near dates together. Kept to whole steps, one class
 * each.
 */
const GROW = [
  "grow-2",
  "grow-3",
  "grow-4",
  "grow-5",
  "grow-6",
  "grow-7",
  "grow-8",
];

function gapGrow(stops: Stop[], index: number): string {
  const spans = stops
    .slice(1)
    .map((stop, at) => stop.at.getTime() - stops[at].at.getTime());
  const longest = Math.max(...spans, 1);
  const weight = Math.round(2 + (6 * spans[index]) / longest);
  return GROW[weight - 2];
}

/** The first stop sits flush left on the track, the last flush right. */
function stopAlign(index: number, count: number): string {
  if (index === 0) return "@min-[440px]:items-start @min-[440px]:text-left";
  if (index === count - 1)
    return "@min-[440px]:items-end @min-[440px]:text-right";
  return "@min-[440px]:items-center @min-[440px]:text-center";
}

/**
 * Today, the deadlines, the event and the record's deletion on one track, in
 * date order. Across the card once there is room, each stop's date above its
 * dot and what it is under it; narrower, the track turns on its side, the
 * date to the left of the dot.
 */
function Timeline({ stops, now }: { stops: Stop[]; now: Date }) {
  const t = useTranslations("Event");
  const locale = useLocale();

  return (
    /* Padded as the to-do box under it, so the two line up. */
    <section aria-label={t("keyDates")} className="@container px-[17px]">
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute top-[18px] bottom-[18px] left-[81px] w-0.5 bg-neutral-800 @min-[440px]:hidden"
        />
        {/* Through the dots' middle: the date (14), 10, half the dot's box (8), less half the line. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-[31px] hidden h-0.5 bg-neutral-800 @min-[440px]:block"
        />
        {/*
         * Across, each stop is as wide as its words and the gaps between take
         * the rest, by `gapGrow`; a gap never closes below 24, so labels keep
         * apart. On its side the track stays evenly spaced.
         */}
        <ol className="relative @min-[440px]:flex">
          {stops.map((stop, index) => {
            const passed = stop.kind !== "today" && stop.at < now;
            return (
              <Fragment key={stop.key}>
                {index > 0 ? (
                  <li
                    aria-hidden="true"
                    className={`hidden min-w-6 @min-[440px]:block ${gapGrow(stops, index - 1)}`}
                  />
                ) : null}
                <li
                  className={`grid grid-cols-[64px_16px_minmax(0,1fr)] items-center gap-x-2.5 py-[7px] @min-[440px]:flex @min-[440px]:min-w-0 @min-[440px]:flex-col @min-[440px]:py-0 ${stopAlign(index, stops.length)}`}
                >
                  <span
                    className={`text-[14px] leading-none font-medium whitespace-nowrap ${
                      passed
                        ? "text-neutral-600"
                        : stop.kind === "event"
                          ? "text-primary-700"
                          : stop.kind === "later"
                            ? "text-accent-800"
                            : "text-neutral-950"
                    }`}
                  >
                    {formatEventDate(stop.at, locale, STOP_DATE)}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-4 items-center justify-center @min-[440px]:my-2.5"
                  >
                    <span
                      className={`block rounded-full ${DOT[passed ? "passed" : stop.kind]}`}
                    />
                  </span>
                  <span
                    className={`text-[14px] leading-5 ${
                      passed ? "text-neutral-600" : "text-neutral-800"
                    }`}
                  >
                    {stop.label}
                  </span>
                </li>
              </Fragment>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/** Same calendar day. */
function sameDay(first: Date, second: Date): boolean {
  return first.toDateString() === second.toDateString();
}

/**
 * Reply-form close and record deletion, with today and the
 * event itself, on one timeline.
 */
export function DatesThatMatter({ event }: { event: DashboardEvent }) {
  const t = useTranslations("Event");
  const replyTitle = t(
    replyWindow(event) === "closed" ? "repliesClosed" : "replyFormCloses",
  );

  const now = countdownNow(event);
  const eventAt = new Date(`${event.date}T${event.time}`);
  const stops: Stop[] = [
    {
      key: "replies",
      kind: "deadline",
      at: replyClose(event),
      label: replyTitle,
    },
    {
      key: "event",
      kind: "event",
      at: eventAt,
      label: t("theEvent"),
    },
    {
      key: "deleted",
      kind: "later",
      at: deletionDate(event.date),
      label: t("recordDeleted"),
    },
  ];
  /* On the day itself the event's own stop says as much. */
  if (!sameDay(now, eventAt)) {
    stops.push({ key: "today", kind: "today", at: now, label: t("today") });
  }
  stops.sort((first, second) => first.at.getTime() - second.at.getTime());

  return <Timeline stops={stops} now={now} />;
}
