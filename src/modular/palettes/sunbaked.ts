import type { ModularPalette } from "@/types/modular";

/** Jade green with bright orange and a sunflower band, on a sandy ground. */
export const palette: ModularPalette = {
  id: "sunbaked",
  name: "Sunbaked",
  mood: "vivid",
  colors: {
    surface: "#fdf5e2",
    "surface-alt": "#f4e9d1",
    ink: "#241B0F",
    "ink-muted": "#695B47",
    line: "#D6BD95",
    accent: "#00967b",
    "accent-ink": "#fdfbf5",
    "accent-soft": "#d4f7d9",
    secondary: "#cb4700",
    "secondary-ink": "#FFFCF4",
    "secondary-soft": "#EDDCBD",
    tertiary: "#FBCB21",
    "tertiary-ink": "#332617",
    error: "#b02a2c",
  },
  envelope: {
    paper: "#b9926c",
    liner: "#137765",
    string: "#6e553c",
    seal: "liner",
    tag: "surface",
    shadow: "#725f36",
    ground: "surface-alt",
  },
};
