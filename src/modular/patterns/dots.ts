import type { ModularPattern } from "@/types/modular";

/**
 * Small `--m-line` polka dots: each row shifted half a step from the one above,
 * so they sit dot – space – dot, then space – dot – space. Two dot layers on
 * one 28px tile, the second moved 14px across and 14px down.
 */
export const pattern: ModularPattern = {
  id: "dots",
  name: "Dots",
  className:
    "bg-[image:radial-gradient(circle,var(--m-line)_1.5px,transparent_2px),radial-gradient(circle,var(--m-line)_1.5px,transparent_2px)] bg-[length:28px_28px] bg-[position:0_0,14px_14px]",
};
