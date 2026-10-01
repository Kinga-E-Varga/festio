import type { ModularTemplate } from "@/types/modular";
import { template as garden } from "../garden";

/**
 * Garden's sections in Midnight and Script — proof that swapping a palette
 * and a pair restyles everything. The section list is Garden's own, not a
 * copy, so the two can't drift.
 */
export const template: ModularTemplate = {
  ...garden,
  id: "garden-midnight",
  name: "Garden Midnight",
  palette: "midnight",
  fontPair: "script",
};
