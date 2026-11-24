import { imageSrc, longDate, text } from "@/modular/content";
import { CORNER, EYEBROW, NAMES_SIZE, SERIF } from "@/modular/styles";
import { CoverNames, DATE_BLOCK_NAMES_SIZE } from "@/modular/CoverNames";
import { WashedPhoto } from "@/modular/WashedPhoto";
import type { VariantProps } from "@/types/modular";

/*
 * The cover's content: upright the picture over the words, the cover's
 * spare height shared evenly above, between and below them; landscape
 * (`cover-side`: a page 768px or wider on a screen wider than tall) side
 * by side, across the page's whole width; an upright tablet stays upright. Below the frosted bar
 * (`pt-bar`), as the cover is drawn from the page's top; upright 24px kept
 * under the words, so the last line never sits on the screen's foot.
 */
const ROW =
  "flex w-full grow flex-col justify-evenly pt-bar pb-6 cover-side:flex-row cover-side:pb-0 cover-side:justify-normal @5xl:pt-bar-lg";

/*
 * The picture's room: upright the whole width, as tall as the screen
 * leaves once the words have theirs (`flex-[1_1_0]`), from 40% of the
 * width up to 77%, just round the two squares; on an upright tablet (a
 * page 672px or wider, the screen taller than wide) up to 65%, so the
 * picture doesn't take the whole screen; so on a short phone the
 * picture shrinks rather than the cover growing past the screen, and with
 * room to spare the cover shares it evenly (`ROW`). On a phone (a page
 * under 448px) the width less 16px a side, so the block and the photo
 * keep clear of the screen's edges, and up to 110% of that tall: with
 * height to spare the frame stays as wide and the shapes grow taller
 * (`STRETCH`). Landscape the row's
 * left half, the words in the other. A size container for the frame inside.
 */
const ART =
  "relative max-h-[77cqw] @max-md/page:max-h-[calc((100cqw-32px)*1.1)] [@container_screen_(aspect-ratio<=1)]:@2xl/page:max-h-[65cqw] min-h-[40cqw] w-full flex-[1_1_0] [container-type:size] cover-side:max-h-none cover-side:min-h-0 cover-side:w-1/2 cover-side:flex-initial";

/*
 * The picture itself: a size container so the block, the photo and the
 * digits keep their proportions to it; they read the layout from
 * `cover-side`, the page's, as the frame is narrower than the step. Upright
 * the room's full height from its top, centred, as wide as that allows,
 * the whole width when the room is at its tallest (16px short of each
 * edge on a phone, `ART`). Landscape a touch taller than wide, at the room's right:
 * as tall as the room less 16px above and below, never over 900px, nor
 * wider than 92% of the room, the row's half (`ROW`): so the block keeps
 * clear of the screen's left edge by 4% of the page, as the words keep
 * from the right one (`WORDS`' `px-[4%]`).
 */
const FRAME =
  "absolute top-0 left-1/2 aspect-[100/77] h-full max-w-full @max-md/page:max-w-[calc(100%-32px)] -translate-x-1/2 [container-type:size] cover-side:inset-auto cover-side:top-1/2 cover-side:right-0 cover-side:aspect-[0.97] cover-side:h-[min(calc(100cqh-32px),900px,calc(92cqw/0.97))] cover-side:translate-x-0 cover-side:-translate-y-1/2";

/*
 * The two shapes, the block and the photo, share one proportion
 * (`SHAPE`): squares upright, 7 : 10 landscape; the block the bigger, and
 * the host's box corners (`CORNER`). Sized by the frame's width upright,
 * by its height landscape, so they keep that proportion whatever the
 * frame's.
 */
const SHAPE = "aspect-square cover-side:aspect-[7/10]";

/*
 * On a phone (a page under 448px) the frame can be taller than its
 * 100 : 77 (`ART`); the shapes then stretch down to its foot rather than
 * stay squares. The photo from 7% down to the foot, the block 52/70 of
 * that, as when square. At 100 : 77 these are the squares' own sizes, so
 * nothing moves until there is height to spare. The digits stay centred in
 * the block, and the sprig hangs from its foot (moved down as far as the
 * block grew).
 */
const STRETCH = {
  block: "@max-md/page:aspect-auto @max-md/page:h-[calc((100cqh-7cqw)*52/70)]",
  photo: "@max-md/page:aspect-auto @max-md/page:h-[calc(100cqh-7cqw)]",
  digits:
    "@max-md/page:top-[calc((100cqh-7cqw)*26/70)] @max-md/page:-translate-y-1/2",
  sprig: "@max-md/page:translate-y-[calc((100cqh-7cqw)*52/70-52cqw)]",
};

/*
 * The block in the secondary, a rectangle of its own at the picture's
 * left, at its top, standing higher than the photo: upright half the
 * width, landscape seven tenths of the height.
 */
const BLOCK = `${CORNER} absolute left-0 top-0 w-[52cqw] ${SHAPE} ${STRETCH.block} bg-(--m-secondary) cover-side:top-0 cover-side:h-[70cqh] cover-side:w-auto`;

/*
 * The photo over the block's right part, standing lower than it, to the
 * frame's right edge: upright seven tenths of the width, its foot at the
 * frame's; landscape nine tenths of the height, centred on it.
 */
const PHOTO = `${CORNER} absolute right-0 top-[7cqw] w-[70cqw] ${SHAPE} ${STRETCH.photo} overflow-hidden bg-(--m-accent) cover-side:right-0 cover-side:top-[5cqh] cover-side:h-[90cqh] cover-side:w-auto`;

/*
 * The date's digits, a pair to a line, in the heading face and the
 * block's own ink, centred in the block's height upright, and
 * between the block's left edge and the photo's: upright the photo starts
 * at 30% of the width (100 less its 70% width), so the middle is 15%; landscape it starts at the width less its own, 7/10 of its 90%
 * height (63cqh), so the middle is half that. As big as the room beside the
 * photo and the block's height allow.
 */
const DIGITS = `${SERIF} absolute left-[15cqw] top-[6cqw] -translate-x-1/2 ${STRETCH.digits} text-center text-[13cqw] leading-[1.04] tracking-[0.02em] text-[color:var(--m-secondary-ink)] cover-side:left-[calc((100cqw-63cqh)/2)] cover-side:top-[11cqh] cover-side:text-[min(22cqw,15cqh)]`;

/*
 * The words: upright not a box of their own, so the picture and their
 * group (`GROUP`) share the spare height evenly; landscape the row's
 * right part, the group centred in it.
 */
const WORDS =
  "contents cover-side:flex cover-side:flex-1 cover-side:flex-col cover-side:items-center cover-side:justify-center cover-side:px-[4%] cover-side:py-10";

/*
 * The words' one group, so they stay together upright too: the names and
 * their second line, then the free line (when there is one). Its own
 * container, so the names' sizes step with its width, and positioned, so
 * drawn over the sprig behind them (`SPRIG_NAMES`).
 */
const GROUP =
  "@container relative flex w-full shrink-0 flex-col items-center px-6 text-center cover-side:px-0";

/*
 * The host's sprig (`art/covers/block-date-leaves.svg`, built to
 * `public/modular/cover/`), painted through its mask in the text colour, in
 * a box of its source's viewBox, the mask reaching the build's 5 units of
 * room past it. Turned and mirrored round its stem's foot (`origin-…`).
 * Placed from the host's layout (`art/covers/block-date-layout.svg`).
 */
const SPRIG =
  "pointer-events-none absolute aspect-[319.19/564.45] origin-[32.895%_99.212%] before:absolute before:-inset-x-[1.5664%] before:-inset-y-[0.8858%] before:bg-current before:mask-[url(/modular/cover/block-date-leaves.svg)] before:mask-contain before:mask-center before:mask-no-repeat";

/*
 * Behind the block and the photo, in the frame (`FRAME`), so it scales with
 * the picture: hanging from the block's foot past the photo's left edge,
 * upright in the secondary's soft tint, landscape in the accent's.
 */
const SPRIG_HANGING = `${SPRIG} left-[32.31cqw] top-[-37.35cqw] w-[38.47cqw] rotate-[43deg] -scale-y-100 ${STRETCH.sprig} text-(--m-secondary-soft) cover-side:left-[30.58cqh] cover-side:top-[-21.59cqh] cover-side:w-[37.88cqh] cover-side:text-(--m-accent-soft)`;

/* Rising from the photo's foot at its right corner, landscape only. */
const SPRIG_CORNER = `${SPRIG} hidden left-[81.51cqh] top-[-8.27cqh] w-[37.88cqh] rotate-[38.9deg] -scale-x-100 text-(--m-secondary-soft) cover-side:block`;

/*
 * Behind the words' right side, in the names' own size (`em`): its stem's
 * foot 16px over the cover's foot (`bottom-4`), so it grows up behind
 * them and is never cut below, and kept 24px clear of the cover's right
 * edge: its box that far in, plus how far its top swings right when
 * turned and its mask reaches past the box, 0.75em upright (a 6.97em tall
 * box), 0.55em side by side (5.17em). Before the row, so the picture and the words (each
 * positioned) are drawn over it.
 */
const SPRIG_NAMES = `${SPRIG} ${NAMES_SIZE} ${DATE_BLOCK_NAMES_SIZE} bottom-4 right-[calc(24px+0.75em)] w-[3.942em] rotate-[5.7deg] text-(--m-accent-soft) cover-side:right-[calc(24px+0.55em)] cover-side:w-[2.926em]`;

/*
 * The free line in small capitals (`EYEBROW`), a touch bigger: 14px, 13px
 * on a phone (a page under 448px), 16px side by side from 1280px; in the
 * ink. Side by side 32px under the names'
 * second line, 40px from 1280px; upright it stays
 * close: 12px under the second line.
 */
const DETAILS = `${EYEBROW} mt-3 whitespace-pre-line text-[14px] @max-md/page:text-[13px] text-[color:var(--m-ink)] cover-side:mt-8 cover-side:@7xl/page:mt-10 cover-side:@7xl/page:text-[16px]`;

/** A date as its day, month and two-digit year: "2027-09-18" → 18, 09, 27. */
function dateDigits(iso: string): string[] {
  const [year, month, day] = iso.split("-");
  return year && month && day ? [day, month, year.slice(-2)] : [];
}

/**
 * A photo cover: a block in the secondary from the left edge, the
 * event's date in it as big digits, the host's photo over its right part,
 * and the names beside it, then their
 * second line and the host's free line.
 * Landscape the picture on the left, the words on the right; upright the
 * picture on top, the words below. The rest is the page's own ground, so a
 * pattern shows there.
 */
export function Variant({ values, basics, language }: VariantProps) {
  const photo = imageSrc(text(values, "photo"));
  const details = text(values, "details");
  const digits = dateDigits(basics.date);

  return (
    /*
     * The whole screen: the page's width (`wide`) and the hero's height from
     * under the frosted bar (`underHeader`), never shorter than a phone's
     * 440px. `data-cover` for the envelope's strip.
     */
    <div
      data-cover
      className="relative flex min-h-110 grow flex-col overflow-hidden"
    >
      <div className={SPRIG_NAMES} aria-hidden="true" />
      <div className={ROW}>
        <div className={ART}>
          <div className={FRAME}>
            {/* Before the block and the photo, so drawn under them. */}
            <div className={SPRIG_HANGING} aria-hidden="true" />
            <div className={SPRIG_CORNER} aria-hidden="true" />
            <div className={BLOCK} />
            {digits.length > 0 ? (
              <p
                className={DIGITS}
                aria-label={longDate(basics.date, language)}
              >
                {digits.map((pair, index) => (
                  <span key={index} className="block" aria-hidden="true">
                    {pair}
                  </span>
                ))}
              </p>
            ) : null}
            <div className={PHOTO}>
              {/* While the photo is missing the accent stands in, as on the other photo covers. */}
              {photo ? (
                <WashedPhoto
                  src={photo}
                  sizes="(min-width: 768px) 35vw, 60vw"
                  ground="surface"
                  preload
                />
              ) : null}
            </div>
          </div>
        </div>
        <div className={WORDS}>
          <div className={GROUP}>
            {/* The names and their second line, one heading in one size and face. */}
            <CoverNames values={values} look="dateBlock" />
            {details ? <p className={DETAILS}>{details}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
