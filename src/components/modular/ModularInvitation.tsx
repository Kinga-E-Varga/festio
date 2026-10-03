"use client";

import { Suspense, useState } from "react";
import { localized, type Language, type LocalizedText } from "@/lib/language";
import { sectionValues } from "@/modular/content";
import { sectionGrounds } from "@/modular/ground";
import { TOP_BAR_ID } from "@/modular/nav";
import { groundClasses } from "@/modular/styles";
import { fontClasses, modularVars } from "@/modular/vars";
import type { RsvpPayload } from "@/types/invitation";
import type {
  InvitationBasics,
  MenuLink,
  ModularDesign,
  SectionDefinition,
  SectionValues,
} from "@/types/modular";
import { SectionsDrawer } from "./SectionsDrawer";
import { SectionView } from "./SectionView";

interface ModularInvitationProps {
  design: ModularDesign;
  basics: InvitationBasics;
  language: Language;
  /**
   * In the editor: the invitation is the column itself, shadowed on
   * the editor's ground, so its scrollbar sits at the column's edge.
   */
  framed?: boolean;
  onRsvp?: (payload: RsvpPayload) => void;
}

/** The values of the sections `definition` reads, in the invitation's language. */
function relatedValues(
  definition: SectionDefinition,
  design: ModularDesign,
  language: Language,
): Partial<Record<string, SectionValues>> {
  return Object.fromEntries(
    (definition.reads ?? []).map((id) => [
      id,
      sectionValues(design.related[id], language),
    ]),
  );
}

/**
 * The menu, in page order: one link per label, to the first section that
 * has it — a label shared by several sections is listed once.
 */
function menuLinks(
  sections: ModularDesign["sections"],
  language: Language,
): MenuLink[] {
  const listed = new Set<LocalizedText>();
  const links: MenuLink[] = [];
  for (const { definition } of sections) {
    const label = definition.menuLabel;
    if (!label || listed.has(label)) continue;
    listed.add(label);
    links.push({ id: definition.id, label: localized(label, language) });
  }
  return links;
}

/**
 * A modular invitation: a sticky bar, the sections stacked full width (up
 * to `INVITE_COLUMN`), each at its own anchor, and the privacy footer. Laid out
 * responsively, not scaled like the simple card. Fills its parent: the
 * screen on the guest page, the padded ground in the editor.
 *
 * Its root is `overflow-clip`, never `hidden`: a hidden box can still be
 * scrolled by an anchor jump (#rsvp), which shifted the whole editor up
 * with no scrollbar to bring it back.
 */
export function ModularInvitation({
  design,
  basics,
  language,
  framed = false,
  onRsvp,
}: ModularInvitationProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = menuLinks(design.sections, language);
  /*
   * The top bar is a section, but drawn straight in the column rather than
   * in a `<section>` of its own: sticky only holds inside its parent.
   */
  const bar = design.sections.find(
    ({ definition }) => definition.id === TOP_BAR_ID,
  );
  const body = design.sections.filter((choice) => choice !== bar);
  const grounds = sectionGrounds(body.map(({ definition }) => definition));

  return (
    <div
      style={modularVars(design.palette, design.fontPair)}
      className={`invite relative flex h-full flex-col overflow-clip bg-[var(--m-surface)] ${framed ? "elevation-band mx-auto max-w-(--invite-column)" : ""} font-[family-name:var(--font-primary)] text-[color:var(--m-ink)] ${fontClasses(design.fontPair)}`}
    >
      {/* While the drawer covers the page, everything under it is out of the tab order. */}
      <div inert={menuOpen} className="flex min-h-0 flex-1 flex-col">
        {/* The page scrolls in here, not the window, so the top bar stays put. */}
        <div
          className={`invite-scroll min-h-0 flex-1 overflow-y-auto scroll-smooth ${framed ? "" : groundClasses(design.pattern)}`}
        >
          {/*
           * Past `INVITE_COLUMN` the page stops growing: bar, sections and footer sit
           * in a centred column, softly shadowed on a plain, darker ground.
           * The column is the container the sections size themselves by.
           */}
          <div
            className={`@container mx-auto max-w-(--invite-column) bg-[var(--m-surface)] ${framed ? "" : "elevation-band"}`}
          >
            {bar ? (
              <Suspense fallback={<BarSkeleton />}>
                <SectionView
                  section={bar.definition.id}
                  variant={bar.variant}
                  values={sectionValues(bar.definition, language)}
                  related={relatedValues(bar.definition, design, language)}
                  basics={basics}
                  language={language}
                  ground="surface"
                  nav={{
                    links,
                    menuOpen,
                    onOpenMenu: () => setMenuOpen(true),
                  }}
                />
              </Suspense>
            ) : null}
            {body.map(({ definition, variant }, index) => (
              <section
                key={definition.id}
                id={definition.id}
                className="scroll-mt-14 @5xl:scroll-mt-16"
              >
                <Suspense fallback={<SectionSkeleton />}>
                  <SectionView
                    section={definition.id}
                    variant={variant}
                    values={sectionValues(definition, language)}
                    related={relatedValues(definition, design, language)}
                    basics={basics}
                    language={language}
                    ground={grounds[index]}
                    onRsvp={onRsvp}
                  />
                </Suspense>
              </section>
            ))}
          </div>
        </div>
      </div>

      <SectionsDrawer
        open={menuOpen}
        links={links}
        onClose={() => setMenuOpen(false)}
      />
    </div>
  );
}

/** Stands in while the bar's variant loads, at the bar's own height. */
function BarSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="h-14 border-b-1 border-[var(--m-line)] bg-[var(--m-surface)] @5xl:h-16"
    />
  );
}

/** Stands in while a variant's file loads. */
function SectionSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="h-[480px] animate-pulse bg-[var(--m-surface-alt)]"
    />
  );
}
