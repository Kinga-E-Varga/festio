/** The flap's turn, 0° → 180° with a small bounce (ms). */
export const FLAP_MS = 1300;
/** Open and still for a moment before it fades. */
export const SETTLE_MS = 150;
/** The open envelope fading into the page. */
export const FADE_MS = 600;
/** With reduced motion: the closed envelope fades straight out. */
export const REDUCED_FADE_MS = 300;

/** The flap's shadow on the pocket blurs to this many times its own as the flap lifts. */
const FLAP_BLUR = 4;
/* The flap's lift to 90°, done at LIFT_END of its turn, on this curve. */
const LIFT_END = 0.42;
const LIFT = [0.42, 0, 0.62, 0.32] as const;

/** On hover the tag drops, turning around its hole, and turns back on leave. */
export const SWING = {
  enter: { duration: 550, to: -25, easing: "cubic-bezier(.3,1.25,.55,1)" },
  leave: { duration: 450, to: 0, easing: "cubic-bezier(.35,0,.25,1)" },
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

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeInOut = (x: number) =>
  x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;

interface Blur {
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
function blursIn(el: Element): Blur[] {
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
 * shading never goes missing. The flap's own shadow spreads and fades with
 * its angle.
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
  ): Fade[] =>
    all(selector).map((el) => ({
      el,
      from,
      to,
      at: (t) => clamp01((t - delay * FLAP_MS) / (length * FLAP_MS)),
      ease: easeInOut,
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
    ...timed(".env-cast .env-v-closed", 1, 0, 0.35, 0.55),
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
