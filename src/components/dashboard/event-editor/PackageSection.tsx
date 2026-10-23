import { useTranslations } from "next-intl";
import { SettingsCard } from "@/components/dashboard/event-editor/SettingsCard";
import { SettingRow } from "@/components/dashboard/event-editor/SettingRow";
import { BTN_GHOST_LIGHT } from "@/components/dashboard/event-editor/styles";
import { isPast } from "@/lib/event";
import { PACKAGES, nextPackage } from "@/lib/packages";
import type { DashboardEvent } from "@/types/dashboard";

/**
 * The way up from this event's package: the next one with its button. What
 * the event has is on its Overview. A Custom event has nowhere to go and a
 * past one nothing left to upgrade, so the card is left out. No payments yet,
 * so the button does nothing.
 */
export function PackageSection({ event }: { event: DashboardEvent }) {
  const t = useTranslations("EventEditor");
  const tPackages = useTranslations("Packages");
  const next = nextPackage(event.package);
  if (!next || isPast(event)) return null;

  return (
    <SettingsCard id="package" title={t("upgrade")}>
      <SettingRow
        title={t("packageOffer", {
          name: tPackages(`${next}.name`),
          price: tPackages("price", { amount: PACKAGES[next].price }),
        })}
        action={
          <button type="button" className={BTN_GHOST_LIGHT}>
            {t("raiseButton", { name: tPackages(`${next}.name`) })}
          </button>
        }
      >
        {tPackages(`${next}.upsell`)}
      </SettingRow>
    </SettingsCard>
  );
}
