"use client";

import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { PREVIEW_EDGE } from "@/components/dashboard/styles";
import { ScaledStage } from "@/components/invitation/ScaledStage";
import { ModularInvitation } from "@/components/modular/ModularInvitation";
import { inviteTheme } from "@/lib/invitation";
import type { Language } from "@/lib/language";
import { resolveDesign } from "@/modular/state";
import type { InvitationTemplate } from "@/types/invitation";
import type {
  InvitationBasics,
  ModularLibrary,
  ModularState,
} from "@/types/modular";

/**
 * The picture's frame, nothing inside it reachable but the Edit tag on its
 * corner. `inert` takes clicks, focus and screen readers off the copy; the
 * image role around it is the one picture they read, the tag beside it, as
 * an image's insides are hidden. `isolate` keeps the copy's own layers (a
 * sticky header) under the tag.
 */
const FRAME = "relative isolate w-full overflow-clip";

/**
 * A simple invitation as guests see it: the card alone, edge to edge, no
 * page around it and no shadow. Drawn live, so nothing is saved or goes
 * stale. The frame takes the card's shape: the column's width, edged by the
 * box it fills (`EventOverview`); once the columns stack, 520px tall and as
 * wide as that makes it (never past the box), centred, with its own edge.
 */
export function SimplePreview({
  template,
  label,
  corner,
  children,
}: {
  template: InvitationTemplate;
  /** What the picture is, for screen readers. */
  label: string;
  /** The Edit tag on its corner. */
  corner: ReactNode;
  /** The card, drawn on the server with the event's values. */
  children: ReactNode;
}) {
  const { width, height } = template.design;
  const theme = inviteTheme(template, { ground: false });
  const shape = {
    aspectRatio: `${width} / ${height}`,
    "--card-ratio": width / height,
  } as CSSProperties;

  return (
    <div
      style={{ ...theme.style, ...shape }}
      className={`${theme.className} ${FRAME} mx-auto flex @max-[860px]:w-[min(100%,520px*var(--card-ratio))] @max-[860px]:rounded-ui @max-[860px]:border ${PREVIEW_EDGE}`}
    >
      <div
        role="img"
        aria-label={label}
        className="flex min-h-0 min-w-0 flex-1"
      >
        <div inert className="flex min-h-0 min-w-0 flex-1">
          <ScaledStage width={width} height={height} minScale={0}>
            {children}
          </ScaledStage>
        </div>
      </div>
      {corner}
    </div>
  );
}

/** The sections the modular picture keeps: the cover alone. */
const PREVIEW_SECTIONS = new Set(["cover"]);

/** The width the modular picture is laid out at, then shrunk to its box. */
const PAGE_WIDTH = 700;
/** Its shape, height over width: about a simple card's (1080 × 1532). */
const CARD_SHAPE = 7 / 5;
/** Its height at most once the Overview's columns stack and it spans the page: a stacked simple card's. */
const STACKED_HEIGHT = 520;

/**
 * A modular invitation's cover, nothing else, in a box of its
 * own, rounded and edged like the others. Laid out 700px wide
 * (`PAGE_WIDTH`) and shrunk to the box's width: a picture, not for reading.
 * The box is shaped like a simple card (`CARD_SHAPE`), or once the columns
 * stack (`--stacked`, set by the frame's container query) the page's width
 * and no taller than `STACKED_HEIGHT`; the cover fills it, its photo
 * cropped.
 * Hidden until measured, so it never shows at full size. No envelope: the
 * page itself shows.
 */
export function ModularPreview({
  library,
  state,
  basics,
  language,
  label,
  corner,
}: {
  library: ModularLibrary;
  state: ModularState;
  basics: InvitationBasics;
  language: Language;
  label: string;
  /** The Edit tag on its corner. */
  corner: ReactNode;
}) {
  const design = useMemo(() => {
    const full = resolveDesign({ ...state, envelope: false }, library);
    return (
      full && {
        ...full,
        sections: full.sections.filter(({ definition }) =>
          PREVIEW_SECTIONS.has(definition.id),
        ),
      }
    );
  }, [state, library]);
  const frame = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ scale: number; height: number } | null>(
    null,
  );

  useLayoutEffect(() => {
    const box = frame.current;
    if (!box) return;
    const measure = () => {
      const width = box.clientWidth;
      const stacked =
        getComputedStyle(box).getPropertyValue("--stacked").trim() === "1";
      const shaped = width * CARD_SHAPE;
      setFit({
        scale: width / PAGE_WIDTH,
        height: stacked ? Math.min(shaped, STACKED_HEIGHT) : shaped,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, [design]);
  if (!design) return null;

  const vars = {
    "--page-w": `${PAGE_WIDTH}px`,
    "--fit-scale": fit?.scale ?? 1,
    "--fit-h": `${fit?.height ?? 0}px`,
  } as CSSProperties;

  return (
    <div
      ref={frame}
      style={vars}
      className={`${FRAME} h-(--fit-h) rounded-ui border ${PREVIEW_EDGE} [--stacked:0] @max-[860px]:[--stacked:1] ${fit ? "" : "invisible"}`}
    >
      <div role="img" aria-label={label}>
        <div inert className="w-(--page-w) origin-top-left scale-(--fit-scale)">
          <ModularInvitation
            design={design}
            basics={basics}
            language={language}
            hero={fit ? `${fit.height / fit.scale}px` : undefined}
          />
        </div>
      </div>
      {corner}
    </div>
  );
}
