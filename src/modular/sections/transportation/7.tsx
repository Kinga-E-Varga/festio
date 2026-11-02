import { list } from "@/modular/content";
import { NoteCard } from "@/modular/cards/NoteCard";
import { otherGround } from "@/modular/ground";
import { iconMode, itemMark } from "@/modular/item-marks";
import { SectionHeading } from "@/modular/SectionHeading";
import { PAD, STACK, SECTION_GROUND, COLUMN } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * The section's heading centred — no italic line — over each way as a wide
 * card, as Helpful notes' (`NoteCard`), stacked down the middle (`COLUMN`):
 * its mark (`itemMark`), when it has one, on a soft disc over its eyebrow at the side,
 * its title and note beside them, every disc in the secondary. On a phone the side
 * stacks over the text.
 */
export function Variant({ values, ground }: VariantProps) {
  const ways = list(values, "ways").slice(0, 6);
  const mode = iconMode(values);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {ways.length > 0 ? (
        <ul className={`${COLUMN} flex flex-col gap-3`}>
          {ways.map((way, index) => (
            <li key={index}>
              <NoteCard
                mark={itemMark(mode, way.icon, index)}
                tone="secondary"
                label={way.label ?? ""}
                title={way.title}
                body={way.text}
                ground={otherGround(ground)}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
