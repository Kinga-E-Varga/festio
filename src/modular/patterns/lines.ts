import type { ModularPattern } from "@/types/modular";

/** `--m-pattern` level stripes: a 5px band every 25px. */
export const pattern: ModularPattern = {
  id: "lines",
  name: "Lines",
  className:
    "bg-[image:repeating-linear-gradient(var(--m-pattern)_0_5px,transparent_5px_25px)]",
};
