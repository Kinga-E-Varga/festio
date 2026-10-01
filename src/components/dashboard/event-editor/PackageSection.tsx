import { useTranslations } from "next-intl";
import { EditorSection } from "@/components/dashboard/event-editor/EditorSection";
import { Icon } from "@/components/icons";
import { PACKAGES, nextPackage } from "@/mock/dashboard";
import type { DashboardEvent, IconName } from "@/types/dashboard";

/* Hovering steps the tile itself down one shade of the same mustard. */
const TILE =
  "group flex gap-3.5 border border-mustard-300 bg-mustard-100 p-4 text-left transition-colors hover:border-mustard-400 hover:bg-mustard-200";
/* The square holds still while the tile around it responds to the pointer. */
const TILE_ICON =
  "grid size-[34px] shrink-0 place-items-center border border-mustard-600 bg-mustard-600 text-mustard-50";

function Tile({
  icon,
  title,
  children,
}: {
  icon: IconName;
  title: string;
  children: string;
}) {
  return (
    <button type="button" className={TILE}>
      <span className={TILE_ICON}>
        <Icon name={icon} className="size-[17px]" />
      </span>
      <span className="min-w-0">
        <b className="mb-[3px] block font-semibold text-mustard-600">{title}</b>
        <span className="block text-[12.5px] leading-[1.5] text-mustard-600">
          {children}
        </span>
      </span>
    </button>
  );
}

export function PackageSection({ event }: { event: DashboardEvent }) {
  const t = useTranslations("EventEditor");
  const tPackages = useTranslations("Packages");
  const pkg = PACKAGES[event.package];
  const next = nextPackage(event.package);
  const price = (amount: number) => tPackages("price", { amount });

  return (
    <EditorSection title={t("package")}>
      <div className="grid grid-cols-1 gap-3">
        {/* What this event already is, stated before anything on offer. */}
        <div className="flex gap-3.5 border border-forest-500 border-l-4 bg-forest-100 p-4">
          <span className="grid size-[34px] shrink-0 place-items-center border border-forest-500 bg-forest-500 text-neutral-50">
            <Icon name="layers" className="size-[17px]" />
          </span>
          <span className="min-w-0">
            <b className="mb-[3px] block font-semibold text-forest-500">
              {t(event.paid ? "packagePaid" : "packageUnpaid", {
                name: tPackages(`${event.package}.name`),
                price: price(pkg.price),
              })}
            </b>
            <span className="block text-[12.5px] leading-[1.5] text-forest-600">
              {tPackages(`${event.package}.blurb`)}
            </span>
          </span>
        </div>

        {next ? (
          <Tile
            icon="arrowRight"
            title={t("raiseTo", {
              name: tPackages(`${next}.name`),
              price: price(PACKAGES[next].price),
            })}
          >
            {tPackages(`${next}.upsell`)}
          </Tile>
        ) : null}

        {event.paid ? null : (
          <Tile
            icon="arrowRight"
            title={t("payAndPublish", { price: price(pkg.price) })}
          >
            {t("payNote")}
          </Tile>
        )}
      </div>
    </EditorSection>
  );
}
