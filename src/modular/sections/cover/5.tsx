import { isOn, longDate, text } from "@/modular/content";
import { Mark, markParts } from "@/modular/Mark";
import {
  AMPERSAND,
  CORNER,
  EYEBROW,
  HEADING,
  POSTER_DATE,
  TONE_TEXT,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/*
 * The corners' gap from the sides: when taller than wide the same small gap
 * as at the top and bottom (2% of the shorter side), 4% of the width when
 * wider, so a wide screen gives them room.
 */
const CORNER_GAP =
  "[--corner-x:2cqmin] [@container(aspect-ratio>1)]:[--corner-x:4cqw]";

/*
 * The corners' width. Taller than wide, 90% of the width, but never so
 * tall that the two reach the words: at most 67.5% of a phone's height, 63%
 * of a tablet's. Wider than tall, a share of the width (49.5%, 40.5% past
 * 1600px), at most 83% of the height.
 */
const CORNER_SIZE =
  "[--corner-w:min(90cqw,63cqh)] @max-3xl:[--corner-w:min(90cqw,67.5cqh)] [@container(aspect-ratio>1)_and_(width<1600px)]:[--corner-w:min(49.5cqw,83cqh)] [@container(aspect-ratio>1)_and_(width>=1600px)]:[--corner-w:min(40.5cqw,83cqh)]";

/*
 * The host's engraved flower corner, a file of its own (large, so it stays
 * out of the page's code), painted in the secondary through a mask, over its
 * filled-in shape in the surface colour (`wildflower-fill.svg`, the host's
 * fill layer: each flower and leaf solid), so the border and the card don't
 * show through the petals. On a dark palette (`dark-palette`) the drawing in
 * the surface colour over a fill in the secondary, its outline much thinner
 * (`wildflower-fill-dark.svg`: a stroke of 0.75, not 2). Each file has 5 units
 * of room round the drawing's 251.95 × 212.19, so the fill's stroke isn't
 * cut, and both layers reach as far past the box (5 / 251.95, 5 / 212.19):
 * one box for both, so the browser rounds them to the same pixel. The box
 * keeps the drawing's proportions.
 */
const FLOWERS = `absolute aspect-[251.95/212.19] w-(--corner-w) ${CORNER_GAP} ${CORNER_SIZE} before:absolute before:-inset-x-[1.9845%] before:-inset-y-[2.3563%] before:bg-(--m-surface) dark-palette:before:bg-(--m-secondary) before:mask-[url(/modular/cover/wildflower-fill.svg)] dark-palette:before:mask-[url(/modular/cover/wildflower-fill-dark.svg)] before:mask-contain before:mask-center before:mask-no-repeat after:absolute after:-inset-x-[1.9845%] after:-inset-y-[2.3563%] after:bg-(--m-secondary) dark-palette:after:bg-(--m-surface) after:mask-[url(/modular/cover/wildflower.svg)] after:mask-contain after:mask-center after:mask-no-repeat`;

/*
 * A card in the second surface colour, in from the cover's edges by its
 * shorter side, and by 5% of its width more at the sides, 4% of its height
 * more at the top and bottom, so a pattern shows only round it. No line
 * round it: its own edge, then 10px in, one hairline in a soft mix of the
 * accent (`FRAME`).
 */
const CARD = `absolute inset-x-[calc(min(5cqw,4.5cqh)+5cqw)] inset-y-[calc(min(5cqw,4.5cqh)+4cqh)] p-2.5 ${CORNER} bg-(--m-surface-alt)`;

/* The card's hairline: the accent mixed into the card's colour. */
const FRAME = `h-full ${CORNER} border-1 border-[color:color-mix(in_oklab,var(--m-accent)_45%,var(--m-surface-alt))]`;

/* The names, growing with the width, never past the Title's 80px. */
const POSTER_NAMES = `${HEADING} text-[min(48px,11.5cqw)] @3xl:text-[min(80px,6cqw)] leading-[1.1] tracking-[-0.03em] italic`;

/* The divider's fine lines either side of the diamonds. */
const RULE = "h-px w-14 bg-current opacity-50";

/** Three diamonds, the middle one larger, between two fine lines. */
function Divider() {
  return (
    <div className="mb-5 flex items-center gap-2.5 text-[color:var(--m-accent)]">
      <span className={RULE} />
      <svg
        viewBox="0 0 36 10"
        className="h-2.5 w-9"
        fill="currentColor"
        aria-hidden
      >
        <path d="M4 2.4 6.6 5 4 7.6 1.4 5Z" />
        <path d="M18 1 22 5 18 9 14 5Z" />
        <path d="M32 2.4 34.6 5 32 7.6 29.4 5Z" />
      </svg>
      <span className={RULE} />
    </div>
  );
}

/**
 * A poster cover, no photo, for a wedding, an engagement or a baptism: the
 * host's flower corner at the bottom left and, turned, at the top right, over
 * a thick-and-thin border, and the Title's lines centred between them
 * (`related.title`), then the date and the host's free line. On the page's
 * surface, so a pattern shows round it.
 */
export function Variant({ values, related, basics, language }: VariantProps) {
  const title = related.title ?? {};
  const eyebrow = text(title, "eyebrow");
  /* Use names off: two plain lines in place of the names and their line. */
  const named = isOn(title, "names");
  const names = named ? markParts(title, "names", AMPERSAND) : [];
  const first = named ? "" : text(title, "firstLine");
  const second = text(title, named ? "secondLine" : "nextLine");
  const details = text(values, "details");
  /* The event's own date, in the invitation's language. */
  const date = longDate(basics.date, language);

  return (
    /* The hero's whole spare height, never shorter than a phone's 440px. `data-cover` for the envelope's strip. */
    <div data-cover className="relative flex min-h-110 grow overflow-hidden">
      <div className="absolute inset-0 [container-type:size]">
        <div className={CARD}>
          <div className={FRAME} />
        </div>
        <div
          className={`${FLOWERS} top-[2cqmin] right-(--corner-x) rotate-180`}
        />
        <div className={`${FLOWERS} bottom-[2cqmin] left-(--corner-x)`} />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-[12cqw] text-center text-[color:var(--m-ink)]">
          {/* With names off there is no secondary "&": the eyebrow takes that colour. */}
          {eyebrow ? (
            <p
              className={`${EYEBROW} ${named ? TONE_TEXT.accent : TONE_TEXT.secondary} mb-3`}
            >
              {eyebrow}
            </p>
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
          <Divider />
          <p className={POSTER_DATE}>{date}</p>
          {details ? (
            <p
              className={`${EYEBROW} ${TONE_TEXT.accent} mt-3 whitespace-pre-line`}
            >
              {details}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
