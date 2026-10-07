"use client";

import { useTranslations } from "next-intl";
import { HINT } from "@/components/dashboard/event-editor/styles";
import { use, useEffect, useLayoutEffect, useRef, useState } from "react";
import { swatchHex } from "@/modular/cards/DressCodeCard";
import { PaletteColors } from "./palette";

/* The browser's colour well, drawn as a round swatch. */
const WELL =
  "size-10 shrink-0 cursor-pointer rounded-full border border-mustard-300 bg-neutral-50 p-0.5 transition-colors hover:border-mustard-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mustard-500 [&::-moz-color-swatch]:rounded-full [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0";

/** A colour value as a hex: a palette role read from the palette. */
function useSwatchHex(value: string): string {
  const colors = use(PaletteColors);
  return colors ? swatchHex(value, colors) : "";
}

/**
 * One colour, picked with the browser's colour picker, as a round swatch. A
 * palette role opens on the palette's colour; picking one stores a hex, so
 * that swatch no longer follows the palette. While the host drags in the
 * picker the swatch follows at once, but the editor hears at most once a
 * frame — the newest colour — not on every move.
 */
export function ColorWell({
  id,
  value,
  label,
  withHex = false,
  onChange,
}: {
  id: string;
  value: string;
  /** Its name when no `<label>` points at it. */
  label?: string;
  /** The hex written beside it (a lone colour field), or a prompt when none. */
  withHex?: boolean;
  onChange: (value: string) => void;
}) {
  const t = useTranslations("ContentTab");
  const hex = useSwatchHex(value);
  /* The colour picked but not passed on yet; the swatch shows it meanwhile. */
  const [draft, setDraft] = useState<string | null>(null);
  const frame = useRef(0);
  const latest = useRef(onChange);
  useLayoutEffect(() => {
    latest.current = onChange;
  });
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function pick(next: string) {
    setDraft(next);
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      latest.current(next);
      setDraft(null);
    });
  }

  const shown = draft ?? hex;
  const well = (
    <input
      id={id}
      type="color"
      value={shown || "#000000"}
      aria-label={label}
      title={shown ? shown.toUpperCase() : undefined}
      onChange={(event) => pick(event.target.value)}
      className={WELL}
    />
  );
  if (!withHex) return well;
  return (
    <div className="flex items-center gap-3">
      {well}
      <span className={HINT}>
        {shown ? shown.toUpperCase() : t("pickColour")}
      </span>
    </div>
  );
}
