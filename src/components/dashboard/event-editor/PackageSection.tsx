import { useTranslations } from "next-intl";
import { EditorSection } from "@/components/dashboard/event-editor/EditorSection";
import {
  BANNER_ICON,
  BANNER_TITLE,
  BANNER_TONE,
  ICON_SQUARE,
} from "@/components/dashboard/event-editor/styles";
import { Icon } from "@/components/icons";
import { PACKAGES, nextPackage } from "@/mock/dashboard";
import type { DashboardEvent, IconName } from "@/types/dashboard";

/* The package box and the tiles under it share a shape: an icon square centred on two lines of text, as the banners have. */
const BOX = "flex items-center gap-3.5 rounded-ui border p-4";
const BOX_TEXT = "block text-[12.5px] leading-[1.5]";

/* The current package, in the info banners' colours. */
const CURRENT = `${BOX} ${BANNER_TONE.info}`;
const CURRENT_ICON = `${ICON_SQUARE} ${BANNER_ICON.info}`;

/* Hovering steps the tile itself down one shade of neutral; the square holds still. */
const TILE = `${BOX} border-neutral-500 bg-neutral-150 text-left text-neutral-700 transition-colors hover:border-neutral-600 hover:bg-neutral-200`;
const TILE_ICON = `${ICON_SQUARE} border-neutral-700 bg-neutral-700 text-neutral-50`;

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
        <Icon name={icon} className="size-[17px]" strokeWidth={1.75} />
      </span>
      <span className="min-w-0">
        <b className={BANNER_TITLE}>{title}</b>
        <span className={BOX_TEXT}>{children}</span>
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
        <div className={CURRENT}>
          <span className={CURRENT_ICON}>
            <Icon name="layers" className="size-[17px]" strokeWidth={1.75} />
          </span>
          <span className="min-w-0">
            <b className={BANNER_TITLE}>
              {t(event.paid ? "packagePaid" : "packageUnpaid", {
                name: tPackages(`${event.package}.name`),
                price: price(pkg.price),
              })}
            </b>
            <span className={BOX_TEXT}>
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
