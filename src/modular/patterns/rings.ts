import type { ModularPattern } from "@/types/modular";

/**
 * `--m-pattern` concentric rings, overlapping: on one 150px tile, a bullseye
 * on its middle, one moved half a tile across and down, and quarters of two
 * more at its corners, so they lie in a staggered grid. Each is ten 7.5px
 * bands from the centre out, every other one the pattern colour; the rest the
 * surface (`--m-surface`: patterns sit only on it), so the bullseye on top
 * hides the rings under it. The bands are written once, as `--rings`.
 */
export const pattern: ModularPattern = {
  id: "rings",
  name: "Rings",
  className:
    "[--rings:var(--m-surface)_0%_5%,var(--m-pattern)_6%_15%,var(--m-surface)_16%_25%,var(--m-pattern)_26%_35%,var(--m-surface)_36%_45%,var(--m-pattern)_46%_55%,var(--m-surface)_56%_65%,var(--m-pattern)_66%_75%,var(--m-surface)_76%_85%,var(--m-pattern)_86%_95%,transparent_96%] bg-[image:radial-gradient(50%_50%_at_100%_0,var(--rings)),radial-gradient(50%_50%_at_0_100%,var(--rings)),radial-gradient(50%_50%,var(--rings)),radial-gradient(50%_50%,var(--rings))] bg-[length:150px_150px] bg-[position:0_0,0_0,0_0,75px_75px]",
};
