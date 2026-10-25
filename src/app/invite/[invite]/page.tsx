import { cache } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { MissingPage } from "@/components/MissingPage";
import { CancelledNotice } from "@/components/invitation/CancelledNotice";
import { Invitation } from "@/components/invitation/Invitation";
import { InviteNotice } from "@/components/invitation/InviteNotice";
import { PasswordGate } from "@/components/invitation/PasswordGate";
import { sendReply } from "@/actions/guest";
import { repliesPaused, replyWindow } from "@/lib/event";
import { cardValues, invitationValues } from "@/lib/invitation";
import { linkGone, loadEventBySlug } from "@/db/reads/events";
import { loadShownInvitation } from "@/db/reads/invitation";
import { isUnlocked } from "@/db/reads/unlock";
import { loadSimpleTemplate } from "@/templates";
import type { DashboardEvent } from "@/types/dashboard";

type Props = PageProps<"/invite/[invite]">;

/** The event a guest may see at this link: none for an unknown or Hidden one. */
async function guestEvent(invite: string): Promise<DashboardEvent | null> {
  const event = await loadEventBySlug(invite);
  return event && event.visibility !== "hidden" ? event : null;
}

/** Whether this browser may see the event's own words: Public, or Protected with the password typed. Once per request. */
const mayRead = cache(async (event: DashboardEvent): Promise<boolean> => {
  return event.visibility !== "protected" || isUnlocked(event);
});

/**
 * An invitation is reachable only by its link and must never be indexed.
 * Link previews always say "You're invited", in the invitation's language,
 * so a forwarded Protected link gives nothing away; so does its tab, until
 * the password is typed.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const robots = { index: false, follow: false };
  const event = await guestEvent((await params).invite);
  if (!event) return { robots };
  const t = await getTranslations({
    locale: event.language,
    namespace: "Meta",
  });
  const invited = t("invited");
  return {
    robots,
    title: (await mayRead(event)) ? event.title : invited,
    openGraph: { title: invited },
  };
}

export default async function InvitationPage({ params }: Props) {
  const { invite } = await params;

  const event = await guestEvent(invite);
  /* Its link's card is already read, so this costs a read only for a blocked link. */
  if (!event && (await linkGone(invite))) return <MissingPage kind="gone" />;
  if (!event?.templateId) notFound();
  /* The password check is the cookie alone; the invitation's own card is read only once it is shown. */
  const [loaded, readable] = await Promise.all([
    loadSimpleTemplate(event.templateId),
    mayRead(event),
  ]);
  if (!loaded) notFound();
  const { template, Card } = loaded;

  /* Protected first, even once cancelled: the host's message is for the guests who hold the card. */
  if (!readable) {
    return (
      <InviteNotice template={template}>
        <PasswordGate slug={invite} />
      </InviteNotice>
    );
  }
  if (event.cancelled) {
    return (
      <CancelledNotice template={template} message={event.cancelMessage} />
    );
  }

  const stored = await loadShownInvitation(event);
  const values = invitationValues(template, event, stored);
  /* The date a guest reads is written in the invitation's own language. */
  const { language } = event;

  return (
    <Invitation
      template={template}
      values={values}
      repliesPaused={repliesPaused(event) || replyWindow(event) === "closed"}
      onSubmit={sendReply.bind(null, invite)}
      /* The host's saved switch, on for a card never saved. */
      envelope={stored?.kind === "simple" ? stored.envelope : true}
    >
      <Card values={cardValues(values, language)} />
    </Invitation>
  );
}
