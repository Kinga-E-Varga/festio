import type { LocalizedText } from "@/lib/language";

/*
 * What the host's editor will call the fields several sections share, in
 * the host's language. Declared once so the same label is never retyped.
 */
export const LABELS = {
  heading: { en: "heading", ro: "titlu", hu: "címsor" },
  headingItalic: {
    en: "italic heading",
    ro: "titlu cursiv",
    hu: "dőlt címsor",
  },
  photo: { en: "photo", ro: "fotografie", hu: "fotó" },
  icon: { en: "icon", ro: "pictogramă", hu: "ikon" },
  link: { en: "link", ro: "link", hu: "link" },
  eyebrow: {
    en: "intro line",
    ro: "rând de început",
    hu: "bevezető sor",
  },
  text: { en: "text", ro: "text", hu: "szöveg" },
  time: { en: "time", ro: "ora", hu: "időpont" },
  title: { en: "title", ro: "titlu", hu: "cím" },
  note: { en: "note", ro: "notă", hu: "megjegyzés" },
  name: { en: "name", ro: "nume", hu: "név" },
  place: { en: "place name", ro: "numele locului", hu: "a hely neve" },
  address: { en: "address", ro: "adresă", hu: "cím" },
} satisfies Record<string, LocalizedText>;
