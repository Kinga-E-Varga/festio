"use client";

import { useTranslations } from "next-intl";
import {
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import type { EnvelopeColors } from "@/types/envelope";
import type { CardShadow } from "@/types/invitation";
import {
  type CardOpening,
  type CardPlaces,
  cardFrame,
  cardPlaces,
  castShadows,
  PANEL_EASING,
  PANEL_MS,
} from "./card";
import { envelopeVars } from "./colors";
import { DRAWING } from "./drawing.generated";
import {
  type Blur,
  blursIn,
  clearFades,
  FADE_MS,
  FLAP_MS,
  flapFrames,
  LIFT_END,
  openingFades,
  REDUCED_FADE_MS,
  reducedMotion,
  SETTLE_MS,
  LIFTED_VARS,
  SWING,
} from "./motion";
import {
  LIFT_WITH_GROWTH,
  type StripPlaces,
  stripFrame,
  stripPlaces,
} from "./strip";
import { placeTag } from "./tag";

interface EnvelopeProps {
  colors: EnvelopeColors;
  /** The invitation's own ground, under the envelope. */
  ground: { className: string; style?: CSSProperties };
  /** Changes with the invitation's body font, so the tag's words are fitted again. */
  fontKey: string;
  /** The simple editor's panel is open beside it: the envelope centres in what is left. */
  besidePanel?: boolean;
  /** A simple invitation's card, which comes out of the envelope once it is open. */
  card?: EnvelopeCard;
  /** A modular invitation's page, which comes out of the envelope once it is open. */
  strip?: EnvelopeStrip;
  /** The fade into the page has started, taking `ms`. */
  onFade?: (ms: number) => void;
  /** The envelope is open and faded: the page is the guest's. */
  onOpened: () => void;
}

/**
 * The card and where the page draws it: `page` is the invitation's root,
 * holding the page's own card (`.stage .card`) and reply panel (`.reply`).
 */
export interface EnvelopeCard {
  node: ReactNode;
  width: number;
  height: number;
  shadow: CardShadow;
  page: RefObject<HTMLElement | null>;
  /** Which way it comes out. */
  opening: CardOpening;
}

/**
 * A modular page's copies: its sections and its header, each in its own
 * vars and fonts, filling the box the envelope gives it. `column` is the
 * page's column (`@container`): its box, its first child the header, its
 * parent the scroller, whose bottom is the page's.
 */
export interface EnvelopeStrip {
  body: ReactNode;
  header: ReactNode;
  column: RefObject<HTMLElement | null>;
}

/** The card's way out, measured on the click; `panel` slides in last. */
interface Reveal {
  places: CardPlaces;
  panel: HTMLElement | null;
}

const { vb, fold, body, hole } = DRAWING;

/** Dev only: `?freeze=<ms>` holds the card or page coming out that long after the click, to style it in DevTools. */
function freezeAt(): number {
  if (process.env.NODE_ENV !== "development") return Infinity;
  const ms = Number(new URLSearchParams(window.location.search).get("freeze"));
  return ms > 0 ? ms : Infinity;
}
const pctX = (x: number) => `${((x - vb.x) / vb.w) * 100}%`;
const pctY = (y: number) => `${((y - vb.y) / vb.h) * 100}%`;

/** The drawing's geometry as the CSS reads it. */
const GEOMETRY = {
  "--env-ratio": vb.w / vb.h,
  "--env-fold-y": pctY(fold),
  "--env-centre-y": pctY((body.y0 + body.y1) / 2),
  "--env-hit-x": pctX(body.x0),
  "--env-hit-y": pctY(body.y0),
  "--env-hit-w": `${((body.x1 - body.x0) / vb.w) * 100}%`,
  "--env-hit-h": `${((body.y1 - body.y0) / vb.h) * 100}%`,
  "--env-body-bottom": pctY(body.y1),
  ...LIFTED_VARS,
  "--env-hole-x": pctX(hole.x),
  "--env-hole-y": pctY(hole.y),
} as CSSProperties;

/** One layer of the drawing, in its own coordinates. Our own generated markup. */
function Layer({ className, markup }: { className: string; markup: string }) {
  return (
    <svg
      className={`env-layer ${className}`}
      viewBox={DRAWING.viewBox}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

/** A layer that swings with the tag, around its hole. */
function Swing({ className, markup }: { className: string; markup: string }) {
  return (
    <div className={`env-layer ${className}`}>
      <svg
        className="env-swing"
        viewBox={DRAWING.viewBox}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </div>
  );
}

/** A copy of the card at its design size, placed by one transform. */
function CardCopy({
  card,
  ref,
}: {
  card: EnvelopeCard;
  ref: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={ref}
      className="env-card"
      data-shadow={card.shadow ?? undefined}
      style={
        {
          "--design-w": `${card.width}px`,
          "--design-h": `${card.height}px`,
        } as CSSProperties
      }
    >
      {card.node}
    </div>
  );
}

type Phase = "closed" | "opening" | "open";

/** Everything running, so a click, a leave or an unmount can stop it. */
interface Work {
  flap: Animation | null;
  swings: Animation[];
  panel: Animation | null;
  fades: Animation[];
  frame: number;
  timers: number[];
  lifted: boolean;
}

/** The tag's current turn, read from its transform. */
function angle(el: Element): number {
  const m = new DOMMatrix(getComputedStyle(el).transform);
  return (Math.atan2(m.b, m.a) * 180) / Math.PI;
}

/**
 * The closed envelope over the invitation, in its colours, on its ground.
 * Built from `.claude/skills/envelope/drawing/envelope-edit.svg` by the `envelope` skill:
 * stacked layers in the drawing's coordinates, back to front. Hovered (mouse
 * only) it lifts and the tag drops; a click anywhere turns the flap open,
 * and once it settles the envelope fades into the page.
 */
export function Envelope({
  colors,
  ground,
  fontKey,
  besidePanel = false,
  card,
  strip,
  onFade,
  onOpened,
}: EnvelopeProps) {
  const t = useTranslations("Envelope");
  const words = t("tag");
  /* The shading is worked out once per palette, not on every render. */
  const colorVars = useMemo(() => envelopeVars(colors), [colors]);
  const [phase, setPhase] = useState<Phase>("closed");
  /* The fade's length once it has started; null while it hasn't. */
  const [fade, setFade] = useState<number | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const rot = useRef<HTMLDivElement>(null);
  const hit = useRef<HTMLButtonElement>(null);
  const hitTag = useRef<HTMLDivElement>(null);
  const pocketCard = useRef<HTMLDivElement>(null);
  const frontCard = useRef<HTMLDivElement>(null);
  const stripCopy = useRef<HTMLDivElement>(null);
  const stripBody = useRef<HTMLDivElement>(null);
  const stripShade = useRef<HTMLDivElement>(null);
  /* After a hover and a click: the cast's shadows' blurs, widened as the envelope grows. Empty otherwise. */
  const castBlurs = useRef<(Blur & { more: boolean })[]>([]);
  /* And every shadow shape, with its own opacity: they fade as the envelope grows. */
  const castFades = useRef<{ el: SVGElement; base: number }[]>([]);
  const headBox = useRef<HTMLDivElement>(null);
  const headCopy = useRef<HTMLDivElement>(null);
  const work = useRef<Work>({
    flap: null,
    swings: [],
    panel: null,
    fades: [],
    frame: 0,
    timers: [],
    lifted: false,
  });

  /* The tag's words, again once the fonts are in: they are fitted by their size. */
  useEffect(() => {
    const root = stage.current;
    if (!root) return;
    let live = true;
    const place = () => {
      /* Lifted, the tag's hover area would be measured off its resting place. */
      if (live) placeTag(root, words.split("\n"), !work.current.lifted);
    };
    place();
    document.fonts.ready.then(place);
    /* Capped on screen, so a new envelope size fits them again. */
    const env = root.querySelector(".env");
    const resized = new ResizeObserver(place);
    if (env) resized.observe(env);
    return () => {
      live = false;
      resized.disconnect();
    };
  }, [words, fontKey]);

  /* Turned off mid-opening (the editor's switch) or left: nothing keeps running. */
  useEffect(() => {
    const running = work.current;
    return () => {
      cancelAnimationFrame(running.frame);
      running.timers.forEach(clearTimeout);
      running.flap?.cancel();
      running.swings.forEach((animation) => animation.cancel());
      running.panel?.cancel();
      clearFades(running.fades);
    };
  }, []);

  function later(ms: number, run: () => void) {
    work.current.timers.push(window.setTimeout(run, ms));
  }

  function swing(kind: keyof typeof SWING) {
    const running = work.current;
    if (kind !== "slide") running.lifted = kind === "enter";
    const root = stage.current;
    if (!root || reducedMotion()) return;
    const swingers = Array.from(
      root.querySelectorAll<SVGSVGElement>(".env-swing"),
    );
    if (!swingers.length) return;
    const from = angle(swingers[0]);
    running.swings.forEach((animation) => animation.cancel());
    const { to, easing, duration } = SWING[kind];
    const frames = [
      { transform: `rotate(${from}deg)` },
      { transform: `rotate(${to}deg)` },
    ];
    running.swings = swingers.map((el) =>
      el.animate(frames, { duration, easing, fill: "forwards" }),
    );
  }

  /* The body and the tag are one hover: moving from one to the other is no new turn. */
  const isHover = (el: EventTarget | null) =>
    el === hit.current || el === hitTag.current;
  function enter(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || isHover(event.relatedTarget)) return;
    if (phase === "closed" && fade === null) swing("enter");
  }
  /* Once clicked, the tag stays where the hover turned it. */
  function leave(event: PointerEvent<HTMLElement>) {
    if (isHover(event.relatedTarget) || phase !== "closed") return;
    if (work.current.lifted) swing("leave");
  }

  function fadeOut(ms: number) {
    setFade(ms);
    onFade?.(ms);
    later(ms, onOpened);
  }

  /* Where the page draws its card; null without a card, or before the page has laid it out. */
  function measureCard(root: HTMLElement, env: Element): Reveal | null {
    const page = card?.page.current;
    const target = page?.querySelector(".stage .card")?.getBoundingClientRect();
    if (!card || !page || !target?.width) return null;
    return {
      places: cardPlaces(
        card.opening,
        root.getBoundingClientRect(),
        env.getBoundingClientRect(),
        target,
        card.width,
        card.height,
        !card.shadow,
      ),
      panel: page.querySelector<HTMLElement>(".reply"),
    };
  }

  /*
   * After the flap, frame by frame: the card out of the pocket and upright
   * as the envelope leaves (`card.ts`, either way), then beside the reply
   * panel as it slides in; it ends where the page draws it, and the page
   * takes over. Each layer moves and fades on its own: one fading wrapper
   * would cut the shadows off the ground they multiply onto.
   */
  function revealCard(root: HTMLElement, reveal: Reveal, from: number) {
    const running = work.current;
    const env = root.querySelector<HTMLElement>(".env");
    const { panelAt, total } = reveal.places;
    /* `from` is when the flap settled; the freeze counts from the click. */
    const freeze = freezeAt() - FLAP_MS;
    if (panelAt < freeze) later(panelAt, () => slidePanel(reveal.panel));
    const tick = (now: number) => {
      const t = Math.min(now - from, total, freeze);
      const frame = cardFrame(reveal.places, t);
      root.dataset.card = frame.inPocket ? "pocket" : "front";
      const copy = (frame.inPocket ? pocketCard : frontCard).current;
      if (copy) copy.style.transform = frame.card;
      for (const card of [pocketCard, frontCard]) {
        card.current?.style.setProperty(
          "--env-card-shadow",
          String(frame.shadow.page),
        );
        card.current?.style.setProperty(
          "--env-card-out",
          String(frame.shadow.out),
        );
      }
      env?.style.setProperty("--env-move", frame.envelope.transform);
      env?.style.setProperty("--env-out", String(frame.envelope.opacity));
      setCastShadows(env, frame.envelope.held);
      if (t >= freeze) return;
      if (t < total) running.frame = requestAnimationFrame(tick);
      else {
        setCastBlur(1);
        setCastFade(1);
        onOpened();
      }
    };
    running.frame = requestAnimationFrame(tick);
  }

  /* Where the page draws its column and header; null without a strip, or before it is laid out. */
  function measureStrip(root: HTMLElement, env: Element): StripPlaces | null {
    const column = strip?.column.current;
    const scroller = column?.parentElement;
    if (!strip || !column || !scroller) return null;
    const box = column.getBoundingClientRect();
    if (!box.width) return null;
    const head = column.firstElementChild?.getBoundingClientRect().height ?? 0;
    /* The gap above the cover (past INVITE_COLUMN), cut off in the pocket. */
    const cover = column.querySelector("[data-cover]")?.getBoundingClientRect();
    const places = stripPlaces(
      root.getBoundingClientRect(),
      env.getBoundingClientRect(),
      box,
      head,
      scroller.getBoundingClientRect().bottom,
      cover ? Math.max(0, cover.top - (box.top + head)) : 0,
    );
    stripCopy.current?.style.setProperty("--strip-w", `${places.width}px`);
    if (stripCopy.current)
      stripCopy.current.style.height = `${places.height}px`;
    /* The page's hero height, held while the copy's own height changes. */
    stripCopy.current?.style.setProperty("--strip-hero", `${places.height}px`);
    headBox.current?.style.setProperty("--head-x", `${places.column.x}px`);
    headBox.current?.style.setProperty("--head-y", `${places.column.y}px`);
    headBox.current?.style.setProperty("--head-w", `${places.column.w}px`);
    headBox.current?.style.setProperty("--head-h", `${head}px`);
    return places;
  }

  /*
   * One frame of the page coming out (`strip.ts`), `t` ms after the click.
   * Set straight on the parts that use them, never as inherited vars on what
   * holds the page's copy: those would have the whole copy's style worked
   * out again every frame, slow on a phone.
   */
  function setStrip(env: HTMLElement | null, places: StripPlaces, t: number) {
    const frame = stripFrame(places, t);
    if (stripCopy.current) {
      stripCopy.current.style.transform = frame.strip;
      stripCopy.current.style.height = `${frame.height}px`;
    }
    /* The side bands and the gap above the cover, cut off in the pocket. */
    const cut = `${frame.clip.top}px ${frame.clip.side}px 0`;
    if (stripBody.current) stripBody.current.style.clipPath = `inset(${cut})`;
    if (stripShade.current) {
      stripShade.current.style.inset = cut;
      stripShade.current.style.opacity = String(frame.shade);
    }
    if (headCopy.current) headCopy.current.style.opacity = String(frame.header);
    for (const layer of env?.querySelectorAll<HTMLElement | SVGElement>(
      ":scope > .env-layer",
    ) ?? []) {
      layer.style.scale = String(frame.grow);
      layer.style.translate = `0 ${frame.drop}px`;
    }
    setCastShadows(env, frame.held);
  }

  /* The cast's shadows as the envelope grows (`castShadows`), after a hover and a click only. */
  function setCastShadows(env: HTMLElement | null, held: number) {
    if (!castBlurs.current.length) return;
    const shadows = castShadows(held);
    env?.style.setProperty("--env-cast-tight", String(shadows.tight));
    setCastBlur(shadows.blur, shadows.moreBlur);
    setCastFade(shadows.opacity);
  }

  /* Never cleared: each shape's drawn opacity is in its own style, and clearing it showed the shadow at full strength. */
  function setCastFade(times: number) {
    for (const fade of castFades.current)
      fade.el.style.opacity = String(fade.base * times);
  }

  /* Each blur as a multiple of its own: those marked to blur more by `more`, the rest by `times`. */
  function setCastBlur(times: number, more = times) {
    for (const blur of castBlurs.current)
      blur.node.setAttribute(
        "stdDeviation",
        String(blur.base * (blur.more ? more : times)),
      );
  }

  /* After the flap, frame by frame: the page out of the pocket as the envelope leaves, its header showing as it arrives. */
  function revealStrip(root: HTMLElement, places: StripPlaces, from: number) {
    const running = work.current;
    const env = root.querySelector<HTMLElement>(".env");
    const freeze = freezeAt();
    const tick = (now: number) => {
      const t = Math.min(now - from, places.total, freeze);
      setStrip(env, places, t);
      if (t >= freeze) return;
      if (t < places.total) running.frame = requestAnimationFrame(tick);
      else {
        setCastBlur(1);
        setCastFade(1);
        onOpened();
      }
    };
    running.frame = requestAnimationFrame(tick);
  }

  /* The page's own reply panel, over the stage: in from the right, or up from the bottom on a phone. */
  function slidePanel(panel: HTMLElement | null) {
    if (!panel) return;
    const style = getComputedStyle(panel);
    const from =
      style.position === "fixed" ? "translateY(100%)" : "translateX(100%)";
    work.current.panel = panel.animate(
      [
        { transform: from, zIndex: 45 },
        { transform: style.transform, zIndex: 45 },
      ],
      { duration: PANEL_MS, easing: PANEL_EASING, fill: "forwards" },
    );
  }

  /* Click anywhere: the flap turns open, settles, then the envelope fades into the page. */
  function open() {
    if (phase !== "closed" || fade !== null) return;
    const running = work.current;
    const root = stage.current;
    const flap = rot.current;
    const env = root?.querySelector<HTMLElement>(".env");
    if (!root || !flap || !env) return;
    /* Reduced motion: the closed envelope fades straight out, never jumping open. */
    if (reducedMotion()) {
      fadeOut(REDUCED_FADE_MS);
      return;
    }
    /*
     * Lifted from here on, the tag turned: after a hover both are already
     * there; a tap or a key eases into them as the flap starts.
     */
    const reveal = measureCard(root, env);
    const page = reveal ? null : measureStrip(root, env);
    if (reveal || page) root.dataset.card = "pocket";
    const shadows = root.querySelectorAll(".env-cast, .env-tag-shade");
    const more = new Set(
      Array.from(root.querySelectorAll(".env-blur-more"))
        .flatMap(blursIn)
        .map((blur) => blur.node),
    );
    castBlurs.current =
      (page || reveal) && running.lifted
        ? Array.from(shadows)
            .flatMap(blursIn)
            .map((blur) => ({ ...blur, more: more.has(blur.node) }))
        : [];
    castFades.current = castBlurs.current.length
      ? Array.from(
          root.querySelectorAll<SVGElement>(
            ":is(.env-cast, .env-tag-shade, .env-tag-hard) [style*='filter']",
          ),
        ).map((el) => ({ el, base: Number(getComputedStyle(el).opacity) }))
      : [];
    /* A tap: the page grows as the flap turns, so the lift goes with it. */
    if (page && !running.lifted)
      root.style.setProperty("--env-lift-time", LIFT_WITH_GROWTH);
    /* After measuring: a style update in between would start the lift on its own clock. */
    root.dataset.lifted = "";
    if (!running.lifted) swing("enter");
    if (reveal && pocketCard.current)
      pocketCard.current.style.transform = cardFrame(reveal.places, 0).card;
    if (page) setStrip(env, page, 0);
    setPhase("opening");
    running.flap = flap.animate(flapFrames(env.getBoundingClientRect().width), {
      duration: FLAP_MS,
      fill: "both",
    });
    /* Started here, before the first frame: nothing shows at full strength for one. */
    running.fades = openingFades(root);
    const start = performance.now();
    const tick = (now: number) => {
      const time = Math.min(now - start, FLAP_MS);
      /* The page and the envelope grow a little while the flap turns. */
      if (page) setStrip(env, page, time);
      /*
       * Upright, the copy of the inside's top strip is fully in: the inside
       * draws it itself again, in one piece (a copy beside it jogs its pattern).
       */
      if (time >= LIFT_END * FLAP_MS) root.dataset.upright = "";
      if (time < FLAP_MS) {
        running.frame = requestAnimationFrame(tick);
        return;
      }
      /*
       * Open first, in this same frame: stopping the turn and the fades a
       * frame before the open state lands showed the closed flap for a frame.
       */
      flushSync(() => setPhase("open"));
      running.flap?.cancel();
      running.flap = null;
      clearFades(running.fades);
      running.fades = [];
      root.style.removeProperty("--env-lift-time");
      if (page || reveal?.places.opening === "slide") swing("slide");
      if (reveal) revealCard(root, reveal, start + FLAP_MS);
      else if (page) revealStrip(root, page, start);
      else later(SETTLE_MS, () => fadeOut(FADE_MS));
    };
    running.frame = requestAnimationFrame(tick);
  }

  return (
    <div
      ref={stage}
      data-state={phase}
      data-fading={fade === null ? undefined : ""}
      onClick={open}
      style={
        {
          ...GEOMETRY,
          ...colorVars,
          ...ground.style,
          "--env-fade": `${fade ?? FADE_MS}ms`,
        } as CSSProperties
      }
      className={`env-stage ${ground.className} ${besidePanel ? "invite:pr-invite-panel" : ""}`}
    >
      <svg
        className="absolute size-0"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: DRAWING.defs }}
      />
      <div className="env">
        {/*
         * Each part that fades while the flap turns is a layer of its own,
         * faded whole (`openingFades`): the cast's closed and open shadows,
         * the inside's top strip, the open pocket over the closed one, the
         * flap's shadow and its spread copy.
         */}
        <Layer
          className="env-cast env-cast-closed"
          markup={DRAWING.castClosed}
        />
        <Layer className="env-cast env-cast-open" markup={DRAWING.castOpen} />
        <Layer className="env-inside env-back-seam" markup={DRAWING.backSeam} />
        <Layer className="env-inside" markup={DRAWING.inside} />
        <Layer
          className="env-inside env-inside-edge env-v-closed"
          markup={DRAWING.insideEdge}
        />
        {card ? (
          <div className="env-layer env-card-pocket" aria-hidden="true" inert>
            <CardCopy card={card} ref={pocketCard} />
          </div>
        ) : null}
        {strip ? (
          <div className="env-layer env-card-pocket" aria-hidden="true" inert>
            <div ref={stripCopy} className="env-strip">
              <div ref={stripShade} className="env-strip-shade" />
              <div ref={stripBody} className="env-strip-body">
                {strip.body}
              </div>
            </div>
          </div>
        ) : null}
        <Layer
          className="env-inside env-inside-shade"
          markup={DRAWING.insideShade}
        />
        <Layer
          className="env-inside env-inside-shade env-inside-edge env-v-closed"
          markup={DRAWING.insideShadeEdge}
        />
        <Layer
          className="env-pocket env-v-closed"
          markup={DRAWING.pocketClosed}
        />
        <Layer className="env-pocket env-v-open" markup={DRAWING.pocketOpen} />
        <Layer
          className="env-pocket env-flap-shadow env-v-closed"
          markup={DRAWING.flapShadow}
        />
        <Layer
          className="env-pocket env-flap-shadow env-flap-spread env-v-closed"
          markup={DRAWING.flapSpread}
        />
        <div className="env-layer env-flap">
          <div ref={rot} className="env-rot">
            <svg
              className="env-face env-front"
              viewBox={DRAWING.viewBox}
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: DRAWING.flapFront }}
            />
            <svg
              className="env-face env-back"
              viewBox={DRAWING.viewBox}
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: DRAWING.flapBack }}
            />
          </div>
        </div>
        <Swing
          className="env-deco-shade env-tag-shade"
          markup={DRAWING.tagShade}
        />
        <Swing
          className="env-deco-shade env-tag-hard"
          markup={DRAWING.tagHard}
        />
        <Swing className="env-tag" markup={DRAWING.tag} />
        <Layer className="env-deco-shade" markup={DRAWING.decoShade} />
        <Layer className="env-deco" markup={DRAWING.deco} />
        <button
          ref={hit}
          type="button"
          className="env-hit"
          aria-label={t("open")}
          onPointerEnter={enter}
          onPointerLeave={leave}
        />
        <div
          ref={hitTag}
          className="env-hit-tag"
          aria-hidden="true"
          onPointerEnter={enter}
          onPointerLeave={leave}
        />
      </div>
      {strip ? (
        <div ref={headBox} className="env-strip-head" aria-hidden="true" inert>
          <div ref={headCopy} className="h-full">
            {strip.header}
          </div>
        </div>
      ) : null}
      {card ? (
        <div className="env-card-front" aria-hidden="true" inert>
          <CardCopy card={card} ref={frontCard} />
        </div>
      ) : null}
    </div>
  );
}
