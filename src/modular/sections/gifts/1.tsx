import { useTranslations } from "next-intl";
import { GiftsCard } from "@/modular/cards/GiftsCard";
import { SectionHeading } from "@/modular/SectionHeading";
import { COLUMN, GROUND, PAD, STACK } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { otherGround } from "@/modular/ground";

/** The gifts card on its own, under its own heading. */
export function Variant({ values, ground }: VariantProps) {
  const t = useTranslations("Sections");
  return (
    <div className={`${STACK} ${GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      <div className={COLUMN}>
        <GiftsCard
          values={values}
          label={t("gifts")}
          ground={otherGround(ground)}
        />
      </div>
    </div>
  );
}
