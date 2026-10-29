import { list } from "@/modular/content";
import { NoteCard } from "@/modular/cards/NoteCard";
import { otherGround } from "@/modular/ground";
import { isIconName } from "@/modular/icons";
import { SectionHeading } from "@/modular/SectionHeading";
import { COLUMN, PAD, STACK, SECTION_GROUND, turnTone } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * The section's heading centred — no italic line — over each way as a wide
 * card, as Helpful notes' (`NoteCard`), stacked down the middle (`COLUMN`):
 * its icon, when it has one, on a soft disc over its eyebrow at the side,
 * its title and note beside them, the ways taking turns — the 1st, 3rd…
 * in the accent, the 2nd, 4th… in the secondary. On a phone the side
 * stacks over the text.
 */
export function Variant({ values, ground }: VariantProps) {
  const ways = list(values, "ways").slice(0, 6);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {ways.length > 0 ? (
        <ul className={`${COLUMN} flex flex-col gap-3`}>
          {ways.map((way, index) => (
            <li key={index}>
              <NoteCard
                icon={isIconName(way.icon) ? way.icon : undefined}
                tone={turnTone(index)}
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
