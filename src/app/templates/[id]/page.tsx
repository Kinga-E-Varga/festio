import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HostInvitationEditor } from "@/components/invitation/HostInvitationEditor";
import { fallbackValues } from "@/lib/invitation";
import { loadTemplate } from "@/templates";

type Props = PageProps<"/templates/[id]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const loaded = await loadTemplate(id);
  return {
    title: loaded ? `${loaded.template.name} · Templates · Festio` : "Templates · Festio",
    robots: { index: false, follow: false },
  };
}

/**
 * A template on its own, before any host has picked it or an event exists —
 * the same editor a host gets on a real event, just seeded from the
 * template's own fallback copy instead of `seedValues(template, event)`.
 */
export default async function TemplatePreviewPage({ params }: Props) {
  const { id } = await params;

  const loaded = await loadTemplate(id);
  if (!loaded) notFound();

  const { template } = loaded;

  return (
    <HostInvitationEditor template={template} initial={fallbackValues(template)} />
  );
}
