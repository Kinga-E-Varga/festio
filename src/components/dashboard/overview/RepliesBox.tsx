import { useLocale, useTranslations } from "next-intl";
import { BoxHead } from "@/components/dashboard/BoxHead";
import { RepliesList } from "@/components/dashboard/RepliesList";
import { RepliesSummary } from "@/components/dashboard/RepliesSummary";
import {
  AGE_SUMMARY_KEY,
  AGES,
  DIET_KEY,
} from "@/components/dashboard/guest-list/labels";
import { LINK_TEXT, PAGE_BOX } from "@/components/dashboard/styles";
import { Link } from "@/i18n/navigation";
import {
  eventPath,
  formatEventDate,
  repliesPaused,
  replyClose,
  replyWindow,
} from "@/lib/event";
import { answeredCustom, buildRows, tallyGuests } from "@/lib/guests";
import type { Language } from "@/lib/language";
import { shortTitle } from "@/mock/dashboard";
import { findGuests } from "@/mock/guests";
import type { DashboardEvent } from "@/types/dashboard";
import type { DietNeed } from "@/types/guests";

/** The latest replies shown here; the side panel and the guest list hold the rest. */
const LATEST = 5;

/**
 * How the replies stand, then who is coming, by age and diet, in a line
 * each, how many answered the host's own questions, and whether the form
 * still takes replies, then this event's latest replies under them; the
 * guest page's Summary and its list one link away.
 */
export function RepliesBox({ event }: { event: DashboardEvent }) {
  const t = useTranslations("Event");
  const tGuests = useTranslations("GuestList");
  const tTop = useTranslations("TopBar");
  const locale = useLocale() as Language;
  const guests = findGuests(event.id);
  const rows = buildRows(guests, event.preloaded);
  const tally = tallyGuests(rows, guests.questions);
  /* Each age group and need with anyone in it; a line left out with none. */
  const facts = [
    {
      key: "age",
      label: tGuests("ageLabel"),
      parts: AGES.map((age) => ({
        key: age,
        label: tGuests(AGE_SUMMARY_KEY[age]),
        count: tally.ages[age],
      })),
    },
    {
      key: "diet",
      label: tGuests("dietLabel"),
      parts: (Object.keys(DIET_KEY) as DietNeed[]).map((need) => ({
        key: need,
        label: tGuests(DIET_KEY[need]),
        count: tally.diets[need],
      })),
    },
  ]
    .map((fact) => ({
      ...fact,
      parts: fact.parts.filter((part) => part.count > 0),
    }))
    .filter((fact) => fact.parts.length > 0);
  const closes = formatEventDate(replyClose(event), locale);
  const form = repliesPaused(event)
    ? t("formPaused")
    : replyWindow(event) === "closed"
      ? t("formClosed", { date: closes })
      : t("formOpen", { date: closes });

  return (
    <section className={PAGE_BOX}>
      <BoxHead title={tGuests("summaryReplies")} />
      {/* The numbers, then the latest replies under them, past a rule. */}
      <RepliesSummary event={event} className="mt-5" />

      <div className="mt-5 flex flex-col gap-1.5 border-t border-neutral-200 pt-4 meta-text leading-[1.5]">
        {facts.length > 0 ? (
          <dl className="flex flex-col gap-1.5">
            {facts.map((fact) => (
              <div key={fact.key} className="flex flex-wrap gap-x-2">
                <dt className="strong-text">{fact.label}</dt>
                <dd>
                  {fact.parts.map((part, index) => (
                    <span key={part.key}>
                      {index > 0 ? " · " : null}
                      {part.label}{" "}
                      <b className="strong-text tabular-nums">{part.count}</b>
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="muted-text">{tGuests("summaryEmpty")}</p>
        )}
        {guests.questions.length > 0 ? (
          <p>{t("customAnswered", { count: answeredCustom(rows) })}</p>
        ) : null}
        <p>{form}</p>
      </div>
      <Link
        href={`${eventPath(event.id, "guests")}?view=summary`}
        className={`mt-4 inline-block ${LINK_TEXT}`}
      >
        {t("fullSummary")}
      </Link>

      <div className="mt-5 border-t border-neutral-200 pt-4">
        {/* Named for screen readers; each row says what it is. */}
        <h3 className="sr-only">{tTop("replies")}</h3>
        <RepliesList event={shortTitle(event)} limit={LATEST} />
      </div>

      <Link
        href={eventPath(event.id, "guests")}
        className={`mt-4 inline-block ${LINK_TEXT}`}
      >
        {t("seeGuestList")}
      </Link>
    </section>
  );
}
