import type { ModularPattern } from "@/types/modular";

/** `--m-pattern` checkerboard of 16px squares: one conic layer on a 32px tile, two quarters filled. */
export const pattern: ModularPattern = {
  id: "checks",
  name: "Checks",
  className:
    "bg-[image:repeating-conic-gradient(var(--m-pattern)_0_25%,transparent_0_50%)] bg-[length:32px_32px]",
};
