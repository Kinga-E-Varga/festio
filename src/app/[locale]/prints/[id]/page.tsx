import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { PrintEditor } from "@/components/print/PrintEditor";
import { eventPath, invitationLink } from "@/lib/event";
import { invitationValues } from "@/lib/invitation";
import { eventMetadata, openEvent } from "@/db/reads/access";
import { loadInvitation } from "@/db/reads/invitation";
import { loadSimpleTemplate } from "@/templates";

type Props = PageProps<"/[locale]/prints/[id]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    ...(await eventMetadata((await params).id, "print")),
    robots: { index: false, follow: false },
  };
}

/**
 * The printable of one event, on a page of its own — the same shape as the
 * invitation editor, and reached the same way: from the event's card.
 *
 * An event with no design has no printable either, which is the same guard
 * the editor keeps and the same one the card's Print link is gated on.
 */
export default async function PrintPage({ params }: Props) {
  const { id } = await params;

  /* Unknown is not found; archived goes Home, like every event page. */
  const event = await openEvent(id);
  if (!event.templateId) notFound();

  const [loaded, stored] = await Promise.all([
    loadSimpleTemplate(event.templateId),
    loadInvitation(event),
  ]);
  if (!loaded) notFound();

  const { template } = loaded;
  const values = invitationValues(template, event, stored);

  /*
   * The page around the paper is host chrome and stays in the host's locale.
   * What goes *on* the paper does not: a printable always speaks the
   * invitation's own language, so Festio's line on it is fetched in that
   * language rather than read from this route's.
   */
  const t = await getTranslations({
    locale: event.language,
    namespace: "Print",
  });

  return (
    <PrintEditor
      template={template}
      rsvpMessage={values.rsvpMessage ?? ""}
      link={invitationLink(event)}
      passwordLine={
        event.visibility === "protected" && event.password
          ? t("password", { password: event.password })
          : undefined
      }
      defaultNote={t("defaultNote")}
      backTo={eventPath(event.id)}
    />
  );
}
