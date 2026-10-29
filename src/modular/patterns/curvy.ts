import type { ModularPattern } from "@/types/modular";

/**
 * `--m-pattern` curves: rings that link into a wavy chain. A 40px ring in every cell, and
 * over it a checkerboard of 80px tiles whose filled squares are the surface
 * (`--m-surface`: patterns sit only on it) and hide that cell's ring; four
 * quarter-ring layers draw the arcs that link the rings across the squares.
 */
export const pattern: ModularPattern = {
  id: "curvy",
  name: "Curvy",
  className:
    "bg-[image:radial-gradient(35.36%_35.36%_at_100%_25%,transparent_66%,var(--m-pattern)_68%_70%,transparent_72%),radial-gradient(35.36%_35.36%_at_0_75%,transparent_66%,var(--m-pattern)_68%_70%,transparent_72%),radial-gradient(35.36%_35.36%_at_100%_25%,transparent_66%,var(--m-pattern)_68%_70%,transparent_72%),radial-gradient(35.36%_35.36%_at_0_75%,transparent_66%,var(--m-pattern)_68%_70%,transparent_72%),repeating-conic-gradient(var(--m-surface)_0_25%,transparent_0_50%),radial-gradient(transparent_66%,var(--m-pattern)_68%_70%,transparent_72%)] bg-[length:80px_80px,80px_80px,80px_80px,80px_80px,80px_80px,40px_40px] bg-[position:40px_40px,40px_40px,0_0,0_0,0_0,0_20px]",
};
