import { useTranslations } from "next-intl";
import { BoxHead } from "@/components/dashboard/BoxHead";
import { LINK_TEXT, PAGE_BOX } from "@/components/dashboard/styles";
import { Link } from "@/i18n/navigation";
import { eventPath, eventStatus } from "@/lib/event";
import { PACKAGES, nextPackage } from "@/lib/packages";
import type { DashboardEvent } from "@/types/dashboard";

/**
 * The event's package: what was bought and what it includes, and the way up
 * to Event settings' card. A saved event is always paid for. A past event
 * shows the package alone.
 */
export function PackageBox({ event }: { event: DashboardEvent }) {
  const tEditor = useTranslations("EventEditor");
  const tEvent = useTranslations("Event");
  const tPackages = useTranslations("Packages");
  const past = eventStatus(event) === "past";
  const name = tPackages(`${event.package}.name`);
  const amount = PACKAGES[event.package].price;
  const next = past ? undefined : nextPackage(event.package);

  return (
    <section className={`@container ${PAGE_BOX}`}>
      <BoxHead title={tEditor("package")} />
      <div className="meta-text leading-[1.5]">
        <p>
          <span className="strong-text">
            {/* A free package has no price to show: its name alone. */}
            {amount === 0
              ? name
              : tEditor("packagePaid", {
                  name,
                  price: tPackages("price", { amount }),
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
        <p className="mt-1 hint-text">{tPackages(`${event.package}.blurb`)}</p>
      </div>
    </section>
  );
}
