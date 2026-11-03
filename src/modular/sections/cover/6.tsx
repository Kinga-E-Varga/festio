import {
  dayOfMonth,
  longDate,
  romanMonth,
  text,
  yearOf,
} from "@/modular/content";
import { Mark } from "@/modular/Mark";
import {
  AMPERSAND,
  EYEBROW,
  HEADING,
  MUTED,
  TONE_TEXT,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import {
  BITES_X,
  BITES_Y,
  CARD_BOX,
  CARD_STAGE,
  DRAWING_FIT,
  drawingRoom,
  posterWords,
} from "./card";

/*
 * The stamp's sizes: the perforations, 7px bites on a phone growing with
 * the cover's shorter side to 16px, and in proportion to them the step
 * between them, the coloured margin (`--stamp-margin`), the fine line inside it
 * (`--line-in`) and the gap (`--gap`), both between the drawing and the
 * words and all round them inside that line: tight upright, where a short
 * phone has little room, and wider landscape, where the card has plenty;
 * landscape only half of it above and below, the drawing's height.
 */
const SIZES =
  "[--bite:clamp(7px,1.8cqmin,16px)] [--bite-step:calc(var(--bite)*20/7)] [--stamp-margin:calc(var(--bite)*16/7)] [--line-in:calc(var(--bite)*22/7)] [--gap:calc(var(--bite)*3)] [@container(aspect-ratio>1)]:[--gap:calc(var(--bite)*5)]";

/* The perforated paper, in the accent: bites on all four sides. */
const STAMP = `absolute inset-0 ${BITES_Y}`;

/*
 * The names, growing with the card's width; landscape also with its
 * height, whichever is bigger, up to 112px. The card stops widening at the
 * invitation's column, so on a big monitor only its height still grows;
 * a laptop's card is too short for the height to win, so it keeps the
 * width's size.
 */
const NAMES = `${HEADING} text-[min(52px,13cqw)] [@container(aspect-ratio>1)]:text-[min(112px,max(6.5cqw,11.4cqh))] leading-[1.05]`;

/* The date, a little bigger than the eyebrow: 14px, 16px landscape. */
const DATE = `${EYEBROW} ${TONE_TEXT.accent} text-[14px]! [@container(aspect-ratio>1)]:text-[16px]!`;

/*
 * The postmark, in the secondary, faded: a double ring with the date, tilted.
 * As on a real letter, hanging past the stamp's left edge onto the page,
 * its middle a quarter of the way down; under the words and the drawing. Its
 * size (`--pm`) is 40% of the card's shorter side, 120px to 340px; it hangs
 * out by a fifth of that, never more than 36px, so the card's 40px margin
 * on wide screens still holds it.
 */
const POSTMARK = `absolute [--pm:clamp(120px,40cqmin,340px)] top-[calc(25%-var(--pm)/2)] -left-[min(calc(var(--pm)/5),36px)] grid size-(--pm) -rotate-12 place-items-center rounded-full border-[length:calc(var(--pm)*0.011)] border-current text-(--m-secondary) opacity-75 before:absolute before:inset-[calc(var(--pm)*0.05)] before:rounded-full before:border-[length:calc(var(--pm)*0.006)] before:border-current`;

/* The postmark's date, sized with it. */
const POSTMARK_DATE = `${HEADING} text-center text-[calc(var(--pm)*0.14)] leading-[1.25] tracking-[0.12em]`;

/* The fine line either side of the date. */
const RULE = `h-px w-[6cqw] max-w-10 shrink-0 bg-(--m-secondary) opacity-60 [@container(aspect-ratio>1)]:w-[4cqw]`;

/**
 * A poster cover, no photo: a postage stamp — round perforations bitten out
 * of all four edges, its margin in the accent round a panel in the card's
 * colour, a fine line inside it — on the page's own ground, the host's
 * drawing (`drawing`) and the Title's lines inside (`related.title`), then the
 * date between two fine lines and the host's free line. Upright the
 * drawing over the words; landscape the drawing on the left.
 */
export function Variant({ values, related, basics, language }: VariantProps) {
  const { eyebrow, names, first, second } = posterWords(
    related.title ?? {},
    AMPERSAND,
  );
  const details = text(values, "details");
  /* The event's own date, in the invitation's language. */
  const date = longDate(basics.date, language);

  return (
    /* The hero's whole spare height, never shorter than a phone's 440px. `data-cover` for the envelope's strip. */
    <div data-cover className="relative flex min-h-110 grow overflow-hidden">
      <div className={CARD_STAGE}>
        <div className={`${CARD_BOX} ${SIZES}`}>
          <div className={STAMP}>
            <div className={`absolute inset-0 bg-(--m-accent) ${BITES_X}`}>
              {/* The picture's panel, in the card's colour. */}
              <div className="absolute inset-(--stamp-margin) bg-(--m-surface-alt)" />
            </div>
          </div>
          <div aria-hidden="true" className={POSTMARK}>
            <p className={POSTMARK_DATE}>
              {dayOfMonth(basics.date)} {romanMonth(basics.date)}
              <br />
              {yearOf(basics.date)}
            </p>
          </div>
          {/* A fine line in the accent, like the perforated edge, just inside the panel's edge. */}
          <div className="absolute inset-(--line-in) border-[length:calc(var(--bite)*1.5/7)] border-(--m-accent)" />
          <div className="absolute inset-(--line-in) flex flex-col items-center justify-center gap-(--gap) p-(--gap) text-center text-[color:var(--m-ink)] [@container(aspect-ratio>1)]:flex-row [@container(aspect-ratio>1)]:py-[calc(var(--gap)/2)]">
            {eyebrow ? (
              <p
                className={`${EYEBROW} ${MUTED} shrink-0 [@container(aspect-ratio>1)]:hidden`}
              >
                {eyebrow}
              </p>
            ) : null}
            <div className={drawingRoom(values)}>
              <div className={DRAWING_FIT} />
            </div>
            <div className="flex shrink-0 flex-col items-center [@container(aspect-ratio>1)]:max-w-[40cqw]">
              {eyebrow ? (
                <p
                  className={`${EYEBROW} ${MUTED} mb-3 hidden [@container(aspect-ratio>1)]:block`}
                >
                  {eyebrow}
                </p>
              ) : null}
              {names.length > 0 || first ? (
                <h1 className={NAMES}>
                  {/* Landscape, the first name on its own line, so the words' box is no wider than they are. */}
                  {names.length > 1 ? (
                    <>
                      <span className="[@container(aspect-ratio>1)]:block">
                        {names[0]}
                      </span>{" "}
                      <Mark parts={names.slice(1)} />
                    </>
                  ) : names.length > 0 ? (
                    <Mark parts={names} />
                  ) : (
                    first
                  )}
                </h1>
              ) : null}
              {second ? (
                <p
                  className={`${HEADING} ${MUTED} mt-1 text-[clamp(16px,4.6cqw,20px)] leading-[1.3] italic [@container(aspect-ratio>1)]:text-[clamp(18px,1.8cqw,26px)]`}
                >
                  {second}
                </p>
              ) : null}
              <div className="mt-[3cqh] flex items-center gap-3">
                <span className={RULE} />
                <p className={DATE}>{date}</p>
                <span className={RULE} />
              </div>
              {details ? (
                <p className={`${EYEBROW} ${MUTED} mt-3 whitespace-pre-line`}>
                  {details}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
