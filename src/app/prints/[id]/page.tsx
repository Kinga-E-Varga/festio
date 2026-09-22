import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrintEditor } from "@/components/print/PrintEditor";
import { invitationLink } from "@/lib/event";
import { seedValues } from "@/lib/invitation";
import { findEvent } from "@/mock/dashboard";
import { loadTemplate } from "@/templates";

type Props = PageProps<"/prints/[id]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = findEvent(id);
  return {
    title: event ? `${event.title} · Print · Festio` : "Print · Festio",
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

  const event = findEvent(id);
  if (!event?.templateId) notFound();

  const loaded = await loadTemplate(event.templateId);
  if (!loaded) notFound();

  const { template } = loaded;
  const values = seedValues(template, event);

  return (
    <PrintEditor
      template={template}
      rsvpMessage={values.rsvpMessage ?? ""}
      link={invitationLink(event)}
    />
  );
}
