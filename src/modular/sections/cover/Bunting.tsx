"use client";

import { useEffect, useRef, useState } from "react";
import { PAUSE } from "./motion";

/*
 * The flags' colours in turn; tertiary and accent-soft are the light ones.
 * A flag over another always takes the other tone, so the two never merge.
 */
const ACCENT = "fill-(--m-accent)";
const TERTIARY = "fill-(--m-tertiary)";
const SECONDARY = "fill-(--m-secondary)";
const ACCENT_SOFT = "fill-(--m-accent-soft)";
const FLAGS = [
  ACCENT,
  TERTIARY,
  SECONDARY,
  ACCENT_SOFT,
  TERTIARY,
  ACCENT,
  SECONDARY,
];
const LIGHT = new Set([TERTIARY, ACCENT_SOFT]);

/*
 * The room one flag takes along its string (a step), by the cover's width:
 * 6.4% of it, 56px on a phone, growing to 110px on a wide screen.
 * Everything else is in steps, so the bunting keeps its shape.
 * The rule is the bunting's height, `--bunting-h` (`HEIGHT` steps), set on
 * the cover's box by `BUNTING_HEIGHT` so the cover can place the rest under
 * it; the layout reads the step back from the measured height.
 */
export const BUNTING_HEIGHT =
  "[--bunting-h:calc(clamp(56px,6.4cqw,110px)*1.88)]";

/* A flag's length down from its string, in steps. */
const FLAG_LENGTH = 0.67;

/*
 * The two strings, an X lying nearly flat, crossing a little left of the
 * middle (`CROSS`, a share of the width): each runs from one edge to a few
 * steps past the crossing (`past`), its low end's height and the sag below
 * it in steps, so the X looks the same at every width. The first rises from
 * low on the left, in front; the second falls to the right, behind, its
 * flags half a step along so they show between the first's. Each hangs and
 * sags its own way.
 */
const CROSS = 0.45;
const STRINGS = [
  { past: 1.9, low: 0.78, sag: 0.28, rises: true, turn: 0 },
  { past: 1.5, low: 0.8, sag: 0.36, rises: false, turn: 4 },
];

/*
 * A flag's sway (`sway`), a skew round its top edge, which stays on the
 * string while the tip swings; paused like the rest (`PAUSE`):
 * the delays step along the string, so a breeze runs down it; the string
 * behind sways slower than the one in front. The delays are 0.25s apart,
 * written whole for Tailwind to find.
 */
const SWAY = `[transform-box:fill-box] origin-top motion-safe:animate-sway ${PAUSE}`;
const BEHIND = "motion-safe:[animation-duration:4.4s]";
const WAVE = [
  "",
  "motion-safe:[animation-delay:0.25s]",
  "motion-safe:[animation-delay:0.5s]",
  "motion-safe:[animation-delay:0.75s]",
  "motion-safe:[animation-delay:1s]",
  "motion-safe:[animation-delay:1.25s]",
  "motion-safe:[animation-delay:1.5s]",
  "motion-safe:[animation-delay:1.75s]",
];

/*
 * The height the bunting takes, in steps: the lowest string, a flag, a
 * little air — 1.88, written out in `BUNTING_HEIGHT` for Tailwind to find.
 */
const HEIGHT =
  Math.max(...STRINGS.map(({ low, sag }) => low + sag)) + FLAG_LENGTH + 0.05;

/*
 * A flag in its own frame (`at`: moved to the middle of its top edge and
 * turned along the string), so that edge lies level at y 0 and the sway's
 * skew moves only the tip; `box` is where it lies on the cover.
 */
type Flag = { at: string; points: string; fill: string; box: number[] };

function round(value: number) {
  return Math.round(value * 10) / 10;
}

type Spec = (typeof STRINGS)[number];

/**
 * A string's curve for a box this wide, a step this long: its ends, its
 * control point and the point a share `t` along it.
 */
function curve(string: Spec, width: number, step: number) {
  const x0 = string.rises ? -0.02 * width : CROSS * width - string.past * step;
  const x1 = string.rises ? CROSS * width + string.past * step : 1.02 * width;
  const y0 = string.rises ? string.low * step : 0;
  const y1 = string.rises ? 0 : string.low * step;
  const cx = (x0 + x1) / 2;
  const cy = string.low * step + string.sag * step;
  const at = (t: number) => [
    (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1,
    (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1,
  ];
  const line = `M${round(x0)} ${round(y0)}Q${round(cx)} ${round(cy)} ${round(x1)} ${round(y1)}`;
  return { x0, x1, at, line };
}

/**
 * A flag hung from `a` to `b` on its string, `m` the string's point between
 * them: in its own frame (`at`, `points`), and where it lies (`box`).
 */
function flagShape([ax, ay]: number[], [bx, by]: number[], [mx, my]: number[]) {
  const length = Math.hypot(bx - ax, by - ay) * 1.05;
  const angle = Math.atan2(by - ay, bx - ax);
  const tx = mx - Math.sin(angle) * length;
  const ty = my + Math.cos(angle) * length;
  /* The tip in the flag's own frame: unturned, from the top edge's middle. */
  const [ox, oy] = [(ax + bx) / 2, (ay + by) / 2];
  const half = Math.hypot(bx - ax, by - ay) / 2;
  const [dx, dy] = [tx - ox, ty - oy];
  const tipX = dx * Math.cos(angle) + dy * Math.sin(angle);
  const tipY = dy * Math.cos(angle) - dx * Math.sin(angle);
  return {
    at: `translate(${round(ox)} ${round(oy)}) rotate(${round((angle * 180) / Math.PI)})`,
    points: [-half, 0, half, 0, tipX, tipY].map(round).join(" "),
    box: [
      Math.min(ax, bx, tx),
      Math.min(ay, by, ty),
      Math.max(ax, bx, tx),
      Math.max(ay, by, ty),
    ],
  };
}

/**
 * A front flag's colour: its turn's (`fill`), unless it lies over flags
 * behind; then the other tone, and never the colour beside it (`before`).
 */
function frontFill(
  fill: string,
  box: number[],
  behind: Flag[],
  before: string,
) {
  const under = behind.filter(
    (flag) =>
      flag.box[0] < box[2] &&
      flag.box[2] > box[0] &&
      flag.box[1] < box[3] &&
      flag.box[3] > box[1],
  );
  if (under.length === 0) return fill;
  const taken = (colour: string) =>
    colour === before || under.some((flag) => flag.fill === colour);
  const clash = (colour: string) =>
    under.some((flag) => LIGHT.has(flag.fill) === LIGHT.has(colour));
  return (
    FLAGS.find((colour) => !taken(colour) && !clash(colour)) ??
    FLAGS.find((colour) => !taken(colour)) ??
    fill
  );
}

/**
 * One string and its flags. The front one is laid out last, its colours
 * by the flags `behind`; the one behind adds its flags to them.
 */
function layString(
  string: Spec,
  front: boolean,
  width: number,
  step: number,
  behind: Flag[],
) {
  const { x0, x1, at, line } = curve(string, width, step);
  const count = Math.max(3, Math.round((x1 - x0) / step));
  const shift = front ? 0 : 0.5;
  const span = count + shift;
  const flags: Flag[] = [];
  let before = "";
  for (let i = 0; i < count; i++) {
    const shape = flagShape(
      at((i + 0.18 + shift) / span),
      at((i + 0.82 + shift) / span),
      at((i + 0.5 + shift) / span),
    );
    const turn = FLAGS[(i + string.turn) % FLAGS.length];
    const fill = front ? frontFill(turn, shape.box, behind, before) : turn;
    before = fill;
    const flag = { ...shape, fill };
    flags.push(flag);
    if (!front) behind.push(flag);
  }
  return { line, flags, front };
}

/** The strings and their flags for a box this wide and tall: the one behind first. */
function layout(width: number, height: number) {
  const step = height / HEIGHT;
  const behind: Flag[] = [];
  return [...STRINGS]
    .reverse()
    .map((string, index) =>
      layString(string, index === 1, width, step, behind),
    );
}

/**
 * Bunting across the cover's whole width: two strings of triangle flags
 * crossing a little left of the middle, laid out for the box: its height
 * (`--bunting-h`) sets the flags' size, its width the X's place. The box has its
 * height before it is measured, so nothing moves.
 */
export function Bunting() {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const watch = new ResizeObserver(([entry]) =>
      setSize({
        width: Math.round(entry.contentRect.width),
        height: Math.round(entry.contentRect.height),
      }),
    );
    watch.observe(element);
    return () => watch.disconnect();
  }, []);
  const { width, height } = size;

  return (
    <div
      ref={box}
      aria-hidden="true"
      className="relative h-(--bunting-h) w-full shrink-0"
    >
      {width > 0 ? (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          className="absolute inset-x-0 top-0 overflow-visible"
        >
          {layout(width, height).map(({ line, flags, front }) => (
            <g key={line}>
              <path
                d={line}
                className="fill-none stroke-(--m-ink-muted) stroke-[1.6]"
              />
              {flags.map(({ at, points, fill }, index) => (
                /* Turned by its group, swayed itself: a CSS transform would replace `at`. */
                <g key={at} transform={at}>
                  <polygon
                    points={points}
                    className={`${fill} ${SWAY} ${front ? "" : BEHIND} ${WAVE[index % WAVE.length]}`}
                  />
                </g>
              ))}
            </g>
          ))}
        </svg>
      ) : null}
    </div>
  );
}
