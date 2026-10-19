import { CARD_SIDE, CARD_TOP, mix, SLIDE_EASE, SLIDE_PAST } from "./card";
import { DRAWING } from "./drawing.generated";
import { clamp01, cubic, easeInOut, FLAP_MS, LIFTED, SLIDE_MS } from "./motion";

/*
 * A modular invitation's page coming out of the envelope, once the flap is
 * open. A copy of its sections, laid out at the column's real width, stands
 * upright in the pocket, scaled to CARD_SIDE in from the body's sides, its top
 * CARD_TOP below the fold, cut off below the envelope. In three steps, all
 * from the lifted pose: while the flap turns, the envelope grows a little, the strip with it (to
 * CAP of the way); then, at that size, the envelope slides down and off the
 * stage (SLIDE_MS) while the strip moves up out of the pocket to where the
 * page draws its sections, just under the header; once the envelope's body
 * has left the stage (only the open flap still shows, behind the strip),
 * the strip grows to full size from its top centre (FINAL_MS). Then
 * the header shows above it, and the page takes over.
 */

/** How much of its growth the strip (and the envelope) gets while the flap turns, before the slide. */
const CAP = 0.25;
const CAP_MS = FLAP_MS;
const CAP_CURVE = [0.4, 0, 0.2, 1] as const;
const CAP_EASE = cubic(...CAP_CURVE);
/** A tap's ease into the lifted pose, on that growth's clock and curve, so the two read as one growth. */
export const LIFT_WITH_GROWTH = `${CAP_MS}ms cubic-bezier(${CAP_CURVE.join(", ")})`;
/* The strip's move up to the header, over the envelope's slide: steady, there as the envelope leaves. */
const MOVE_EASE = cubic(0.4, 0, 0.35, 1);
/** The rest of the growth (ms), once the envelope's body has left the stage. */
const FINAL_MS = 900;
/** The header coming in (ms), once the strip is full size. */
const HEADER_MS = 150;

const { vb, fold, body } = DRAWING;

/** The strip's way out, in px from the stage, measured on the click. */
export interface StripPlaces {
  /** The copy of the sections: the column's width, the height it shows. */
  width: number;
  height: number;
  /** The column's box in the stage, its header's height and the scroller's bottom. */
  column: { x: number; y: number; w: number };
  headerHeight: number;
  bottom: number;
  /** The strip's scale in the pocket, in the envelope's own size. */
  local: number;
  offX: number;
  offY: number;
  /** The point the envelope's layers grow from. */
  originX: number;
  originY: number;
  liftY: number;
  grow: number;
  /** The growth while the envelope is on the stage. */
  cap: number;
  /** Its top's distance above the growth's origin, per unit of growth (px). */
  rise: number;
  slide: number;
  /** When the rest of the growth starts: the envelope's body has left the stage. */
  growAt: number;
  /** The strip's top centre in the pocket, and where the page draws it. */
  start: { x: number; y: number };
  end: { x: number; y: number };
  /** When the strip is full size: the header shows. */
  headerAt: number;
  total: number;
}

/** One frame: the strip's transform in the pocket, the envelope's move, the header's fade (0 to 1). */
export interface StripFrame {
  strip: string;
  /** The copy's height: down to the scroller's bottom at the size it is drawn, as it is still growing after the envelope has gone. */
  height: number;
  /** The envelope's growth and drop, as their own `scale` and `translate`: the lift's transition never smooths them. */
  grow: number;
  drop: number;
  /** How far the first growth has come, 0 to 1 (`castShadows`). */
  held: number;
  header: number;
}

export function stripPlaces(
  stage: DOMRect,
  env: DOMRect,
  column: DOMRect,
  headerHeight: number,
  bottom: number,
): StripPlaces {
  const k = env.width / vb.w;
  const lift = LIFTED.body.s;
  const liftY = LIFTED.body.y * env.height;
  const offX = env.left - stage.left;
  const offY = env.top - stage.top;
  const originX = offX + env.width / 2;
  const originY = offY + ((body.y0 + body.y1) / 2 - vb.y) * k;
  const width = column.width;
  const local = ((body.x1 - body.x0 - 2 * CARD_SIDE) * k) / width;
  /* The growth on top of the lift that brings the strip to full size. */
  const grow = 1 / (local * lift);
  const top = (fold + CARD_TOP - vb.y) * k;
  const start = {
    x: originX,
    y: originY + lift * (offY + top - originY) + liftY,
  };
  const end = {
    x: column.left - stage.left + width / 2,
    y: column.top - stage.top + headerHeight,
  };
  const cap = 1 + CAP * (grow - 1);
  const rise = lift * (offY - originY) + liftY;
  const slide = stage.height + SLIDE_PAST - (originY + cap * rise);
  /*
   * The first moment the body's top (the fold) is past the stage's bottom:
   * only the open flap still shows, and the strip covers it.
   */
  const fold0 =
    originY + cap * (lift * (offY + (fold - vb.y) * k - originY) + liftY);
  const growAt =
    CAP_MS +
    (Array.from({ length: 201 }, (_, i) => (SLIDE_MS * i) / 200).find(
      (t) => fold0 + slide * SLIDE_EASE(t / SLIDE_MS) >= stage.height,
    ) ?? SLIDE_MS);
  /* Full size, and in place under the header. */
  const headerAt = Math.max(growAt + FINAL_MS, CAP_MS + SLIDE_MS);
  return {
    width,
    height: bottom - (column.top + headerHeight),
    column: {
      x: column.left - stage.left,
      y: column.top - stage.top,
      w: width,
    },
    headerHeight,
    bottom: bottom - stage.top,
    local,
    offX,
    offY,
    originX,
    originY,
    liftY,
    grow,
    cap,
    rise,
    slide,
    growAt,
    start,
    end,
    headerAt,
    total: headerAt + HEADER_MS,
  };
}

/** The strip at `t` ms after the click. */
export function stripFrame(p: StripPlaces, t: number): StripFrame {
  const slid = clamp01((t - CAP_MS) / SLIDE_MS);
  const final = clamp01((t - p.growAt) / FINAL_MS);
  const g =
    final > 0
      ? mix(p.cap, p.grow, easeInOut(final))
      : mix(1, p.cap, CAP_EASE(clamp01(t / CAP_MS)));
  /* Past the stage's bottom, the envelope's top held there as it grows on with the strip. */
  const dy = p.slide * SLIDE_EASE(slid) + Math.min(0, p.cap - g) * p.rise;
  const move = MOVE_EASE(slid);
  /* Where it shows on the stage, taken back into the lifted, moved envelope's layer; in the pocket it grows with the envelope. */
  const lift = LIFTED.body.s;
  const x = mix(p.originX + g * (p.start.x - p.originX), p.end.x, move);
  const y = mix(p.originY + g * (p.start.y - p.originY), p.end.y, move);
  const left = p.originX + (x - p.originX) / (g * lift) - p.offX;
  const top = p.originY + ((y - p.originY - dy) / g - p.liftY) / lift - p.offY;
  return {
    strip: `translate(${left - (p.width * p.local) / 2}px, ${top}px) scale(${p.local})`,
    height: Math.max(p.height, (p.bottom - y) / (p.local * lift * g)),
    grow: g,
    drop: dy,
    held: (Math.min(g, p.cap) - 1) / (p.cap - 1),
    header: easeInOut(clamp01((t - p.headerAt) / HEADER_MS)),
  };
}
