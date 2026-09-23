import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { HostInvitationEditor } from "@/components/invitation/HostInvitationEditor";
import { fallbackValues } from "@/lib/invitation";
import { loadTemplate } from "@/templates";

type Props = PageProps<"/[locale]/templates/[id]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const loaded = await loadTemplate(id);
  const t = await getTranslations("Meta");
  return {
    title: loaded
      ? t("template", { name: loaded.template.name })
      : t("templateFallback"),
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

  /*
   * There is no invitation here to hold a language of its own, so the
   * preview speaks the host's — the only person who ever sees this page.
   * The route's own locale is already one of `LANGUAGES`; `[locale]` is
   * matched against that same list before anything renders.
   */
  const language = await getLocale();

  return (
    <HostInvitationEditor
      template={template}
      initial={fallbackValues(template, language)}
      language={language}
    />
  );
}
