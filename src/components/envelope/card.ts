import { DRAWING } from "./drawing.generated";
import { clamp01, cubic, easeInOut, LIFTED, SLIDE_MS } from "./motion";

/*
 * A simple invitation's card coming out of the envelope, once the flap is
 * open. In the pocket it lies landscape, CARD_SIDE in from the body's sides
 * and CARD_TOP below the fold, turned -90° (its top to the left); what hangs
 * below the body is cut off. Two ways out, to compare:
 *
 * - `rise`: it slides up by CARD_RISE (drawing units) until it clears the
 *   pocket, the envelope sinking just enough to keep it on the stage. Then it
 *   moves over the envelope, turns upright and grows to the page card's size,
 *   centred, while the envelope shrinks and fades.
 * - `slide`: the card grows on one curve, from the pocket to the page card's
 *   size, rising toward the centre on the way (a little higher, then back);
 *   the envelope grows with it while it holds the card, then stops (eased)
 *   as the card clears, and slides down and off the stage all along. Once
 *   clear, the card turns upright.
 *
 * Last, either way, the reply panel slides in and the card moves to where the
 * page draws it. A shadow of its own (the page's colour and blur, no offset)
 * comes in as it starts out of the pocket and gives way to the page's as it
 * settles; none, without the template's own. Both start from the lifted pose (`LIFTED.body`), and move the
 * envelope on top of it.
 */
export type CardOpening = "rise" | "slide";
export const CARD_OPENINGS: CardOpening[] = ["rise", "slide"];

/** `rise`: out of the pocket (ms). */
const RISE_MS = 900;
/** Upright and to its size. */
const TURN_MS = 1000;
/** The card's shadow coming in, as it starts out of the pocket. */
const SHADE_MS = 300;
/** The way-out shadow's strength; it gives way to the page's as the card settles. */
const SHADE_OUT = 0.6;
/** The reply panel sliding in, the card moving beside it. */
export const PANEL_MS = 800;
/** The panel's slide, the same curve as its own open and close. */
export const PANEL_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

/** In the pocket: the gap to the body's sides, and to the fold (drawing units). */
export const CARD_SIDE = 3;
export const CARD_TOP = 2;
const CARD_RISE = 65;
/** `rise`: the room kept above the card's top while it rises, in px. */
const TOP_ROOM = 12;
/** `slide`: the card's whole way, from the pocket to the centre at its size (ms). */
const OUT_MS = 1700;
/** `slide`: the extra lift on the card's way out, at its highest (drawing units). */
const OUT_LIFT = 14;
/** How gently the envelope stops growing, as a share of its growth (`softCap`). */
const KNEE = 0.25;
/** `slide`: how far past the stage's bottom the envelope ends, in px. */
export const SLIDE_PAST = 24;
/* `rise`: the envelope shrinks to SHRINK_TO of its size by SHRINK_END of the turn, and fades from FADE_FROM to FADE_END. */
const SHRINK_TO = 0.6;
const SHRINK_END = 0.8;
const FADE_FROM = 0.25;
const FADE_END = 0.8;

const RISE_EASE = cubic(0.45, 0, 0.25, 1);
const TURN_EASE = cubic(0.45, 0, 0.2, 1);
/* Heading for the centre a little ahead of the turn, so the corners stay on the stage. */
export const MOVE_EASE = cubic(0.3, 0, 0.2, 1);
export const PANEL_EASE = cubic(0.22, 1, 0.36, 1);
export const GROW_EASE = cubic(0.3, 0, 0.2, 1);
export const SLIDE_EASE = cubic(0.35, 0, 0.7, 1);

const { vb, fold, body } = DRAWING;

/** A card's place: its centre, turn and scale. */
interface Place {
  x: number;
  y: number;
  a: number;
  s: number;
}

/** Where the card is at each step, in px: in the pocket from the envelope's box, the rest from the stage's. */
export interface CardPlaces {
  opening: CardOpening;
  width: number;
  height: number;
  inside: Place;
  rise: number;
  sink: number;
  /** The envelope's box in the stage. */
  offX: number;
  offY: number;
  /** The point the envelope's layers grow from, in the stage. */
  originX: number;
  originY: number;
  /** The lift's rise, in px. */
  liftY: number;
  /** The fold, from the envelope's top. */
  foldY: number;
  /** `slide`: the envelope's growth (the card's, when it clears), its slide, and when the card is clear of the pocket. */
  grow: number;
  slide: number;
  clear: number;
  /** The template has no card shadow: the card's goes once it is beside the panel. */
  shadowless: boolean;
  /** When the panel starts, and the whole way out. */
  panelAt: number;
  total: number;
  /** Upright over the envelope, the page card's size. */
  centre: Place;
  /** The page's own card. */
  page: Place;
}

/** One frame: the card's transform, which copy shows it, and what the envelope does. */
export interface CardFrame {
  inPocket: boolean;
  card: string;
  /** The card's shadows, 0 to 1: the page's, and its own on the way out. */
  shadow: { page: number; out: number };
  /** Its growth and how far that has come, 0 to 1 (`castShadows`). */
  envelope: { transform: string; opacity: number; grow: number; held: number };
}

export const mix = (a: number, b: number, x: number) => a + (b - a) * x;

export function cardPlaces(
  opening: CardOpening,
  stage: DOMRect,
  env: DOMRect,
  page: DOMRect,
  width: number,
  height: number,
  shadowless: boolean,
): CardPlaces {
  const k = env.width / vb.w;
  const wide = body.x1 - body.x0 - 2 * CARD_SIDE;
  const tall = (wide * width) / height;
  const offX = env.left - stage.left;
  const offY = env.top - stage.top;
  const s = page.width / width;
  const lift = LIFTED.body.s;
  const liftY = LIFTED.body.y * env.height;
  const inside = {
    x: ((body.x0 + body.x1) / 2 - vb.x) * k,
    y: (fold + CARD_TOP + tall / 2 - vb.y) * k,
    a: -90,
    s: (wide * k) / height,
  };
  const originY = offY + ((body.y0 + body.y1) / 2 - vb.y) * k;
  /* Lifted, as drawn on the stage: a point `y` from the envelope's top. */
  const lifted = (y: number) => originY + lift * (offY + y - originY) + liftY;
  const top = lifted((fold + CARD_TOP - CARD_RISE - vb.y) * k);
  const places: CardPlaces = {
    opening,
    width,
    height,
    inside,
    rise: CARD_RISE * k,
    sink: Math.max(0, TOP_ROOM - top),
    offX,
    offY,
    originX: offX + env.width / 2,
    originY,
    liftY,
    foldY: (fold - vb.y) * k,
    grow: 1,
    slide: 0,
    clear: SLIDE_MS,
    shadowless,
    panelAt: 0,
    total: 0,
    centre: { x: offX + env.width / 2, y: offY + env.height / 2, a: 0, s },
    page: {
      x: page.left - stage.left + page.width / 2,
      y: page.top - stage.top + page.height / 2,
      a: 0,
      s,
    },
  };
  if (opening === "slide") {
    /*
     * The envelope grows until the card clears, and when the card clears
     * depends on that growth and on the slide it sets: a few rounds settle all three.
     */
    for (let round = 0; round < 6; round++) {
      const grow = places.grow;
      places.slide =
        stage.height -
        (originY + grow * lift * (offY - originY) + grow * liftY) +
        SLIDE_PAST;
      places.clear = clearAt(places);
      places.grow = outCard(places, places.clear).s / (inside.s * lift);
    }
    places.panelAt = Math.max(SLIDE_MS, places.clear + TURN_MS, OUT_MS);
  } else places.panelAt = RISE_MS + TURN_MS;
  places.total = places.panelAt + PANEL_MS;
  return places;
}

/** `slide`: the first moment the fold has passed the card's lower edge. */
function clearAt(p: CardPlaces) {
  const lift = LIFTED.body.s;
  for (let t = 0; t <= OUT_MS; t += 10) {
    const { g, dy } = slideAt(p, t);
    const foldNow =
      p.originY + g * (lift * (p.offY + p.foldY - p.originY) + p.liftY) + dy;
    const card = outCard(p, t);
    if (foldNow >= card.y + (p.width * card.s) / 2) return t;
  }
  return OUT_MS;
}

function transform(p: CardPlaces, { x, y, a, s }: Place) {
  return `translate(${x}px, ${y}px) rotate(${a}deg) scale(${s}) translate(${-p.width / 2}px, ${-p.height / 2}px)`;
}

/** The card at `t` ms after the flap has settled. */
export function cardFrame(p: CardPlaces, t: number): CardFrame {
  const frame = p.opening === "slide" ? slideFrame(p, t) : riseFrame(p, t);
  return { ...frame, shadow: cardShadow(p, t) };
}

/** The card's shadows at `t`: its own, in as it starts out of the pocket; beside the panel, the page's (none without the template's own). */
function cardShadow(p: CardPlaces, t: number) {
  const shown = SHADE_OUT * easeInOut(clamp01(t / SHADE_MS));
  const settle = PANEL_EASE(clamp01((t - p.panelAt) / PANEL_MS));
  return { out: shown * (1 - settle), page: p.shadowless ? 0 : settle };
}

/** The card beside the panel as it slides in, from the centre to the page's card. */
function besidePanel(p: CardPlaces, t: number): Place | null {
  const k = PANEL_EASE(clamp01((t - p.panelAt) / PANEL_MS));
  return k > 0
    ? {
        x: mix(p.centre.x, p.page.x, k),
        y: mix(p.centre.y, p.page.y, k),
        a: 0,
        s: p.page.s,
      }
    : null;
}

function riseFrame(p: CardPlaces, t: number): Omit<CardFrame, "shadow"> {
  const r = RISE_EASE(clamp01(t / RISE_MS));
  const sink = p.sink * r;
  const out = { ...p.inside, y: p.inside.y - p.rise * r };
  if (t < RISE_MS)
    return {
      inPocket: true,
      card: transform(p, out),
      envelope: {
        transform: `translateY(${sink}px)`,
        opacity: 1,
        grow: 1,
        held: 0,
      },
    };
  const at = clamp01((t - RISE_MS) / TURN_MS);
  const turn = TURN_EASE(at);
  const move = MOVE_EASE(at);
  const from = {
    ...out,
    x: out.x + p.offX,
    y:
      p.originY + LIFTED.body.s * (out.y + p.offY - p.originY) + p.liftY + sink,
    s: out.s * LIFTED.body.s,
  };
  const upright = {
    x: mix(from.x, p.centre.x, move),
    y: mix(from.y, p.centre.y, move),
    a: mix(from.a, 0, turn),
    s: mix(from.s, p.centre.s, turn),
  };
  const shrink = mix(1, SHRINK_TO, easeInOut(clamp01(at / SHRINK_END)));
  const fade = clamp01((at - FADE_FROM) / (FADE_END - FADE_FROM));
  return {
    inPocket: false,
    card: transform(p, besidePanel(p, t) ?? upright),
    envelope: {
      transform: `translateY(${sink}px) scale(${shrink})`,
      opacity: 1 - easeInOut(fade),
      grow: 1,
      held: 0,
    },
  };
}

/** `slide`: the card on the stage at `t`, still lying as in the pocket. */
function outCard(p: CardPlaces, t: number): Place {
  const lift = LIFTED.body.s;
  const u = clamp01(t / OUT_MS);
  const move = MOVE_EASE(u);
  const k = p.rise / CARD_RISE;
  const x = p.offX + p.inside.x;
  const y = p.originY + lift * (p.offY + p.inside.y - p.originY) + p.liftY;
  return {
    x: mix(x, p.centre.x, move),
    y: mix(y, p.centre.y, move) - OUT_LIFT * k * Math.sin(Math.PI * move),
    a: -90,
    s: mix(p.inside.s * lift, p.centre.s, GROW_EASE(u)),
  };
}

/**
 * `slide`: the envelope's growth and how far down it is at `t`. It grows as
 * the card does, then eases to a stop at `grow`, never past the card.
 */
function slideAt(p: CardPlaces, t: number) {
  const g = softCap(outCard(p, t).s / (p.inside.s * LIFTED.body.s), p.grow);
  return { g, dy: p.slide * SLIDE_EASE(clamp01(t / SLIDE_MS)) };
}

/**
 * The envelope's growth while it follows the card's (or page's) growth `a`:
 * the same, then easing to a stop at `top`, never past `a`.
 */
export function softCap(a: number, top: number) {
  const w = Math.max(KNEE * (top - 1), 1e-6);
  const cap = top + w / 4;
  return a <= cap - w
    ? a
    : a >= cap + w
      ? cap
      : a - (a - cap + w) ** 2 / (4 * w);
}

/*
 * After a hover and a click, as the envelope grows (`held`: how far its
 * growth has come, 0 to 1): every shadow grows with it and fades to
 * SHADOW_OPACITY of its own, and all but the tag's hard one blur more (a
 * multiple of their own; the envelope's hard one and the tag's soft one by
 * MORE_BLUR). A tap's lift already runs over the growth, so it keeps them.
 */
const CAST_BLUR = 2;
const MORE_BLUR = 2;
const SHADOW_OPACITY = 0.5;
export function castShadows(held: number) {
  return {
    tight: 1,
    blur: 1 + (CAST_BLUR - 1) * held,
    moreBlur: 1 + (MORE_BLUR - 1) * held,
    opacity: 1 - (1 - SHADOW_OPACITY) * held,
  };
}

function slideFrame(p: CardPlaces, t: number): Omit<CardFrame, "shadow"> {
  const { g, dy } = slideAt(p, t);
  const envelope = {
    transform: `translateY(${dy}px) scale(${g})`,
    opacity: 1,
    grow: g,
    held: clamp01((g - 1) / Math.max(p.grow - 1, 1e-6)),
  };
  const card = outCard(p, t);
  /* In the pocket the card rides the envelope's layer: undo its growth and slide. */
  if (t < p.clear) {
    const lift = LIFTED.body.s;
    return {
      inPocket: true,
      card: transform(p, {
        x: p.originX + (card.x - p.originX) / (g * lift) - p.offX,
        y:
          p.originY + ((card.y - dy - p.originY) / g - p.liftY) / lift - p.offY,
        a: -90,
        s: card.s / (g * lift),
      }),
      envelope,
    };
  }
  const turn = TURN_EASE(clamp01((t - p.clear) / TURN_MS));
  return {
    inPocket: false,
    card: transform(p, besidePanel(p, t) ?? { ...card, a: mix(-90, 0, turn) }),
    envelope,
  };
}
