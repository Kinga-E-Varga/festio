import { useTranslations } from "next-intl";
import { list, text } from "@/modular/content";
import { HEADING, PAD } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * One centred card, like the one on the table. Dishes are in the body face:
 * a script heading face is unreadable at this size.
 */
export function Variant({ values }: VariantProps) {
  const t = useTranslations("Sections");
  const footnote = text(values, "footnote");

  return (
    <div className={`flex justify-center bg-[var(--m2)] ${PAD}`}>
      <div className="flex w-full max-w-[560px] flex-col items-center gap-4 border-1 border-[var(--m6)] bg-[var(--m1)] px-6 py-12 text-center outline-1 outline-offset-8 outline-[var(--m5)] @3xl:px-14">
        <p className="text-[12px] tracking-[0.3em] uppercase text-[color:var(--m10)]">
          {t("menu")}
        </p>
        <h2
          className={`${HEADING} text-[28px] text-[color:var(--m8)] @3xl:text-[32px]`}
        >
          {text(values, "heading")}
        </h2>
        <span className="my-1.5 h-px w-10 bg-[var(--m7)]" />
        {list(values, "courses").map((course, index) => (
          <div key={index} className="flex flex-col gap-2 not-first:mt-2">
            <p className="text-[12px] tracking-[0.24em] uppercase text-[color:var(--m13)]">
              {course.course}
            </p>
            <p className="text-[17px] leading-[1.8] whitespace-pre-line text-[color:var(--m8)]">
              {course.dishes}
            </p>
          </div>
        ))}
        {footnote ? (
          <>
            <span className="my-1.5 h-px w-10 bg-[var(--m7)]" />
            <p className="text-[14px] text-[color:var(--m10)]">{footnote}</p>
          </>
        ) : null}
      </div>
    </div>
  );
}
