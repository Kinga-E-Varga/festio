import { text } from "@/modular/content";
import { DressCodeSwatches, hasSwatches } from "@/modular/cards/DressCodeCard";
import { SoloCard } from "@/modular/cards/SoloCard";
import { IconHeading } from "@/modular/IconHeading";
import { twinIcon } from "@/modular/notes";
import type { VariantProps } from "@/types/modular";

/** The section's icon (`twinIcon`, none unless picked) on its soft disc over the heading — no eyebrow — beside one card (`SoloCard`): the title, text and colours. */
export function Variant({ values, ground }: VariantProps) {
  return (
    <SoloCard
      heading={<IconHeading icon={twinIcon(values)} values={values} />}
      title={text(values, "title")}
      body={text(values, "body")}
      ground={ground}
    >
      {hasSwatches(values) ? <DressCodeSwatches values={values} /> : null}
    </SoloCard>
  );
}
