import type { ModularPattern } from "@/types/modular";

/** `--m-pattern` diagonal stripes: a 5px band every 25px, rising to the right at 45°. */
export const pattern: ModularPattern = {
  id: "stripes",
  name: "Stripes",
  className:
    "bg-[image:repeating-linear-gradient(-45deg,var(--m-pattern)_0_5px,transparent_5px_25px)]",
};
