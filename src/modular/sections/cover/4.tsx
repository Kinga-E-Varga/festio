"use client";

import { formatDay } from "@/lib/event";
import { isOn, text, yearOf } from "@/modular/content";
import { Mark, markParts } from "@/modular/Mark";
import {
  AMPERSAND_SIZE,
  HEADING,
  INNER_EYEBROW,
  SERIF,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { BUNTING_HEIGHT, Bunting } from "./Bunting";
import { CAKE_SHAPE, Cake } from "./Cake";
import { useOutOfView } from "./useOutOfView";

/*
 * The Title's lines on the band, growing smoothly with the width: on a phone
 * they wrap to two lines, from `@3xl` they fit on one.
 */
const BAND_NAMES = `${HEADING} text-[clamp(28px,9.5cqw,44px)] @3xl:text-[clamp(40px,4.3cqw,84px)] leading-[1.1] tracking-[-0.02em]`;

/* The middle part of the names, a little quieter on the band. */
const BAND_AMPERSAND = `${AMPERSAND_SIZE} text-[color:color-mix(in_oklab,var(--m-secondary-ink),var(--m-secondary)_25%)]`;

/*
 * The date on the ribbon, in the names' voice, much smaller, at the stage's
 * `--date-size`: the weekday, the day and month, and the year, each on its
 * own row; the day and month split over two only when they don't fit.
 */
const RIBBON_DATE = `${SERIF} text-(length:--date-size) leading-[1.2]`;

/*
 * The stage under the band, laid out by the cake's own shape (`CAKE_SHAPE`).
 * The floor, 13% of the cover's height (`--cover-floor`, registered in
 * `globals.css` so it is the cover's, not the stage's), and the cake's base,
 * 60% of the way up it.
 *
 * The cake stands left of centre, its middle at `--cake-share` of the
 * width. Stacked — a phone, or any cover taller than wide — at 36%, the
 * ribbon hanging at the right, the cake in front of it; side by side — wide
 * covers from `@3xl` — at 44%, the ribbon 16px past the cake itself (its
 * shadow may run under it). How tall the cake may be for the width
 * (`--cake-fit`): the cake itself no wider than twice the room on its
 * left, less the margin, nor twice the room on its right, less the margin
 * and, side by side, the ribbon; never past 760px. Its height (`--cake-h`):
 * from its base, its highest flame reaching 12px over the band, or its fit,
 * whichever is less.
 *
 * The ribbon's width and its date's size (`--ribbon-w`, `--date-size`):
 * wide and large enough for a day and its month on one line on every
 * screen.
 */
const STAGE = `${CAKE_SHAPE} [--cover-floor:clamp(72px,13cqh,160px)] [--cake-base:calc(var(--cover-floor)*0.6)] [--cake-share:0.36] [--cake-margin:4cqw] [--ribbon-room:0px] [--date-size:clamp(15px,4.8cqw,28px)] [--ribbon-w:min(39cqw,220px)] [--ribbon-x:calc(100%-4cqw-var(--ribbon-w))] @3xl:[@container(aspect-ratio>1)]:[--cake-share:0.44] @3xl:[@container(aspect-ratio>1)]:[--cake-margin:8cqw] @3xl:[@container(aspect-ratio>1)]:[--ribbon-room:calc(var(--ribbon-w)+16px)] @3xl:[@container(aspect-ratio>1)]:[--date-size:clamp(22px,1.9cqw,34px)] @3xl:[@container(aspect-ratio>1)]:[--ribbon-w:clamp(190px,15cqw,270px)] @3xl:[@container(aspect-ratio>1)]:[--ribbon-x:calc(var(--cake-x)+var(--cake-h)*var(--cake-body)/2+16px)] [--cake-x:calc(var(--cake-share)*100%)] [--cake-fit:min(min(var(--cake-share)*100cqw-var(--cake-margin),(1-var(--cake-share))*100cqw-var(--cake-margin)-var(--ribbon-room))*2/var(--cake-body),760px)] [--cake-h:min((100cqh-var(--cake-base)+12px)/var(--cake-rise),var(--cake-fit))]`;

/* The cake: its base on `--cake-base`, the shadow below it. */
const CAKE =
  "absolute bottom-[calc(var(--cake-base)-var(--cake-h)*var(--cake-foot))] left-(--cake-x) h-(--cake-h) w-auto -translate-x-1/2";

/*
 * The ribbon hangs from the band at `--ribbon-x`, its words at the top: 72%
 * of the way down to the floor, longer only when its words need it, then
 * the V cut. Its padding follows the stage's height, tight on a short one,
 * so the ribbon stays clear of the floor.
 */
const RIBBON =
  "absolute top-0 left-(--ribbon-x) flex min-h-[calc((100cqh-var(--cover-floor))*0.72)] w-(--ribbon-w) flex-col items-center gap-3 bg-(--m-tertiary) px-3 pt-[clamp(12px,5cqh,56px)] pb-[calc(22px+clamp(8px,3cqh,36px))] text-center text-[color:var(--m-tertiary-ink)] [clip-path:polygon(0_0,100%_0,100%_100%,50%_calc(100%-22px),0_100%)] @3xl:gap-4";

/**
 * A poster cover, no photo, after a birthday card: bunting across the top,
 * the Title's lines on a band in the secondary colour, a three-tier cake
 * standing on the accent floor, and the date and the host's free line on a
 * ribbon beside it. The cover is on the page's surface, so a pattern shows
 * round the drawing. Every part runs the whole width but the cake and the
 * ribbon, sized by the room the cover has.
 */
export function Variant({ values, related, basics, language }: VariantProps) {
  const title = related.title ?? {};
  /* Use names off: two plain lines in place of the names and their line. */
  const named = isOn(title, "names");
  const names = named ? markParts(title, "names", BAND_AMPERSAND) : [];
  const first = named ? "" : text(title, "firstLine");
  const second = text(title, named ? "secondLine" : "nextLine");
  const details = text(values, "details");
  /* The event's own date in the invitation's language, in three rows: the weekday, the day and month, the year. */
  const weekday = formatDay(basics.date, language, { weekday: "long" });
  const dayMonth = formatDay(basics.date, language, {
    day: "numeric",
    month: "long",
  });
  const year = yearOf(basics.date);
  /* Out of view, the flames and flags wait (`PAUSE`). */
  const cover = useOutOfView<HTMLDivElement>();

  return (
    /*
     * The hero's whole spare height, never shorter than a phone's 440px.
     * `data-cover` for the envelope's strip; out of view, the motion waits.
     */
    <div
      ref={cover}
      data-cover
      className="relative flex min-h-110 grow overflow-hidden"
    >
      <div
        className={`absolute inset-0 flex flex-col [container-type:size] ${BUNTING_HEIGHT}`}
      >
        <Bunting />
        {/* The band's top at 22% of the cover's height, at least 16px under the bunting. */}
        <div className="h-[max(22cqh-var(--bunting-h),16px)] shrink-0" />
        {names.length > 0 || first || second ? (
          <div className="bg-(--m-secondary) px-[6cqw] py-[clamp(14px,2.6cqh,30px)] text-center text-[color:var(--m-secondary-ink)]">
            <h1 className={BAND_NAMES}>
              {names.length > 0 ? <Mark parts={names} /> : first}
              {second ? ` ${second}` : null}
            </h1>
          </div>
        ) : null}
        {/* After the band, so the cake's candles lie over it. */}
        <div
          className={`relative min-h-0 flex-1 [container-type:size] ${STAGE}`}
        >
          <div className={RIBBON}>
            <time dateTime={basics.date} className={RIBBON_DATE}>
              <span className="block">{weekday}</span>
              <span className="block">{dayMonth}</span>
              <span className="block">{year}</span>
            </time>
            {details ? (
              <>
                <span className="h-0.5 w-6.5 bg-current opacity-45" />
                <p
                  className={`${INNER_EYEBROW} whitespace-pre-line text-[color:var(--m-tertiary-ink-muted)]`}
                >
                  {details}
                </p>
              </>
            ) : null}
          </div>
          {/* The floor, and on it a line in the surface as wide as the cake's own edge. */}
          <div className="absolute inset-x-0 bottom-0 h-(--cover-floor) bg-(--m-accent) before:absolute before:inset-x-0 before:bottom-full before:h-[calc(var(--cake-h)*var(--cake-edge))] before:bg-(--m-surface)" />
          <Cake className={CAKE} />
        </div>
      </div>
    </div>
  );
}
