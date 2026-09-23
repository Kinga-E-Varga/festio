import type { StaticImageData } from "next/image";
import type { Language } from "@/lib/language";

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
  | "download"
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

/**
 * The nav is Festio's own structure, so what each entry is *called* lives in
 * the message catalogs and only the key travels with the data. Same for the
 * footer below.
 */
export interface NavItem {
  /** A key in the `Nav` namespace. */
  labelKey: string;
  href: string;
  icon: IconName;
  /** Small count shown right-aligned, e.g. how many invitations are live. */
  badge?: string;
}

export interface NavSection {
  /** A key in the `Nav` namespace. */
  labelKey: string;
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

/** Host-set cap on replies — a technical safeguard, not a guest limit. */
export interface AttendeeSafeguard {
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
  /** Which template file draws this invitation; see `src/templates/`. */
  templateId?: string;
  /**
   * The language the invitation itself is written in — RSVP labels, Festio's
   * own section copy, the dates guests read. Never the host's app locale: a
   * host reading Festio in Hungarian may send a Romanian invitation.
   *
   * Absent means English. Invitations made before this field existed carry
   * nothing, and read as English without anyone touching them.
   */
  language?: Language;
  paid: boolean;
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
  /**
   * Who is coming, beyond the head count — age groups, dietary needs and the
   * like, already phrased for display. Empty or absent means nothing worth
   * calling out, not that nobody was asked.
   */
  attendeeNotes?: string[];
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
  /** A key in the `Stats` namespace. */
  labelKey: string;
  value: string;
  /**
   * A key in the `Stats` namespace for the quieter text trailing the value,
   * e.g. "of 4" or "days away". It follows the value rather than wrapping it,
   * so every language has to phrase it as a suffix.
   */
  detailKey?: string;
  /** Filled into `detailKey` when it names a count. */
  detailValue?: number;
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
  /** Keys in the `Footer` namespace — the heading, then each link under it. */
  labelKey: string;
  linkKeys: string[];
}
