import type { IconName, Visibility } from "@/types/dashboard";

/**
 * The icon is this map's own; what each visibility is *called* and what it
 * means are keys into the `Event` namespace, since both are words.
 */
export const VISIBILITY: Record<
  Visibility,
  { labelKey: string; icon: IconName; blurbKey: string }
> = {
  hidden: { labelKey: "hidden", icon: "eyeOff", blurbKey: "hiddenNote" },
  public: { labelKey: "public", icon: "globe", blurbKey: "publicNote" },
  protected: {
    labelKey: "protected",
    icon: "shield",
    blurbKey: "protectedNote",
  },
};
