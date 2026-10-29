import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  BODY_SM,
  CARD_DISC,
  EYEBROW,
  H3,
  MUTED,
  PAD,
  SECTION_GROUND,
  STACK,
  TONE_TEXT,
  turnTone,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * The full cards' heading, eyebrow and heading only, centred over the
 * moments, laid out as Schedule's Timeline (`4`): one line down the middle from the first moment to the last, a small dot
 * on it for each, the moments taking turns left and right, those on the
 * left leaning on the line. Each its year as an eyebrow over its
 * title and its line. The dots, the years and the line's pieces take turns:
 * the 1st, 3rd… in the accent, the 2nd, 4th… in the secondary. On a phone
 * the line runs down the left, every moment right of it, the whole no wider
 * than 350px and centred.
 */
export function Variant({ values, ground }: VariantProps) {
  const moments = list(values, "moments").slice(0, 6);
  const last = moments.length - 1;

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {moments.length > 0 ? (
        <ol className="mx-auto w-full max-w-[350px] @3xl:max-w-240">
          {moments.map((moment, index) => {
            const tone = TONE_TEXT[turnTone(index)];
            const left = index % 2 === 0;
            return (
              <li
                key={index}
                className="grid grid-cols-[2.375rem_minmax(0,1fr)] gap-x-4 @3xl:grid-cols-[minmax(0,1fr)_2.375rem_minmax(0,1fr)] @3xl:gap-x-6"
              >
                {/*
                 * The line through this moment, from its top to its bottom so
                 * the pieces join, but from the dot's centre on the first and
                 * to it on the last; under the dots on a phone, in the middle
                 * on a wide page.
                 */}
                <span
                  className={`relative col-start-1 row-start-1 flex justify-center @3xl:col-start-2 ${tone}`}
                >
                  {moments.length > 1 ? (
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-0 left-4.75 w-px bg-current/50 @3xl:left-1/2 ${index === 0 ? "top-4.75" : ""} ${index === last ? "bottom-auto h-4.75" : ""}`}
                    />
                  ) : null}
                  <span className={`${CARD_DISC} relative`}>
                    <span className="size-2.5 rounded-full bg-current" />
                  </span>
                </span>
                <div
                  className={`col-start-2 row-start-1 min-w-0 pt-1.5 ${index === last ? "" : "pb-9"} ${left ? "@3xl:col-start-1 @3xl:text-right" : "@3xl:col-start-3"}`}
                >
                  {moment.year ? (
                    <p className={`${EYEBROW} ${tone} mb-4 tabular-nums`}>
                      {moment.year}
                    </p>
                  ) : null}
                  {moment.title ? <h3 className={H3}>{moment.title}</h3> : null}
                  {moment.text ? (
                    <p className={`${BODY_SM} ${MUTED} mt-1`}>{moment.text}</p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}
