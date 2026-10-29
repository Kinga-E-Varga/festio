import type { SectionGround } from "@/types/modular";

/*
 * By the ground the record sits on: the colour it is mixed from
 * (`--record-base`, the ground's own). Written out whole, as Tailwind only
 * sees whole class names.
 */
const ON: Record<SectionGround, string> = {
  accent: "[--record-base:var(--m-accent)]",
  surface: "[--record-base:var(--m-surface)]",
  "surface-alt": "[--record-base:var(--m-surface-alt)]",
};

/* The label's colour: by default the secondary on the accent, the accent on a surface. */
const LABEL = {
  accent: "[--record-label:var(--m-accent)]",
  secondary: "[--record-label:var(--m-secondary)]",
};

/**
 * The record's size, 180px on a phone and 260px from `@3xl`, as
 * `--record`: set on the record, and on whatever lays itself out around
 * it (Full card, `3`), so the size is written only here.
 */
export const RECORD_SIZE = "[--record:180px] @3xl:[--record:260px]";

/**
 * A drawn record, in its ground's colour (`on`). On a light ground the disc,
 * the hole and the shadow are mixed from that colour toward black, so any
 * palette gets a dark disc that matches its ground; the disc stops at a set
 * darkness, so it never turns grey. The grooves and rim are lighter than the
 * disc by a step that shrinks a little as the ground gets lighter, so they
 * show about the same on a light ground and a dark one; a ground darker than
 * Peony's accent gets them a touch lighter still. On a dark ground (a dark
 * page's surface, below 0.36 lightness; no accent is that dark) the record
 * is lighter than the page instead: the disc a step above it, the grooves a
 * step above the disc. A soft sheen on two opposite sides of the disc and its
 * label (not the hole) lights the grooves. The label is the secondary colour
 * on the accent band, the accent on a surface.
 */
export function Record({
  on,
  label = on === "accent" ? "secondary" : "accent",
}: {
  on: SectionGround;
  /** The label's colour, past its ground's default: Card accent's, on the accent card. */
  label?: keyof typeof LABEL;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative ${ON[on]} ${LABEL[label]} ${RECORD_SIZE} size-(--record) shrink-0 drop-shadow-xl drop-shadow-(color:--record-shadow)/70 [--record-line:oklch(from_var(--record-base)_calc((l_*_0.2_+_0.145_+_clamp(0,(0.46_-_l)_*_100,1)_*_0.015)_*_(1_-_clamp(0,(0.36_-_l)_*_100,1))_+_(l_+_0.15)_*_clamp(0,(0.36_-_l)_*_100,1))_calc(c*0.5)_h)] [--record-shadow:color-mix(in_oklab,var(--record-base),black_55%)]`}
    >
      <svg viewBox="0 0 260 260" className="size-full">
        <circle
          cx="130"
          cy="130"
          r="128"
          strokeWidth="2"
          className="fill-[oklch(from_var(--record-base)_calc(min(l_*_0.3,0.17)_*_(1_-_clamp(0,(0.36_-_l)_*_100,1))_+_(l_+_0.05)_*_clamp(0,(0.36_-_l)_*_100,1))_calc(c*0.3)_h)] stroke-(--record-line)"
        />
        {[104, 84, 64].map((radius) => (
          <circle
            key={radius}
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            strokeWidth="1.5"
            className="stroke-(--record-line)"
          />
        ))}
        <circle cx="130" cy="130" r="40" className="fill-(--record-label)" />
        <circle
          cx="130"
          cy="130"
          r="5"
          className="fill-[color-mix(in_oklab,var(--record-base),black_30%)]"
        />
      </svg>
      <div className="absolute inset-[1%] rounded-full bg-[conic-gradient(from_20deg,transparent,rgb(255_255_255/0.14)_30deg,transparent_70deg,transparent_180deg,rgb(255_255_255/0.14)_210deg,transparent_250deg)] [mask-image:radial-gradient(circle_closest-side,transparent_4%,black_4.5%)]" />
    </div>
  );
}
