"use client";

import { createContext } from "react";
import type { ColorRole } from "@/types/modular";

/**
 * The invitation's palette colours, for a colour field holding a role
 * ("accent") to open its picker on. Null outside the Content tab.
 */
export const PaletteColors = createContext<Record<ColorRole, string> | null>(
  null,
);
