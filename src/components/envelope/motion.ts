/** The flap's turn, 0° → 180° with a small bounce (ms). */
export const FLAP_MS = 1300;
/** Open and still for a moment before it fades. */
export const SETTLE_MS = 150;
/** The open envelope fading into the page. */
export const FADE_MS = 600;
/** The envelope sliding down and off the stage (modular, and the simple card's `slide`). */
export const SLIDE_MS = 1400;
/** With reduced motion: the closed envelope fades straight out. */
export const REDUCED_FADE_MS = 300;

/* The flap's lift to 90°, done at LIFT_END of its turn, on this curve. */
export const LIFT_END = 0.42;
const LIFT = [0.42, 0, 0.62, 0.32] as const;

/**
 * The lifted pose: hovered with a mouse, and from the click on (a tap eases
 * into it as the opening starts). Each part rises by `y` of the envelope's
 * height and grows by `s` around the body's centre: the cast shadow grows
 * more and rises less, so more of it shows below; the tag's shadow rises less
 * (and blurs, in the CSS). The CSS reads them as `--env-lift-*`.
 */
export const LIFTED = {
  body: { y: -0.03, s: 1.04 },
  cast: { y: -0.02, s: 1.055 },
  tagShade: { y: -0.02, s: 1.04 },
} as const;

export const LIFTED_VARS = Object.fromEntries(
  Object.entries(LIFTED).flatMap(([part, { y, s }]) => [
    [`--env-lift-${part}-y`, `${y * 100}%`],
    [`--env-lift-${part}-s`, String(s)],
  ]),
);

/**
 * On hover the tag drops, turning around its hole, and turns back on leave.
 * As the envelope slides down and off the stage (modular, and the simple
 * card's `slide`), it turns back a little past where it was drawn.
 */
export const SWING = {
  enter: { duration: 550, to: -25, easing: "cubic-bezier(.3,1.25,.55,1)" },
  leave: { duration: 450, to: 0, easing: "cubic-bezier(.35,0,.25,1)" },
  slide: { duration: SLIDE_MS, to: 8, easing: "linear" },
} as const;

export const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The flap's turn as keyframes; perspective a little over twice the envelope's width. */
export function flapFrames(width: number): Keyframe[] {
  const turn = (deg: number) =>
    `perspective(${width * 2.2}px) rotateX(${deg}deg)`;
  return [
    { transform: turn(0), easing: `cubic-bezier(${LIFT.join(",")})` },
    {
      transform: turn(90),
      offset: LIFT_END,
      easing: "cubic-bezier(.2,.5,.35,1)",
    },
    { transform: turn(180), offset: 0.84, easing: "cubic-bezier(.3,0,.6,1)" },
    { transform: turn(173), offset: 0.92, easing: "cubic-bezier(.4,0,.6,1)" },
    { transform: turn(180) },
  ];
}

const bez = (a: number, b: number, s: number) =>
  3 * a * s * (1 - s) ** 2 + 3 * b * s * s * (1 - s) + s ** 3;

/** A CSS `cubic-bezier` as a function of progress (0 to 1), for frame-by-frame motion. */
export function cubic(x1: number, y1: number, x2: number, y2: number) {
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 30; i++) {
      const s = (lo + hi) / 2;
      if (bez(x1, x2, s) < x) lo = s;
      else hi = s;
    }
    return bez(y1, y2, lo);
  };
}

/** The flap's angle at a point of its turn (0 to 1), up to 90°. */
function liftDeg(at: number): number {
  if (at <= 0) return 0;
  if (at >= LIFT_END) return 90;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 30; i++) {
    const s = (lo + hi) / 2;
    if (bez(LIFT[0], LIFT[2], s) * LIFT_END < at) lo = s;
    else hi = s;
  }
  return bez(LIFT[1], LIFT[3], lo) * 90;
}

/** The flap's angle where the inside's top strip starts to come in, and over how many degrees. */
const INSIDE_EDGE_DEG = [55, 35];

/** The cast's hard shadow's strength as drawn (its opacity). */
const CAST_ALPHA = 0.5;

/*
 * The closed cast shadow's way out, under the open one's easeInOut: drawn
 * over each other, two half-faded shadows are lighter than one, so the
 * closed one stays a little stronger and the hard shadow keeps its strength.
 */
function castOut(x: number) {
  const open = easeInOut(x);
  return 1 - (1 - (1 - CAST_ALPHA) / (1 - CAST_ALPHA * open)) / CAST_ALPHA;
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const easeInOut = (x: number) =>
  x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;

export interface Blur {
  node: Element;
  base: number;
}

/* Each shape's own feGaussianBlur, its region widened once so the grown blur isn't cut off. */
export function blursIn(el: Element): Blur[] {
  return Array.from(el.querySelectorAll("[style*='filter:url(#']")).flatMap(
    (shape) => {
      const id = /filter:url\(#([^)]+)\)/.exec(
        shape.getAttribute("style") ?? "",
      )?.[1];
      const filter = id ? document.getElementById(id) : null;
      const node = filter?.querySelector("feGaussianBlur");
      if (!filter || !node) return [];
      const base = Number(node.getAttribute("stdDeviation"));
      filter.setAttribute("x", "-1");
      filter.setAttribute("y", "-1");
      filter.setAttribute("width", "3");
      filter.setAttribute("height", "3");
      return [{ node, base }];
    },
  );
}

/** Keyframes per fade: enough that straight steps between them follow its curve. */
const FADE_STEPS = 48;

/*
 * Closed-only shading leaves while the flap lifts and open-only shading
 * arrives as it lands: the open pocket fades in over the closed one, and the
 * cast's closed and open shadows cross-fade. The inside's top comes in once
 * the flap is up a little. The flap's own shadow spreads and fades with its
 * angle: a copy blurred more (`flapSpread`) fades in as it fades out.
 *
 * Each is a layer of its own, faded by its opacity in an animation the
 * graphics chip runs: a part changed inside a layer every frame redraws the
 * whole layer every frame, slow on a phone. Each curve, `at` its progress (0
 * to 1) at time t, is sampled into keyframes over the flap's turn.
 */
export function openingFades(root: Element): Animation[] {
  const fade = (
    selector: string,
    from: number,
    to: number,
    at: (t: number) => number,
    ease: (x: number) => number,
  ): Animation[] => {
    const frames = Array.from({ length: FADE_STEPS + 1 }, (_, i) => {
      const offset = i / FADE_STEPS;
      return {
        offset,
        opacity: from + (to - from) * ease(at(offset * FLAP_MS)),
      };
    });
    return Array.from(root.querySelectorAll(selector)).map((el) =>
      el.animate(frames, { duration: FLAP_MS, fill: "both" }),
    );
  };
  const timed = (delay: number, length: number) => (t: number) =>
    clamp01((t - delay * FLAP_MS) / (length * FLAP_MS));
  const lifted = (t: number) => liftDeg(t / FLAP_MS) / 90;
  /* The inside's top strip: in once the flap is up a little. */
  const edge = (t: number) =>
    clamp01((liftDeg(t / FLAP_MS) - INSIDE_EDGE_DEG[0]) / INSIDE_EDGE_DEG[1]);
  const linear = (x: number) => x;
  return [
    /* Together (1 - x) of the shadow, x of it spread, as the flap goes from flat (x = 0) to upright (1). */
    ...fade(
      ".env-flap-shadow:not(.env-flap-spread)",
      1,
      0,
      lifted,
      (x) => 1 - (1 - x) ** 2,
    ),
    ...fade(".env-flap-spread", 0, 1, lifted, (x) => x * (1 - x)),
    ...fade(".env-pocket.env-v-open", 0, 1, timed(0.15, 0.6), easeInOut),
    ...fade(".env-inside-edge", 0, 1, edge, linear),
    /* The lining under the fold's seam: in as the flap's back face takes over. */
    ...fade(".env-back-seam", 0, 1, timed(LIFT_END, 0.04), easeInOut),
    ...fade(".env-cast-closed", 1, 0, timed(0.35, 0.55), castOut),
    ...fade(".env-cast-open", 0, 1, timed(0.35, 0.55), easeInOut),
  ];
}

export function clearFades(fades: Animation[]) {
  for (const fade of fades) fade.cancel();
}
