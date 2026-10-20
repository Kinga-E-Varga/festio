import type { ModularPalette } from "@/types/modular";

/** Steel teal with terracotta and a soft gold band, on a warm beige ground. */
export const palette: ModularPalette = {
  id: "coastal",
  name: "Coastal",
  mood: "subtle",
  colors: {
    surface: "#f5f1ea",
    "surface-alt": "#e8e0d4",
    ink: "#22303b",
    "ink-muted": "#615a53",
    line: "#d0c6b8",
    accent: "#3d5c60",
    "accent-ink": "#f7f6f0",
    "accent-soft": "#c9dcd6",
    secondary: "#934329",
    "secondary-ink": "#fdf6f1",
    "secondary-soft": "#ebd0c3",
    tertiary: "#dcc38e",
    "tertiary-ink": "#33280f",
    error: "#b8322a",
  },
  envelope: {
    paper: "#bea590",
    liner: "accent",
    string: "#7c5c49",
    seal: "liner",
    tag: "#f5efe8",
    shadow: "#7d694d",
    ground: "surface-alt",
  },
};
