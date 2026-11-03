"use client";

import { longDate, text } from "@/modular/content";
import { Mark } from "@/modular/Mark";
import { drawingOf } from "@/modular/drawing";
import { EYEBROW, HEADING } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import {
  CARD_BOX,
  CARD_STAGE,
  DRAWING_FIT,
  drawingRoom,
  posterWords,
} from "./card";
import { CardFrame, type LineInset } from "./CardFrame";

/*
 * The border: the card's corners scooped out (`--scoop`), a thin line in the
 * secondary on its edge, and a row of dots in the secondary just inside it,
 * both following the scoops round the card's corners (`CardFrame`). The
 * scoops 28px on a phone, growing with the cover's shorter side to 64px; the
 * rest in proportion to them: the line (`--line` wide), the dots (`--dot`
 * across, about `--dot-step` apart), how far in each runs, the room kept
 * inside the dots (`--pad`) and the gap between the parts (`--gap`): tight
 * upright, wider landscape, where the card has room; landscape only half the
 * room above and below, the drawing's height.
 */
const SIZES =
  "[--scoop:clamp(28px,7cqmin,64px)] [--line:calc(var(--scoop)*0.14)] [--line-in:calc(var(--line)/2)] [--dots-in:calc(var(--scoop)*0.4)] [--dot:calc(var(--scoop)*0.1)] [--dot-step:calc(var(--scoop)*0.3)] [--gap:calc(var(--scoop)*0.7)] [--pad:calc(var(--scoop)*0.9)] [@container(aspect-ratio>1)]:[--gap:calc(var(--scoop)*1.1)] [@container(aspect-ratio>1)]:[--pad:calc(var(--scoop)*1.4)]";

/*
 * The card, each mask quarter scooping its own corner: out to the middle of
 * the line on the edge (`--line`), its edge sharp, so none of it shows past
 * the line.
 */
const CARD =
  "absolute inset-0 bg-(--m-surface-alt) [--cut:calc(var(--scoop)+var(--line)/2)] [mask:radial-gradient(circle_var(--cut)_at_0_0,#0000_calc(100%-0.5px),#000)_0_0/51%_51%_no-repeat,radial-gradient(circle_var(--cut)_at_100%_0,#0000_calc(100%-0.5px),#000)_100%_0/51%_51%_no-repeat,radial-gradient(circle_var(--cut)_at_0_100%,#0000_calc(100%-0.5px),#000)_0_100%/51%_51%_no-repeat,radial-gradient(circle_var(--cut)_at_100%_100%,#0000_calc(100%-0.5px),#000)_100%_100%/51%_51%_no-repeat]";

/* The line on the edge; the dots, round strokes of no length, a whole number of them about `--dot-step` apart. */
const LINES: { inset: LineInset; className: string; dots?: boolean }[] = [
  {
    inset: "--line-in",
    className: "stroke-(--m-secondary) [stroke-width:var(--line)]",
  },
  {
    inset: "--dots-in",
    className:
      "stroke-(--m-secondary) [stroke-width:var(--dot)] [stroke-dasharray:0_1] [stroke-linecap:round]",
    dots: true,
  },
];

/* The small lines' size, the eyebrow's and the date's, both in `EYEBROW`'s style: 12.5px, landscape growing to 17px (`!` over its own). */
const SMALL =
  "text-[12.5px]! [@container(aspect-ratio>1)]:text-[min(17px,1.25cqw)]!";

/*
 * The names' ribbon: swallowtail ends, in the accent, the names in its ink;
 * on a dark palette in the palette's own ink, light on the card's deepened
 * accent (`CARD_STAGE`). Landscape the names grow with the card's width or
 * its height, whichever is bigger, up to 52px, as the Stamp's (a big
 * monitor's card grows only taller); long names wrap.
 */
const RIBBON = `${HEADING} bg-(--m-accent) px-[1.4em] py-[0.3em] text-[min(24px,6.5cqw)] leading-[1.2] text-[color:var(--m-accent-ink)] dark-palette:text-[color:var(--card-paper)] [clip-path:polygon(0_0,100%_0,calc(100%-0.6em)_50%,100%_100%,0_100%,0.6em_50%)] [@container(aspect-ratio>1)]:text-[min(52px,max(2.9cqw,5.4cqh))]`;

/**
 * A poster cover, no photo: a playbill — a card with scooped corners, a
 * thin line on its edge and a row of dots inside it — on the page's own ground.
 * The Title's eyebrow over the cover's highlight (`kicker`) as a big heading, the host's
 * drawing (`drawing`), the names on a ribbon (`related.title`), then the date
 * and the host's free line between two double rules. Upright one column;
 * landscape the heading across the top, under it drawing | names and date;
 * on a card wide enough, heading | drawing | names and date in one row.
 */
export function Variant({ values, related, basics, language }: VariantProps) {
  /* One row only for a tall or square drawing: a wide one keeps the heading across the top, and the full width under it. */
  const row = drawingOf(text(values, "drawing")).shape !== "wide";
  const { eyebrow, names, first } = posterWords(related.title ?? {}, "");
  const heading = text(values, "kicker");
  const details = text(values, "details");
  /* The event's own date, in the invitation's language. */
  const date = longDate(basics.date, language);

  return (
    /* The hero's whole spare height, never shorter than a phone's 440px. `data-cover` for the envelope's strip. */
    <div data-cover className="relative flex min-h-110 grow overflow-hidden">
      <div className={CARD_STAGE}>
        <div className={`${CARD_BOX} ${SIZES}`}>
          <div className={CARD} />
          <CardFrame lines={LINES} />
          {/* Inside the dots, `--pad` clear of them; the heading, then the drawing and the names; on a card over 1.9 times as wide as tall, all three in one row (`data-row`) unless the drawing is wide, which there would get only what the other two leave, the room beside and between them by the card's width: the drawing takes the width the other two leave, so room grown with the height would shrink it on a taller card. */}
          <div
            data-row={row || undefined}
            className="group/row absolute inset-(--dots-in) flex flex-col items-center justify-center gap-(--gap) p-(--pad) text-center text-[color:var(--m-ink)] [@container(aspect-ratio>1)]:py-[calc(var(--pad)/2)] [@container(aspect-ratio>1.9)]:data-row:flex-row [@container(aspect-ratio>1.9)]:data-row:gap-[2.8cqw] [@container(aspect-ratio>1.9)]:data-row:px-[3.5cqw]"
          >
            <div className="flex shrink-0 flex-col items-center [@container(aspect-ratio>1.9)]:group-data-row/row:max-w-[26cqw]">
              {eyebrow ? (
                <p className={`${EYEBROW} ${SMALL}`}>{eyebrow}</p>
              ) : null}
              {heading ? (
                <p
                  className={`${HEADING} mt-1 text-[color:var(--m-secondary)] text-[min(40px,10cqw)] leading-[0.95] uppercase [@container(aspect-ratio>1)]:mt-2 [@container(aspect-ratio>1)]:text-[min(84px,5.5cqw)] [@container(aspect-ratio>1.9)]:group-data-row/row:text-[min(96px,5cqw)]`}
                >
                  {heading}
                </p>
              ) : null}
            </div>
            {/* Upright the drawing over the names, shrinking first; landscape side by side, as tall as the drawing's cap, less if the heading leaves less, so the whole stays centred. */}
            <div className="flex min-h-0 w-full flex-col items-center justify-center gap-(--gap) [@container(aspect-ratio>1)]:h-160 [@container(aspect-ratio>1)]:flex-row [@container(aspect-ratio>1.9)]:group-data-row/row:contents">
              {/* A little smaller than on the Stamp, as the ribbon and heading need the room. */}
              <div className={drawingRoom(values, "snug")}>
                <div className={DRAWING_FIT} />
              </div>
              {/* Landscape, beside the drawing, at most 40% of the card, in the one row 36% (the heading takes 26%): long names wrap on the ribbon rather than squeeze the drawing; a usual pair stays on one line. */}
              <div className="flex shrink-0 flex-col items-center [@container(aspect-ratio>1)]:max-w-[40cqw] [@container(aspect-ratio>1.9)]:group-data-row/row:max-w-[36cqw]">
                {names.length > 0 || first ? (
                  <h1 className={RIBBON}>
                    {names.length > 0 ? <Mark parts={names} /> : first}
                  </h1>
                ) : null}
                <div
                  className={`${EYEBROW} mt-[calc(var(--gap)*0.6)] border-y-[3px] border-double border-(--m-ink) px-[0.8em] py-2 whitespace-pre-line ${SMALL}`}
                >
                  <p>{date}</p>
                  {details ? <p>{details}</p> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
