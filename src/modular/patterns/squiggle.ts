import type { ModularPattern } from "@/types/modular";

/**
 * `--m-pattern` wavy lines, 4px thick, a row every 30px. Two half-ring
 * layers (radius 8–12px) on one 40 × 30px tile: arcs bowing up from the
 * tile's foot, and arcs bowing down from its top moved 20px across, so they
 * meet end to end in one squiggle.
 */
export const pattern: ModularPattern = {
  id: "squiggle",
  name: "Squiggle",
  className:
    "bg-[image:radial-gradient(circle_at_50%_100%,transparent_7.5px,var(--m-pattern)_8px_12px,transparent_12.5px),radial-gradient(circle_at_50%_0,transparent_7.5px,var(--m-pattern)_8px_12px,transparent_12.5px)] bg-[length:40px_30px] bg-[position:0_0,-20px_0]",
};
