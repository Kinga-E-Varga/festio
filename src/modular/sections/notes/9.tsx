import type { VariantProps } from "@/types/modular";
import { NoteFullCard } from "./NoteTiles";

/** The notes one under another in a full card (`NoteFullCard`). */
export function Variant(props: VariantProps) {
  return <NoteFullCard {...props} />;
}
