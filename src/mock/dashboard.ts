import previewAniversare from "@/mock/inv-img/Screenshot 2026-07-21 151118.png";
import previewBotez from "@/mock/inv-img/Screenshot 2026-07-23 180642.png";
import previewCununie from "@/mock/inv-img/Screenshot 2026-07-27 213629.png";
import previewRevelion from "@/mock/inv-img/Screenshot 2026-07-27 155217.png";
import previewCumetrie from "@/mock/inv-img/Screenshot 2026-06-16 173040.png";
import previewMajorat from "@/mock/inv-img/Screenshot 2026-07-28 172900.png";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import type {
  AttentionNotice,
  DashboardEvent,
  DashboardStat,
  EventKind,
  FooterColumn,
  NavSection,
  RsvpActivity,
  Tier,
  TierId,
} from "@/types/dashboard";

/** Placeholder host until accounts are wired up. */
export const HOST = {
  greeting: "Bună, Maria",
  initials: "MI",
  todayLabel: "Friday, 4 September 2026",
  lede: "Your next invitation locks for editing tomorrow — 24 hours before the event.",
};

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Hosting",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: "home" },
      {
        label: "Events",
        href: "/dashboard/events",
        icon: "calendar",
        badge: "4",
      },
      {
        label: "Guest lists",
        href: "/dashboard/guest-lists",
        icon: "guests",
        badge: "148",
      },
      {
        label: "Seating charts",
        href: "/dashboard/seating",
        icon: "seating",
      },
    ],
  },
  {
    label: "Studio",
    items: [
      { label: "Invitations", href: "/dashboard/invitations", icon: "envelope" },
      { label: "Print & downloads", href: "/dashboard/print", icon: "printer" },
      { label: "Templates", href: "/dashboard/templates", icon: "templates" },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Billing", href: "/dashboard/billing", icon: "billing" },
      { label: "Privacy & data", href: "/dashboard/privacy", icon: "shield" },
      { label: "Settings", href: "/dashboard/settings", icon: "settings" },
    ],
  },
];

/** Prices and what each tier unlocks, straight from the project spec. */
export const TIERS: Record<TierId, Tier> = {
  1: {
    name: "Free",
    price: "Free",
    seating: false,
    blurb:
      "A fixed template with a minimal RSVP form. No seating chart.",
  },
  2: {
    name: "Standard",
    price: "100 RON",
    seating: true,
    blurb:
      "A fixed template with a minimal RSVP form, and a seating chart included.",
    upsell:
      "Adds a seating chart to this invitation. You pay the difference, and nothing you have written is lost.",
  },
  3: {
    name: "Custom",
    price: "200 RON",
    seating: true,
    blurb:
      "Modular invitation and RSVP sections, template customisation, and a seating chart.",
    upsell:
      "Unlocks modular sections, your own palette and fonts, and custom RSVP questions. You pay the difference, and nothing you have written is lost.",
  },
};

export const EVENT_KINDS: { id: EventKind; label: string }[] = [
  { id: "wedding", label: "Wedding — Nuntă" },
  { id: "christening", label: "Christening — Botez" },
  { id: "birthday", label: "Birthday — Aniversare" },
  { id: "comingOfAge", label: "Coming of age — Majorat" },
  { id: "cumetrie", label: "Cumetrie" },
  { id: "newYear", label: "New Year — Revelion" },
  { id: "other", label: "Other" },
];

export const STATS: DashboardStat[] = [
  { label: "Live invitations", value: "3", detail: "of 4" },
  { label: "Attendees confirmed", value: "148", detail: "+12 this week" },
  { label: "Awaiting reply", value: "37" },
  { label: "Unmatched names", value: "5", detail: "UNKNOWN", tone: "attention" },
];

export const EVENTS: DashboardEvent[] = [
  {
    id: "maria-andrei",
    title: "Maria & Andrei — Cununie civilă și petrecere",
    kind: "wedding",
    date: "2026-09-06",
    time: "16:00",
    dateLabel: "6 September 2026",
    countdownLabel: "in 2 days",
    isNextUp: true,
    venue: "Restaurant Cetate",
    address: "Piața Unirii 2, Cluj-Napoca",
    visibility: "protected",
    tier: 3,
    invitationType: 2,
    paid: true,
    editLockLabel: "Locks in 30 h",
    locksInLabel: "30 hours",
    slug: "maria-andrei",
    digits: "1657",
    password: "andrei26",
    rsvp: {
      replied: 96,
      invited: 124,
      attending: 82,
      declined: 14,
      pending: 28,
    },
    safeguard: { confirmed: 82, cap: 140 },
    unmatched: 5,
    preloaded: true,
    preloadedCount: 124,
    note: {
      tone: "warning",
      text: "5 names didn't match your pre-loaded list.",
      actionLabel: "Review names",
    },
    preview: previewCununie,
    previewAlt: "Invitation preview for Maria & Andrei",
    status: "active",
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
    dateLabel: "11 October 2026",
    countdownLabel: "in 5 weeks",
    venue: "Grădina Bunicii",
    address: "Strada Plopilor 14, Florești",
    visibility: "public",
    tier: 2,
    invitationType: 2,
    paid: true,
    locksInLabel: "5 weeks",
    slug: "botez-sofia",
    digits: "4093",
    rsvp: {
      replied: 41,
      invited: 70,
      attending: 38,
      declined: 3,
      pending: 29,
    },
    safeguard: { confirmed: 38, cap: 100 },
    unmatched: 0,
    preloaded: true,
    preloadedCount: 70,
    note: {
      tone: "neutral",
      text: "6 children and 2 babies among the attendees.",
    },
    preview: previewBotez,
    previewAlt: "Invitation preview for Botez Sofia",
    status: "active",
    seatingAvailable: true,
    locked: false,
    dataDeleted: false,
  },
  {
    id: "aniversare-50",
    title: "Aniversare 50 — Ion Popescu",
    kind: "birthday",
    date: "2026-11-22",
    time: "19:00",
    dateLabel: "22 November 2026",
    countdownLabel: "in 11 weeks",
    venue: "Casa Ardeleană",
    address: "Bulevardul Eroilor 8, Cluj-Napoca",
    visibility: "hidden",
    tier: 1,
    invitationType: 1,
    paid: true,
    locksInLabel: "11 weeks",
    slug: "ion-50",
    digits: "7712",
    linkNote: "Not shared yet — the page is hidden",
    rsvp: { replied: 0, invited: 40, attending: 0, declined: 0, pending: 40 },
    safeguard: { confirmed: 0, cap: 60 },
    unmatched: 0,
    preloaded: false,
    preloadedCount: 0,
    note: {
      tone: "neutral",
      text: "The RSVP form opens when you make the page public.",
    },
    preview: previewAniversare,
    previewAlt: "Invitation preview for Aniversare 50",
    status: "active",
    seatingAvailable: false,
    locked: false,
    dataDeleted: false,
  },
  {
    id: "revelion",
    title: "Revelion 2027 — Casa Mare",
    kind: "newYear",
    date: "2026-12-31",
    time: "21:00",
    dateLabel: "31 December 2026",
    countdownLabel: "in 17 weeks",
    venue: "Casa Mare",
    address: "Strada Someșului 3, Gilău",
    visibility: "hidden",
    tier: 3,
    invitationType: 2,
    paid: false,
    locksInLabel: "17 weeks",
    slug: "revelion-2027",
    digits: "2208",
    linkNote: "Hidden until payment clears",
    rsvp: { replied: 0, invited: 0, attending: 0, declined: 0, pending: 0 },
    safeguard: { confirmed: 0, cap: 80 },
    unmatched: 0,
    preloaded: false,
    preloadedCount: 0,
    note: {
      tone: "warning",
      text: "Payment is pending, so the page stays hidden.",
      actionLabel: "Pay & publish",
    },
    preview: previewRevelion,
    previewAlt: "Invitation preview for Revelion 2027",
    status: "draft",
    seatingAvailable: false,
    locked: false,
    dataDeleted: false,
  },
  {
    id: "cumetrie-luca",
    title: "Cumetrie Luca — Restaurant Salcia",
    kind: "cumetrie",
    date: "2026-06-14",
    time: "14:00",
    dateLabel: "14 June 2026",
    countdownLabel: "12 weeks ago",
    venue: "Restaurant Salcia",
    address: "Strada Piatra Craiului 2, Cluj-Napoca",
    visibility: "public",
    tier: 2,
    invitationType: 2,
    paid: true,
    slug: "cumetrie-luca",
    digits: "3390",
    rsvp: {
      replied: 58,
      invited: 60,
      attending: 51,
      declined: 7,
      pending: 2,
    },
    safeguard: { confirmed: 51, cap: 80 },
    unmatched: 0,
    preloaded: true,
    preloadedCount: 60,
    note: {
      tone: "neutral",
      text: `Guest data is deleted ${GUEST_DATA_RETENTION_DAYS} days after the event — this one is already past that window.`,
    },
    preview: previewCumetrie,
    previewAlt: "Invitation preview for Cumetrie Luca",
    status: "past",
    seatingAvailable: true,
    locked: true,
    dataDeleted: true,
  },
  {
    id: "majorat-ana",
    title: "Majorat Ana — Terasa Verde",
    kind: "comingOfAge",
    date: "2026-08-22",
    time: "18:00",
    dateLabel: "22 August 2026",
    countdownLabel: "2 weeks ago",
    venue: "Terasa Verde",
    address: "Strada Republicii 21, Turda",
    visibility: "protected",
    tier: 1,
    invitationType: 1,
    paid: true,
    slug: "majorat-ana",
    digits: "8814",
    password: "ana18ana",
    rsvp: {
      replied: 34,
      invited: 40,
      attending: 30,
      declined: 4,
      pending: 6,
    },
    safeguard: { confirmed: 30, cap: 45 },
    unmatched: 0,
    preloaded: false,
    preloadedCount: 0,
    preview: previewMajorat,
    previewAlt: "Invitation preview for Majorat Ana",
    status: "past",
    seatingAvailable: false,
    locked: true,
    dataDeleted: false,
  },
];

/** Events keep their own order; the editor just needs one by id. */
export function findEvent(id: string): DashboardEvent | undefined {
  return EVENTS.find((event) => event.id === id);
}

export const ATTENTION_NOTICES: AttentionNotice[] = [
  {
    id: "unmatched",
    title: "5 unmatched names",
    context: "on Maria & Andrei",
    body: "Tagged UNKNOWN. Add them, or match them to a mistyped name on your pre-loaded list.",
    actionLabel: "Review names",
    tone: "unmatched",
  },
  {
    id: "editing-closes",
    title: "Editing closes in 30 hours",
    body: "Content and template freeze 24 hours before the event date.",
    actionLabel: "Make final edits",
    tone: "deadline",
  },
  {
    id: "safeguard",
    title: "Attendee safeguard at 88%",
    body: "96 of your 140 cap. Raise it any time — it's a technical guard, not a guest limit.",
    actionLabel: "Raise cap",
    tone: "safeguard",
  },
  {
    id: "unpaid",
    title: "Revelion draft is unpaid",
    body: "A Custom invitation. The page stays hidden until payment clears.",
    actionLabel: "Pay & publish",
    tone: "billing",
  },
];

export const RECENT_RSVPS: RsvpActivity[] = [
  {
    id: "elena",
    initials: "EM",
    actor: "Elena Marin",
    summary: "is attending with 2 others",
    meta: ["Maria & Andrei", "1 child, vegetarian", "14 min ago"],
  },
  {
    id: "radu",
    initials: "?",
    actor: "Radu P.",
    summary: "replied",
    tag: "UNKNOWN",
    meta: ["Maria & Andrei", "not on pre-loaded list", "1 h ago"],
  },
  {
    id: "ionescu",
    initials: "FI",
    actor: "Familia Ionescu",
    summary: "declined",
    meta: ["Botez Sofia", "4 h ago"],
  },
  {
    id: "ana",
    initials: "AV",
    actor: "Ana Vasilescu",
    summary: "is attending, 1 baby",
    meta: ["Botez Sofia", "gluten-free", "yesterday"],
  },
  {
    id: "bunica-veta",
    initials: "MI",
    actor: "You",
    summary: "added a phone RSVP for",
    subject: "Bunica Veta",
    meta: ["Maria & Andrei", "added by host", "yesterday"],
  },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    label: "Product",
    links: [
      "Template gallery",
      "Editions & pricing",
      "Print sizes",
      "Seating charts",
    ],
  },
  {
    label: "For hosts",
    links: [
      "Getting started",
      "Writing RSVP questions",
      "Sharing your link",
      "Cancel or postpone",
    ],
  },
  {
    label: "Legal",
    links: [
      "Terms & DPA",
      "Privacy notice",
      "Data retention",
      "Cookies",
    ],
  },
];
