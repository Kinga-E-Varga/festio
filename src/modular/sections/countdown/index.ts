import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "countdown",
  name: { en: "Countdown", ro: "Numărătoare inversă", hu: "Visszaszámlálás" },
  required: false,
  order: 40,
  fields: [
    {
      id: "caption",
      label: {
        en: "line after the days",
        ro: "rândul de după zile",
        hu: "sor a napok után",
      },
      type: "text",
      maxLength: 60,
      fallback: {
        en: "until we say yes",
        ro: "până spunem „da”",
        hu: "az igenig",
      },
    },
  ],
};
