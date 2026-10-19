import type { CSSProperties } from "react";
import type { EnvelopeColors, EnvelopeRole } from "@/types/envelope";

/* Hue + Vivid, fixed: shadows turn toward cold, highlights toward warm (OKLCH degrees). */
const SHADOW_TURN = 10;
const HIGHLIGHT_TURN = 15;
const COLD = 235;
const WARM = 55;
/* How much more colour highlights and shadows get (1 = none added). */
const VIVID = 1.5;
const VIVID_SHADOW = 1.15;

/** The roles the drawing shades; the cast shadow keeps its own colour. */
const SHADED = ["paper", "liner", "string", "tag", "seal"] as const;

const HEX = /^#[0-9a-f]{6}$/i;

/** A role's hex, following roles that name another. A loop or a bad hex is a typo in a palette file. */
export function roleColor(
  colors: EnvelopeColors,
  role: EnvelopeRole,
  seen: EnvelopeRole[] = [],
): string {
  const value = colors[role];
  if (value.startsWith("#")) {
    if (!HEX.test(value))
      throw new Error(
        `Envelope colour "${role}" is not a 6-digit hex: ${value}`,
      );
    return value;
  }
  if (seen.includes(role))
    throw new Error(`Envelope colours loop: ${[...seen, role].join(" → ")}`);
  return roleColor(colors, value as EnvelopeRole, [...seen, role]);
}

type Triple = [number, number, number];
const lin = (v: number) =>
  v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
const gam = (v: number) =>
  v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055;

function toLab(hex: string): Triple {
  const [r, g, b] = [1, 3, 5].map((i) =>
    lin(parseInt(hex.slice(i, i + 2), 16) / 255),
  );
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function toRgb([L, a, b]: Triple): Triple {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const fits = (rgb: Triple) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);

/*
 * An OKLCH colour as hex. Past what the screen shows, only its chroma gives
 * way: a colour off the screen, blurred and blended, came out as cyan specks
 * in Chrome.
 */
function toHex(L: number, C: number, H: number): string {
  const lab = (c: number): Triple => [
    L,
    c * Math.cos((H * Math.PI) / 180),
    c * Math.sin((H * Math.PI) / 180),
  ];
  let lo = 0;
  let hi = C;
  if (!fits(toRgb(lab(hi)))) {
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (fits(toRgb(lab(mid)))) lo = mid;
      else hi = mid;
    }
    hi = lo;
  }
  const channel = (v: number) =>
    Math.round(
      Math.min(1, Math.max(0, gam(Math.min(1, Math.max(0, v))))) * 255,
    );
  return (
    "#" +
    toRgb(lab(hi))
      .map((v) => channel(v).toString(16).padStart(2, "0"))
      .join("")
  );
}

/** Hue h turned by up to deg degrees toward target, the short way, stopping there. */
function toward(h: number, target: number, deg: number): number {
  const gap = ((target - h + 540) % 360) - 180;
  return h + Math.sign(gap) * Math.min(Math.abs(gap), deg);
}

function shade(
  hex: string,
  turn: { to: number; deg: number },
  boost: number,
  white: boolean,
): string {
  let [L, a, b] = toLab(hex);
  if (white) [L, a, b] = [(L + 1) / 2, a / 2, b / 2];
  const C = Math.hypot(a, b) * boost;
  const hue = ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
  return toHex(L, C, toward(hue, turn.to, turn.deg));
}

/**
 * The envelope's colours as the drawing reads them: `--env-<role>`, and for
 * each shaded role its shadow (`-mul`, drawn multiplied) and highlight
 * (`-scr`, drawn screened).
 */
export function envelopeVars(colors: EnvelopeColors): CSSProperties {
  const vars: Record<string, string> = {
    "--env-shadow": roleColor(colors, "shadow"),
    "--env-cast": "var(--env-shadow)",
    "--env-text": "var(--env-liner)",
  };
  for (const role of SHADED) {
    const hex = roleColor(colors, role);
    vars[`--env-${role}`] = hex;
    vars[`--env-${role}-mul`] = shade(
      hex,
      { to: COLD, deg: SHADOW_TURN },
      VIVID_SHADOW,
      false,
    );
    vars[`--env-${role}-scr`] = shade(
      hex,
      { to: WARM, deg: HIGHLIGHT_TURN },
      VIVID,
      true,
    );
  }
  return vars as CSSProperties;
}
