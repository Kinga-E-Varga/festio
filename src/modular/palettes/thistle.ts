import type { ModularPalette } from "@/types/modular";

/** Deep plum with sage green and a dusty rose band, on a pale lilac ground. */
export const palette: ModularPalette = {
  id: "thistle",
  name: "Thistle",
  mood: "balanced",
  colors: {
    surface: "#f5eff1",
    "surface-alt": "#e8d9e1",
    ink: "#2a1f2b",
    "ink-muted": "#685d69",
    line: "#d8c5d0",
    accent: "#6b3a5b",
    "accent-ink": "#fbf5f8",
    "accent-soft": "#e0c5d6",
    secondary: "#316847",
    "secondary-ink": "#f4faf6",
    "secondary-soft": "#dcebe2",
    tertiary: "#e9b8c8",
    "tertiary-ink": "#3a1a26",
    error: "#b3261e",
  },
  envelope: {
    paper: "#bb9690",
    liner: "#4e5f54",
    string: "liner",
    seal: "accent",
    tag: "surface",
    shadow: "#693f56",
    ground: "surface-alt",
  },
};
