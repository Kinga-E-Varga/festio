import { useTranslations } from "next-intl";
import { daysUntil, text } from "@/modular/content";
import { HEADING, PAD } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/** Days only, calm rather than ticking. The board's progress line waits for a real "sent" date. */
export function Variant({ values, basics }: VariantProps) {
  const t = useTranslations("Sections");
  const days = daysUntil(basics.date);

  return (
    <div
      className={`flex flex-col items-center gap-3.5 bg-[var(--m1)] text-center ${PAD}`}
    >
      {/*
       * Counted on the server and kept as is: React leaves suppressed text
       * alone when hydrating. Around midnight a server in another timezone
       * can be a day off the guest's; that is accepted for a calm count.
       */}
      <span
        suppressHydrationWarning
        className={`${HEADING} text-[96px] leading-none text-[color:var(--m13)] @3xl:text-[140px]`}
      >
        {days}
      </span>
      <p className="text-[18px] text-[color:var(--m8)] @3xl:text-[20px]">
        <span suppressHydrationWarning>{t("days", { count: days })}</span>{" "}
        {text(values, "caption")}
      </p>
    </div>
  );
}
