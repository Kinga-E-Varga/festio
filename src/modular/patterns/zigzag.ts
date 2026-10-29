import type { ModularPattern } from "@/types/modular";

/**
 * `--m-pattern` zigzag bands across the surface. Two layers on one 32px tile,
 * each a quarter-turn wedge (a triangle): one pointing down, one pointing up
 * and moved 16px across, so they meet in a zigzag.
 */
export const pattern: ModularPattern = {
  id: "zigzag",
  name: "Zigzag",
  className:
    "bg-[image:conic-gradient(from_-45deg,var(--m-pattern)_90deg,transparent_90.5deg),conic-gradient(from_135deg,var(--m-pattern)_90deg,transparent_90.5deg)] bg-[length:32px_32px] bg-[position:0_0,16px_0]",
};
