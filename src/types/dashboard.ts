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

/**
 * Key into the `Tiers` message namespace, which holds each tier's name, blurb
 * and — for the tiers a host can raise to — its upsell.
 */
export type TierKey = "free" | "standard" | "custom";

export interface Tier {
  key: TierKey;
  /** In RON; 0 is the free tier. */
  price: number;
  seating: boolean;
}

/** Occasion drives which templates are offered first. */
export type EventKind =
  | "wedding"
  | "engagement"
  | "bachelorParty"
  | "christening"
  | "birthday"
  | "kidsParty"
  | "dinnerParty"
  | "reunion"
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

/**
 * A sentence Festio writes from an event's own numbers: the catalog key and
 * the values it is filled with. The wording lives in the catalogs, so it is
 * written in whichever language reads it.
 */
export interface Message {
  key: string;
  values?: Record<string, string | number>;
}

/**
 * A stretch of time as a number and a unit, so it can be written out in the
 * reader's language. Negative is in the past.
 */
export interface TimeSpan {
  value: number;
  unit: "minute" | "hour" | "day" | "week";
}

/** Keys into the `EventNotes` message namespace. */
export interface EventNote extends Message {
  tone: "warning" | "neutral";
  actionKey?: string;
}

export interface DashboardEvent {
  id: string;
  title: string;
  kind: EventKind;
  /** ISO `YYYY-MM-DD`; the editor computes every deadline from it. */
  date: string;
  /** 24h `HH:MM` start time. */
  time: string;
  /** How far the event is from today; the list does no date maths of its own. */
  countdown: TimeSpan;
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
  /** Replaces the copy row when there is nothing to share yet. A key into `EventNotes`. */
  linkNoteKey?: string;
  rsvp: RsvpTally;
  safeguard: AttendeeSafeguard;
  /** Replies that matched no name on the pre-loaded list. */
  unmatched: number;
  preloaded: boolean;
  preloadedCount: number;
  note?: EventNote;
  /**
   * Who is coming, beyond the head count — age groups, dietary needs and the
   * like, as keys into `EventNotes`. Empty or absent means nothing worth
   * calling out, not that nobody was asked.
   */
  attendeeNotes?: Message[];
  preview: StaticImageData;
  status: EventStatus;
  seatingAvailable: boolean;
  /** True once the content freeze has passed; nothing is editable after it. */
  locked: boolean;
  /** How long until the freeze, while it is still ahead. */
  locksIn?: TimeSpan;
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

/**
 * A notice's title, body, action and optional context are keys under
 * `Notices.<key>`, all filled from the same values.
 */
export interface AttentionNotice extends Message {
  id: string;
  /** Filled in as `{time}`, written out in the reader's language. */
  span?: TimeSpan;
  /** Filled in as `{tier}`, the tier's own name in the reader's language. */
  tier?: TierId;
  tone: NoticeTone;
}

export interface RsvpActivity {
  id: string;
  initials: string;
  /** Who acted. Absent means the host, who is addressed as "you". */
  actor?: string;
  /**
   * What happened, a key into `Activity`. The sentence names the actor
   * itself — where the name sits is the language's business.
   */
  action: Message;
  tag?: "UNKNOWN";
  /** The event's short name, as the host would say it. */
  event: string;
  /** Anything worth knowing about the reply, as keys into `Activity`. */
  details?: Message[];
  /** When it happened, counted back from now. */
  when: TimeSpan;
}

export interface FooterColumn {
  /** Keys in the `Footer` namespace — the heading, then each link under it. */
  labelKey: string;
  linkKeys: string[];
}
