import { headingFields } from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import { GOOD_TO_KNOW } from "@/modular/notes";
import type { SectionDefinition } from "@/types/modular";

/** Also drawn inside Helpful notes, from these same values. */
export const section: SectionDefinition = {
  id: "dress-code",
  name: { en: "Dress code", ro: "Ținută", hu: "Öltözet" },
  required: false,
  order: 100,
  menuLabel: GOOD_TO_KNOW,
  variants: [{ id: "card", name: { en: "Card", ro: "Card", hu: "Kártya" } }],
  fields: [
    ...headingFields({
      eyebrow: { en: "What to wear", ro: "Ce să porți", hu: "Mit vegyél fel" },
      heading: {
        en: "Come as you feel",
        ro: "Vino cum te simți bine",
        hu: "Gyere úgy, ahogy jól érzed magad",
      },
    }),
    {
      id: "title",
      label: LABELS.title,
      type: "text",
      maxLength: 80,
      fallback: {
        en: "Garden party, with a little Italian ease",
        ro: "Petrecere în grădină, cu o lejeritate italiană",
        hu: "Kerti parti, egy kis olasz lazasággal",
      },
    },
    {
      id: "body",
      label: LABELS.text,
      type: "longText",
      maxLength: 300,
      fallback: {
        en: "Think summer suits, flowing dresses, and shoes that are happy on grass. The evening gets cool, so bring a light layer.",
        ro: "Gândește-te la costume de vară, rochii vaporoase și pantofi care se înțeleg cu iarba. Seara se răcorește, așa că ia ceva subțire pe umeri.",
        hu: "Nyári öltöny, könnyű ruha és fűbarát cipő. Este lehűl a levegő, hozz egy könnyű réteget.",
      },
    },
    {
      id: "swatchLabel",
      label: {
        en: "line above the colours",
        ro: "rândul de deasupra culorilor",
        hu: "sor a színek fölött",
      },
      type: "text",
      maxLength: 40,
      fallback: {
        en: "A few colors we love",
        ro: "Câteva culori care ne plac",
        hu: "Néhány szín, amit szeretünk",
      },
    },
    {
      id: "swatches",
      label: { en: "colours", ro: "culori", hu: "színek" },
      type: "list",
      maxItems: 6,
      item: [
        { id: "name", label: LABELS.name, type: "text", maxLength: 20 },
        {
          id: "color",
          label: { en: "colour", ro: "culoare", hu: "szín" },
          type: "text",
          maxLength: 7,
        },
      ],
      fallback: [
        { name: { en: "Sage", ro: "Salvie", hu: "Zsálya" }, color: "#A8B891" },
        { name: { en: "Olive", ro: "Măslin", hu: "Olíva" }, color: "#435943" },
        {
          name: { en: "Terracotta", ro: "Teracotă", hu: "Terrakotta" },
          color: "#D88D6D",
        },
        {
          name: { en: "Soft gold", ro: "Auriu pal", hu: "Halvány arany" },
          color: "#E2C480",
        },
        { name: { en: "Cream", ro: "Crem", hu: "Krém" }, color: "#F0EEE5" },
      ],
    },
  ],
};
