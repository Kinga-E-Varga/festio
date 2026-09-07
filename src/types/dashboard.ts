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
  /** Pre-formatted for display; no date maths in this layout-only pass. */
  dateLabel: string;
  countdownLabel: string;
  isNextUp?: boolean;
  visibility: Visibility;
  /** Host-facing tier name shown on the card. */
  tierLabel: string;
  /** Set while the 24h content freeze is in sight. */
  editLockLabel?: string;
  link: string;
  /** Set only on Protected invitations; min 4 chars, letters or digits. */
  password?: string;
  /** Replaces the copy row when there is nothing to share yet. */
  linkNote?: string;
  rsvp: RsvpTally;
  safeguard: AttendeeSafeguard;
  note?: EventNote;
  preview: StaticImageData;
  previewAlt: string;
  status: EventStatus;
  seatingAvailable: boolean;
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
