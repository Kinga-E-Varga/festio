import { EditorSection } from "@/components/dashboard/event-editor/EditorSection";
import { Icon } from "@/components/icons";
import { TIERS } from "@/mock/dashboard";
import type { DashboardEvent, IconName, TierId } from "@/types/dashboard";

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
        <b className="mb-[3px] block text-mustard-600">{title}</b>
        <span className="block text-xs leading-[1.45] text-mustard-600">
          {children}
        </span>
      </span>
    </button>
  );
}

export function EditionSection({ event }: { event: DashboardEvent }) {
  const tier = TIERS[event.tier];
  const nextId = (event.tier + 1) as TierId;
  const next = event.tier < 3 ? TIERS[nextId] : undefined;

  return (
    <EditorSection title="Edition">
      <div className="grid grid-cols-1 gap-3">
        {/* What this event already is, stated before anything on offer. */}
        <div className="flex gap-3.5 border border-forest-500 border-l-4 bg-forest-100 p-4">
          <span className="grid size-[34px] shrink-0 place-items-center border border-forest-500 bg-forest-500 text-neutral-50">
            <Icon name="layers" className="size-[17px]" />
          </span>
          <span className="min-w-0">
            <b className="mb-[3px] block text-forest-500">
              {tier.name} — {tier.price}
              {event.paid ? " · paid" : " · unpaid"}
            </b>
            <span className="block text-xs leading-[1.45] text-forest-600">
              {tier.blurb}
            </span>
          </span>
        </div>

        {next?.upsell ? (
          <Tile icon="arrowRight" title={`Raise to ${next.name} — ${next.price}`}>
            {next.upsell}
          </Tile>
        ) : null}

        {event.paid ? null : (
          <Tile icon="arrowRight" title={`Pay ${tier.price} and publish`}>
            Clears the draft for sharing. Visibility stays where you set it
            until you change it yourself.
          </Tile>
        )}
      </div>
    </EditorSection>
  );
}
