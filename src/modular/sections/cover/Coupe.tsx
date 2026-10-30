/*
 * Every colour of the drawing is mixed from the cover's ground, the accent,
 * so any palette gets a coupe that matches it: the glass and the stars
 * lighter, the drink near white, the bow tie much darker.
 */
const COLORS =
  "[--coupe-glass:color-mix(in_oklab,var(--m-accent),white_48%)] [--coupe-drink:color-mix(in_oklab,var(--m-accent),white_90%)] [--coupe-bubble:color-mix(in_oklab,var(--m-accent),white_92%)] [--coupe-star:color-mix(in_oklab,var(--m-accent),white_40%)] [--coupe-tie:color-mix(in_oklab,var(--m-accent),black_62%)] [--coupe-knot:color-mix(in_oklab,var(--m-accent),black_40%)]";

/*
 * Five-point stars about 20 across, centred on 0,0, each a little uneven as
 * if cut by hand: arms of different lengths, not quite evenly spaced. The
 * stars take them in turn.
 */
const STARS = [
  "M0.3,-10.3 L3,-3.5 L10.5,-2.8 L4,0.9 L5.1,8.7 L-0.3,3.7 L-5.3,7.4 L-4,1.2 L-8.8,-1.9 L-2.9,-3.5 Z",
  "M-0.7,-10.9 L2.2,-3.7 L8.4,-3.5 L3.5,1.5 L5.4,8 L0.1,4.1 L-5.6,9 L-3.5,1.4 L-8.9,-1.9 L-2.7,-3.6 Z",
  "M-0.9,-10.2 L2.8,-3.6 L8.5,-3.2 L4,1.5 L6.4,8 L0.1,4.4 L-4.7,7.7 L-3.8,0.9 L-10.2,-2.7 L-2.1,-3 Z",
];

/* An SVG part's own box for its motion, so it scales round its middle. */
const OWN_BOX = "[transform-box:fill-box] origin-center";

/*
 * The motion plays a few times, about 20 seconds, then rests on a still
 * frame (`--animate-*` in `globals.css`). It waits while the page is inert,
 * under the envelope (the envelope's copy of the page too), and while the
 * cover is out of view (`data-paused`, set by the cover). Forced, as the
 * animation's own shorthand comes later and would set it running.
 */
const PAUSE =
  "in-[[inert]]:[animation-play-state:paused]! in-[[data-paused]]:[animation-play-state:paused]!";

/** A star's twinkle, paused like the rest. */
const STAR_TWINKLE = `motion-safe:animate-twinkle ${PAUSE}`;

const TWINKLE = `${OWN_BOX} ${STAR_TWINKLE}`;

/*
 * The bubbles over the glass, each rising a little after the one before,
 * then fading back in where they rest: two delays, the rise's and the
 * fade's, 18s (five rises) after it. Written out in full for Tailwind to
 * find: change `--animate-rise` in `globals.css` (5 × 3.6s, `appear` at
 * 18s) and the second delay of each changes with it.
 */
const BUBBLES = [
  { cx: 86, cy: 34, r: 5.5, delay: "" },
  { cx: 104, cy: 18, r: 3.5, delay: "[animation-delay:1.1s,19.1s]" },
  { cx: 94, cy: 4, r: 4, delay: "[animation-delay:2.1s,20.1s]" },
  { cx: 110, cy: 40, r: 3, delay: "[animation-delay:0.5s,18.5s]" },
];

/* The fizz in the drink. */
const FIZZ = [
  { cx: 88, cy: 92, r: 3, delay: "" },
  { cx: 100, cy: 86, r: 2.2, delay: "[animation-delay:0.8s]" },
  { cx: 108, cy: 97, r: 3.2, delay: "[animation-delay:1.5s]" },
  { cx: 96, cy: 104, r: 2, delay: "[animation-delay:0.8s]" },
  { cx: 114, cy: 88, r: 1.8, delay: "" },
];

/* The three stars beside the glass, in its own drawing. */
const GLASS_STARS = [
  { at: "translate(176 18) rotate(12) scale(1.15)", delay: "" },
  {
    at: "translate(168 226) rotate(-8) scale(.8)",
    delay: "[animation-delay:1.6s]",
  },
  { at: "translate(150 286) rotate(20)", delay: "[animation-delay:2.8s]" },
];

/*
 * The stars scattered over the cover, kept clear of the glass and the words
 * and spread evenly with no pattern: one set for the stacked cover, one for
 * the glass beside the words, each placed in what that layout leaves free.
 * Sizes follow the shorter side of the box, so a tall tablet's stars are not
 * oversized: small, medium and large.
 */
const SM = "size-[4.5cqmin]";
const MD = "size-[5.5cqmin]";
const LG = "size-[7cqmin]";

/* Stacked: the glass high in the middle, the words low and centred. */
const STACKED_STARS = [
  `left-[15%] top-[3%] ${MD} rotate-[8deg]`,
  `left-[91%] top-[6%] ${LG} rotate-[14deg] [animation-delay:0.7s]`,
  `left-[4%] top-[16%] ${SM} -rotate-[6deg] [animation-delay:2.1s]`,
  `left-[96%] top-[19%] ${SM} rotate-[18deg] [animation-delay:2.8s]`,
  `left-[17%] top-[29%] ${LG} -rotate-[16deg] [animation-delay:3.5s]`,
  `left-[84%] top-[30%] ${MD} -rotate-[4deg] [animation-delay:1.1s]`,
  `left-[6%] top-[60%] ${SM} -rotate-[10deg] [animation-delay:2.5s]`,
  `left-[93%] top-[73%] ${MD} rotate-[20deg] [animation-delay:3.2s]`,
  `left-[10%] top-[85%] ${MD} rotate-[4deg] [animation-delay:0.9s]`,
  `left-[42%] top-[97%] ${MD} rotate-[16deg] [animation-delay:0.4s]`,
];

const SIDE_SM = "size-[3cqmin]";
const SIDE_MD = "size-[3.8cqmin]";
const SIDE_LG = "size-[5cqmin]";

/*
 * Glass and words side by side (`@3xl`): the glass at the right of the first
 * 46%, `--glass-h` tall, the words from about 52% across and 38% to 78% down.
 * The first five spread over the room left of the glass, however wide it is;
 * one sits in the glass's own corner, clear of the bow tie.
 */
const SIDE_STARS = [
  `left-[calc((46cqw_-_var(--glass-h)*0.69)*0.3)] top-[10%] ${SIDE_MD} rotate-[8deg]`,
  `left-[calc((46cqw_-_var(--glass-h)*0.69)*0.4)] top-[50%] ${SIDE_LG} rotate-[16deg] [animation-delay:2.8s]`,
  `left-[calc((46cqw_-_var(--glass-h)*0.69)*0.8)] top-[69%] ${SIDE_SM} -rotate-[6deg] [animation-delay:0.9s]`,
  `left-[calc((46cqw_-_var(--glass-h)*0.69)*0.25)] top-[86%] ${SIDE_MD} rotate-[12deg] [animation-delay:2.1s]`,
  `left-[calc(46cqw_-_var(--glass-h)*0.62)] top-[72%] ${SIDE_SM} rotate-[4deg] [animation-delay:1.6s]`,
  `left-[53%] top-[25%] ${SIDE_MD} -rotate-[10deg] [animation-delay:0.4s]`,
  `left-[76%] top-[22%] ${SIDE_MD} -rotate-[12deg] [animation-delay:1.2s]`,
  `left-[90%] top-[10%] ${SIDE_LG} rotate-[10deg] [animation-delay:3.2s]`,
  `left-[97%] top-[38%] ${SIDE_SM} -rotate-[4deg] [animation-delay:0.6s]`,
  `left-[97%] top-[66%] ${SIDE_MD} rotate-[14deg] [animation-delay:1.9s]`,
  `left-[60%] top-[86%] ${SIDE_LG} -rotate-[8deg] [animation-delay:2.6s]`,
  `left-[87%] top-[83%] ${SIDE_MD} -rotate-[16deg] [animation-delay:1.5s]`,
];

/*
 * Side by side on a cover taller than wide (a tablet held upright): the
 * glass is held back by the width, so the bands above and below it and the
 * words get a few more.
 */
const TALL_STARS = [
  `left-[28%] top-[20%] ${SIDE_MD} rotate-[14deg] [animation-delay:2s]`,
  `left-[70%] top-[34%] ${SIDE_MD} -rotate-[10deg] [animation-delay:0.3s]`,
  `left-[32%] top-[80%] ${SIDE_LG} rotate-[6deg] [animation-delay:3.1s]`,
];

/*
 * Past the glass and words' column, in the cover's side margins, once they
 * are 100px or more (a cover 2000px wide): spread across each margin's
 * width.
 */
const MARGIN_STARS = [
  `left-[calc((100cqw_-_1800px)/2*0.4)] top-[18%] ${SIDE_MD} rotate-[12deg] [animation-delay:0.8s]`,
  `left-[calc((100cqw_-_1800px)/2*0.65)] top-[52%] ${SIDE_MD} -rotate-[8deg] [animation-delay:2.2s]`,
  `left-[calc((100cqw_-_1800px)/2*0.3)] top-[81%] ${SIDE_LG} rotate-[4deg] [animation-delay:3.4s]`,
  `left-[calc(100cqw_-_(100cqw_-_1800px)/2*0.5)] top-[40%] ${SIDE_MD} -rotate-[16deg] [animation-delay:1.3s]`,
  `left-[calc(100cqw_-_(100cqw_-_1800px)/2*0.35)] top-[78%] ${SIDE_MD} rotate-[18deg] [animation-delay:2.9s]`,
];

/**
 * The stars scattered over the cover, behind the glass and the words: in the
 * glass and words' own box (`--glass-h` set on it), or with `margins` in the
 * whole cover's, for the margins past it.
 */
export function CoverStars({ margins = false }: { margins?: boolean }) {
  const stars = margins
    ? MARGIN_STARS.map((place) => `hidden @min-[2000px]:block ${place}`)
    : [
        ...STACKED_STARS.map((place) => `@3xl:hidden ${place}`),
        ...SIDE_STARS.map((place) => `hidden @3xl:block ${place}`),
        ...TALL_STARS.map(
          (place) => `hidden @3xl:[@container(aspect-ratio<=1)]:block ${place}`,
        ),
      ];
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${COLORS}`}
    >
      {stars.map((place, index) => (
        <svg
          key={place}
          viewBox="-10 -10 20 20"
          className={`absolute -translate-1/2 overflow-visible ${STAR_TWINKLE} ${place}`}
        >
          <path
            d={STARS[index % STARS.length]}
            className="fill-(--coupe-star)"
          />
        </svg>
      ))}
    </div>
  );
}

/**
 * A champagne coupe after a mid-century party card: a wide, shallow bowl,
 * the drink in its lower part, a bow tie on the stem, bubbles rising above
 * and three stars beside it, drawn a little off true like the card: the
 * rim and the drink's line tilt, the bowl is fuller on the left, the stem
 * leans, the drink sits deeper on the right, the foot's dome is lopsided and
 * the bow tie's left wing is the bigger. The bubbles rise, the stars twinkle and the
 * fizz shimmers for a while (`PAUSE`), unless the guest asks for less motion.
 */
export function Coupe({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 -10 200 290"
      className={`overflow-visible ${COLORS} ${className}`}
    >
      {BUBBLES.map(({ cx, cy, r, delay }) => (
        <circle
          key={cx}
          cx={cx}
          cy={cy}
          r={r}
          className={`fill-(--coupe-bubble) motion-safe:animate-rise ${PAUSE} ${delay}`}
        />
      ))}
      {GLASS_STARS.map(({ at, delay }, index) => (
        <g key={at} transform={at}>
          <path
            d={STARS[(index + 1) % STARS.length]}
            className={`fill-(--coupe-star) ${TWINKLE} ${delay}`}
          />
        </g>
      ))}
      <path
        d="M13.3 62.7 L186.7 60.6 C184.7 101.9 148.8 123.3 101.4 124 C51.9 124.7 15.3 106.1 13.3 62.7 Z"
        className="fill-(--coupe-glass)"
      />
      <path
        d="M26.3 81.4 L173.7 78.6 C168 104.5 143 116.8 107 117.2 C63 117.6 33.6 107.4 26.3 81.4 Z"
        className="fill-(--coupe-drink)"
      />
      {FIZZ.map(({ cx, cy, r, delay }) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={r}
          className={`fill-(--m-accent) motion-safe:animate-fizz ${PAUSE} ${delay}`}
        />
      ))}
      <path
        d="M95.7 122 H104.3 L103 254 H98 Z"
        className="fill-(--coupe-glass)"
      />
      <path
        d="M54 266 C66 259.5 83 253.5 104 253.5 C121 253.5 140 259 147 266 Z"
        className="fill-(--coupe-glass)"
      />
      {/* The bow tie, tilted a little round its knot. */}
      <g transform="rotate(-8 100 162)">
        <path
          d="M100 162 L63.9 145.9 C59.2 157.3 59.9 169.4 65.9 180.1 Z M100 162 L131.9 150.1 C135.2 158 135.2 166.6 130.6 175.2 Z"
          className="fill-(--coupe-tie)"
        />
        <circle cx="100" cy="162" r="7.5" className="fill-(--coupe-knot)" />
      </g>
    </svg>
  );
}
