import type { StaticImageData } from "next/image";

export type IconName =
  | "home"
  | "envelope"
  | "guests"
  | "seating"
  | "templates"
  | "printer"
  | "billing"
  | "shield"
  | "settings"
  | "cart"
  | "user"
  | "bell"
  | "pencil"
  | "eye"
  | "eyeOff"
  | "list"
  | "link"
  | "lock"
  | "copy"
  | "clock"
  | "alert"
  | "globe"
  | "arrowUpRight"
  | "arrowLeft"
  | "arrowRight"
  | "calendar"
  | "layers"
  | "plus"
  | "info"
  | "ban"
  | "trash"
  | "check"
  | "search"
  | "menu"
  | "close";

export interface NavItem {
  label: string;
  href: string;
  icon: IconName;
  /** Small count shown right-aligned, e.g. how many invitations are live. */
  badge?: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

/** Tier is per invitation and can only ever go up (project spec). */
export type TierId = 1 | 2 | 3;

export interface Tier {
  name: string;
  price: string;
  seating: boolean;
  blurb: string;
  /** Shown on the tile offering the next tier up; absent on the top tier. */
  upsell?: string;
}

/** Occasion drives which templates are offered first. */
export type EventKind =
  | "wedding"
  | "christening"
  | "birthday"
  | "comingOfAge"
  | "cumetrie"
  | "newYear"
  | "other";

/** Per-invitation visibility (project spec: Hidden / Public / Protected). */
export type Visibility = "hidden" | "public" | "protected";

export type EventStatus = "active" | "draft" | "past";

export interface RsvpTally {
  replied: number;
  invited: number;
  attending: number;
  declined: number;
  pending: number;
}

/** Host-set cap on total attendees — a technical safeguard, not a guest limit. */
export interface AttendeeSafeguard {
  confirmed: number;
  cap: number;
}

export interface EventNote {
  tone: "warning" | "neutral";
  text: string;
  actionLabel?: string;
}

export interface DashboardEvent {
  id: string;
  title: string;
  kind: EventKind;
  /** ISO `YYYY-MM-DD`; the editor computes every deadline from it. */
  date: string;
  /** 24h `HH:MM` start time. */
  time: string;
  /** Pre-formatted for display; the list does no date maths of its own. */
  dateLabel: string;
  countdownLabel: string;
  isNextUp?: boolean;
  venue: string;
  address: string;
  visibility: Visibility;
  tier: TierId;
  /** 1 = fixed template, text only. 2 = modular sections. */
  invitationType: 1 | 2;
  paid: boolean;
  /** Set while the 24h content freeze is in sight. */
  editLockLabel?: string;
  /** The host-editable half of the link. */
  slug: string;
  /** Festio's four random digits, which keep the link unguessable. */
  digits: string;
  /** Set only on Protected invitations; min 4 chars, letters or digits. */
  password?: string;
  /** Replaces the copy row when there is nothing to share yet. */
  linkNote?: string;
  rsvp: RsvpTally;
  safeguard: AttendeeSafeguard;
  /** Replies that matched no name on the pre-loaded list. */
  unmatched: number;
  preloaded: boolean;
  preloadedCount: number;
  note?: EventNote;
  preview: StaticImageData;
  previewAlt: string;
  status: EventStatus;
  seatingAvailable: boolean;
  /** True once the content freeze has passed; nothing is editable after it. */
  locked: boolean;
  /** How long until the freeze, while it is still ahead. */
  locksInLabel?: string;
  /** True once the retention window has run out and the guest data is gone. */
  dataDeleted: boolean;
}

export interface DashboardStat {
  label: string;
  value: string;
  /** Quieter text trailing the value, e.g. "of 4" or "+12 this week". */
  detail?: string;
  tone?: "default" | "attention";
}

export type NoticeTone = "unmatched" | "deadline" | "safeguard" | "billing";

export interface AttentionNotice {
  id: string;
  title: string;
  /** Event the notice belongs to, appended to the title in lighter ink. */
  context?: string;
  body: string;
  actionLabel: string;
  tone: NoticeTone;
}

export interface RsvpActivity {
  id: string;
  initials: string;
  /** Who acted — rendered emphasised. */
  actor: string;
  /** What they did, following the actor in plain ink. */
  summary: string;
  /** Optional second emphasised name, e.g. the guest a host added by phone. */
  subject?: string;
  tag?: "UNKNOWN";
  meta: string[];
}

export interface FooterColumn {
  label: string;
  links: string[];
}
