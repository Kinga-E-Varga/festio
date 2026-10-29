import type { ModularPattern } from "@/types/modular";

/** `--m-pattern` thin diagonal stripes: a 2px line every 24px, rising to the right at 45°. */
export const pattern: ModularPattern = {
  id: "pinstripes",
  name: "Pinstripes",
  className:
    "bg-[image:repeating-linear-gradient(-45deg,var(--m-pattern)_0_2px,transparent_2px_24px)]",
};
