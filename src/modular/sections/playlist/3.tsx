import type { VariantProps } from "@/types/modular";
import { PlaylistCard } from "./PlaylistCard";

/** The words in a full card on the section's own ground, the record over it (`PlaylistCard`). */
export function Variant(props: VariantProps) {
  return <PlaylistCard {...props} />;
}
