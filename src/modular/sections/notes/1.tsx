import { useTranslations } from "next-intl";
import { DressCodeCard } from "@/modular/cards/DressCodeCard";
import { GiftsCard } from "@/modular/cards/GiftsCard";
import { NoteCard } from "@/modular/cards/NoteCard";
import { list } from "@/modular/content";
import { isIconName } from "@/modular/icons";
import { noteItems } from "@/modular/notes";
import { SectionHeading } from "@/modular/SectionHeading";
import { COLUMN, GROUND, PAD, STACK } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { otherGround } from "@/modular/ground";

/** The subsections as cards, one under another. */
export function Variant({ values, related, ground }: VariantProps) {
  const t = useTranslations("Sections");
  const cardGround = otherGround(ground);
  const items = noteItems(list(values, "items"), values);

  return (
    <div className={`${STACK} ${GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {/* With every subsection off, only the heading: an empty list would still take the stack's gap. */}
      {items.length > 0 ? (
        <div className={`${COLUMN} flex flex-col gap-3`}>
          {items.map((item, index) => {
            if (item.kind === "dress-code") {
              return (
                <DressCodeCard
                  key={index}
                  values={related["dress-code"] ?? {}}
                  label={t("dressCode")}
                  ground={cardGround}
                />
              );
            }
            if (item.kind === "gifts") {
              return (
                <GiftsCard
                  key={index}
                  values={related.gifts ?? {}}
                  label={t("gifts")}
                  ground={cardGround}
                />
              );
            }
            return (
              <NoteCard
                key={index}
                icon={isIconName(item.icon) ? item.icon : undefined}
                tone="secondary"
                label={item.label ?? ""}
                title={item.title}
                body={item.text}
                ground={cardGround}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
