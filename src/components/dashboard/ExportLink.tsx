import { useTranslations } from "next-intl";
import { LINK_TEXT } from "@/components/dashboard/styles";

/** Export the event's data. None yet: the link is there, greyed as the Overview's other closed links, saying so. */
export function ExportLink({ className = "" }: { className?: string }) {
  const t = useTranslations("EventEditor");
  const tNav = useTranslations("Nav");

  return (
    <button
      type="button"
      disabled
      title={tNav("comingSoon")}
      className={`${className} ${LINK_TEXT} disabled:cursor-not-allowed disabled:text-neutral-500 disabled:no-underline`}
    >
      {t("export")}
    </button>
  );
}
