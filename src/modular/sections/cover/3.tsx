"use client";

import { useEffect, useRef } from "react";
import { isOn, longDate, text } from "@/modular/content";
import { Mark, markParts } from "@/modular/Mark";
import { AMPERSAND_SIZE, EYEBROW, HEADING } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Coupe, CoverStars } from "./Coupe";

/*
 * The names grow smoothly with the width, never past the Title's 80px:
 * the whole width on a phone, half of it beside the glass from `@3xl`.
 */
const POSTER_NAMES = `${HEADING} text-[min(56px,12cqw)] @3xl:text-[min(80px,4.5cqw)] leading-[1.1] tracking-[-0.03em] italic`;

/*
 * The date in the names' voice, the second thing read: italic in the heading
 * face, growing with the width like them, 20px to 26px stacked, to 34px
 * beside the glass. The details line sits close under it, its footnote.
 */
const POSTER_DATE = `${HEADING} text-[clamp(20px,6.5cqw,26px)] @3xl:text-[clamp(22px,2.3cqw,34px)] leading-[1.3] italic`;

const MUTED_ON_ACCENT = "text-[color:var(--m-accent-ink-muted)]";

/**
 * A poster cover, no photo: a drawn champagne coupe on the accent, stars
 * scattered round it, and the Title's lines on it in the Title's place
 * (`related.title`), then the date and the host's free line. On a phone the
 * glass on top and the words below, the glass giving way when the words
 * need the room; from `@3xl` the glass on the left and the words on the right.
 */
export function Variant({ values, related, basics, language }: VariantProps) {
  const title = related.title ?? {};
  const eyebrow = text(title, "eyebrow");
  /* Use names off: two plain lines in place of the names and their line. */
  const named = isOn(title, "names");
  const names = named
    ? markParts(title, "names", `${AMPERSAND_SIZE} ${MUTED_ON_ACCENT}`)
    : [];
  const first = named ? "" : text(title, "firstLine");
  const second = text(title, named ? "secondLine" : "nextLine");
  const details = text(values, "details");
  /* The event's own date, in the invitation's language. */
  const date = longDate(basics.date, language);
  /* Out of view, the motion waits (`Coupe`'s `PAUSE`). */
  const cover = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = cover.current;
    if (!element) return;
    /* On the element itself: no re-render each time it scrolls in or out. */
    const watch = new IntersectionObserver(([entry]) =>
      element.toggleAttribute("data-paused", !entry.isIntersecting),
    );
    watch.observe(element);
    return () => watch.disconnect();
  }, []);

  return (
    /*
     * The hero's whole spare height at every width, and no gap above past
     * 1440px: there is no Title below to make room for, and no photo to
     * stop at the column. The accent runs edge to edge (the variant's
     * `band`) and so do the stars (`wide`); the glass and the words stay in
     * a column of their own. Never shorter than a phone's 440px. `data-cover` for the envelope's strip.
     */
    <div
      ref={cover}
      data-cover
      className="relative flex min-h-110 grow overflow-hidden"
    >
      {/* The stars in the margins past the glass and words' column, on a very wide cover. */}
      <div className="absolute inset-0 [container-type:size]">
        <CoverStars margins />
      </div>
      {/*
       * Sized by the column, so the drawing and the names follow its height and
       * width. Wider than the page's column: up to 1800px, where the names
       * reach the Title's 80px beside the glass (`POSTER_NAMES`).
       */}
      <div className="absolute inset-y-0 left-1/2 flex w-full max-w-[1800px] -translate-x-1/2 flex-col [container-type:size] [--glass-h:min(84cqh,55cqw,900px)] @3xl:grid @3xl:grid-cols-[46%_1fr] @3xl:gap-x-[max(16px,calc(11.85%_-_105px))] @3xl:items-center">
        <CoverStars />
        {/* From `@3xl` the glass at its column's right, by the gap. */}
        <div className="relative min-h-0 flex-1 @3xl:h-full">
          <Coupe className="absolute top-1/2 left-1/2 h-[min(50cqh,100%-8cqh)] w-auto -translate-1/2 @3xl:right-0 @3xl:left-auto @3xl:h-(--glass-h) @3xl:translate-x-0" />
        </div>
        <div className="relative flex flex-col items-center px-[11cqw] text-center @3xl:items-stretch @3xl:text-left pb-[8cqh] text-[color:var(--m-accent-ink)] @3xl:translate-y-[8cqh] @3xl:pr-[8cqw] @3xl:pb-0 @3xl:pl-0">
          {eyebrow ? (
            <p className={`${EYEBROW} ${MUTED_ON_ACCENT} mb-3`}>{eyebrow}</p>
          ) : null}
          {names.length > 0 || first || second ? (
            <h1 className={`${POSTER_NAMES} mb-6`}>
              {names.length > 0 ? (
                <span className="block">
                  <Mark parts={names} />
                </span>
              ) : first ? (
                <span className="block">{first}</span>
              ) : null}
              {second ? <span className="block">{second}</span> : null}
            </h1>
          ) : null}
          <p className={POSTER_DATE}>{date}</p>
          {details ? (
            <p className={`${EYEBROW} ${MUTED_ON_ACCENT} mt-3`}>{details}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
