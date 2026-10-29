import type { ModularPattern } from "@/types/modular";

/** `--m-pattern` upright stripes: a 5px band every 25px, as Lines turned on its side. */
export const pattern: ModularPattern = {
  id: "columns",
  name: "Columns",
  className:
    "bg-[image:repeating-linear-gradient(90deg,var(--m-pattern)_0_5px,transparent_5px_25px)]",
};
