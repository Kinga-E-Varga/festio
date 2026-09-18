"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

/**
 * Measurement has to land before paint or the card flashes at the wrong size.
 * `useLayoutEffect` does that on the client and warns on the server, where
 * there is nothing to measure — so the server takes the effect that does
 * nothing instead of the one that complains about it.
 */
const useMeasureEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Below this the card is unreadable, so the stage scrolls instead. */
const MIN_SCALE = 0.18;
const MAX_SCALE = 1;

/** Re-rendering for a change this small buys nothing. */
const STEP = 0.0005;

interface ScaledStageProps {
  /** The size the template is authored at, in px. */
  width: number;
  height: number;
  minScale?: number;
  maxScale?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Paints a fixed-size card at whatever size its slot allows.
 *
 * Shared on purpose: the same card has to serve the guest page, the host
 * editor, a dashboard thumbnail and the print preview, and only one of those
 * has any relationship to the viewport — so the stage measures its own
 * container and never asks how wide the window is.
 */
export function ScaledStage({
  width,
  height,
  minScale = MIN_SCALE,
  maxScale = MAX_SCALE,
  className = "",
  children,
}: ScaledStageProps) {
  const slot = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useMeasureEffect(() => {
    const node = slot.current;
    if (!node) return;

    const measure = () => {
      const { clientWidth, clientHeight } = node;
      if (clientWidth === 0 || clientHeight === 0) return;

      const fit = Math.min(clientWidth / width, clientHeight / height);
      const next = Math.min(Math.max(fit, minScale), maxScale);

      setScale((current) => (Math.abs(current - next) < STEP ? current : next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [width, height, minScale, maxScale]);

  const vars = {
    "--design-w": `${width}px`,
    "--design-h": `${height}px`,
    "--scale": String(scale),
  } as CSSProperties;

  return (
    <div
      ref={slot}
      style={vars}
      data-measured={scale > 0}
      className={`stage ${className}`}
    >
      <div className="frame">
        <div className="card">{children}</div>
      </div>
    </div>
  );
}
