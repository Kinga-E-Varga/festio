import type { ModularPalette } from "@/types/modular";

/** Olive and terracotta on a deep green-black, with a soft gold band, on a light beige ground. */
export const palette: ModularPalette = {
  id: "orchard",
  name: "Orchard",
  mood: "subtle",
  colors: {
    surface: "#22251f",
    "surface-alt": "#2c3028",
    ink: "#f0eee5",
    "ink-muted": "#b2b6a7",
    line: "#41463b",
    accent: "#a8b891",
    "accent-ink": "#1a2118",
    "accent-soft": "#353f30",
    secondary: "#d88d6d",
    "secondary-ink": "#241812",
    "secondary-soft": "#463127",
    tertiary: "#dfbf76",
    "tertiary-ink": "#2a251a",
    error: "#ef8a7e",
  },
  envelope: {
    paper: "#a9b489",
    liner: "#42483b",
    string: "liner",
    seal: "#98533c",
    tag: "#f3eedd",
    shadow: "#434b35",
    ground: "#dfd8c7",
  },
};
