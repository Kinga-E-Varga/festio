import type { ModularPattern } from "@/types/modular";

/**
 * `--m-pattern` polka dots as Polka's, but 10px across: two dot layers on one
 * 60px tile, the second moved 30px across and 30px down.
 */
export const pattern: ModularPattern = {
  id: "big-dots",
  name: "Big polka",
  className:
    "bg-[image:radial-gradient(circle,var(--m-pattern)_5px,transparent_5.5px),radial-gradient(circle,var(--m-pattern)_5px,transparent_5.5px)] bg-[length:60px_60px] bg-[position:0_0,30px_30px]",
};
