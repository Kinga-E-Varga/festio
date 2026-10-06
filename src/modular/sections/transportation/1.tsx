import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  BODY,
  CARD,
  INNER_EYEBROW,
  GROUND,
  H3,
  MUTED,
  PAD,
  STACK,
  columnsFor,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { otherGround } from "@/modular/ground";

/** One card per way of arriving. */
export function Variant({ values, ground }: VariantProps) {
  const ways = list(values, "ways").slice(0, 4);

  return (
    <div className={`${STACK} ${GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {ways.length > 0 ? (
        <ul className={`grid gap-3 @3xl:gap-4 ${columnsFor(ways.length)}`}>
          {ways.map((way, index) => (
            <li
              key={index}
              className={`${CARD} flex flex-col ${GROUND[otherGround(ground)]}`}
            >
              {way.label ? (
                <span
                  className={`${INNER_EYEBROW} text-[color:var(--m-secondary)]`}
                >
                  {way.label}
                </span>
              ) : null}
              {way.title ? (
                <h3 className={`${H3} mt-2.5 mb-2`}>{way.title}</h3>
              ) : null}
              {way.text ? (
                <p className={`${BODY} ${MUTED} whitespace-pre-line`}>
                  {way.text}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
