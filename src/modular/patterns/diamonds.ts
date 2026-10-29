import type { ModularPattern } from "@/types/modular";

/**
 * `--m-pattern` nested diamonds, three rings each: groups of three diagonal
 * stripes rising and falling at 45°, crossing. On one 120px tile, each
 * direction twice, the second copy moved 60px across and down. The stripes
 * are written once, as `--diamonds`.
 */
export const pattern: ModularPattern = {
  id: "diamonds",
  name: "Diamonds",
  className:
    "[--diamonds:transparent_calc(-650%/13)_calc(50%/13),var(--m-pattern)_0_calc(100%/13),transparent_0_calc(150%/13),var(--m-pattern)_0_calc(200%/13),transparent_0_calc(250%/13),var(--m-pattern)_0_calc(300%/13)] bg-[image:repeating-linear-gradient(45deg,var(--diamonds)),repeating-linear-gradient(45deg,var(--diamonds)),repeating-linear-gradient(-45deg,var(--diamonds)),repeating-linear-gradient(-45deg,var(--diamonds))] bg-[length:120px_120px] bg-[position:0_0,60px_60px,0_0,60px_60px]",
};
