import type { VariantProps } from "@/types/modular";
import { NoteFullCard } from "./NoteTiles";

/** Full card (`9`) on the accent, no lines, every disc in the secondary (`NoteFullCard`). */
export function Variant(props: VariantProps) {
  return <NoteFullCard {...props} accent />;
}
