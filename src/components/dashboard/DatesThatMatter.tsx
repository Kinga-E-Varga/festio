import { Fragment } from "react";
import { useLocale, useTranslations } from "next-intl";
import { RowLines } from "@/components/dashboard/RowLines";
import {
  countdownNow,
  deletionDate,
  formatEventDate,
  formatRelative,
  replyClose,
  replyWindow,
  spanBetween,
} from "@/lib/event";
import type { Language } from "@/lib/language";
import type { DashboardEvent } from "@/types/dashboard";

type StopKind = "today" | "deadline" | "event" | "later";

interface Stop {
  key: string;
  kind: StopKind;
  at: Date;
  label: string;
}

/** Weekday, day and short month, no year: the timeline's dates. */
const STOP_DATE: Intl.DateTimeFormatOptions = {
  weekday: "short",
  day: "numeric",
  month: "short",
};

/**
 * Each kind of stop's dot. The event and the record's deletion stand out
 * with a light ring, the event a size up; today and the deadlines are plain
 * dots in the line's own colour, as is a stop already behind today.
 */
const DOT: Record<StopKind | "passed", string> = {
  today: "size-2.5 bg-neutral-300",
  deadline: "size-2.5 bg-neutral-300",
  event: "size-4 bg-primary-700 ring-4 ring-primary-200",
  later: "size-3 bg-accent-800 ring-4 ring-accent-200",
  passed: "size-2.5 bg-neutral-300",
};

/**
 * How much of the track's spare room the gap after each stop takes, once it
 * runs across: half shared evenly, half by the days it spans, so a long wait
 * looks longer without crowding the near dates together. Kept to whole
 * steps, one class each.
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

/** Across, the first stop sits flush left on the track, the last flush right. */
function stopAlign(index: number, count: number): string {
  if (index === 0) return "@min-[560px]:items-start @min-[560px]:text-left";
  if (index === count - 1)
    return "@min-[560px]:items-end @min-[560px]:text-right";
  return "@min-[560px]:items-center @min-[560px]:text-center";
}

/**
 * Today, the deadlines, the event and the record's deletion on one line, in
 * date order: each stop's name over its day and how far off it is (under
 * the day once across). Across the box once it has room, its gaps as long as
 * the waits; down it before.
 * A stop already behind today fades its words, its dot plain in the line's colour.
 */
function Timeline({ stops, now }: { stops: Stop[]; now: Date }) {
  const t = useTranslations("Event");
  const locale = useLocale() as Language;

  return (
    <div className="@container">
      <ol aria-label={t("keyDates")} className="relative @min-[560px]:flex">
        {/* Across, from the first dot's middle to the last one's (8px in from either end), so the dots cover its ends. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-2 top-[8.5px] hidden h-0.5 bg-neutral-300 @min-[560px]:block"
        />
        {stops.map((stop, index) => {
          const passed = stop.kind !== "today" && stop.at < now;
          const day = formatEventDate(stop.at, locale, STOP_DATE);
          return (
            <Fragment key={stop.key}>
              {/* Across, the gaps take the spare room; a gap never closes below 24. */}
              {index > 0 ? (
                <li
                  aria-hidden="true"
                  className={`hidden min-w-6 @min-[560px]:block ${gapGrow(stops, index - 1)}`}
                />
              ) : null}
              <li
                className={`relative flex gap-3 pb-4 last:pb-0 @min-[560px]:min-w-0 @min-[560px]:flex-col @min-[560px]:gap-2 @min-[560px]:pb-0 ${stopAlign(index, stops.length)}`}
              >
                {/*
                 * Down, each stop's stretch of the line: from its dot's middle
                 * to the next one's (9.5px into it), so none runs past the last.
                 */}
                {index < stops.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-[9.5px] -bottom-[9.5px] left-[7px] w-0.5 bg-neutral-300 @min-[560px]:hidden"
                  />
                ) : null}
                <span
                  aria-hidden="true"
                  className="relative flex h-[19px] w-4 shrink-0 items-center justify-center"
                >
                  <span
                    className={`block rounded-full ${DOT[passed ? "passed" : stop.kind]}`}
                  />
                </span>
                {/* The day and how far off it is: one line down the box, two across it. */}
                {/* A stop behind today fades its words; its dot keeps the line's colour. */}
                <RowLines
                  className={passed ? "opacity-60" : ""}
                  title={stop.label}
                  detail={
                    stop.kind === "today" ? (
                      day
                    ) : (
                      <>
                        {day}
                        <span className="@min-[560px]:hidden"> · </span>
                        <span className="@min-[560px]:block">
                          {formatRelative(spanBetween(now, stop.at), locale)}
                        </span>
                      </>
                    )
                  }
                />
              </li>
            </Fragment>
          );
        })}
      </ol>
    </div>
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
  /* No start time is stored: the event is its day. */
  const eventAt = new Date(`${event.date}T00:00`);
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
