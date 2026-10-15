/**
 * The two warning colourings. Light, for a warning sitting on a light card
 * (the to-dos); dark, for one on the page or a darker ground (the warning
 * banners, Not coming).
 */
export const WARNING_LIGHT =
  "border-warning-500/50 bg-warning-50 text-warning-700";
export const WARNING_DARK =
  "border-warning-700/50 bg-warning-100 text-warning-700";
/** The positive colouring (Coming): the dark warning's shades in green, its border, fill and ink a step darker. */
export const SUCCESS_DARK =
  "border-primary-800/50 bg-primary-150 text-primary-800";
/** The info boxes' colouring: the dark warning's shades, in blue. */
export const INFO_DARK = "border-info-700/50 bg-info-100 text-info-700";
/** The danger colouring (Unknown and Duplicate tags, the danger zone): the dark warning's shades in brick, its fill and ink a step darker. */
export const DANGER_DARK = "border-danger-800/50 bg-danger-150 text-danger-800";

/** A word picked out in a sentence (a name, a count): bold and darkest. Size comes from the sentence. */
export const STRONG_TEXT = "font-semibold text-neutral-950";

/** A side card's title: the page's section title, smaller to suit the narrow cards. */
export const SIDE_CARD_TITLE =
  "section-title text-[17px]! min-[1800px]:text-[20px]!";

/** Every text link and link-like button in the dashboard: colour, weight, hover. Size is the caller's. */
export const TEXT_LINK =
  "font-semibold text-primary-700 underline-offset-[3px] transition-colors hover:text-primary-900 hover:underline";

/** A quiet link to a full list, e.g. "See all events"; followed by an arrow. */
export const SEE_ALL_LINK = `flex items-center gap-1 text-[12.5px] ${TEXT_LINK}`;
