/*
 * Look at a page of the running dev server: measure elements, and save a
 * screenshot only when asked. See context/dev-tools/look.md.
 *
 *   npm run look -- [path or url] [options]
 *
 * --width 800,970,1200   page widths, one browser for all (default 1200)
 * --section playlist     the part to look at: #<id>, a modular section
 * --style "Full card"    pick this style for --section (modular preview)
 * --pattern Polka        pick a background pattern (modular preview)
 * --palette Peony        pick a colour palette (modular preview)
 * --measure "svg,h2"     selectors inside the part: size, place, padding
 * --shot                 save a screenshot of the part (default: no)
 * --out <dir>            where screenshots go (default: <tmp>/festio-look)
 *
 * The path defaults to the Olive Garden preview, which runs in memory: no
 * Firestore reads or writes. The envelope is switched off there.
 */
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { chromium } from "playwright";

const { values: opts, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    width: { type: "string", default: "1200" },
    section: { type: "string" },
    style: { type: "string" },
    pattern: { type: "string" },
    palette: { type: "string" },
    measure: { type: "string" },
    shot: { type: "boolean", default: false },
    out: { type: "string", default: join(tmpdir(), "festio-look") },
  },
});

const target = positionals[0] ?? "/templates/olive-garden";
const url = target.startsWith("http")
  ? target
  : `http://localhost:3000${target}`;
const widths = opts.width.split(",").map(Number);

/** Clicks the option named `name` in the Design tab's group `heading`. */
async function pickLook(page, heading, name) {
  const group = page.locator(`[aria-labelledby=design-heading-${heading}]`);
  await group.locator("button").first().click();
  await group.getByRole("button", { name, exact: true }).click();
}

/** The modular preview's Design tab: envelope off, then the picks asked for. */
async function setUp(page) {
  const envelope = page.getByRole("switch", { name: "Use envelope" });
  if (!(await envelope.count())) return;
  if ((await envelope.getAttribute("aria-checked")) === "true") {
    await envelope.click();
  }
  if (opts.palette) await pickLook(page, "palette", opts.palette);
  if (opts.pattern) await pickLook(page, "pattern", opts.pattern);
  if (opts.section && opts.style) {
    const card = page.locator(`#design-card-${opts.section}`);
    await card.scrollIntoViewIfNeeded();
    const on = card.getByRole("switch");
    if (
      (await on.count()) &&
      (await on.getAttribute("aria-checked")) === "false"
    ) {
      await on.click();
    }
    const reveal = card.locator("button[aria-expanded]");
    if ((await reveal.getAttribute("aria-expanded")) === "false") {
      await reveal.click();
    }
    await card
      .locator("button[aria-pressed]")
      .filter({ hasText: new RegExp(`^${opts.style}$`) })
      .click();
  }
}

/** Each selector's box inside the part, relative to it, and its padding. */
function measure(part, selectors) {
  const base = part.getBoundingClientRect();
  return selectors.flatMap((selector) =>
    [...part.querySelectorAll(selector)].slice(0, 3).map((el) => {
      const box = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const pad = [
        style.paddingTop,
        style.paddingRight,
        style.paddingBottom,
        style.paddingLeft,
      ].join(" ");
      return `${selector}: x ${Math.round(box.left - base.left)} y ${Math.round(box.top - base.top)} w ${Math.round(box.width)} h ${Math.round(box.height)} pad ${pad}`;
    }),
  );
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1400, height: 900 },
  });
  await page.goto(url, { waitUntil: "networkidle" });
  await setUp(page);
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(500);
    // The editor's side panel opens again where it fits beside the page.
    const close = page.locator("aside[data-open=true] header button");
    if (await close.isVisible().catch(() => false)) {
      await close.click();
      await page.waitForTimeout(500);
    }
    const part = opts.section
      ? page.locator(`#${opts.section}`).first()
      : page.locator("body");
    await part.scrollIntoViewIfNeeded();
    const box = await part.boundingBox();
    console.log(
      `${width}px: ${opts.section ?? "page"} w ${Math.round(box.width)} h ${Math.round(box.height)}`,
    );
    if (opts.measure) {
      const lines = await part.evaluate(
        measure,
        opts.measure.split(",").map((s) => s.trim()),
      );
      for (const line of lines) console.log(`  ${line}`);
    }
    if (opts.shot) {
      mkdirSync(opts.out, { recursive: true });
      const file = join(opts.out, `${opts.section ?? "page"}-${width}.png`);
      await (opts.section ? part : page).screenshot({ path: file });
      console.log(`  shot: ${file}`);
    }
  }
} finally {
  await browser.close();
}
