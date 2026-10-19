const SVG_NS = "http://www.w3.org/2000/svg";
/** Where the words sit along the tag, as a share of its length from the hole. */
const TAG_AT = 0.53;
/** The words' size before fitting, in the drawing's units (as `.env-tag-text`). */
const TAG_SIZE = 5.5;
/** The words' largest size on screen, in CSS px: big envelopes don't need them bigger. */
const TAG_MAX_PX = 28;

/**
 * The tag's words, written along the tag from its bottom up toward the hole,
 * shrunk to fit inside it and never above `TAG_MAX_PX` on screen. The tag's
 * direction comes from its shape (hole → the paper's centre), so a tag drawn
 * at any angle works. Then, unless `measureHover` is off, the tag's hover
 * area: its paper's box at rest.
 */
export function placeTag(
  root: HTMLElement,
  lines: string[],
  measureHover = true,
) {
  for (const text of root.querySelectorAll<SVGTextElement>(".env-tag-text")) {
    const group = text.parentNode as SVGGraphicsElement;
    const paper = group.querySelector<SVGGeometryElement>(".env-tag-paper");
    const ring = group.querySelector<SVGGraphicsElement>(".env-tag-hole");
    const paperCtm = paper?.getCTM();
    const ringCtm = ring?.getCTM();
    const groupCtm = group.getCTM();
    if (!paper || !ring || !paperCtm || !ringCtm || !groupCtm) continue;
    const toPaper = paperCtm.inverse().multiply(ringCtm);
    const rb = ring.getBBox();
    const hole = new DOMPoint(
      rb.x + rb.width / 2,
      rb.y + rb.height / 2,
    ).matrixTransform(toPaper);
    const length = paper.getTotalLength();
    const pts = Array.from({ length: 240 }, (_, k) =>
      paper.getPointAtLength((length * k) / 240),
    );
    let area = 0;
    let cx = 0;
    let cy = 0;
    pts.forEach((p, k) => {
      const q = pts[(k + 1) % pts.length];
      const c = p.x * q.y - q.x * p.y;
      area += c;
      cx += (p.x + q.x) * c;
      cy += (p.y + q.y) * c;
    });
    cx /= 3 * area;
    cy /= 3 * area;
    const d = Math.hypot(cx - hole.x, cy - hole.y);
    const ax = (cx - hole.x) / d;
    const ay = (cy - hole.y) / d;
    /* Length along the tag from the hole, and half its width across. */
    let long = 0;
    let wide = 0;
    for (const p of pts) {
      long = Math.max(long, (p.x - hole.x) * ax + (p.y - hole.y) * ay);
      wide = Math.max(wide, Math.abs((p.x - cx) * ay - (p.y - cy) * ax));
    }
    const x = hole.x + ax * long * TAG_AT;
    const y = hole.y + ay * long * TAG_AT;
    const deg = (Math.atan2(-ay, -ax) * 180) / Math.PI;
    text.replaceChildren(
      ...lines.map((line, k) => {
        const span = document.createElementNS(SVG_NS, "tspan");
        span.textContent = line;
        span.setAttribute("x", String(x));
        span.setAttribute(
          "dy",
          k ? "1.05em" : `${-0.525 * (lines.length - 1)}em`,
        );
        return span;
      }),
    );
    /* The paper may be drawn scaled; the text shares its coordinates, so undo its scale. */
    const pm = groupCtm.inverse().multiply(paperCtm);
    const unscale = 1 / Math.sqrt(Math.abs(pm.a * pm.d - pm.b * pm.c));
    text.style.fontSize = `${TAG_SIZE * unscale}px`;
    text.setAttribute("x", String(x));
    text.setAttribute("y", String(y));
    text.dataset.base ??= text.getAttribute("transform") ?? "";
    text.setAttribute(
      "transform",
      `${text.dataset.base} rotate(${deg} ${x} ${y})`,
    );
    /* Fit: along the tag, the part below the hole; across, most of its width. */
    const bb = text.getBBox();
    const fit = Math.min(
      (long * (1 - TAG_AT) * 2 * 0.9) / bb.width,
      (wide * 2 * 0.8) / bb.height,
    );
    /* On screen: the CTM runs to the drawing's viewport, so the layers' own moves are left out. */
    const ctm = text.getCTM();
    const perUnit = ctm
      ? Math.sqrt(Math.abs(ctm.a * ctm.d - ctm.b * ctm.c))
      : 0;
    const size = TAG_SIZE * Math.min(fit, 1) * unscale;
    const cap = perUnit ? TAG_MAX_PX / perUnit : size;
    text.style.fontSize = `${Math.min(size, cap)}px`;
  }
  if (!measureHover) return;
  const env = root.querySelector<HTMLElement>(".env");
  const paper = root.querySelector(".env-tag .env-tag-paper");
  if (!env || !paper) return;
  const e = env.getBoundingClientRect();
  /* Not laid out yet (a hidden parent): nothing to measure against. */
  if (!e.width || !e.height) return;
  const r = paper.getBoundingClientRect();
  env.style.setProperty(
    "--env-tag-x",
    `${((r.left - e.left) / e.width) * 100}%`,
  );
  env.style.setProperty(
    "--env-tag-y",
    `${((r.top - e.top) / e.height) * 100}%`,
  );
  env.style.setProperty("--env-tag-w", `${(r.width / e.width) * 100}%`);
  env.style.setProperty("--env-tag-h", `${(r.height / e.height) * 100}%`);
}
