import type { LocalizedText } from "@/lib/language";
import { isOn, text } from "@/modular/content";
import { isIconName, type IconName } from "@/modular/icons";
import type { ListItem, SectionValues } from "@/types/modular";

/**
 * The menu link for Helpful notes, Dress code and Gifts — one object, so the
 * three share one link, to whichever of them comes first on the page.
 */
export const GOOD_TO_KNOW: LocalizedText = {
  en: "Good to know",
  ro: "Bine de știut",
  hu: "Jó tudni",
};

/** Dress code's or Gifts' icon, the host's pick: none when none is picked, as any icon. */
export function twinIcon(values: SectionValues): IconName | undefined {
  const icon = text(values, "icon");
  return isIconName(icon) ? icon : undefined;
}

/** What a Helpful notes subsection can be. Dress code and Gifts read their own sections. */
export const NOTE_KINDS = ["dress-code", "gifts", "custom"] as const;
export type NoteKind = (typeof NOTE_KINDS)[number];

/** Helpful notes holds at most this many subsections, of every kind together. */
export const MAX_NOTES = 6;

/**
 * Each kind's on/off switch: a `toggle` field on Helpful notes, drawn on
 * its part's bar in the Content tab. Custom covers every custom note at once.
 */
export const NOTE_SWITCH: Record<NoteKind, string> = {
  "dress-code": "showDressCode",
  gifts: "showGifts",
  custom: "showCustom",
};

function isNoteKind(value: string | undefined): value is NoteKind {
  return NOTE_KINDS.some((kind) => kind === value);
}

/**
 * The subsections to draw, in order: known kinds only, switched-off kinds
 * left out, Dress code and Gifts once each (the first wins — an editor
 * should never allow a second, but stored data is not trusted to follow
 * it), at most `MAX_NOTES`.
 */
export function noteItems(
  items: ListItem[],
  values: SectionValues,
): (ListItem & { kind: NoteKind })[] {
  const seen = new Set<NoteKind>();
  const kept: (ListItem & { kind: NoteKind })[] = [];
  for (const item of items) {
    const kind = item.kind;
    if (!isNoteKind(kind) || !isOn(values, NOTE_SWITCH[kind])) continue;
    if (kind !== "custom" && seen.has(kind)) continue;
    seen.add(kind);
    kept.push({ ...item, kind });
    if (kept.length === MAX_NOTES) break;
  }
  return kept;
}
