import type { LocalizedText } from "@/lib/language";

/*
 * What the host's editor will call the fields several sections share, in
 * the host's language. Declared once so the same label is never retyped.
 */
export const LABELS = {
  heading: { en: "heading", ro: "titlu", hu: "címsor" },
  kicker: {
    en: "small line above",
    ro: "rând mic deasupra",
    hu: "kis sor fölötte",
  },
  text: { en: "text", ro: "text", hu: "szöveg" },
  time: { en: "time", ro: "ora", hu: "időpont" },
  title: { en: "title", ro: "titlu", hu: "cím" },
  note: { en: "note", ro: "notă", hu: "megjegyzés" },
  name: { en: "name", ro: "nume", hu: "név" },
  place: { en: "place", ro: "loc", hu: "helyszín" },
  address: { en: "address", ro: "adresă", hu: "cím" },
} satisfies Record<string, LocalizedText>;
