"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import type { PrintSettings } from "@/types/print";
import front from "@/mock/inv-img/Screenshot 2026-07-27 213629.png";

interface PrintPreviewProps {
  settings: PrintSettings;
  /** The guest-facing address, printed under the host's own two lines. */
  link: string;
  /** Printed under the link on Protected invitations; absent otherwise. */
  passwordLine?: string;
}

/**
 * The printable, turned. Nothing here is the scaled design the guest page
 * paints — a printable is a sheet of paper, so it is drawn at whatever size
 * its slot allows and shown the way it will be handled: turned over, or
 * opened out.
 *
 * Each shape is its own component and holds its own turned/shut state, so
 * switching shape mounts a fresh card and the new one is always shut. Nothing
 * has to reach across and reset it. Once the host has switched, each new card
 * turns over or opens by itself, to show what it does; the first one, on
 * arrival, stays still.
 */
export function PrintPreview(props: PrintPreviewProps) {
  const [firstShape] = useState(props.settings.shape);
  const [switched, setSwitched] = useState(false);
  if (!switched && props.settings.shape !== firstShape) setSwitched(true);

  return (
    <div className="sheet">
      {props.settings.shape === "flat" ? (
        <FlatCard {...props} demo={switched} />
      ) : (
        <FoldedCard {...props} demo={switched} />
      )}
    </div>
  );
}

/** A beat before the card turns by itself. */
const DEMO_DELAY = 300;

/**
 * A card's turned/shut state. With `demo` it turns once by itself as it
 * mounts and stays turned, unless the host asks for less motion; a click of
 * their own before then cancels it.
 */
function useTurn(demo: boolean) {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!demo || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const id = window.setTimeout(() => setOpen(true), DEMO_DELAY);
    timer.current = id;
    return () => window.clearTimeout(id);
  }, [demo]);

  function toggle() {
    window.clearTimeout(timer.current);
    setOpen((was) => !was);
  }

  return { open, toggle };
}

interface CardProps extends PrintPreviewProps {
  demo: boolean;
}

/** One sheet, printed both sides and turned over. */
function FlatCard({ settings, demo, ...written }: CardProps) {
  const t = useTranslations("PrintPanel");
  const { open, toggle } = useTurn(demo);

  return (
    <TurnStage
      open={open}
      onToggle={toggle}
      ariaLabel={t("turnOver")}
      caption={open ? t("flipBack") : t("flip")}
    >
      <span className="sheet-view" data-pages={1}>
        <span className="flip" data-open={open}>
          <span className="leaf elevation-print">
            <Front />
          </span>
          <span
            className="leaf elevation-print"
            data-face="back"
            data-tint={settings.tinted}
          >
            <Written settings={settings} {...written} />
          </span>
        </span>
      </span>
    </TurnStage>
  );
}

/**
 * The same sheet folded in half, so it is two pages wide opened out and one
 * page wide shut. Only the right-hand page never moves; the cover and its
 * reverse are the two faces of the half that swings.
 */
function FoldedCard({ settings, demo, ...written }: CardProps) {
  const t = useTranslations("PrintPanel");
  const { open, toggle } = useTurn(demo);

  return (
    <TurnStage
      open={open}
      onToggle={toggle}
      ariaLabel={t("openCard")}
      caption={open ? t("clickClose") : t("clickOpen")}
    >
      <span className="sheet-view" data-pages={2}>
        <span className="fold" data-open={open}>
          {/* The half that stays put — what the cover swings away from. */}
          <span className="fold-page">
            <span className="leaf elevation-print" data-tint={settings.tinted}>
              <Written settings={settings} {...written} />
            </span>
          </span>

          <span className="fold-page fold-flap" data-open={open}>
            <span className="leaf elevation-print">
              <Front />
            </span>
            {/* The back of the cover — bare paper, or the template's colour. */}
            <span
              className="leaf elevation-print"
              data-face="back"
              data-tint={settings.tinted}
            />
          </span>
        </span>
      </span>
    </TurnStage>
  );
}

/**
 * The shared shell both shapes turn inside: one pressable button holding the
 * shape's own faces, and the caption underneath that names what a click does.
 * Only the faces and the wording differ between a flat card and a folded one.
 */
function TurnStage({
  open,
  onToggle,
  ariaLabel,
  caption,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  ariaLabel: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={open}
      aria-label={ariaLabel}
      onClick={onToggle}
      className="sheet-stack"
    >
      {children}
      <Caption>{caption}</Caption>
    </button>
  );
}

/**
 * What to do with the card, under the card. A `span` rather than a `p`: the
 * whole stage is one button now, and a button may only hold phrasing content.
 */
function Caption({ children }: { children: string }) {
  return (
    <span className="block eyebrow tracking-[0.16em]! text-[color:var(--c2)]">
      {children}
    </span>
  );
}

/** The artwork, which is not edited here. */
function Front() {
  return (
    <Image
      src={front}
      alt=""
      fill
      sizes="(width >= 1000px) 40vw, 90vw"
      className="object-cover"
      priority
    />
  );
}

/**
 * A stand-in for the code that will carry the invitation's address. Made up,
 * not encoded — nothing here scans. It is a fixed pattern rather than a
 * generated one so the card looks the same on every render, and it is drawn
 * at the size a real code will be so the face's spacing is already settled
 * when the encoder arrives.
 *
 * `#` is an inked module, `.` bare paper. The three seven-square eyes are
 * part of the pattern rather than drawn over it, which keeps the whole thing
 * one pass.
 */
const QR_ROWS = [
  "#######.#.#.#.#######",
  "#.....#..##...#.....#",
  "#.###.#.#..#..#.###.#",
  "#.###.#...##..#.###.#",
  "#.###.#.#.#...#.###.#",
  "#.....#..#..#.#.....#",
  "#######.#.#.#.#######",
  "........#.##.........",
  "#.#..###..#.##..#.#.#",
  "..##.#.#.##..#.##..#.",
  "#.##..#..#.##.#..##.#",
  ".#..##.##..#..##.#..#",
  "##.#..#.#..##.#.##.#.",
  "........#.##..#.#..##",
  "#######..#..##.#.##.#",
  "#.....#.##.#..#.#..#.",
  "#.###.#..##..##.#.##.",
  "#.###.#.#.#.##..#..#.",
  "#.###.#..#..#.##.##.#",
  "#.....#.##.##..#.#..#",
  "#######..#.#.##..##.#",
];

/**
 * The pattern as one path — a square per inked module — worked out once at
 * load rather than as a few hundred elements on every render.
 */
const QR_PATH = QR_ROWS.map((row, y) =>
  row
    .split("")
    .map((module, x) => (module === "#" ? `M${x} ${y}h1v1h-1z` : ""))
    .join(""),
).join("");

/**
 * The face the host writes: their two lines above, and the way to the page —
 * code and address — along the foot. Every size is in `em` off the face's own
 * font size, so a face reads at the same proportions on a flat card, on a
 * folded one, and at any width.
 *
 * Two groups rather than one centred column: the foot is placed against the
 * bottom edge, and the host's lines take whatever is left and centre
 * themselves in that, so they stay in the middle of the space they can see
 * rather than in the middle of the paper.
 */
function Written({ settings, link, passwordLine }: PrintPreviewProps) {
  return (
    <span className="flex h-full flex-col px-[2.5em] py-[1.8em] text-center">
      <span className="flex flex-1 flex-col items-center justify-center gap-[1.1em]">
        <span className="font-[family-name:var(--font-primary)] text-[1.5em] leading-[1.3] text-balance">
          {settings.headline}
        </span>
        <span className="text-[1em] leading-[1.5] text-balance">
          {settings.note}
        </span>
      </span>

      <span className="flex flex-col items-center gap-[0.7em]">
        {/*
         * The viewBox is two modules wider than the code on every side — the
         * quiet margin a reader needs, held by the code itself so neither the
         * gap above nor the page's own padding has to stand in for it.
         */}
        <svg
          viewBox="-2 -2 25 25"
          shapeRendering="crispEdges"
          aria-hidden="true"
          className="size-[5em] fill-current"
        >
          <path d={QR_PATH} />
        </svg>
        <span className="flex flex-col items-center gap-[0.3em] text-[0.8em] tracking-[0.08em]">
          <span>{link}</span>
          {passwordLine ? <span>{passwordLine}</span> : null}
        </span>
      </span>
    </span>
  );
}
