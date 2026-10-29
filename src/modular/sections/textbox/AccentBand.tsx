import type { ReactNode } from "react";
import { ON_ACCENT, PAD } from "@/modular/styles";

/**
 * The accent band, as Playlist's Accent: everything in it in the band's
 * ink. Simple accent (`2`) and Quote accent (`7`).
 */
export function AccentBand({ children }: { children: ReactNode }) {
  return <div className={`${ON_ACCENT} ${PAD}`}>{children}</div>;
}
