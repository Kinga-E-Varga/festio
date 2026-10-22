import { useTranslations } from "next-intl";
import { BOX_PAD } from "@/components/dashboard/styles";
import { ButtonIcon } from "@/components/icons";

/**
 * Home's first box, the one thing a host starts from: the whole box is the
 * button, in the accent colour. Nowhere to go yet, like the picker's New event.
 */
export function CreateEventCard() {
  const t = useTranslations("Dashboard");

  return (
    <button
      type="button"
      className={`flex items-center gap-6 rounded-ui bg-accent-800 text-left text-accent-50 transition-colors hover:bg-accent-900 ${BOX_PAD}`}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="card-face">{t("createTitle")}</span>
        <span className="meta-face leading-[1.45]">{t("createLine")}</span>
      </span>
      <span
        aria-hidden="true"
        className="grid size-7 shrink-0 place-items-center rounded-full bg-accent-50 text-accent-800"
      >
        <ButtonIcon name="plus" />
      </span>
    </button>
  );
}
