import { PAUSE } from "./motion";

/*
 * Every colour of the drawing is mixed from the palette, so any palette gets
 * a cake that matches it: the sponge a light tertiary, the icing the
 * secondary, the candles a light accent striped in the accent, the flames
 * the tertiary. The outline is the page's surface, as if cut out of it, and
 * the shadow is the floor (the accent) darkened.
 */
const COLORS =
  "[--cake-sponge:color-mix(in_oklab,var(--m-tertiary),white_62%)] [--cake-sponge-base:color-mix(in_oklab,var(--m-tertiary),white_35%)] [--cake-candle:color-mix(in_oklab,var(--m-accent),white_70%)] [--cake-shadow:color-mix(in_oklab,var(--m-accent),black_22%)]";

/*
 * The drawing's proportions, for the layout that places it, each a share
 * of the drawing's height (its box holds the whole drawing, so its width
 * follows): the cake's own width, outline included (`body`); from the
 * cake's base up to its highest flame (`rise`); and from the base down to
 * the drawing's bottom, the shadow's lower edge (`foot`); and how wide the
 * sticker edge shows round it (`edge`, half its 12-unit stroke). Change the
 * drawing, change these.
 */
export const CAKE_SHAPE =
  "[--cake-body:0.705] [--cake-rise:0.899] [--cake-foot:0.057] [--cake-edge:0.026]";

/* The three tiers, top to bottom: the sponge, then its icing dripping down. */
const TIERS = [
  {
    x: 56,
    y: 72,
    width: 88,
    height: 44,
    icing:
      "M54 77Q54 70 60 70L140 70Q146 70 146 77L146 79C142.7 79 142 88 136.8 88C131.6 88 130.9 79 127.6 79C124.3 79 123.6 83 118.4 83C113.2 83 112.5 79 109.2 79C105.9 79 105.2 92 100 92C94.8 92 94.1 79 90.8 79C87.5 79 86.8 84 81.6 84C76.4 84 75.7 79 72.4 79C69.1 79 68.4 89 63.2 89C58 89 57.3 79 54 79Z",
  },
  {
    x: 42,
    y: 116,
    width: 116,
    height: 48,
    icing:
      "M40 121Q40 114 46 114L154 114Q160 114 160 121L160 123C156.4 123 155.6 134 150 134C144.4 134 143.6 123 140 123C136.4 123 135.6 128 130 128C124.4 128 123.6 123 120 123C116.4 123 115.6 138 110 138C104.4 138 103.6 123 100 123C96.4 123 95.6 127 90 127C84.4 127 83.6 123 80 123C76.4 123 75.6 132 70 132C64.4 132 63.6 123 60 123C56.4 123 55.6 129 50 129C44.4 129 43.6 123 40 123Z",
  },
  {
    x: 28,
    y: 164,
    width: 144,
    height: 58,
    icing:
      "M26 169Q26 162 32 162L168 162Q174 162 174 169L174 171C170.2 171 169.3 178 163.4 178C157.5 178 156.7 171 152.9 171C149.1 171 148.2 186 142.3 186C136.4 186 135.5 171 131.7 171C127.9 171 127.1 176 121.1 176C115.2 176 114.4 171 110.6 171C106.8 171 105.9 183 100 183C94.1 183 93.2 171 89.4 171C85.6 171 84.8 175 78.9 175C72.9 175 72.1 171 68.3 171C64.5 171 63.6 185 57.7 185C51.8 185 50.9 171 47.1 171C43.3 171 42.5 179 36.6 179C30.7 179 29.8 171 26 171Z",
  },
];

/*
 * The three candles, not quite level, each with its stripes and flame. Each
 * flame flickers to its own beat (`flicker`: a delay and a length), so the
 * three never move together.
 */
const CANDLES = [
  {
    x: 84.75,
    y: 44,
    stripes:
      "M84.75 53L91.25 50V53L84.75 56ZM84.75 62L91.25 59V62L84.75 65ZM84.75 71L91.25 68V71L84.75 74Z",
    flame: "M88 28C93 35 93 41 88 42C83 41 84 34 88 28Z",
    flicker: "",
  },
  {
    x: 96.75,
    y: 40,
    stripes:
      "M96.75 49L103.25 46V49L96.75 52ZM96.75 58L103.25 55V58L96.75 61ZM96.75 67L103.25 64V67L96.75 70Z",
    flame: "M100 24C105 31 105 37 100 38C95 37 96 30 100 24Z",
    flicker:
      "motion-safe:[animation-delay:0.4s] motion-safe:[animation-duration:1.8s]",
  },
  {
    x: 108.75,
    y: 45,
    stripes:
      "M108.75 54L115.25 51V54L108.75 57ZM108.75 63L115.25 60V63L108.75 66ZM108.75 72L115.25 69V72L108.75 75Z",
    flame: "M112 29C117 36 117 42 112 43C107 42 108 35 112 29Z",
    flicker:
      "motion-safe:[animation-delay:0.9s] motion-safe:[animation-duration:1.3s]",
  },
];

/*
 * A flame's flicker, round its base, paused like the rest (`PAUSE`). Its
 * sticker edge flickers with it, so no edge is left showing.
 */
const FLICKER = `[transform-box:fill-box] origin-bottom motion-safe:animate-flicker ${PAUSE}`;

/* The candles stand down to the top tier, hidden under its icing. */
const CANDLE_FOOT = 74;

/* Sprinkles on the tiers, each turned its own way: x, y, angle. */
const SPRINKLES = [
  [46.8, 200, -30],
  [67.9, 208, 20],
  [96.1, 202, 50],
  [122.5, 210, -10],
  [148.9, 203, 35],
  [60.9, 146, -45],
  [89, 152, 10],
  [115.4, 145, 60],
  [140.1, 151, -20],
  [78.5, 100, 25],
  [110.1, 104, -55],
  [127.7, 98, 15],
];

const SPRINKLE_FILLS = ["fill-(--m-accent)", "fill-(--m-secondary)"];

/**
 * The cake's shapes: with `outline`, all in the surface and drawn wider, the
 * sticker edge round the whole cake; else in their own colours.
 */
function Shapes({ outline }: { outline: boolean }) {
  const edge = outline
    ? "fill-(--m-surface) stroke-(--m-surface) stroke-12 [stroke-linejoin:round]"
    : "";
  return (
    <g className={edge}>
      {CANDLES.map(({ x, y, stripes, flame, flicker }) => (
        <g key={x}>
          <rect
            x={x}
            y={y}
            width="6.5"
            height={CANDLE_FOOT - y}
            rx="2"
            className={outline ? "" : "fill-(--cake-candle)"}
          />
          {outline ? null : <path d={stripes} className="fill-(--m-accent)" />}
          <path
            d={flame}
            className={`${outline ? "" : "fill-(--m-tertiary)"} ${FLICKER} ${flicker}`}
          />
        </g>
      ))}
      {TIERS.map(({ x, y, width, height, icing }) => (
        <g key={y}>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            rx="6"
            className={outline ? "" : "fill-(--cake-sponge)"}
          />
          {outline ? null : (
            <rect
              x={x}
              y={y + height - 7}
              width={width}
              height="7"
              rx="3"
              className="fill-(--cake-sponge-base)"
            />
          )}
          <path d={icing} className={outline ? "" : "fill-(--m-secondary)"} />
        </g>
      ))}
      {outline
        ? null
        : SPRINKLES.map(([x, y, angle], index) => (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="7"
              height="2.6"
              rx="1.3"
              transform={`rotate(${angle} ${x + 3.5} ${y + 1.3})`}
              className={SPRINKLE_FILLS[index % 3 === 1 ? 1 : 0]}
            />
          ))}
    </g>
  );
}

/**
 * A three-tier birthday cake after a party card: drippy icing on each tier,
 * sprinkles, three striped candles, a sticker edge in the surface, and its
 * shadow on the floor it stands on, wider than the cake. The box holds the
 * whole drawing, shadow included (`CAKE_SHAPE`).
 */
export function Cake({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="3 14 194 227"
      className={`overflow-visible ${COLORS} ${className}`}
    >
      <ellipse
        cx="100"
        cy="229"
        rx="97"
        ry="12"
        className="fill-(--cake-shadow)"
      />
      <Shapes outline />
      <Shapes outline={false} />
    </svg>
  );
}
