"use client";

import { Suspense, useState } from "react";
import { localized, type Language } from "@/lib/language";
import { hostNames, sectionValues } from "@/modular/content";
import { TOP_BAR_ID } from "@/modular/nav";
import { groundClasses } from "@/modular/styles";
import { fontClasses, modularVars } from "@/modular/vars";
import type { RsvpPayload } from "@/types/invitation";
import type {
  InvitationBasics,
  MenuLink,
  ModularDesign,
} from "@/types/modular";
import { ModularFooter } from "./ModularFooter";
import { SectionsDrawer } from "./SectionsDrawer";
import { SectionView } from "./SectionView";

interface ModularInvitationProps {
  design: ModularDesign;
  basics: InvitationBasics;
  language: Language;
  /**
   * In the editor: the invitation is the 1280px column itself, shadowed on
   * the editor's ground, so its scrollbar sits at the column's edge.
   */
  framed?: boolean;
  onRsvp?: (payload: RsvpPayload) => void;
}

/**
 * A modular invitation: a sticky bar, the sections stacked full width (up
 * to 1280px), each at its own anchor, and the privacy footer. Laid out
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
  const links: MenuLink[] = design.sections.flatMap(({ definition }) =>
    definition.menuLabel
      ? [
          {
            id: definition.id,
            label: localized(definition.menuLabel, language),
          },
        ]
      : [],
  );
  /*
   * The top bar is a section, but drawn straight in the column rather than
   * in a `<section>` of its own: sticky only holds inside its parent.
   */
  const bar = design.sections.find(
    ({ definition }) => definition.id === TOP_BAR_ID,
  );
  const body = design.sections.filter((choice) => choice !== bar);

  return (
    <div
      style={modularVars(design.palette, design.fontPair)}
      className={`invite relative flex h-full flex-col overflow-clip bg-[var(--m1)] ${framed ? "elevation-band mx-auto max-w-[1280px]" : ""} font-[family-name:var(--font-primary)] text-[color:var(--m8)] ${fontClasses(design.fontPair)}`}
    >
      {/* While the drawer covers the page, everything under it is out of the tab order. */}
      <div inert={menuOpen} className="flex min-h-0 flex-1 flex-col">
        {/* The page scrolls in here, not the window, so the top bar stays put. */}
        <div
          className={`invite-scroll min-h-0 flex-1 overflow-y-auto scroll-smooth ${framed ? "" : groundClasses(design.pattern)}`}
        >
          {/*
           * Past 1280px the page stops growing: bar, sections and footer sit
           * in a centred column, softly shadowed on a plain, darker ground.
           * The column is the container the sections size themselves by.
           */}
          <div
            className={`@container mx-auto max-w-[1280px] bg-[var(--m1)] ${framed ? "" : "elevation-band"}`}
          >
            {bar ? (
              <Suspense fallback={<BarSkeleton />}>
                <SectionView
                  section={bar.definition.id}
                  variant={bar.variant}
                  values={sectionValues(bar.definition, language)}
                  basics={basics}
                  language={language}
                  nav={{
                    links,
                    menuOpen,
                    onOpenMenu: () => setMenuOpen(true),
                  }}
                />
              </Suspense>
            ) : null}
            {body.map(({ definition, variant }) => (
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
                    basics={basics}
                    language={language}
                    onRsvp={onRsvp}
                  />
                </Suspense>
              </section>
            ))}
            <ModularFooter hosts={hostNames(basics)} />
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
      className="h-14 border-b-1 border-[var(--m5)] bg-[var(--m1)] @5xl:h-16"
    />
  );
}

/** Stands in while a variant's file loads. */
function SectionSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="h-[480px] animate-pulse bg-[var(--m3)]"
    />
  );
}
