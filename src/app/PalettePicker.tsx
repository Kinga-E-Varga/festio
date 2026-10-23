"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { MENU_SURFACE } from "@/components/dashboard/styles";

type Scale = Record<string, string>;
type Palette = Record<string, Scale>;

const STORAGE_KEY = "festio-dev-palette";
const SWITCH_KEY = "festio-dev-palette-switcher";

// The wine accent tried on today's palette.
const WINE: Scale = {
  50: "#fff6f8",
  100: "#fdedf2",
  150: "#fae5eb",
  200: "#f4d7e0",
  300: "#ebc5d1",
  400: "#ddaabc",
  500: "#c7849d",
  600: "#af6080",
  700: "#974167",
  800: "#79214b",
  900: "#571736",
  950: "#3b0e24",
};

// The palette before Moss: deep green and burgundy.
const OLD: Palette = {
  neutral: {
    50: "#fbfaf5",
    100: "#f4f2e9",
    125: "#f2efe5",
    150: "#efebe0",
    200: "#e5e0d1",
    300: "#dad3be",
    400: "#c5bda4",
    500: "#a29b85",
    600: "#827d6e",
    700: "#666359",
    800: "#4f4d46",
    900: "#3a3832",
    950: "#26241f",
  },
  primary: {
    50: "#f6f9f7",
    100: "#eef3ef",
    150: "#e6ede7",
    200: "#d8e3da",
    300: "#c7d5ca",
    400: "#acc1b2",
    500: "#87a392",
    600: "#638773",
    700: "#3c6854",
    800: "#2e5745",
    900: "#1a3d2e",
    950: "#0f2a21",
  },
  secondary: {
    50: "#faf9f1",
    100: "#f5f2e5",
    150: "#efecdb",
    200: "#e4e1c8",
    300: "#d6d3b2",
    400: "#bdba8d",
    500: "#a29d75",
    600: "#847e5a",
    700: "#6a6444",
    800: "#544d31",
    900: "#3f381f",
    950: "#2a230e",
  },
  accent: {
    50: "#fff6f7",
    100: "#fdedf0",
    150: "#fae5e9",
    200: "#f5d7dc",
    300: "#ecc5cc",
    400: "#deabb4",
    500: "#c78692",
    600: "#af6371",
    700: "#994355",
    800: "#84253d",
    900: "#63172f",
    950: "#430b20",
  },
  info: {
    50: "#f6f9fb",
    100: "#edf3f6",
    150: "#e5ecf2",
    200: "#d7e1e9",
    300: "#c5d3dd",
    400: "#abbdcb",
    500: "#889fb1",
    600: "#668197",
    700: "#405e78",
    800: "#365067",
    900: "#263a4e",
    950: "#172535",
  },
  warning: {
    50: "#fdf8ec",
    100: "#f9f1dc",
    150: "#f5eace",
    200: "#eedeb7",
    300: "#e6cf9a",
    400: "#d7b66d",
    500: "#b59856",
    600: "#93793e",
    700: "#7b5f0f",
    800: "#604904",
    900: "#473502",
    950: "#2f2200",
  },
  danger: {
    50: "#fff7f1",
    100: "#feeee4",
    150: "#fce6d9",
    200: "#f7d9c7",
    300: "#f0c7b1",
    400: "#e3ad90",
    500: "#cf8766",
    600: "#b9613e",
    700: "#ae4e2a",
    800: "#7f3119",
    900: "#611f0e",
    950: "#440e04",
  },
};

// "Current" is whatever globals.css holds, so it needs no values.
const PALETTES: Record<string, Palette | null> = {
  Current: null,
  "Wine accent": { accent: WINE },
  "Old: green + burgundy": OLD,
};

// Written out in full: Tailwind only finds class names it can read whole.
const SWATCHES = [
  ["bg-neutral-300", "bg-neutral-800"],
  ["bg-primary-300", "bg-primary-800"],
  ["bg-secondary-300", "bg-secondary-800"],
  ["bg-accent-300", "bg-accent-800"],
];

function entries(palette: Palette | null) {
  if (!palette) return [];
  return Object.entries(palette).flatMap(([role, scale]) =>
    Object.entries(scale).map(([step, hex]) => [
      `--color-${role}-${step}`,
      hex,
    ]),
  );
}

// Each palette's `--color-*` overrides, worked out once.
const OVERRIDES = Object.fromEntries(
  Object.entries(PALETTES).map(([name, palette]) => [name, entries(palette)]),
);

// The overrides now on <html>, so a change clears only those.
let applied: string[][] = [];

// Overrides the @theme variables on <html>; every Tailwind colour reads them.
function apply(name: string) {
  const root = document.documentElement.style;
  for (const [key] of applied) root.removeProperty(key);
  applied = OVERRIDES[name] ?? [];
  for (const [key, hex] of applied) root.setProperty(key, hex);
}

function toCss(name: string) {
  return OVERRIDES[name].map(([key, hex]) => `  ${key}: ${hex};`).join("\n");
}

// `?palette=on` / `?palette=off` on any host page; remembered until switched off. Read once per page load.
let switcher: boolean | undefined;
function switcherOn() {
  if (switcher === undefined) {
    try {
      const param = new URLSearchParams(location.search).get("palette");
      if (param === "on") localStorage.setItem(SWITCH_KEY, "on");
      if (param === "off") localStorage.removeItem(SWITCH_KEY);
      switcher = localStorage.getItem(SWITCH_KEY) === "on";
    } catch {
      switcher = false;
    }
  }
  return switcher;
}

const noSubscribe = () => () => {};

function savedPalette() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved in PALETTES) return saved;
  } catch {}
  return "Current";
}

export function PalettePicker() {
  // Off on the server's render, so the button only appears once the page has loaded.
  const enabled = useSyncExternalStore(noSubscribe, switcherOn, () => false);
  return enabled ? <Picker /> : null;
}

/** The button and its panel, mounted only while the switcher is on. */
function Picker() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(savedPalette);
  const [copied, setCopied] = useState(false);

  useEffect(() => apply(active), [active]);

  function pick(name: string) {
    setActive(name);
    setCopied(false);
    try {
      localStorage.setItem(STORAGE_KEY, name);
    } catch {}
  }

  async function copy() {
    await navigator.clipboard.writeText(toCss(active));
    setCopied(true);
  }

  return (
    <div className="fixed right-4 bottom-4 z-[60] flex flex-col items-end gap-2 font-sans">
      {open && (
        <div className={`flex w-52 flex-col gap-1 p-2 ${MENU_SURFACE}`}>
          <p className="px-2 py-1 label-caps text-neutral-600">Palette (dev)</p>
          {Object.keys(PALETTES).map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => pick(name)}
              className={`rounded-ui px-2 py-1.5 text-left row-text transition-colors ${
                name === active
                  ? "bg-primary-800 text-neutral-50"
                  : "text-neutral-900 hover:bg-neutral-100"
              }`}
            >
              {name}
            </button>
          ))}
          <div className="mt-1 flex gap-1 px-2 py-1">
            {SWATCHES.map(([light, dark]) => (
              <span key={light} className="flex flex-1 flex-col gap-0.5">
                <span className={`h-4 rounded-ui ${light}`} />
                <span className={`h-4 rounded-ui ${dark}`} />
              </span>
            ))}
          </div>
          {PALETTES[active] && (
            <button
              type="button"
              onClick={copy}
              className="rounded-ui px-2 py-1.5 text-left hint-text text-neutral-700 hover:bg-neutral-100"
            >
              {copied ? "Copied" : "Copy CSS"}
            </button>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Switch palette"
        className="grid size-10 place-items-center rounded-full border border-neutral-400 bg-neutral-50 shadow-menu"
      >
        <span className="grid size-6 grid-cols-2 overflow-hidden rounded-full">
          <span className="bg-neutral-300" />
          <span className="bg-primary-800" />
          <span className="bg-secondary-600" />
          <span className="bg-accent-800" />
        </span>
      </button>
    </div>
  );
}
