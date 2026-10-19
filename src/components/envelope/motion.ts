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

/** The flap's shadow on the pocket blurs to this many times its own as the flap lifts. */
const FLAP_BLUR = 4;
/* The flap's lift to 90°, done at LIFT_END of its turn, on this curve. */
const LIFT_END = 0.42;
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

/** One part's opacity (and its blurs) through the flap's turn, `at` its progress (0 to 1) at time t. */
export interface Fade {
  el: SVGElement;
  from: number;
  to: number;
  at: (t: number) => number;
  ease: (x: number) => number;
  blurs: Blur[];
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

/*
 * Closed-only shading leaves while the flap lifts and open-only shading
 * arrives as it lands; each closed / open pair cross-fades together, so the
 * shading never goes missing. The inside's top comes in once the flap is up
 * a little. The flap's own shadow spreads and fades with its angle.
 */
export function openingFades(root: Element): Fade[] {
  const all = (selector: string) =>
    Array.from(root.querySelectorAll<SVGElement>(selector));
  const timed = (
    selector: string,
    from: number,
    to: number,
    delay: number,
    length: number,
    ease = easeInOut,
  ): Fade[] =>
    all(selector).map((el) => ({
      el,
      from,
      to,
      at: (t) => clamp01((t - delay * FLAP_MS) / (length * FLAP_MS)),
      ease,
      blurs: [],
    }));
  return [
    ...all(".env-flap-shadow").map((el) => ({
      el,
      from: 1,
      to: 0,
      at: (t: number) => liftDeg(t / FLAP_MS) / 90,
      ease: (x: number) => x,
      blurs: blursIn(el),
    })),
    ...timed(
      ".env-pocket .env-v-closed:not(.env-flap-shadow)",
      1,
      0,
      0.15,
      0.6,
    ),
    ...timed(".env-pocket .env-v-open", 0, 1, 0.15, 0.6),
    /* The inside's top strip: hidden while the flap lies nearly flat. */
    ...all(".env-inside-edge").map((el) => ({
      el,
      from: 1,
      to: 0,
      at: (t: number) =>
        clamp01(
          (liftDeg(t / FLAP_MS) - INSIDE_EDGE_DEG[0]) / INSIDE_EDGE_DEG[1],
        ),
      ease: (x: number) => x,
      blurs: [],
    })),
    ...timed(".env-cast .env-v-closed", 1, 0, 0.35, 0.55, castOut),
    ...timed(".env-cast .env-v-open", 0, 1, 0.35, 0.55),
  ];
}

export function setFades(fades: Fade[], t: number) {
  for (const fade of fades) {
    const x = fade.at(t);
    fade.el.style.opacity = String(
      fade.from + (fade.to - fade.from) * fade.ease(x),
    );
    for (const blur of fade.blurs)
      blur.node.setAttribute(
        "stdDeviation",
        String(blur.base * (1 + (FLAP_BLUR - 1) * x)),
      );
  }
}

export function clearFades(fades: Fade[]) {
  for (const fade of fades) {
    fade.el.style.opacity = "";
    for (const blur of fade.blurs)
      blur.node.setAttribute("stdDeviation", String(blur.base));
  }
}
