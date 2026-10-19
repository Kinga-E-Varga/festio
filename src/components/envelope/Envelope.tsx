"use client";

import { useTranslations } from "next-intl";
import {
  type CSSProperties,
  type PointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { EnvelopeColors } from "@/types/envelope";
import { envelopeVars } from "./colors";
import { DRAWING } from "./drawing.generated";
import {
  clearFades,
  FADE_MS,
  type Fade,
  FLAP_MS,
  flapFrames,
  openingFades,
  REDUCED_FADE_MS,
  reducedMotion,
  setFades,
  SETTLE_MS,
  SWING,
} from "./motion";
import { placeTag } from "./tag";

interface EnvelopeProps {
  colors: EnvelopeColors;
  /** The invitation's own ground, under the envelope. */
  ground: { className: string; style?: CSSProperties };
  /** Changes with the invitation's body font, so the tag's words are fitted again. */
  fontKey: string;
  /** The simple editor's panel is open beside it: the envelope centres in what is left. */
  besidePanel?: boolean;
  /** The envelope is open and faded: the page is the guest's. */
  onOpened: () => void;
}

const { vb, fold, body, hole } = DRAWING;
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

type Phase = "closed" | "opening" | "open";

/** Everything running, so a click, a leave or an unmount can stop it. */
interface Work {
  flap: Animation | null;
  swings: Animation[];
  fades: Fade[];
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
  const work = useRef<Work>({
    flap: null,
    swings: [],
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
    return () => {
      live = false;
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
      clearFades(running.fades);
    };
  }, []);

  function later(ms: number, run: () => void) {
    work.current.timers.push(window.setTimeout(run, ms));
  }

  function swing(kind: "enter" | "leave") {
    const running = work.current;
    running.lifted = kind === "enter";
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
  function leave(event: PointerEvent<HTMLElement>) {
    if (isHover(event.relatedTarget)) return;
    if (work.current.lifted) swing("leave");
  }

  function fadeOut(ms: number) {
    setFade(ms);
    later(ms, onOpened);
  }

  /* Click anywhere: the flap turns open, settles, then the envelope fades into the page. */
  function open() {
    if (phase !== "closed" || fade !== null) return;
    const running = work.current;
    if (running.lifted) swing("leave");
    const root = stage.current;
    const flap = rot.current;
    const env = root?.querySelector(".env");
    if (!root || !flap || !env) return;
    /* Reduced motion: the closed envelope fades straight out, never jumping open. */
    if (reducedMotion()) {
      fadeOut(REDUCED_FADE_MS);
      return;
    }
    setPhase("opening");
    running.flap = flap.animate(flapFrames(env.getBoundingClientRect().width), {
      duration: FLAP_MS,
      fill: "both",
    });
    running.fades = openingFades(root);
    const start = performance.now();
    const tick = (now: number) => {
      const time = Math.min(now - start, FLAP_MS);
      setFades(running.fades, time);
      if (time < FLAP_MS) {
        running.frame = requestAnimationFrame(tick);
        return;
      }
      running.flap?.cancel();
      running.flap = null;
      clearFades(running.fades);
      running.fades = [];
      setPhase("open");
      later(SETTLE_MS, () => fadeOut(FADE_MS));
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
        <Layer
          className="env-cast"
          markup={DRAWING.castClosed + DRAWING.castOpen}
        />
        <Layer className="env-inside" markup={DRAWING.inside} />
        <Layer
          className="env-inside env-inside-shade"
          markup={DRAWING.insideShade}
        />
        <Layer className="env-pocket" markup={DRAWING.pocket} />
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
    </div>
  );
}
