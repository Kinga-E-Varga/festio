import { useTranslations } from "next-intl";
import { formatDeadline, replyClose } from "@/lib/event";
import { dottedDate, hostNames, text } from "@/modular/content";
import { HEADING } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * The names large on a dark ground — the board's full-bleed cover, `--m11`
 * in the photo's place. Its link rings in the light accent: the page's own
 * ring is the dark ink, which vanishes here.
 */
export function Variant({ values, basics, language }: VariantProps) {
  const t = useTranslations("Sections");
  const closes = formatDeadline(replyClose({ date: basics.date }), language);

  return (
    <div className="flex min-h-[560px] flex-col items-center justify-center gap-6 bg-[var(--m11)] px-6 py-20 text-center text-[color:var(--m1)] @3xl:min-h-[720px]">
      <p className="text-[12px] tracking-[0.34em] uppercase text-[color:var(--m4)]">
        {text(values, "kicker")}
      </p>
      <h1 className={`${HEADING} text-[52px] leading-[1.05] @3xl:text-[104px]`}>
        {hostNames(basics)}
      </h1>
      <p className="text-[16px] tracking-[0.08em] text-[color:var(--m4)] @3xl:text-[18px]">
        {dottedDate(basics.date)} — {basics.venue}
      </p>
      <a
        href="#rsvp"
        className="mt-3 inline-flex min-h-11 items-center bg-[var(--m1)] px-8 text-[14px] font-semibold tracking-[0.06em] text-[color:var(--m8)] transition-opacity hover:opacity-85 focus-visible:outline-[var(--m14)]"
      >
        {t("rsvpBy", { date: closes })}
      </a>
    </div>
  );
}
