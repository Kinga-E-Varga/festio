import { useTranslations } from "next-intl";
import { DressCodeCard } from "@/modular/cards/DressCodeCard";
import { SectionHeading } from "@/modular/SectionHeading";
import { COLUMN, GROUND, PAD, STACK } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { otherGround } from "@/modular/ground";

/** The dress code card on its own, under its own heading. */
export function Variant({ values, ground }: VariantProps) {
  const t = useTranslations("Sections");
  return (
    <div className={`${STACK} ${GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      <div className={COLUMN}>
        <DressCodeCard
          values={values}
          label={t("dressCode")}
          ground={otherGround(ground)}
        />
      </div>
    </div>
  );
}
