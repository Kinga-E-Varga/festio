import type { ModularPattern } from "@/types/modular";

/**
 * `--m-pattern` leaves in rows 40px tall, each curving into the next. Over a
 * checkerboard of `--m-pattern` and `--m-surface` (patterns sit only on it),
 * 40px squares moved 20px across, a pattern disc fills every 40px cell, and
 * surface discs (40px, on an 80px tile and again moved 40px across and down)
 * cut its other side. The surface disc is written once, as `--leaf-cut`.
 */
export const pattern: ModularPattern = {
  id: "leaves",
  name: "Leaves",
  className:
    "[--leaf-cut:radial-gradient(25%_25%_at_25%_25%,var(--m-surface)_99%,transparent_101%)] bg-[image:var(--leaf-cut),var(--leaf-cut),radial-gradient(50%_50%,var(--m-pattern)_98%,transparent),repeating-conic-gradient(var(--m-pattern)_0_25%,var(--m-surface)_0_50%)] bg-[length:80px_80px,80px_80px,40px_40px,80px_40px] bg-[position:40px_40px,0_0,0_0,20px_0]",
};
