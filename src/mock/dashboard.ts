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
  FooterColumn,
  NavSection,
  RsvpActivity,
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
        label: "Invitations",
        href: "/dashboard/invitations",
        icon: "envelope",
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
      { label: "Templates", href: "/dashboard/templates", icon: "templates" },
      { label: "Print & downloads", href: "/dashboard/print", icon: "printer" },
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
    dateLabel: "6 September 2026",
    countdownLabel: "in 2 days",
    isNextUp: true,
    visibility: "protected",
    tierLabel: "Custom",
    editLockLabel: "Locks in 30 h",
    link: "festio.eu/maria-andrei-1657",
    password: "andrei26",
    rsvp: {
      replied: 96,
      invited: 124,
      attending: 82,
      declined: 14,
      pending: 28,
    },
    safeguard: { confirmed: 82, cap: 140 },
    note: {
      tone: "warning",
      text: "5 names didn't match your pre-loaded list.",
      actionLabel: "Review names",
    },
    preview: previewCununie,
    previewAlt: "Invitation preview for Maria & Andrei",
    status: "active",
    seatingAvailable: true,
  },
  {
    id: "botez-sofia",
    title: "Botez Sofia — Grădina Bunicii",
    dateLabel: "11 October 2026",
    countdownLabel: "in 5 weeks",
    visibility: "public",
    tierLabel: "Standard",
    link: "festio.eu/botez-sofia-4093",
    rsvp: {
      replied: 41,
      invited: 70,
      attending: 38,
      declined: 3,
      pending: 29,
    },
    safeguard: { confirmed: 38, cap: 100 },
    note: {
      tone: "neutral",
      text: "6 children and 2 babies among the attendees.",
    },
    preview: previewBotez,
    previewAlt: "Invitation preview for Botez Sofia",
    status: "active",
    seatingAvailable: true,
  },
  {
    id: "aniversare-50",
    title: "Aniversare 50 — Ion Popescu",
    dateLabel: "22 November 2026",
    countdownLabel: "in 11 weeks",
    visibility: "hidden",
    tierLabel: "Free",
    link: "festio.eu/ion-50-7712",
    linkNote: "Not shared yet — the page is hidden",
    rsvp: { replied: 0, invited: 40, attending: 0, declined: 0, pending: 40 },
    safeguard: { confirmed: 0, cap: 60 },
    note: {
      tone: "neutral",
      text: "The RSVP form opens when you make the page public.",
    },
    preview: previewAniversare,
    previewAlt: "Invitation preview for Aniversare 50",
    status: "active",
    seatingAvailable: false,
  },
  {
    id: "revelion",
    title: "Revelion 2027 — Casa Mare",
    dateLabel: "31 December 2026",
    countdownLabel: "in 17 weeks",
    visibility: "hidden",
    tierLabel: "Custom",
    link: "festio.eu/revelion-2027-2208",
    linkNote: "Hidden until payment clears",
    rsvp: { replied: 0, invited: 0, attending: 0, declined: 0, pending: 0 },
    safeguard: { confirmed: 0, cap: 80 },
    note: {
      tone: "warning",
      text: "Payment is pending, so the page stays hidden.",
      actionLabel: "Pay & publish",
    },
    preview: previewRevelion,
    previewAlt: "Invitation preview for Revelion 2027",
    status: "draft",
    seatingAvailable: false,
  },
  {
    id: "cumetrie-luca",
    title: "Cumetrie Luca — Restaurant Salcia",
    dateLabel: "14 June 2026",
    countdownLabel: "12 weeks ago",
    visibility: "public",
    tierLabel: "Standard",
    link: "festio.eu/cumetrie-luca-3390",
    rsvp: {
      replied: 58,
      invited: 60,
      attending: 51,
      declined: 7,
      pending: 2,
    },
    safeguard: { confirmed: 51, cap: 80 },
    note: {
      tone: "neutral",
      text: `Guest data is deleted ${GUEST_DATA_RETENTION_DAYS} days after the event — this one is already past that window.`,
    },
    preview: previewCumetrie,
    previewAlt: "Invitation preview for Cumetrie Luca",
    status: "past",
    seatingAvailable: true,
  },
  {
    id: "majorat-ana",
    title: "Majorat Ana — Terasa Verde",
    dateLabel: "2 August 2026",
    countdownLabel: "5 weeks ago",
    visibility: "protected",
    tierLabel: "Free",
    link: "festio.eu/majorat-ana-8814",
    password: "ana18ana",
    rsvp: {
      replied: 34,
      invited: 40,
      attending: 30,
      declined: 4,
      pending: 6,
    },
    safeguard: { confirmed: 30, cap: 45 },
    preview: previewMajorat,
    previewAlt: "Invitation preview for Majorat Ana",
    status: "past",
    seatingAvailable: false,
  },
];

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
