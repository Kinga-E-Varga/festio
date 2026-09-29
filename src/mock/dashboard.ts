import previewAniversare from "@/mock/inv-img/Screenshot 2026-07-21 151118.png";
import previewBotez from "@/mock/inv-img/Screenshot 2026-07-23 180642.png";
import previewCununie from "@/mock/inv-img/Screenshot 2026-07-27 213629.png";
import previewRevelion from "@/mock/inv-img/Screenshot 2026-07-27 155217.png";
import previewCumetrie from "@/mock/inv-img/Screenshot 2026-06-16 173040.png";
import previewMajorat from "@/mock/inv-img/Screenshot 2026-07-28 172900.png";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import {
  canReportFlood,
  eventStatus,
  expectedLevel,
  expectedPercent,
  floodReportPath,
  repliesPaused,
  replyWindow,
} from "@/lib/event";
import type {
  AttentionNotice,
  DashboardEvent,
  DashboardStat,
  EventKind,
  FooterColumn,
  NavSection,
  RsvpActivity,
  Package,
  PackageId,
} from "@/types/dashboard";

/**
 * Placeholder host until accounts are wired up. The name and the date are
 * data, not sentences: the greeting around the name and the way the date is
 * written both change with the host's language.
 */
export const HOST = {
  name: "Maria",
  initials: "MI",
  today: "2026-09-04",
};

/* Keys into the `Nav` message namespace; the words themselves live there. */
export const NAV_SECTIONS: NavSection[] = [
  {
    labelKey: "hosting",
    items: [
      { labelKey: "home", href: "/dashboard", icon: "home" },
      {
        labelKey: "events",
        href: "/dashboard/events",
        icon: "calendar",
        badge: "5",
      },
      {
        labelKey: "invitations",
        href: "/dashboard/invitations",
        icon: "envelope",
      },
    ],
  },
  {
    labelKey: "studio",
    items: [
      { labelKey: "print", href: "/dashboard/print", icon: "printer" },
      {
        labelKey: "templates",
        href: "/dashboard/templates",
        icon: "templates",
      },
    ],
  },
  {
    labelKey: "account",
    items: [
      { labelKey: "billing", href: "/dashboard/billing", icon: "billing" },
      { labelKey: "privacy", href: "/dashboard/privacy", icon: "shield" },
      { labelKey: "settings", href: "/dashboard/settings", icon: "settings" },
    ],
  },
];

/** Prices and what each package unlocks, lowest first, straight from the project spec. */
export const PACKAGES: Record<PackageId, Package> = {
  free: { price: 0, seating: false },
  standard: { price: 100, seating: true },
  custom: { price: 200, seating: true },
};

/** The package one step up, or none from the top. */
export function nextPackage(id: PackageId): PackageId | undefined {
  const order = Object.keys(PACKAGES) as PackageId[];
  return order[order.indexOf(id) + 1];
}

/* Keys into the `Occasions` message namespace, in the order they are offered. */
export const EVENT_KINDS: EventKind[] = [
  "wedding",
  "engagement",
  "bachelorParty",
  "christening",
  "birthday",
  "kidsParty",
  "dinnerParty",
  "reunion",
  "other",
];

/* Keys into the `Stats` message namespace. */
export const STATS: DashboardStat[] = [
  {
    labelKey: "liveInvitations",
    value: "4",
    detailKey: "ofTotal",
    detailValue: 5,
  },
  { labelKey: "nextEvent", value: "2", detailKey: "daysAway" },
  { labelKey: "newReplies", value: "12", detailKey: "sinceLastVisit" },
  { labelKey: "repliesToReview", value: "7", detailKey: "toReview" },
];

export const EVENTS: DashboardEvent[] = [
  {
    id: "maria-andrei",
    title: "Maria & Andrei — Cununie civilă și petrecere",
    kind: "wedding",
    date: "2026-09-06",
    time: "16:00",
    countdown: { value: 2, unit: "day" },
    isNextUp: true,
    venue: "Restaurant Cetate",
    address: "Piața Unirii 2, Cluj-Napoca",
    visibility: "protected",
    package: "custom",
    templateId: "wolf-dance",
    /* Events without one read as English — the rollout default. */
    language: "ro",
    paid: true,
    locksIn: { value: 30, unit: "hour" },
    repliesCloseIn: { value: 30, unit: "hour" },
    slug: "maria-andrei",
    password: "andrei26",
    rsvp: {
      replied: 96,
      invited: 124,
      attending: 82,
      declined: 14,
      pending: 28,
    },
    expectedGuests: 110,
    needsAttention: 5,
    preloaded: true,
    preloadedCount: 124,
    note: {
      tone: "warning",
      key: "attention",
      values: { count: 5 },
      actionKey: "reviewReplies",
    },
    attendeeNotes: [
      { key: "childrenBabies", values: { children: 4, babies: 1 } },
      { key: "vegetarian", values: { count: 7 } },
      { key: "stepFree", values: { count: 2 } },
    ],
    preview: previewCununie,
    seatingAvailable: true,
    locked: false,
    dataDeleted: false,
  },
  {
    id: "botez-sofia",
    title: "Botez Sofia — Grădina Bunicii",
    kind: "christening",
    date: "2026-10-11",
    time: "13:00",
    countdown: { value: 5, unit: "week" },
    venue: "Grădina Bunicii",
    address: "Strada Plopilor 14, Florești",
    visibility: "public",
    package: "standard",
    paid: true,
    locksIn: { value: 5, unit: "week" },
    slug: "botez-sofia",
    rsvp: {
      replied: 70,
      invited: 70,
      attending: 63,
      declined: 7,
      pending: 0,
    },
    expectedGuests: 70,
    needsAttention: 0,
    preloaded: true,
    preloadedCount: 70,
    attendeeNotes: [
      { key: "childrenBabies", values: { children: 6, babies: 2 } },
      { key: "glutenFree", values: { count: 3 } },
    ],
    preview: previewBotez,
    seatingAvailable: true,
    locked: false,
    dataDeleted: false,
  },
  {
    id: "logodna-ana-vlad",
    title: "Logodnă Ana & Vlad — Vila Florilor",
    kind: "engagement",
    date: "2026-10-24",
    time: "18:00",
    countdown: { value: 7, unit: "week" },
    venue: "Vila Florilor",
    address: "Strada Florilor 5, Cluj-Napoca",
    visibility: "public",
    package: "custom",
    language: "ro",
    paid: true,
    locksIn: { value: 7, unit: "week" },
    slug: "ana-vlad",
    /* Matches the rows in `mock/guests.ts`. */
    rsvp: { replied: 8, invited: 8, attending: 7, declined: 1, pending: 3 },
    expectedGuests: 8,
    needsAttention: 2,
    preloaded: true,
    preloadedCount: 8,
    preview: previewAniversare,
    seatingAvailable: false,
    locked: false,
    dataDeleted: false,
  },
  {
    id: "aniversare-50",
    title: "Aniversare 50 — Ion Popescu",
    kind: "birthday",
    date: "2026-11-22",
    time: "19:00",
    countdown: { value: 11, unit: "week" },
    venue: "Casa Ardeleană",
    address: "Bulevardul Eroilor 8, Cluj-Napoca",
    visibility: "hidden",
    package: "free",
    paid: true,
    locksIn: { value: 11, unit: "week" },
    slug: "ion-50",
    linkNoteKey: "notSharedHidden",
    rsvp: { replied: 0, invited: 40, attending: 0, declined: 0, pending: 40 },
    expectedGuests: 60,
    needsAttention: 0,
    preloaded: false,
    preloadedCount: 0,
    note: {
      tone: "neutral",
      key: "opensWhenPublic",
    },
    preview: previewAniversare,
    seatingAvailable: false,
    locked: false,
    dataDeleted: false,
  },
  {
    id: "revelion",
    title: "Revelion 2027 — Casa Mare",
    kind: "dinnerParty",
    date: "2026-12-31",
    time: "21:00",
    countdown: { value: 17, unit: "week" },
    venue: "Casa Mare",
    address: "Strada Someșului 3, Gilău",
    visibility: "hidden",
    package: "custom",
    paid: false,
    locksIn: { value: 17, unit: "week" },
    slug: "revelion-2027",
    linkNoteKey: "hiddenUntilPaid",
    rsvp: { replied: 0, invited: 0, attending: 0, declined: 0, pending: 0 },
    expectedGuests: 80,
    needsAttention: 0,
    preloaded: false,
    preloadedCount: 0,
    note: {
      tone: "warning",
      key: "paymentPending",
      actionKey: "payPublish",
    },
    preview: previewRevelion,
    seatingAvailable: false,
    locked: false,
    dataDeleted: false,
  },
  {
    id: "cumetrie-luca",
    title: "Cumetrie Luca — Restaurant Salcia",
    kind: "christening",
    date: "2026-06-14",
    time: "14:00",
    countdown: { value: -12, unit: "week" },
    venue: "Restaurant Salcia",
    address: "Strada Piatra Craiului 2, Cluj-Napoca",
    visibility: "public",
    package: "standard",
    paid: true,
    slug: "cumetrie-luca",
    rsvp: {
      replied: 58,
      invited: 60,
      attending: 51,
      declined: 7,
      pending: 2,
    },
    expectedGuests: 80,
    needsAttention: 0,
    preloaded: true,
    preloadedCount: 60,
    note: {
      tone: "neutral",
      key: "pastRetention",
      values: { days: GUEST_DATA_RETENTION_DAYS },
    },
    preview: previewCumetrie,
    seatingAvailable: true,
    locked: true,
    dataDeleted: true,
  },
  {
    id: "majorat-ana",
    title: "Majorat Ana — Terasa Verde",
    kind: "birthday",
    date: "2026-08-22",
    time: "18:00",
    countdown: { value: -2, unit: "week" },
    venue: "Terasa Verde",
    address: "Strada Republicii 21, Turda",
    visibility: "protected",
    package: "free",
    paid: true,
    slug: "majorat-ana",
    password: "ana18ana",
    rsvp: {
      replied: 34,
      invited: 40,
      attending: 30,
      declined: 4,
      pending: 6,
    },
    expectedGuests: 45,
    needsAttention: 0,
    preloaded: false,
    preloadedCount: 0,
    preview: previewMajorat,
    seatingAvailable: false,
    locked: true,
    dataDeleted: false,
  },
];

/** Events keep their own order; the editor just needs one by id. */
export function findEvent(id: string): DashboardEvent | undefined {
  return EVENTS.find((event) => event.id === id);
}

/* The part of a title before " — ", which is how the notices name an event. */
function shortTitle(event: DashboardEvent): string {
  return event.title.split(" — ")[0];
}

/**
 * Reply notices come from the events' own numbers, so they always match the
 * cards: paused once the hidden cap is hit, otherwise one from 80% of
 * expected guests. Only active events can still take replies.
 */
function replyNotices(): AttentionNotice[] {
  return EVENTS.filter((event) => eventStatus(event) === "active").flatMap(
    (event): AttentionNotice[] => {
      const name = shortTitle(event);
      const { replied } = event.rsvp;
      const reportHref = canReportFlood(event)
        ? floodReportPath(event)
        : undefined;
      if (repliesPaused(event)) {
        return [
          {
            id: `paused-${event.id}`,
            key: "paused",
            values: { event: name },
            tone: "paused",
            reportHref,
          },
        ];
      }
      const percent = expectedPercent(replied, event.expectedGuests);
      if (replied === 0 || expectedLevel(percent) === "ok") return [];
      const over = replied > event.expectedGuests;
      return [
        {
          id: `expected-${event.id}`,
          key: over ? "overExpected" : "nearExpected",
          values: {
            percent,
            replied,
            expected: event.expectedGuests,
            event: name,
          },
          tone: over ? "overExpected" : "expected",
          reportHref,
        },
      ];
    },
  );
}

/*
 * Each notice's title and body are the event editor's banner for the same
 * thing (`EventPage.<key>Title` / `<key>Body`), so the two always read alike.
 * `Notices.<key>` holds only the rail's own context and action.
 */
export const ATTENTION_NOTICES: AttentionNotice[] = [
  {
    id: "attention",
    key: "attention",
    values: { count: 5, event: "Maria & Andrei" },
    tone: "attention",
  },
  ...EVENTS.filter(
    (event) => event.isNextUp && event.locksIn && !event.locked,
  ).map((event): AttentionNotice => ({
    id: `editing-closes-${event.id}`,
    key: "closing",
    span: event.locksIn,
    eventDate: event.date,
    values: { event: shortTitle(event) },
    tone: "deadline",
  })),
  ...replyNotices(),
  ...EVENTS.filter(
    (event) => eventStatus(event) === "active" && replyWindow(event) !== "open",
  ).map((event): AttentionNotice => ({
    id: `replies-close-${event.id}`,
    key: replyWindow(event) === "closed" ? "repliesClosed" : "repliesClosing",
    span: event.repliesCloseIn,
    closesAt: event.repliesCloseAt,
    eventDate: event.date,
    values: {
      event: shortTitle(event),
      custom: event.repliesCloseAt ? "yes" : "no",
      /*
       * A custom time can still move until the default close — the same
       * moment editing freezes. On the default time there is nothing to
       * change, so the guest list is offered instead.
       */
      change: event.repliesCloseAt && !event.locked ? "yes" : "no",
    },
    tone: "deadline",
  })),
  {
    id: "unpaid",
    key: "unpaid",
    values: { event: "Revelion" },
    package: "custom",
    tone: "billing",
  },
];

/* Keys into the `Activity` message namespace. */
export const RECENT_RSVPS: RsvpActivity[] = [
  {
    id: "elena",
    initials: "EM",
    actor: "Elena Marin",
    action: { key: "attendingWith", values: { others: 2 } },
    event: "Maria & Andrei",
    details: [{ key: "children", values: { count: 1 } }, { key: "vegetarian" }],
    when: { value: -14, unit: "minute" },
  },
  {
    id: "radu",
    initials: "?",
    actor: "Radu P.",
    action: { key: "replied" },
    tag: "UNKNOWN",
    event: "Maria & Andrei",
    details: [{ key: "notOnList" }],
    when: { value: -1, unit: "hour" },
  },
  {
    id: "ionescu",
    initials: "FI",
    actor: "Familia Ionescu",
    action: { key: "declined" },
    event: "Botez Sofia",
    when: { value: -4, unit: "hour" },
  },
  {
    id: "ana",
    initials: "AV",
    actor: "Ana Vasilescu",
    action: { key: "attendingBabies", values: { babies: 1 } },
    event: "Botez Sofia",
    details: [{ key: "glutenFree" }],
    when: { value: -1, unit: "day" },
  },
  {
    id: "bunica-veta",
    initials: "MI",
    action: { key: "phoneRsvp", values: { subject: "Bunica Veta" } },
    event: "Maria & Andrei",
    details: [{ key: "addedByHost" }],
    when: { value: -1, unit: "day" },
  },
];

/* Keys into the `Footer` message namespace. */
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    labelKey: "product",
    linkKeys: [
      "templateGallery",
      "packagesPricing",
      "printSizes",
      "seatingCharts",
    ],
  },
  {
    labelKey: "forHosts",
    linkKeys: [
      "gettingStarted",
      "writingQuestions",
      "sharingLink",
      "cancelPostpone",
    ],
  },
  {
    labelKey: "legal",
    linkKeys: ["termsDpa", "privacyNotice", "dataRetention", "cookies"],
  },
];
