import { text } from "@/modular/content";
import { Mark } from "@/modular/Mark";
import { AMPERSAND_INK, EYEBROW, HEADING, MUTED } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import type { ReactNode } from "react";
import { CARD_INKS, CARD_STAGE, posterWords } from "./card";

/*
 * A ticket's sizes, read by its masks and its padding: small bites along
 * its ends, 6px on a phone, growing with the cover's shorter side to 12px;
 * the step between them, the extra paper along the long sides (`--edge`)
 * and along the ends and the tear line (`--end-in`),
 * the two big notches at the tear line, the holes along it kept clear of
 * the notches (`--hole-off`), the
 * boxes' distance in from the edge (`--box-in`) and the room inside the
 * main one (`--box-pad`) all in proportion to them. The same on every
 * ticket of the cover.
 */
const SIZES =
  "[--bite:clamp(6px,1.1cqmin,12px)] [--bite-step:calc(var(--bite)*22/7)] [--edge:calc(var(--bite)*2.6)] [--end-in:calc(var(--bite)*0.8)] [--notch:calc(var(--bite)*17/7)] [--hole-off:calc(var(--notch)+var(--bite)*0.8)] [--box-in:calc(var(--bite)*16/7)] [--box-pad:calc(var(--bite)*1.7)]";

/*
 * The ticket itself. Its width is what its place allows for a ticket's
 * shape: its inside upright 1 : 2, landscape 2.4 : 1, the paper along its
 * long sides `--edge` wider past that, so the margin grows the ticket, not
 * shrinks what's in it; its inside never wider than 1800px (750px tall).
 * That shape is only its shortest: when its words need more room (a phone
 * held sideways, a long line), it grows longer, and the paper with it;
 * its place (`HOLDS`) keeps it centred, growing both ways. A container by its width, so its parts read its width
 * (`cqw`); whether it lies or stands, they read from its place.
 */
const TICKET =
  "flex flex-col [container-type:inline-size] w-[min(100cqw,calc(50cqh+2*var(--edge)))] min-h-[min(100cqh,calc((100cqw-2*var(--edge))*2))] [@container(aspect-ratio>1)]:w-[min(100cqw,calc((100cqh-2*var(--edge))*2.4),1800px)] [@container(aspect-ratio>1)]:min-h-[min(100cqh,calc(100cqw/2.4+2*var(--edge)),calc(750px+2*var(--edge)))]";

/*
 * A ticket's place: a size container (the ticket fits it) with the ticket
 * centred in its one cell. The cell is the place's size, so a ticket grown
 * longer than it overflows it evenly both ways.
 */
const HOLDS =
  "grid grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] place-items-center [container-type:size]";

/*
 * Inside the ticket, filling it: the stub's length along it (`--stub`),
 * fixed, whatever the main part needs. Landscape, the ticket's last 26%;
 * upright, 26% of its shortest height, (width - 2 edges) × 2. Set here,
 * inside the ticket, so `cqw` is the ticket's width.
 */
const INSIDE =
  "relative flex flex-1 flex-col [--stub:calc((100cqw-2*var(--edge))*0.52)] [@container(aspect-ratio>1)]:[--stub:26cqw]";

/*
 * The paper is two pieces, the main part and the stub, meeting at the tear
 * line. Each is cut in three nested steps, each step's mask keeping what
 * the one around it left: its two notch quarters at the tear line, the
 * bites along its end, and half holes along its tear edge, so the two
 * pieces' halves meet as whole holes, as big and as far apart as the bites.
 * The pieces overlap by a pixel at the tear line, so no seam shows.
 * A bitten edge keeps `--off` clear at each end (its padding: the bites
 * tile the content box), so no bite or hole runs into a corner or a notch.
 */
const BITTEN = {
  top: "absolute inset-0 px-(--off) [mask:radial-gradient(circle_var(--bite)_at_50%_0,#0000_96%,#000)_0_0/var(--bite-step)_51%_round_no-repeat_content-box,linear-gradient(#000_0_0)_0_100%/100%_51%_no-repeat_border-box,linear-gradient(#000_0_0)_left/calc(var(--off)+1px)_100%_no-repeat_border-box,linear-gradient(#000_0_0)_right/calc(var(--off)+1px)_100%_no-repeat_border-box]",
  bottom:
    "absolute inset-0 px-(--off) [mask:radial-gradient(circle_var(--bite)_at_50%_100%,#0000_96%,#000)_0_100%/var(--bite-step)_51%_round_no-repeat_content-box,linear-gradient(#000_0_0)_0_0/100%_51%_no-repeat_border-box,linear-gradient(#000_0_0)_left/calc(var(--off)+1px)_100%_no-repeat_border-box,linear-gradient(#000_0_0)_right/calc(var(--off)+1px)_100%_no-repeat_border-box]",
  left: "absolute inset-0 py-(--off) [mask:radial-gradient(circle_var(--bite)_at_0_50%,#0000_96%,#000)_0_0/51%_var(--bite-step)_no-repeat_round_content-box,linear-gradient(#000_0_0)_100%_0/51%_100%_no-repeat_border-box,linear-gradient(#000_0_0)_top/100%_calc(var(--off)+1px)_no-repeat_border-box,linear-gradient(#000_0_0)_bottom/100%_calc(var(--off)+1px)_no-repeat_border-box]",
  right:
    "absolute inset-0 py-(--off) [mask:radial-gradient(circle_var(--bite)_at_100%_50%,#0000_96%,#000)_100%_0/51%_var(--bite-step)_no-repeat_round_content-box,linear-gradient(#000_0_0)_0_0/51%_100%_no-repeat_border-box,linear-gradient(#000_0_0)_top/100%_calc(var(--off)+1px)_no-repeat_border-box,linear-gradient(#000_0_0)_bottom/100%_calc(var(--off)+1px)_no-repeat_border-box]",
};

/* A piece's two notch quarters, on the corners at the tear line. */
const NOTCHED = {
  top: "[mask:radial-gradient(circle_var(--notch)_at_0_0,#0000_96%,#000)_0_0/51%_51%_no-repeat,radial-gradient(circle_var(--notch)_at_100%_0,#0000_96%,#000)_100%_0/51%_51%_no-repeat,linear-gradient(#000_0_0)_0_100%/100%_51%_no-repeat]",
  bottom:
    "[mask:radial-gradient(circle_var(--notch)_at_0_100%,#0000_96%,#000)_0_100%/51%_51%_no-repeat,radial-gradient(circle_var(--notch)_at_100%_100%,#0000_96%,#000)_100%_100%/51%_51%_no-repeat,linear-gradient(#000_0_0)_0_0/100%_51%_no-repeat]",
  left: "[mask:radial-gradient(circle_var(--notch)_at_0_0,#0000_96%,#000)_0_0/51%_51%_no-repeat,radial-gradient(circle_var(--notch)_at_0_100%,#0000_96%,#000)_0_100%/51%_51%_no-repeat,linear-gradient(#000_0_0)_100%_0/51%_100%_no-repeat]",
  right:
    "[mask:radial-gradient(circle_var(--notch)_at_100%_0,#0000_96%,#000)_100%_0/51%_51%_no-repeat,radial-gradient(circle_var(--notch)_at_100%_100%,#0000_96%,#000)_100%_100%/51%_51%_no-repeat,linear-gradient(#000_0_0)_0_0/51%_100%_no-repeat]",
};

type Side = keyof typeof BITTEN;

/* One piece of paper in `paper`: notched and holed at `tear`, bitten at `end`. */
function Piece({
  place,
  tear,
  end,
  paper,
}: {
  place: string;
  tear: Side;
  end: Side;
  paper: string;
}) {
  return (
    <div className={`absolute ${place} ${NOTCHED[tear]}`}>
      <div className={`${BITTEN[end]} [--off:var(--bite)]`}>
        <div className={`${BITTEN[tear]} [--off:var(--hole-off)]`}>
          <div className={`absolute inset-0 ${paper}`} />
        </div>
      </div>
    </div>
  );
}

/* A ticket's paper, upright (stub at the bottom) or landscape (stub on the right), torn `--stub` from that end. */
function Paper({ paper }: { paper: string }) {
  return (
    <>
      <div className="[@container(aspect-ratio>1)]:hidden">
        <Piece
          place="inset-x-0 top-0 h-[calc(100%-var(--stub)+0.5px)]"
          tear="bottom"
          end="top"
          paper={paper}
        />
        <Piece
          place="inset-x-0 top-[calc(100%-var(--stub)-0.5px)] bottom-0"
          tear="top"
          end="bottom"
          paper={paper}
        />
      </div>
      <div className="hidden [@container(aspect-ratio>1)]:block">
        <Piece
          place="inset-y-0 left-0 w-[calc(100%-var(--stub)+0.5px)]"
          tear="right"
          end="left"
          paper={paper}
        />
        <Piece
          place="inset-y-0 left-[calc(100%-var(--stub)-0.5px)] right-0"
          tear="left"
          end="right"
          paper={paper}
        />
      </div>
    </>
  );
}

/*
 * The main part and the stub, side by side landscape, stacked upright: the
 * stub `--stub` long, the main part the rest, and as long as its words
 * need, which is what makes the ticket grow. Positioned, so it lies over
 * the paper (`Paper`'s pieces are).
 */
const PARTS =
  "relative grid flex-1 grid-rows-[1fr_var(--stub)] [@container(aspect-ratio>1)]:grid-cols-[1fr_var(--stub)] [@container(aspect-ratio>1)]:grid-rows-1";

/* A ticket: its paper in `paper`, its main part and stub (`children`) on it. */
function Ticket({ paper, children }: { paper: string; children: ReactNode }) {
  return (
    <div className={TICKET}>
      <div className={INSIDE}>
        <Paper paper={paper} />
        <div className={PARTS}>{children}</div>
      </div>
    </div>
  );
}

/*
 * Both boxes sit `--box-in` and the extra `--edge` in from the long sides,
 * and a bite and `--end-in` further than `--box-in` from the bitten end and
 * the holes (that room taken from the boxes, not added to the ticket).
 */
const BOX_PLACE =
  "mx-[calc(var(--box-in)+var(--edge))] my-[calc(var(--box-in)+var(--bite)+var(--end-in))] [@container(aspect-ratio>1)]:mx-[calc(var(--box-in)+var(--bite)+var(--end-in))] [@container(aspect-ratio>1)]:my-[calc(var(--box-in)+var(--edge))]";

/* The main box, in the surface (on a dark palette the card's light paper, `CARD_INKS`); a fine frame just inside it. */
const BOX = `relative isolate flex min-h-0 flex-col p-(--box-pad) text-[color:var(--m-ink)] before:absolute before:inset-0 before:-z-10 before:bg-(--m-surface) dark-palette:before:bg-(--m-surface-alt) after:pointer-events-none after:absolute after:inset-[calc(var(--bite)*0.7)] after:border after:border-(--m-ink) ${BOX_PLACE}`;

/* The top and bottom lines' size: 13.5px to 17px upright, landscape 14px to 22px, growing with the ticket (`!` over `EYEBROW`'s own). */
const LINE = `${EYEBROW} text-[clamp(13.5px,5cqw,17px)]! [@container(aspect-ratio>1)]:text-[clamp(14px,1.9cqw,22px)]!`;

/* The eyebrow's band across the top, in the ink, its words in the box's colour. */
const BAND = `${LINE} bg-(--m-ink) px-2 py-[0.5em] text-center text-[color:var(--m-surface)] dark-palette:text-[color:var(--m-surface-alt)]`;

/*
 * The names, the one line in the heading face, growing with the ticket's
 * width, up to 130px however it lies: with no drawing beside them, they
 * have the whole box, an upright tablet's too.
 */
const NAMES = `${HEADING} text-center text-[min(130px,17cqw)] leading-[1.05] italic [@container(aspect-ratio>1)]:text-[min(130px,8cqw)]`;

/* The Title's second line under the names, italic, muted, about a third of their size, growing with them. */
const SECOND = `${HEADING} ${MUTED} mt-[0.3em] text-center text-[clamp(16px,5cqw,32px)] leading-[1.3] italic [@container(aspect-ratio>1)]:text-[clamp(16px,2.4cqw,36px)]`;

/*
 * The stub's frame, no fill, a fine line; the date fills it, the frame in
 * its colour: the palette's surface, on a dark palette the card's light
 * paper (`--card-paper`, `CARD_STAGE`). `--date` is the day's and
 * month's size: what the frame's width and length allow, from the
 * ticket's width alone (`--stub`, and landscape its shortest height,
 * width / 2.4 + 2 edges), so a ticket grown longer for its words keeps
 * its date.
 */
const STUB = `flex min-h-0 items-center justify-center border-[length:max(1px,calc(var(--bite)*1.5/7))] border-current text-[color:var(--m-surface)] dark-palette:text-[color:var(--card-paper)] [--date:min(calc((100cqw-2*(var(--box-in)+var(--edge)))*0.22),calc((var(--stub)-2*(var(--box-in)+var(--bite)+var(--end-in)))*0.62))] [@container(aspect-ratio>1)]:flex-col [@container(aspect-ratio>1)]:[--date:min(calc((var(--stub)-2*(var(--box-in)+var(--bite)+var(--end-in)))*0.62),calc((100cqw/2.4-2*var(--box-in))*0.3))] ${BOX_PLACE}`;

/* The date's numbers, in the body face. */
const NUMBER = "leading-none font-medium tracking-[0.02em] tabular-nums";

/*
 * The host's ticket's place: the cover's middle, upright 80% of its width,
 * landscape 70% of its width and 52% of its height (a landscape box, so the
 * ticket inside turns landscape too), room round it for the pile, holding
 * the ticket (`HOLDS`), tilted a little, its two shadows as the pile's
 * (`LYING`), deeper: it lies on top. On a dark palette, the card's
 * colours (`CARD_INKS`), as on every ticket.
 */
const MAIN = `absolute inset-x-[10cqw] inset-y-[6cqh] ${HOLDS} rotate-[2.5deg] [filter:drop-shadow(0_2px_2px_color-mix(in_oklab,var(--m-shadow)_45%,transparent))_drop-shadow(0_14px_18px_color-mix(in_oklab,var(--m-shadow)_35%,transparent))] [@container(aspect-ratio>1)]:inset-x-[15cqw] [@container(aspect-ratio>1)]:inset-y-[24cqh] [@container(aspect-ratio>1)]:-rotate-[3.5deg] ${SIZES} ${CARD_INKS}`;

/*
 * The pile's tickets under it, each a ticket's place (`HOLDS`) in a
 * landscape ticket's proportions, under each two shadows from the palette's
 * `shadow`: a close one along the paper's edge, so where two tickets
 * overlap the upper one's edge shows, and a soft one lifting it.
 * Their places, sizes and turns are the cover's: upright by its width,
 * landscape by its height, so each set fills its own layout, running off
 * the top and the sides. Never off the foot: the section under the cover
 * may be on the same ground, where a ticket cut there would show the cut,
 * so the lowest ones are placed from the foot, clear of it however
 * they're turned.
 */
const LYING = `absolute aspect-[2.3] ${HOLDS} [filter:drop-shadow(0_1px_1.5px_color-mix(in_oklab,var(--m-shadow)_45%,transparent))_drop-shadow(0_6px_10px_color-mix(in_oklab,var(--m-shadow)_28%,transparent))] ${SIZES} ${CARD_INKS}`;

/*
 * Where the pile and the change lie: the whole cover upright; landscape
 * never wider than 1.9 times its height, centred, so on a wide screen
 * they stay round the host's ticket instead of drifting apart.
 */
const SCENE =
  "absolute inset-0 [@container(aspect-ratio>1)]:inset-x-[max(0px,calc(50cqw-95cqh))]";

/*
 * The pile, one set per layout, each ticket about the host's size, all
 * turned over, apart from each other. Upright, two lying across, one
 * behind the host's ticket's top, one behind its foot. Landscape, two on
 * the diagonal; on a big screen (the cover 1600px wide or more), two
 * more, top and bottom: by the width, not the shape, as a short laptop
 * window is as wide for its height as a big monitor, but has less room.
 */
const PILE = [
  `${LYING} -left-[18%] -top-[4%] w-[120cqw] -rotate-[14deg] [@container(aspect-ratio>1)]:hidden`,
  `${LYING} -left-[6%] bottom-[17cqw] w-[120cqw] rotate-[11deg] [@container(aspect-ratio>1)]:hidden`,
  `${LYING} -left-[14%] top-[2%] w-[86cqh] rotate-[12deg] hidden [@container(aspect-ratio>1)]:block`,
  `${LYING} -right-[12%] top-[40%] w-[86cqh] -rotate-[16deg] hidden [@container(aspect-ratio>1)]:block`,
  `${LYING} left-[40%] -top-[6%] w-[86cqh] -rotate-[6deg] hidden [@container(aspect-ratio>1)_and_(min-width:1600px)]:block`,
  `${LYING} left-[4%] bottom-[9%] w-[86cqh] rotate-[8deg] hidden [@container(aspect-ratio>1)_and_(min-width:1600px)]:block`,
];

/*
 * The margins `SCENE` leaves on a big screen's cover more than twice as
 * wide as tall: one more ticket turned over in each, placed by the cover.
 */
const MARGIN_PILE = [
  `${LYING} -left-[4%] bottom-[12%] w-[86cqh] -rotate-[12deg] hidden [@container(aspect-ratio>2)_and_(min-width:1600px)]:block`,
  `${LYING} -right-[3%] top-[6%] w-[86cqh] rotate-[16deg] hidden [@container(aspect-ratio>2)_and_(min-width:1600px)]:block`,
];

/* A turned-over ticket's fine dashed lines, where the front's boxes would be. */
const BACK_LINE = `border-[length:max(1px,calc(var(--bite)*1.2/7))] border-dashed border-[color:color-mix(in_oklab,var(--m-accent-ink)_45%,transparent)] ${BOX_PLACE}`;

/* One ticket of the pile, turned over: in the accent, its dashed lines. */
function PileTicket({ place }: { place: string }) {
  return (
    <div aria-hidden className={place}>
      <Ticket paper="bg-(--m-accent)">
        <div className={BACK_LINE} />
        <div className={BACK_LINE} />
      </Ticket>
    </div>
  );
}

/*
 * The change: real gold and silver whatever the palette, the one part of
 * the cover not drawn from it (its shadow is). A domed face lit from the
 * top left with a fine line round it, a raised rim with a sheen running
 * round it (`before:`), a ring of beads inside the rim (`after:`), the
 * value struck in relief, a thin edge under it. Sized by the cover's
 * shorter side.
 */
const COIN =
  "absolute grid aspect-square place-items-center rounded-full [container-type:inline-size] bg-[radial-gradient(circle_closest-side,#0000_0_77%,color-mix(in_oklab,var(--coin-lo)_80%,transparent)_78%_80%,#0000_81%),radial-gradient(circle_at_34%_28%,var(--coin-hi),var(--coin-mid)_42%,var(--coin-lo)_110%)] shadow-[0_1px_0_var(--coin-edge),0_2px_3px_color-mix(in_oklab,var(--m-shadow)_25%,transparent),0_6px_10px_color-mix(in_oklab,var(--m-shadow)_15%,transparent)] before:absolute before:inset-0 before:rounded-full before:bg-[conic-gradient(from_300deg,var(--coin-hi),var(--coin-mid)_12%,var(--coin-lo)_30%,var(--coin-mid)_45%,var(--coin-hi)_55%,var(--coin-mid)_68%,var(--coin-lo)_82%,var(--coin-mid)_92%,var(--coin-hi))] before:[mask:radial-gradient(circle_closest-side,#0000_81%,#000_82%)] after:absolute after:inset-0 after:rounded-full after:bg-[repeating-conic-gradient(color-mix(in_oklab,var(--coin-lo)_75%,transparent)_0_3.5deg,#0000_3.5deg_10deg)] after:[mask:radial-gradient(circle_closest-side,#0000_70%,#000_71%_74%,#0000_75%)]";

const METAL = {
  gold: "[--coin-hi:#fff6cf] [--coin-mid:#e0b445] [--coin-lo:#8f6512] [--coin-edge:#6b4a0c]",
  silver:
    "[--coin-hi:#ffffff] [--coin-mid:#c7cbd1] [--coin-lo:#767c85] [--coin-edge:#565b63]",
};

/* The value, in the heading face, raised: lit on its top left edge, shaded on its bottom right. */
const COIN_VALUE = `${HEADING} relative z-1 text-[40cqw] leading-none font-bold text-(--coin-mid) [text-shadow:-1px_-1px_0_var(--coin-hi),1px_1px_0_var(--coin-lo)]`;

/*
 * The coins, one set per layout, over the pile and round the host's
 * ticket, all clear of the cover's foot (`LYING`): the lowest placed from
 * it, never nearer than 24px, past their shadow, on a short cover too.
 */
type CoinSpot = { place: string; metal: keyof typeof METAL; value: string };

const COINS: CoinSpot[] = (
  [
    {
      place: "left-[2%] top-[3%] w-[19.8cqmin] -rotate-10",
      metal: "gold",
      value: "5",
    },
    {
      place: "left-[21%] top-[1%] w-[15.5cqmin] rotate-12",
      metal: "silver",
      value: "1",
    },
    {
      place: "-right-[3%] top-[28%] w-[17.6cqmin] -rotate-[18deg]",
      metal: "gold",
      value: "10",
    },
    {
      place: "-right-[2%] top-[72%] w-[18.4cqmin] rotate-[14deg]",
      metal: "gold",
      value: "50",
    },
    {
      place: "left-[3%] bottom-[max(24px,4%)] w-[14.9cqmin] -rotate-6",
      metal: "silver",
      value: "2",
    },
    {
      place: "right-[20%] bottom-[max(24px,4%)] w-[16.2cqmin] rotate-[8deg]",
      metal: "gold",
      value: "1",
    },
  ] satisfies CoinSpot[]
).map((coin) => ({
  ...coin,
  place: `${coin.place} [@container(aspect-ratio>1)]:hidden`,
}));

const WIDE_COINS: CoinSpot[] = (
  [
    {
      place: "left-[9%] top-[74%] w-[13.8cqmin] -rotate-12",
      metal: "gold",
      value: "5",
    },
    {
      place: "left-[15%] bottom-[max(24px,4%)] w-[11.5cqmin] rotate-[8deg]",
      metal: "silver",
      value: "1",
    },
    {
      place: "left-[86%] top-[12%] w-[9.7cqmin] -rotate-[20deg]",
      metal: "gold",
      value: "1",
    },
    {
      place: "left-[87%] top-[52%] w-[13.3cqmin] rotate-[14deg]",
      metal: "gold",
      value: "10",
    },
    {
      place: "left-[90%] top-[65%] w-[10.2cqmin] -rotate-6",
      metal: "gold",
      value: "5",
    },
    {
      place: "left-[68.9%] top-[77.8%] w-[12cqmin] rotate-[22deg]",
      metal: "silver",
      value: "2",
    },
    {
      place: "left-[7.1%] top-[37%] w-[11.5cqmin] rotate-[10deg]",
      metal: "gold",
      value: "10",
    },
    {
      place: "left-[91.1%] bottom-[max(24px,4%)] w-[10.2cqmin] rotate-[16deg]",
      metal: "silver",
      value: "1",
    },
  ] satisfies CoinSpot[]
).map((coin) => ({
  ...coin,
  place: `${coin.place} hidden [@container(aspect-ratio>1)]:grid`,
}));

/**
 * A poster cover, no photo: the host's admission ticket just bought, lying
 * on a pile of others with the change, on the page's own ground across the
 * whole cover. The ticket in the secondary — scalloped ends, two round
 * notches and a row of holes at the tear line. On its main part a box in
 * the surface, a fine frame inside it: the Title's eyebrow on a band in the
 * ink, the names large, the Title's second line under them, the host's
 * free line along the foot, its lines joined by dots. On the stub, in a framed box, the date in numbers filling
 * it. Upright the stub at the bottom; landscape on the right. Under it,
 * tickets turned over, and gold and silver coins.
 */
export function Variant({ values, related, basics, language }: VariantProps) {
  const { eyebrow, names, first, second } = posterWords(
    related.title ?? {},
    AMPERSAND_INK,
  );
  /* The free line on one line: the host's line breaks become dots. */
  const details = text(values, "details")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" · ");
  const [year, month, day] = basics.date.split("-");
  /* Hungarian writes the year first. */
  const yearFirst = language === "hu";
  const dayMonth = yearFirst ? [month, day] : [day, month];

  return (
    /* The hero's whole spare height, never shorter than a phone's 440px. `data-cover` for the envelope's strip. */
    <div data-cover className="relative flex min-h-110 grow overflow-hidden">
      <div className={CARD_STAGE}>
        {MARGIN_PILE.map((place) => (
          <PileTicket key={place} place={place} />
        ))}
        <div className={SCENE}>
          {PILE.map((place) => (
            <PileTicket key={place} place={place} />
          ))}
          {[...COINS, ...WIDE_COINS].map(({ place, metal, value }) => (
            <Coin
              key={place}
              place={`${place} ${METAL[metal]}`}
              value={value}
            />
          ))}
        </div>
        <div className={MAIN}>
          <Ticket paper="bg-(--m-secondary)">
            <div className={BOX}>
              {eyebrow ? <p className={BAND}>{eyebrow}</p> : null}
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-(--box-pad) [@container(aspect-ratio>1)]:px-[calc(var(--box-pad)*2)]">
                {names.length > 0 || first ? (
                  <h1 className={NAMES}>
                    {names.length > 0 ? <Mark parts={names} /> : first}
                  </h1>
                ) : null}
                {second ? <p className={SECOND}>{second}</p> : null}
              </div>
              {details ? (
                <p
                  className={`${LINE} border-t border-(--m-ink) pt-[0.8em] text-center`}
                >
                  {details}
                </p>
              ) : null}
            </div>
            <div className={STUB}>
              <DateStub year={year} dayMonth={dayMonth} yearFirst={yearFirst} />
            </div>
          </Ticket>
        </div>
      </div>
    </div>
  );
}

/* A coin of the change, its value on its face. */
function Coin({ place, value }: { place: string; value: string }) {
  return (
    <div aria-hidden className={`${COIN} ${place}`}>
      <span className={COIN_VALUE}>{value}</span>
    </div>
  );
}

/* The stub's date: landscape stacked, upright in a row. */
function DateStub({
  year,
  dayMonth,
  yearFirst,
}: {
  year: string;
  dayMonth: string[];
  yearFirst: boolean;
}) {
  return (
    <>
      {/* Landscape: stacked, the year under (or, Hungarian, over) the day and month. */}
      <div className="hidden w-full flex-col items-stretch text-center [@container(aspect-ratio>1)]:flex">
        {yearFirst ? (
          <p className={`${NUMBER} mb-[0.5em] text-[calc(var(--date)*0.5)]`}>
            {year}
          </p>
        ) : null}
        <p className={`${NUMBER} text-(length:--date)`}>{dayMonth[0]}</p>
        <span className="mx-[12%] my-[calc(var(--date)*0.12)] border-t border-current" />
        <p className={`${NUMBER} text-(length:--date)`}>{dayMonth[1]}</p>
        {yearFirst ? null : (
          <>
            <span className="mx-[12%] my-[calc(var(--date)*0.12)] border-t border-current" />
            <p className={`${NUMBER} text-[calc(var(--date)*0.5)]`}>{year}</p>
          </>
        )}
      </div>
      {/* Upright: in a row, the year small, stacked in two. */}
      <div className="flex items-center gap-[calc(var(--date)*0.2)] [@container(aspect-ratio>1)]:hidden">
        {yearFirst ? <Year year={year} /> : null}
        <p className={`${NUMBER} text-(length:--date)`}>{dayMonth[0]}</p>
        <p className={`${NUMBER} text-(length:--date) opacity-50`}>/</p>
        <p className={`${NUMBER} text-(length:--date)`}>{dayMonth[1]}</p>
        {yearFirst ? null : <Year year={year} />}
      </div>
    </>
  );
}

/* The year small beside the day and month: its two halves stacked. */
function Year({ year }: { year: string }) {
  return (
    <p
      className={`${NUMBER} flex flex-col text-[calc(var(--date)*0.36)] font-semibold tracking-[0.08em]`}
    >
      <span>{year.slice(0, 2)}</span>
      <span>{year.slice(2)}</span>
    </p>
  );
}
