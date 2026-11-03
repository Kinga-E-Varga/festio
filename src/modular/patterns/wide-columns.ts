import type { ModularPattern } from "@/types/modular";

/** `--m-pattern` upright stripes as Columns', but wide: a 36px band every 72px, like an awning. */
export const pattern: ModularPattern = {
  id: "wide-columns",
  name: "Wide columns",
  className:
    "bg-[image:repeating-linear-gradient(90deg,var(--m-pattern)_0_36px,transparent_36px_72px)]",
};
