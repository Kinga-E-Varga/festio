import type { ReactNode } from "react";

/*
 * The icons a host can pick wherever a section offers one (schedule events,
 * transport cards, custom notes). Drawn by hand on a 24px grid. Adding an
 * icon is adding one entry here: the id is stored with the event, so never
 * rename or remove one.
 */
export const ICONS = {
  meal: (
    <>
      <path d="M7 3v6a2 2 0 0 0 4 0V3M9 11v10" />
      <path d="M17 21V3c-1.8 1.4-3 4-3 7v3h3" />
    </>
  ),
  heart: (
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z" />
  ),
  sparkle: (
    <>
      <path d="M11 3l1.7 4.8L17.5 9.5l-4.8 1.7L11 16l-1.7-4.8L4.5 9.5l4.8-1.7Z" />
      <path d="M18 15v5M15.5 17.5h5" />
    </>
  ),
  moon: <path d="M19.5 14.5A8 8 0 1 1 9.5 4.5a6.3 6.3 0 0 0 10 10Z" />,
  train: (
    <>
      <rect x="6" y="3" width="12" height="14" rx="3" />
      <path d="M6 11h12M9 17l-2 4M15 17l2 4" />
      <circle cx="9.5" cy="14" r="0.6" />
      <circle cx="14.5" cy="14" r="0.6" />
    </>
  ),
  bus: (
    <>
      <rect x="4" y="3" width="16" height="15" rx="2" />
      <path d="M4 11h16M8 18v3M16 18v3" />
      <circle cx="8" cy="14.5" r="1" />
      <circle cx="16" cy="14.5" r="1" />
    </>
  ),
  car: (
    <>
      <path d="M5 16V11l2-5h10l2 5v5M3 16h18v3H3Z" />
      <circle cx="7.5" cy="13" r="1" />
      <circle cx="16.5" cy="13" r="1" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5Z" />
    </>
  ),
  gift: (
    <>
      <rect x="4" y="9" width="16" height="12" rx="1.5" />
      <path d="M12 9v12M4 14h16" />
      <path d="M12 9c-2-3.5-5.5-3.5-5.5-1.5S10 9 12 9Zm0 0c2-3.5 5.5-3.5 5.5-1.5S14 9 12 9Z" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21.5c-4.3-4.6-7.5-8.4-7.5-11.5a7.5 7.5 0 0 1 15 0c0 3.1-3.2 6.9-7.5 11.5Z" />
      <circle cx="12" cy="10" r="2.7" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  question: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6" />
      <circle cx="12" cy="17" r="0.6" />
    </>
  ),
  bed: (
    <>
      <path d="M3 19V6M3 14h18M21 19v-6a3 3 0 0 0-3-3h-7v4" />
      <circle cx="7" cy="10.5" r="1.8" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3.5 7l8.5 6.5L20.5 7" />
    </>
  ),
} satisfies Record<string, ReactNode>;

/** The page's own arrows, ticks and the RSVP heart — never offered as a choice. */
const GLYPHS = {
  "arrow-down": <path d="M12 5v14M6 13l6 6 6-6" />,
  "arrow-up": <path d="M12 19V5M6 11l6-6 6 6" />,
  "arrow-up-right": <path d="M7 17 17 7M9 7h8v8" />,
  "chevron-down": <path d="M6 9l6 6 6-6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  /* Filled, with no stroke: a stroke would round off the dip between the lobes. */
  "heart-filled": (
    <path
      d="M12 8.7A4.5 4.5 0 0 0 3.1 9.6C3.1 14.6 9.4 18.4 12 21.2C14.6 18.4 20.9 14.6 20.9 9.6A4.5 4.5 0 0 0 12 8.7Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof ICONS;
type GlyphName = keyof typeof GLYPHS;

/** Every id a host can pick, in the order an editor lists them. */
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

/** A stored icon id that still names an icon; anything else draws none. */
export function isIconName(value: string | undefined): value is IconName {
  return ICON_NAMES.some((name) => name === value);
}

const DRAWINGS: Record<IconName | GlyphName, ReactNode> = {
  ...ICONS,
  ...GLYPHS,
};

/** One icon in the current text colour. Decorative: the words beside it carry the meaning. */
export function Icon({
  name,
  className = "",
}: {
  name: IconName | GlyphName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {DRAWINGS[name]}
    </svg>
  );
}
