import type { ModularPalette } from "@/types/modular";

/** Light periwinkle with pink raspberry and a mint band, on deep indigo surfaces and a cool grey ground. */
export const palette: ModularPalette = {
  id: "y2k",
  name: "Y2K",
  mood: "vivid",
  colors: {
    surface: "#14162a",
    "surface-alt": "#272b48",
    ink: "#eef0fa",
    "ink-muted": "#a9adc4",
    line: "#3d4263",
    accent: "#a9aef0",
    "accent-ink": "#181a33",
    "accent-soft": "#2c3058",
    secondary: "#f08fb0",
    "secondary-ink": "#2d0f1b",
    "secondary-soft": "#3f2236",
    tertiary: "#a8d8c0",
    "tertiary-ink": "#12291e",
    error: "#f2837a",
  },
  envelope: {
    paper: "#ac8f88",
    liner: "#2f3154",
    string: "#45476c",
    seal: "#25785a",
    tag: "ink",
    shadow: "#49549a",
    ground: "#d1d3ec",
  },
};
