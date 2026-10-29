import type { ReactNode } from "react";

/*
 * The icons a host can pick wherever a section offers one (schedule events,
 * locations, ways, stays, courses, notes). Drawn by hand on a 24px grid,
 * grouped as the picker lists them. Adding an icon is adding one entry
 * here: the id is stored with the event, so never rename or remove one.
 */
export const ICONS = {
  /* Ceremony and places. */
  heart: (
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z" />
  ),
  sparkle: (
    <>
      <path d="M11 3l1.7 4.8L17.5 9.5l-4.8 1.7L11 16l-1.7-4.8L4.5 9.5l4.8-1.7Z" />
      <path d="M18 15v5M15.5 17.5h5" />
    </>
  ),
  rings: (
    <>
      {/* Linked: each ring broken where the other passes in front. */}
      <path d="M11.99 19.25A5.5 5.5 0 1 1 13.82 16.39" />
      <path d="M12.01 8.75A5.5 5.5 0 1 1 10.18 11.61" />
      <path d="M14 3.5h3l1.3 1.6-2.8 2.4-2.8-2.4Z" />
    </>
  ),
  church: (
    <>
      <path d="M12 2.5v4M10.2 4.3h3.6" />
      <path d="M7.5 21V11l4.5-4.5 4.5 4.5v10" />
      <path d="M7.5 14H4v7h16v-7h-3.5" />
      <path d="M10.5 21v-3a1.5 1.5 0 0 1 3 0v3" />
    </>
  ),
  venue: (
    <>
      <path d="M3.5 9 12 4l8.5 5Z" />
      <path d="M6 11.5V18M10 11.5V18M14 11.5V18M18 11.5V18M3 20.5h18" />
    </>
  ),
  tree: (
    <>
      <path d="M12 2.5 7 9.5h2.5L5 16h14l-4.5-6.5H17Z" />
      <path d="M12 16v5.5" />
    </>
  ),
  house: (
    <>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 9.5V20h12V9.5" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21.5c-4.3-4.6-7.5-8.4-7.5-11.5a7.5 7.5 0 0 1 15 0c0 3.1-3.2 6.9-7.5 11.5Z" />
      <circle cx="12" cy="10" r="2.7" />
    </>
  ),
  /* Food and drink. */
  meal: (
    <>
      <path d="M7 3v6a2 2 0 0 0 4 0V3M9 11v10" />
      <path d="M17 21V3c-1.8 1.4-3 4-3 7v3h3" />
    </>
  ),
  cloche: (
    <>
      <path d="M4.5 18a7.5 7.5 0 0 1 15 0Z" />
      <path d="M2.5 20.5h19" />
      <circle cx="12" cy="9.5" r="1" />
      {/* The dome's shine, and the steam rising over it. */}
      <path d="M7.3 15.5a5 5 0 0 1 2.5-3.2" />
      <path d="M8 7c-1-1.2 1-2.3 0-3.5M12 6.5c-1-1.2 1-2.3 0-3.5M16 7c-1-1.2 1-2.3 0-3.5" />
    </>
  ),
  cake: (
    <>
      <path d="M3.5 21h17M5 21v-6.5h14V21M7 14.5V10.5h10v4" />
      <path d="M5 17.5c1.2 1 2.3 1 3.5 0s2.3-1 3.5 0 2.3 1 3.5 0 2.3-1 3.5 0" />
      <path d="M12 10.5V8M12 5.8c-.9-.8-.9-1.8 0-3 .9 1.2.9 2.2 0 3Z" />
    </>
  ),
  coffee: (
    <>
      <path d="M4.5 9h11v4.5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5Z" />
      <path d="M15.5 10.5h1.5a2.5 2.5 0 0 1 0 5h-1.8" />
      <path d="M3.5 21h14" />
      <path d="M8.5 6.5c-.8-.9.8-1.6 0-2.5M12 6.5c-.8-.9.8-1.6 0-2.5" />
    </>
  ),
  cheers: (
    <>
      <g transform="rotate(10 7 19)">
        <path d="M5 3h4l-.5 6.5a1.5 1.5 0 0 1-3 0Z" />
        <path d="M7 11v8M5 19h4" />
      </g>
      <g transform="rotate(-10 17 19)">
        <path d="M15 3h4l-.5 6.5a1.5 1.5 0 0 1-3 0Z" />
        <path d="M17 11v8M15 19h4" />
      </g>
      <path d="M12 3.5V1.8M9.8 2.5l-.8-1M14.2 2.5l.8-1" />
    </>
  ),
  cocktail: (
    <>
      <path d="M4 4h16l-8 9Z" />
      <path d="M12 13v7.5M8.5 20.5h7" />
      <path d="M13.5 8 17.5 2.5" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4C10 4 4 9 4 16c0 1.8.4 3 1 4 1 .6 2.2 1 4 1 7 0 11-7 11-17Z" />
      <path d="M4.5 19.5 13 11" />
    </>
  ),
  /* The day's moments. */
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V6.5l10-2V16M9 10l10-2" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="16" r="2.5" />
    </>
  ),
  camera: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7l1.5-2.5h5L16 7" />
      <circle cx="12" cy="13.5" r="3.5" />
    </>
  ),
  balloon: (
    <>
      <path d="M13 2.5a5 5 0 0 0-5 5.3c0 3.3 2.9 6 5 6.4 2.1-.4 5-3.1 5-6.4A5 5 0 0 0 13 2.5Z" />
      <path d="M12 15.5h2l-1-1.3Z" />
      <path d="M13 15.5c-1.3 1-1.3 2 0 3s1.3 2 0 3" />
      <path d="M10.3 7.2a2.9 2.9 0 0 1 1.9-2.1" />
    </>
  ),
  baby: (
    <>
      <path d="M8.5 9.5h7V19a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2Z" />
      <path d="M9.5 9.5V7.5h5v2M11 7.5c0-2 .3-3.4 1-4 .7.6 1 2 1 4" />
      <path d="M8.5 13h2.5M8.5 16h2.5" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </>
  ),
  moon: <path d="M19.5 14.5A8 8 0 1 1 9.5 4.5a6.3 6.3 0 0 0 10 10Z" />,
  /* Getting there. */
  car: (
    <>
      <path d="M5 16V11l2-5h10l2 5v5M3 16h18v3H3Z" />
      <circle cx="7.5" cy="13" r="1" />
      <circle cx="16.5" cy="13" r="1" />
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
  train: (
    <>
      <rect x="6" y="3" width="12" height="14" rx="3" />
      <path d="M6 11h12M9 17l-2 4M15 17l2 4" />
      <circle cx="9.5" cy="14" r="0.6" />
      <circle cx="14.5" cy="14" r="0.6" />
    </>
  ),
  plane: (
    <path d="M12 2.5c1 0 1.5 1 1.5 2.5v4.5l7 4.5v2l-7-2v4l2 1.5v1.5L12 20l-3.5 1v-1.5l2-1.5v-4l-7 2v-2l7-4.5V5c0-1.5.5-2.5 1.5-2.5Z" />
  ),
  boat: (
    <>
      <path d="M3 16h18l-2.5 4h-13Z" />
      <path d="M12 3v13M12 4.5l6 9.5h-6M10.5 7 6 14h4.5" />
    </>
  ),
  walk: (
    <>
      <path d="M7.5 3.5c1.7 0 2.7 1.8 2.5 4.5-.2 2.2-.9 3.5-2.5 3.5S5.2 10.2 5 8C4.8 5.3 5.8 3.5 7.5 3.5Z" />
      <path d="M6 14h3v1.5a1.5 1.5 0 0 1-3 0Z" />
      <path d="M16.5 8c1.7 0 2.7 1.8 2.5 4.5-.2 2.2-.9 3.5-2.5 3.5s-2.3-1.3-2.5-3.5C13.8 9.8 14.8 8 16.5 8Z" />
      <path d="M15 18.5h3V20a1.5 1.5 0 0 1-3 0Z" />
    </>
  ),
  parking: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M10 16.5v-9h3a2.7 2.7 0 0 1 0 5.4h-3" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5Z" />
      {/* The needle's north half, filled. */}
      <path d="M15.5 8.5l-2 5-3-3Z" fill="currentColor" />
    </>
  ),
  /* Staying. */
  bed: (
    <>
      <path d="M3 19V6M3 14h18M21 19v-6a3 3 0 0 0-3-3h-7v4" />
      <circle cx="7" cy="10.5" r="1.8" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="16" r="4.5" />
      <path d="M11.2 12.8 19.5 4.5M18.3 5.7l2.5 2.5M16 8l2 2" />
    </>
  ),
  /* Dress code and gifts. */
  dress: (
    <>
      <path d="M9.5 2.5v3L7.5 8.5l2 2.5L5 21c4.5 1.3 9.5 1.3 14 0l-4.5-10 2-2.5-2-3v-3" />
      <path d="M9.5 5.5c1.2 1.5 3.8 1.5 5 0M9.5 11h5" />
    </>
  ),
  "bow-tie": (
    <>
      <path d="M10.5 10.5 5.7 7.6A1.5 1.5 0 0 0 3.5 9v6a1.5 1.5 0 0 0 2.2 1.4l4.8-2.9M13.5 10.5l4.8-2.9A1.5 1.5 0 0 1 20.5 9v6a1.5 1.5 0 0 1-2.2 1.4l-4.8-2.9" />
      <rect x="10.5" y="10" width="3" height="4" rx="1" />
    </>
  ),
  hanger: (
    <>
      <path d="M10 5.5a2 2 0 1 1 2 2v1" />
      <path d="M12 8.5 3.2 15.3a1 1 0 0 0 .6 1.7h16.4a1 1 0 0 0 .6-1.7Z" />
    </>
  ),
  gift: (
    <>
      <rect x="4" y="9" width="16" height="12" rx="1.5" />
      <path d="M12 9v12M4 14h16" />
      <path d="M12 9c-2-3.5-5.5-3.5-5.5-1.5S10 9 12 9Zm0 0c2-3.5 5.5-3.5 5.5-1.5S14 9 12 9Z" />
    </>
  ),
  /* Notes. */
  question: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6" />
      <circle cx="12" cy="17" r="0.6" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3.5 7l8.5 6.5L20.5 7" />
    </>
  ),
  toy: (
    /* A teddy bear sitting: ears behind the head, its face, arms, feet. */
    <>
      <path d="M9.44 3.9A2.1 2.1 0 1 0 7.3 6.5M16.7 6.5a2.1 2.1 0 1 0-2.14-2.6" />
      <circle cx="12" cy="8.2" r="5" />
      <circle cx="10.2" cy="7.4" r="0.2" />
      <circle cx="13.8" cy="7.4" r="0.2" />
      <path d="M11.2 9.2h1.6l-.8.8Z" />
      <path d="M8.6 11.9C6.4 12.6 4.6 14 4.6 15.6c0 .7.4 1.1 1 1.2M15.4 11.9c2.2.7 4 2.1 4 3.7 0 .7-.4 1.1-1 1.2M10 21h4" />
      <circle cx="7.4" cy="18.6" r="2.6" />
      <circle cx="16.6" cy="18.6" r="2.6" />
    </>
  ),
  umbrella: (
    <>
      <path d="M3 12a9 9 0 0 1 18 0c-1.5-1-3-1-4.5 0-1.5-1-3-1-4.5 0-1.5-1-3-1-4.5 0-1.5-1-3-1-4.5 0Z" />
      <path d="M12 3V2M12 12v6.5a2 2 0 0 1-4 0" />
    </>
  ),
  /* A traditional handset, earpiece top left, mouthpiece bottom right. */
  phone: (
    <path d="M5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5.5a2 2 0 0 1 2-2Z" />
  ),
  "no-phone": (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M11 18h2M4 4l16 16" />
    </>
  ),
  paw: (
    <>
      <path d="M12 12c-2.5 0-5 3-5 5.5C7 19 8 20 9.5 20c.9 0 1.7-.5 2.5-.5s1.6.5 2.5.5c1.5 0 2.5-1 2.5-2.5 0-2.5-2.5-5.5-5-5.5Z" />
      <circle cx="6" cy="10.5" r="1.7" />
      <circle cx="9.5" cy="6.5" r="1.8" />
      <circle cx="14.5" cy="6.5" r="1.8" />
      <circle cx="18" cy="10.5" r="1.7" />
    </>
  ),
  accessible: (
    <>
      <circle cx="11" cy="4.5" r="1.5" />
      <path d="M11 7.5v6h5l2.5 5M11 10h4" />
      <path d="M8.5 11a5.5 5.5 0 1 0 6.5 7.5" />
    </>
  ),
} satisfies Record<string, ReactNode>;

/** The page's own arrows, ticks, the RSVP heart and the date's calendar — never offered as a choice. */
const GLYPHS = {
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
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
export type GlyphName = keyof typeof GLYPHS;

/** Every id a host can pick, in the order an editor lists them. */
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

/** A new item's icon: never none, the host picks another. */
export const DEFAULT_ICON: IconName = "sparkle";

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
