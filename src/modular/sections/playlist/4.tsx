import type { VariantProps } from "@/types/modular";
import { PlaylistCard } from "./PlaylistCard";

/** Card (`3`) with the card on the accent (`PlaylistCard`). */
export function Variant(props: VariantProps) {
  return <PlaylistCard {...props} accent />;
}
