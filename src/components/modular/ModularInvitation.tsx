"use client";

import { type ReactNode, Suspense, useState } from "react";
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
  /** The host's controls, in flow above the page. */
  hostBar?: ReactNode;
  /** The host's edit panel. Drawn in here: it reads the palette vars on the root. */
  host?: ReactNode;
  /** Whether the edit panel is open — above the breakpoint the page makes room for it. */
  panelOpen?: boolean;
  onRsvp?: (payload: RsvpPayload) => void;
}

/**
 * A modular invitation: a sticky bar, the sections stacked full width, each
 * at its own anchor, and the privacy footer. Laid out responsively, not
 * scaled like the simple card.
 */
export function ModularInvitation({
  design,
  basics,
  language,
  hostBar,
  host,
  panelOpen,
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
      className={`invite relative flex h-dvh flex-col overflow-hidden bg-[var(--m1)] font-[family-name:var(--font-primary)] text-[color:var(--m8)] ${fontClasses(design.fontPair)}`}
    >
      {/*
       * The host bar and the page share one column. With the panel open
       * above the breakpoint, the column gives up the panel's width, so the
       * panel opens beside the bar and the page rather than over them —
       * same duration and easing as the panel. While the drawer covers the
       * screen, everything under it is out of the tab order.
       */}
      <div
        data-panel={panelOpen ? "true" : undefined}
        inert={menuOpen}
        className="flex min-h-0 flex-1 flex-col transition-[margin] duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] invite:data-[panel=true]:mr-invite-panel"
      >
        {hostBar}

        {/* The page scrolls in here, not the window, so the host bar stays put. */}
        <div className="min-h-0 flex-1 overflow-y-auto scroll-smooth">
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

      {host}
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
