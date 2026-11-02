import { pad } from "@/lib/event";
import { isOn } from "./content";
import { isIconName, type IconName } from "./icons";
import { LABELS } from "./labels";
import type { ItemField, SectionValues, ToggleField } from "@/types/modular";

/**
 * A list section's two switches over its items' icons, after the heading
 * fields: Use icons (on by default), and under it while it is on Use
 * numbers (off by default), each item's number in its icon's place.
 * `list` is the items' path (`venues`, `days.items`).
 */
export function iconSwitches(list: string): ToggleField[] {
  return [
    {
      id: "icons",
      label: {
        en: "use icons",
        ro: "folosește pictograme",
        hu: "ikonok használata",
      },
      type: "toggle",
      controls: ["numbers", `${list}.icon`],
    },
    {
      id: "numbers",
      label: {
        en: "use numbers as icons",
        ro: "folosește numere ca pictograme",
        hu: "számok használata ikonként",
      },
      type: "toggle",
      off: true,
      controlsOff: [`${list}.icon`],
    },
  ];
}

/** What a variant drawing its items' icons shows: the switches and the icon. */
export function iconShows(list: string): string[] {
  return ["icons", "numbers", `${list}.icon`];
}

/** An item's own icon field: no "No icon" choice, the switch stands in for it. */
export const ITEM_ICON: ItemField = {
  id: "icon",
  label: LABELS.icon,
  type: "icon",
  maxLength: 20,
  always: true,
};

/** How a section draws its items' marks, by its switches. */
export type IconMode = "icons" | "numbers" | "none";

export function iconMode(values: SectionValues): IconMode {
  if (!isOn(values, "icons")) return "none";
  return values.numbers === true ? "numbers" : "icons";
}

/** One item's mark on its disc: its icon, its number (`01`), or nothing. */
export type ItemMark = { icon: IconName } | { number: string } | null;

/** Item `index`'s mark (from 0) with `icon` as its own pick. */
export function itemMark(
  mode: IconMode,
  icon: string | undefined,
  index: number,
): ItemMark {
  if (mode === "none") return null;
  if (mode === "numbers") return { number: pad(index + 1) };
  return isIconName(icon) ? { icon } : null;
}
