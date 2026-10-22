import { useTranslations } from "next-intl";
import { BoxHead } from "@/components/dashboard/BoxHead";
import { BTN_PRIMARY } from "@/components/dashboard/event-editor/styles";
import { LINK_TEXT, PAGE_BOX } from "@/components/dashboard/styles";
import { Link } from "@/i18n/navigation";
import { eventPath, eventStatus } from "@/lib/event";
import { PACKAGES, nextPackage, upgradePrice } from "@/lib/packages";
import type { DashboardEvent } from "@/types/dashboard";

/**
 * The event's package: what it includes and the way up to Event settings'
 * card, or, while unpaid, paying for it. A past event shows the package
 * alone.
 */
export function PackageBox({ event }: { event: DashboardEvent }) {
  const tEditor = useTranslations("EventEditor");
  const tEvent = useTranslations("Event");
  const tPackages = useTranslations("Packages");
  const past = eventStatus(event) === "past";
  /* Unpaid, it shows what the event needs, at the difference. */
  const shown = event.neededPackage;
  const name = tPackages(`${shown}.name`);
  const amount = event.paid ? PACKAGES[shown].price : upgradePrice(event);
  const price = tPackages("price", { amount });
  const next = past ? undefined : nextPackage(shown);

  return (
    <section className={`@container ${PAGE_BOX}`}>
      <BoxHead title={tEditor("package")} />
      <div className="meta-text leading-[1.5]">
        <p>
          <span className="strong-text">
            {/* A free package has no price to show or pay: its name alone. */}
            {amount === 0
              ? name
              : tEditor(event.paid ? "packagePaid" : "packageUnpaid", {
                  name,
                  price,
                })}
          </span>
          {next ? (
            <>
              {" · "}
              <Link
                href={`${eventPath(event.id, "details")}#package`}
                className={LINK_TEXT}
              >
                {tEvent("upgrade")}
              </Link>
            </>
          ) : null}
        </p>
        <p className="mt-1 hint-text">
          {event.paid || past
            ? tPackages(`${event.package}.blurb`)
            : tEditor("payNote")}
        </p>
        {/* No payments yet, so it does nothing. The box's width while it is narrow. */}
        {!event.paid && !past ? (
          <button
            type="button"
            className={`mt-4 w-full @min-[400px]:w-auto ${BTN_PRIMARY}`}
          >
            {tEditor("payAndPublish", { price })}
          </button>
        ) : null}
      </div>
    </section>
  );
}
