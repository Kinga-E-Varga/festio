import { text } from "@/modular/content";
import { GiftActions, hasGiftActions } from "@/modular/cards/GiftsCard";
import { SoloCard } from "@/modular/cards/SoloCard";
import { SectionHeading } from "@/modular/SectionHeading";
import type { VariantProps } from "@/types/modular";

/** The two-line heading beside one card (`SoloCard`): the title, text and gift buttons. */
export function Variant({ values, ground }: VariantProps) {
  return (
    <SoloCard
      heading={
        <div>
          <SectionHeading values={values} align="start" />
        </div>
      }
      title={text(values, "title")}
      body={text(values, "body")}
      ground={ground}
    >
      {hasGiftActions(values) ? <GiftActions values={values} /> : null}
    </SoloCard>
  );
}
