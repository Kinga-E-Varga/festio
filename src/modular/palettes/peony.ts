import type { ModularPalette } from "@/types/modular";

/** Plum-rose with sage green and a sage band, on cream and blush surfaces and a dusty rose ground. */
export const palette: ModularPalette = {
  id: "peony",
  name: "Peony",
  mood: "balanced",
  colors: {
    surface: "#fbefe0",
    "surface-alt": "#f3d9d1",
    ink: "#3a272b",
    "ink-muted": "#6e575b",
    line: "#e3c3c1",
    accent: "#82424e",
    "accent-ink": "#fff8f4",
    "accent-soft": "#e9babd",
    secondary: "#466227",
    "secondary-ink": "#f7faef",
    "secondary-soft": "#ccd6ba",
    tertiary: "#8ea66b",
    "tertiary-ink": "#16200b",
    error: "#b3261e",
  },
  envelope: {
    paper: "#b79681",
    liner: "#694542",
    string: "liner",
    seal: "#4d612f",
    tag: "surface",
    shadow: "#6d4e44",
    ground: "surface-alt",
  },
};
