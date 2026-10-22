import type { StaticImageData } from "next/image";
import type { Language } from "@/lib/language";

export type IconName =
  | "home"
  | "envelope"
  | "guests"
  | "seating"
  | "templates"
  | "palette"
  | "brush"
  | "fonts"
  | "pattern"
  | "corners"
  | "printer"
  | "billing"
  | "shield"
  | "settings"
  | "cart"
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
  | "quit"
  | "logout"
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
  | "more"
  | "close"
  | "note"
  | "chevron";

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
}

/**
 * What an event was bought as. Per event, and it only ever goes up:
 * free → standard → custom (project spec). Also the key into the `Packages`
 * message namespace, which holds each package's name.
 */
export type PackageId = "free" | "standard" | "custom";

export interface Package {
  /** In RON; 0 is the free package. */
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

/** What Home's events box needs of an event: small enough to hand to the client. */
export interface HomeEventRow extends Pick<
  DashboardEvent,
  "id" | "title" | "date" | "countdown" | "rsvp" | "expectedGuests"
> {
  status: EventStatus;
  /** Past and its data deleted: nothing left to open. */
  archived: boolean;
}

/** What the nav needs of an event: small enough to hand to the client. */
export interface PickerEvent {
  id: string;
  title: string;
  date: string;
  countdown: TimeSpan;
  status: EventStatus;
  /** Past and its data deleted: nothing left to open. */
  archived: boolean;
  /** A template draws its invitation, so there is something to edit, print and show. */
  hasDesign: boolean;
  seatingAvailable: boolean;
  slug: string;
}

export interface RsvpTally {
  replied: number;
  invited: number;
  attending: number;
  declined: number;
  pending: number;
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
  package: PackageId;
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
  /** The whole guest link path; unique across Festio. */
  slug: string;
  /** Set only on Protected invitations; min 4 chars, letters or digits. */
  password?: string;
  rsvp: RsvpTally;
  /**
   * How many people the host expects. Replies are shown against it, and the
   * hidden reply cap is worked out from it (`replyCap` in `lib/event.ts`).
   */
  expectedGuests: number;
  /** Replies to sort out: names not on the pre-loaded list, or used by more than one reply. */
  needsAttention: number;
  preloaded: boolean;
  preloadedCount: number;
  preview: StaticImageData;
  seatingAvailable: boolean;
  /**
   * The host's own reply-form closing time, `YYYY-MM-DDTHH:MM`. Absent means
   * the default: the day before the event at 00:00.
   */
  repliesCloseAt?: string;
  /** How long until the reply form closes; negative once it has. */
  repliesCloseIn?: TimeSpan;
  /** True once the retention window has run out and the guest data is gone. */
  dataDeleted: boolean;
  /** Cancelled by the host: the reply form is closed and the invitation shows their message instead. */
  cancelled?: boolean;
}

export type NoticeTone =
  "attention" | "deadline" | "paused" | "billing" | "hidden" | "deletion";

/**
 * A notice's title and body are the event editor's banner texts,
 * `EventPage.<key>Title` and `<key>Body`; its context and action are under
 * `Notices.<key>`. All are filled from the same values.
 */
export interface AttentionNotice extends Message {
  id: string;
  /** The event it is about; its card lists it as a to-do. */
  eventId: string;
  /** Filled in as `{time}`, written out in the reader's language. */
  span?: TimeSpan;
  /** An event's ISO date; its editing cut-off is filled in as `{date}`. */
  eventDate?: string;
  /** A custom reply-form close; when set, `{date}` is this instead. */
  closesAt?: string;
  /** Filled in as `{package}`, the package's own name in the reader's language. */
  package?: PackageId;
  tone: NoticeTone;
  /** Set once replies pause at the cap: where the host reports a flood. */
  reportHref?: string;
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
