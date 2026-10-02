"use client";

import { Suspense, useState } from "react";
import { formatDeadline, replyClose } from "@/lib/event";
import { localized, type Language } from "@/lib/language";
import { hostInitials, hostNames, sectionValues } from "@/modular/content";
import { fontClasses, modularVars } from "@/modular/vars";
import type { RsvpPayload } from "@/types/invitation";
import type { InvitationBasics, ModularDesign } from "@/types/modular";
import { ModularFooter } from "./ModularFooter";
import { ModularTopBar, type MenuLink } from "./ModularTopBar";
import { SectionsDrawer } from "./SectionsDrawer";
import { SectionView } from "./SectionView";

interface ModularInvitationProps {
  design: ModularDesign;
  basics: InvitationBasics;
  language: Language;
  onRsvp?: (payload: RsvpPayload) => void;
}

/**
 * A modular invitation: a sticky bar, the sections stacked full width, each
 * at its own anchor, and the privacy footer. Laid out responsively, not
 * scaled like the simple card. Fills its parent: the screen on the guest
 * page, the framed box in the editor.
 */
export function ModularInvitation({
  design,
  basics,
  language,
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
  const closes = formatDeadline(replyClose({ date: basics.date }), language);

  return (
    <div
      style={modularVars(design.palette, design.fontPair)}
      className={`invite relative flex h-full flex-col overflow-hidden bg-[var(--m1)] font-[family-name:var(--font-primary)] text-[color:var(--m8)] ${fontClasses(design.fontPair)}`}
    >
      {/* While the drawer covers the page, everything under it is out of the tab order. */}
      <div inert={menuOpen} className="flex min-h-0 flex-1 flex-col">
        {/* The page scrolls in here, not the window, so the top bar stays put. */}
        <div className="invite-scroll min-h-0 flex-1 overflow-y-auto scroll-smooth">
          <div className="@container">
            <ModularTopBar
              initials={hostInitials(basics)}
              links={links}
              closes={closes}
              menuOpen={menuOpen}
              onOpenMenu={() => setMenuOpen(true)}
            />
            {design.sections.map(({ definition, variant }) => (
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

/** Stands in while a variant's file loads. */
function SectionSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="h-[480px] animate-pulse bg-[var(--m3)]"
    />
  );
}
