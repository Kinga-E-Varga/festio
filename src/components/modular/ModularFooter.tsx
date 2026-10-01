import { useTranslations } from "next-intl";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";

/** The privacy line under every modular invitation. The period is the config's, never written here. */
export function ModularFooter({ hosts }: { hosts: string }) {
  const t = useTranslations("Sections");

  return (
    <footer className="flex flex-col gap-2.5 border-t-1 border-[var(--m5)] bg-[var(--m1)] px-6 py-10 @3xl:flex-row @3xl:items-start @3xl:justify-between @3xl:gap-10 @3xl:px-14">
      <p className="max-w-[760px] text-[13px] leading-[1.7] text-[color:var(--m10)]">
        {t("privacy", { hosts, days: GUEST_DATA_RETENTION_DAYS })}
      </p>
      <span className="text-[12px] tracking-[0.16em] uppercase text-[color:var(--m7)]">
        Festio
      </span>
    </footer>
  );
}
