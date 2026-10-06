#!/usr/bin/env node
// Checks modular palettes for readability and separation, and writes a swatch page.
//
//   node .claude/skills/palette/check.mjs --all
//   node .claude/skills/palette/check.mjs src/modular/palettes/noir.ts drafts.json
//   node .claude/skills/palette/check.mjs drafts.json --out /tmp/swatch.html
//
// Inputs: palette .ts files, or a .json file holding one palette or an array of
// them ({ id, name, mood, colors }). `--all` adds every file in src/modular/palettes.
// Exit code 1 when any text pair fails.

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../../..");
const PALETTES = join(ROOT, "src/modular/palettes");

/* ── Colour maths ─────────────────────────────────────────────────── */

function parse(color) {
  const c = color.trim().toLowerCase();
  const rgb = c.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/);
  if (rgb) return rgb.slice(1, 4).map(Number);
  let hex = c.replace("#", "");
  if (hex.length === 3) hex = [...hex].map((x) => x + x).join("");
  if (!/^[0-9a-f]{6}$/.test(hex))
    throw new Error(`Can't read colour "${color}"`);
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

const toLinear = (v) => {
  v /= 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const fromLinear = (v) => {
  const s = v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055;
  return Math.round(Math.min(1, Math.max(0, s)) * 255);
};

function luminance(rgb) {
  const [r, g, b] = rgb.map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

function oklab(rgb) {
  const [r, g, b] = rgb.map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function fromOklab([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(fromLinear);
}

/** `color-mix(in oklab, a, b <share>)`, as `vars.ts` mixes the muted band inks. */
function mix(a, b, share) {
  const [p, q] = [oklab(a), oklab(b)];
  return fromOklab(p.map((v, i) => v * (1 - share) + q[i] * share));
}

function lch(rgb) {
  const [L, a, b] = oklab(rgb);
  return {
    L,
    C: Math.hypot(a, b),
    h: ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360,
  };
}

const distance = (a, b) => {
  const [p, q] = [oklab(a), oklab(b)];
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
};

/* ── Reading palettes ─────────────────────────────────────────────── */

function readTs(path) {
  const src = readFileSync(path, "utf8");
  const field = (name) =>
    src.match(new RegExp(`\\b${name}:\\s*"([^"]*)"`))?.[1];
  const body = src.slice(src.indexOf("colors:"));
  const colors = {};
  for (const [, role, value] of body.matchAll(/"?([a-z-]+)"?:\s*"([^"]+)"/g))
    colors[role] = value;
  return { id: field("id"), name: field("name"), mood: field("mood"), colors };
}

function readInput(path) {
  if (path.endsWith(".json")) {
    const data = JSON.parse(readFileSync(path, "utf8"));
    return Array.isArray(data) ? data : [data];
  }
  return [readTs(path)];
}

/* ── Checks ───────────────────────────────────────────────────────── */

const ROLES = [
  "canvas",
  "surface",
  "surface-alt",
  "ink",
  "ink-muted",
  "line",
  "accent",
  "accent-ink",
  "accent-soft",
  "secondary",
  "secondary-ink",
  "secondary-soft",
  "tertiary",
  "tertiary-ink",
  "error",
];

/*
 * Text on a ground, as the sections draw it: 4.5:1. The accent on its soft
 * tint is only ever an icon on a disc (`TONES` in `styles.ts`): 3:1.
 */
const TEXT = [
  ["ink", "surface"],
  ["ink", "surface-alt"],
  ["ink-muted", "surface"],
  ["ink-muted", "surface-alt"],
  ["secondary", "surface"],
  ["secondary", "surface-alt"],
  ["secondary", "secondary-soft"],
  ["accent", "surface"],
  ["accent", "surface-alt"],
  ["accent", "accent-soft", 3],
  ["ink", "accent-soft"],
  ["ink", "secondary-soft"],
  ["ink-muted", "secondary-soft"],
  ["accent-ink", "accent"],
  ["accent-ink-muted", "accent"],
  ["secondary-ink", "secondary"],
  ["tertiary-ink", "tertiary"],
  ["tertiary-ink-muted", "tertiary"],
  ["error", "surface"],
  ["error", "surface-alt"],
];

/*
 * Grounds that sit side by side and must not blend. Not the canvas: the
 * column casts a shadow on it, so it may sit close to the surfaces.
 */
const STEPS = [
  ["surface", "surface-alt", 1.15],
  ["line", "surface-alt", 1.15],
];
const SOFTS = ["accent-soft", "secondary-soft"];
const HUES = [
  ["accent", "secondary"],
  ["accent", "tertiary"],
  ["secondary", "tertiary"],
];

function check(palette) {
  const missing = ROLES.filter((r) => !palette.colors[r]);
  if (missing.length)
    return {
      fails: [`missing roles: ${missing.join(", ")}`],
      warns: [],
      rows: [],
    };

  const c = Object.fromEntries(ROLES.map((r) => [r, parse(palette.colors[r])]));
  c["accent-ink-muted"] = mix(c["accent-ink"], c.accent, 0.2);
  c["tertiary-ink-muted"] = mix(c["tertiary-ink"], c.tertiary, 0.2);

  const fails = [];
  const warns = [];
  const rows = TEXT.map(([fg, bg, min = 4.5]) => {
    const ratio = contrast(c[fg], c[bg]);
    if (ratio < min)
      fails.push(`${fg} on ${bg}: ${ratio.toFixed(2)} (needs ${min})`);
    return { fg, bg, ratio, min };
  });

  for (const [a, b, min] of STEPS) {
    const ratio = contrast(c[a], c[b]);
    if (+ratio.toFixed(2) < min)
      warns.push(
        `${a} vs ${b}: ${ratio.toFixed(2)}, hard to tell apart (aim for ${min}+)`,
      );
  }
  for (const soft of SOFTS) {
    const ratio = contrast(c[soft], c["surface-alt"]);
    const apart = distance(c[soft], c["surface-alt"]);
    if (ratio < 1.08 && apart < 0.05)
      warns.push(
        `${soft} blends into surface-alt (${ratio.toFixed(2)}, colour distance ${apart.toFixed(3)})`,
      );
  }
  for (const [a, b] of HUES) {
    const [p, q] = [lch(c[a]), lch(c[b])];
    const gap = Math.min(Math.abs(p.h - q.h), 360 - Math.abs(p.h - q.h));
    if (p.C > 0.04 && q.C > 0.04 && gap < 30 && Math.abs(p.L - q.L) < 0.15)
      warns.push(
        `${a} and ${b} look alike: hues ${gap.toFixed(0)}° apart at similar lightness`,
      );
  }
  return { fails, warns, rows };
}

/* ── Swatch page ──────────────────────────────────────────────────── */

function swatch(palettes) {
  const block = (p) => {
    const v = p.colors;
    const chips = ROLES.map(
      (r) =>
        `<div class="chip"><b style="background:${v[r]}"></b><span>${r}<br>${v[r]}</span></div>`,
    ).join("");
    return `<section>
  <h2>${p.name ?? p.id} <small>${p.id ?? ""} · ${p.mood ?? "no mood"}</small></h2>
  <div class="preview" style="background:${v.canvas}">
    <div style="background:${v.surface};color:${v.ink}">
      <p style="color:${v.secondary}" class="eyebrow">Eyebrow in secondary</p>
      <h3>Heading in ink</h3>
      <p style="color:${v["ink-muted"]}">Muted text on the surface.</p>
      <span class="btn" style="background:${v.accent};color:${v["accent-ink"]}">Reply</span>
      <span class="tag" style="background:${v["secondary-soft"]};color:${v.secondary}">Tag</span>
      <span class="tag" style="background:${v["accent-soft"]};color:${v.accent}">Tag</span>
    </div>
    <div style="background:${v["surface-alt"]};color:${v.ink};border-top:1px solid ${v.line}">
      <h3>Surface alt</h3>
      <p style="color:${v["ink-muted"]}">Muted text. <span style="color:${v.error}">An error.</span></p>
    </div>
    <div style="background:${v.tertiary};color:${v["tertiary-ink"]}"><h3>Tertiary band</h3><p>Text on the band.</p></div>
    <div style="background:${v.accent};color:${v["accent-ink"]}"><h3>Accent band</h3><p>Text on the accent.</p></div>
  </div>
  <div class="chips">${chips}</div>
</section>`;
  };
  return `<!doctype html><meta charset="utf-8"><title>Palette swatches</title>
<style>
body{margin:0;padding:24px;font:14px/1.4 system-ui,sans-serif;background:#f4f4f2;color:#222}
section{margin-bottom:40px}h2{margin:0 0 10px;font-size:18px}small{color:#777;font-weight:400}
.preview{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));padding:16px;gap:0;border-radius:6px}
.preview>div{padding:20px}.preview h3{margin:0 0 6px;font:600 20px Georgia,serif}.preview p{margin:0 0 10px}
.eyebrow{font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:600}
.btn,.tag{display:inline-block;padding:6px 14px;border-radius:999px;font-size:12px;font-weight:600;margin-right:6px}
.chips{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px;margin-top:10px}
.chip b{display:block;height:40px;border-radius:4px;border:1px solid #0002}.chip span{font-size:11px;color:#555}
</style>
${palettes.map(block).join("\n")}`;
}

/* ── Run ──────────────────────────────────────────────────────────── */

const args = process.argv.slice(2);
const outAt = args.indexOf("--out");
const out =
  outAt >= 0 ? args.splice(outAt, 2)[1] : join(tmpdir(), "palette-swatch.html");
const files = args.filter((a) => a !== "--all");
if (args.includes("--all"))
  files.unshift(
    ...readdirSync(PALETTES)
      .filter((f) => f.endsWith(".ts"))
      .map((f) => join(PALETTES, f)),
  );
if (!files.length) {
  console.error("Give palette .ts / .json files, or --all.");
  process.exit(2);
}

const palettes = files.flatMap(readInput);
let failed = false;
for (const p of palettes) {
  const { fails, warns, rows } = check(p);
  failed ||= fails.length > 0;
  console.log(
    `\n${p.name ?? p.id} (${p.mood ?? "no mood"}) — ${fails.length ? "FAIL" : "pass"}`,
  );
  for (const r of rows)
    console.log(
      `  ${r.ratio >= r.min ? "ok  " : "FAIL"} ${r.ratio.toFixed(2).padStart(5)}  ${r.fg} on ${r.bg}`,
    );
  for (const f of fails.filter((f) => f.startsWith("missing")))
    console.log(`  FAIL ${f}`);
  for (const w of warns) console.log(`  warn ${w}`);
}
writeFileSync(out, swatch(palettes));
console.log(`\nSwatch page: ${out}`);
process.exit(failed ? 1 : 0);
