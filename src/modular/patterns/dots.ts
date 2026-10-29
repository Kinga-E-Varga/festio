import type { ModularPattern } from "@/types/modular";

/**
 * `--m-pattern` polka dots, 3px across: each row shifted half a step from the one above,
 * so they sit dot – space – dot, then space – dot – space. Two dot layers on
 * one 36px tile, the second moved 18px across and 18px down.
 */
export const pattern: ModularPattern = {
  id: "dots",
  name: "Polka",
  className:
    "bg-[image:radial-gradient(circle,var(--m-pattern)_1.5px,transparent_2px),radial-gradient(circle,var(--m-pattern)_1.5px,transparent_2px)] bg-[length:36px_36px] bg-[position:0_0,18px_18px]",
};
