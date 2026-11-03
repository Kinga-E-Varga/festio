"use client";

import { useEffect, useRef, useState } from "react";
import { frameLength, framePath } from "./card";

/** A card's measured size and the sizes its CSS sets, in px. */
interface CardShape {
  width: number;
  height: number;
  /** `--scoop`: each corner's scoop, 0 for square corners. */
  scoop: number;
  /** Each line's distance in from the edge, in `lines`' order. */
  insets: number[];
  /** `--dot-step`: a dotted line's spacing, 0 when unset. */
  dotStep: number;
}

/** The custom properties a line's distance in may come from. */
export type LineInset = "--line-in" | "--dots-in";

/** A custom property's number: "22px" → 22; 0 when unset. */
function cssNumber(style: CSSStyleDeclaration, name: string): number {
  return parseFloat(style.getPropertyValue(name)) || 0;
}

/**
 * A card's drawn lines, following its cut shape (`framePath`): each line
 * as far in from the edge as its `inset` property says, in its own
 * `className` (stroke, dashes). A line with `dots` gets a whole number of
 * them, about `--dot-step` apart (its `pathLength` their count, so its
 * dashes, `0_1`, are counted in dots), so the first and last never meet.
 * Fills the card's box and is laid out for its measured size. The sizes
 * are read from the card's CSS (`--scoop` and the insets), the one place
 * they are set, which its masks cut by too.
 */
export function CardFrame({
  lines,
}: {
  lines: { inset: LineInset; className: string; dots?: boolean }[];
}) {
  const box = useRef<SVGSVGElement>(null);
  const [shape, setShape] = useState<CardShape | null>(null);
  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const watch = new ResizeObserver(([entry]) => {
      const style = getComputedStyle(element);
      setShape({
        width: Math.round(entry.contentRect.width),
        height: Math.round(entry.contentRect.height),
        scoop: cssNumber(style, "--scoop"),
        insets: lines.map(({ inset }) => cssNumber(style, inset)),
        dotStep: cssNumber(style, "--dot-step"),
      });
    });
    watch.observe(element);
    return () => watch.disconnect();
  }, [lines]);

  return (
    <svg
      ref={box}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full fill-none"
    >
      {shape && shape.width > 0
        ? lines.map(({ inset, className, dots }, index) => {
            const args = [
              shape.width,
              shape.height,
              shape.insets[index],
              shape.scoop,
            ] as const;
            return (
              <path
                key={inset}
                className={className}
                d={framePath(...args)}
                pathLength={
                  dots && shape.dotStep > 0
                    ? Math.round(frameLength(...args) / shape.dotStep)
                    : undefined
                }
              />
            );
          })
        : null}
    </svg>
  );
}
