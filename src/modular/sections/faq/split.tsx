import { list, text } from "@/modular/content";
import { Icon } from "@/modular/icons";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  ARROW_NUDGE,
  BODY,
  GROUND,
  H4,
  MEASURE,
  MUTED,
  PAD,
  SPLIT,
  UNDERLINE_LINK,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * The heading and a link to the reply form beside the questions. Every
 * answer starts closed. Native `<details>`, so it needs no script.
 */
export function Variant({ values, ground }: VariantProps) {
  const linkLabel = text(values, "linkLabel");
  const items = list(values, "items");

  return (
    <div className={`${SPLIT} ${GROUND[ground]} ${PAD}`}>
      <div className="flex flex-col items-center gap-2 @3xl:items-start">
        <SectionHeading values={values} align="start" />
        {linkLabel ? (
          <a href="#rsvp" className={UNDERLINE_LINK}>
            {linkLabel}
            <Icon name="arrow-up-right" className={ARROW_NUDGE} />
          </a>
        ) : null}
      </div>
      {items.length > 0 ? (
        <div className={`border-t-1 border-[var(--m-line)]`}>
          {items.map((item, index) => (
            <details
              key={index}
              className="group border-b-1 border-[var(--m-line)]"
            >
              <summary
                className={`${H4} flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-3 text-[color:var(--m-ink)] [&::-webkit-details-marker]:hidden`}
              >
                {item.question}
                <Icon
                  name="chevron-down"
                  className="size-4 shrink-0 text-[color:var(--m-secondary)] transition-transform group-open:rotate-180"
                />
              </summary>
              <p
                className={`${BODY} ${MUTED} ${MEASURE} mb-5 pr-9 whitespace-pre-line`}
              >
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      ) : null}
    </div>
  );
}
