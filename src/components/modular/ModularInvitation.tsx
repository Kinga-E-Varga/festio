"use client";

import { memo, Suspense, useState } from "react";
import { Icon } from "@/components/icons";
import { localized, type Language, type LocalizedText } from "@/lib/language";
import { cornerVars } from "@/modular/corners";
import { hasContent } from "@/modular/fields";
import { sectionGrounds } from "@/modular/ground";
import { HEADER_ID } from "@/modular/nav";
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
  /** The editor in Edit mode: a section's Design and Content buttons. */
  edit?: SectionEdit;
}

/** The two ways into a section from the preview, each with its name. */
interface SectionEdit {
  design: { label: string; onEdit: (id: string) => void };
  content: { label: string; onEdit: (id: string) => void };
}

/** The values of the sections `definition` reads — on the page or not. */
function relatedValues(
  definition: SectionDefinition,
  design: ModularDesign,
): Partial<Record<string, SectionValues>> {
  return Object.fromEntries(
    (definition.reads ?? []).map((id) => [id, design.values[id] ?? {}]),
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
export const ModularInvitation = memo(function ModularInvitation({
  design,
  basics,
  language,
  framed = false,
  onRsvp,
  edit,
}: ModularInvitationProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = menuLinks(design.sections, language);
  /*
   * The header is a section, but drawn straight in the column rather than
   * in a `<section>` of its own: sticky only holds inside its parent.
   */
  const bar = design.sections.find(
    ({ definition }) => definition.id === HEADER_ID,
  );
  const body = design.sections.filter((choice) => choice !== bar);
  const grounds = sectionGrounds(body);

  return (
    <div
      style={{
        ...modularVars(design.palette, design.fontPair),
        ...cornerVars(design.corners),
      }}
      className={`invite relative flex h-full flex-col overflow-clip bg-[var(--m-surface)] ${framed ? "elevation-band mx-auto max-w-(--invite-column)" : ""} font-[family-name:var(--font-primary)] text-[color:var(--m-ink)] ${fontClasses(design.fontPair)}`}
    >
      {/* While the drawer covers the page, everything under it is out of the tab order. */}
      <div inert={menuOpen} className="flex min-h-0 flex-1 flex-col">
        {/* The page scrolls in here, not the window, so the header stays put. */}
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
                  section={bar.definition}
                  variant={bar.variant}
                  values={design.values[bar.definition.id] ?? {}}
                  related={relatedValues(bar.definition, design)}
                  basics={basics}
                  language={language}
                  ground="surface"
                  nav={{
                    links,
                    menuOpen,
                    onOpenMenu: () => setMenuOpen(true),
                    edit: edit ? (
                      <EditButtons
                        edit={edit}
                        id={bar.definition.id}
                        content={hasContent(bar.definition)}
                      />
                    ) : undefined,
                  }}
                />
              </Suspense>
            ) : null}
            {body.map(({ definition, variant }, index) => (
              <section
                key={definition.id}
                id={definition.id}
                className="group/edit relative scroll-mt-14 @5xl:scroll-mt-16"
              >
                {edit ? (
                  <EditButtons
                    edit={edit}
                    id={definition.id}
                    content={hasContent(definition)}
                  />
                ) : null}
                <Suspense fallback={<SectionSkeleton />}>
                  <SectionView
                    section={definition}
                    variant={variant}
                    values={design.values[definition.id] ?? {}}
                    related={relatedValues(definition, design)}
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
});

/**
 * The editor's two buttons on a section, top right: its Design (a brush)
 * and its Content (a T), each in the invitation's ink with a shadow all
 * round, its name as label and tooltip; hovered, the fill a little
 * see-through, the icon still solid. Only they open anything; the section itself stays the page.
 * They show on a hovered section, or one the keyboard reaches them in; hidden,
 * they are see-through and let clicks pass. Tailwind's hover only applies
 * where the device can hover, so a touch screen never shows them. Under the
 * sticky header, never over it; the header's own sit inside it, over Reply.
 */
function EditButtons({
  edit,
  id,
  content,
}: {
  edit: SectionEdit;
  id: string;
  /** Left out for a section with nothing to edit, like the footer. */
  content: boolean;
}) {
  return (
    <div className="pointer-events-none absolute top-3 right-3 z-10 flex gap-2">
      <EditButton
        label={edit.design.label}
        icon="brush"
        onClick={() => edit.design.onEdit(id)}
      />
      {content ? (
        <EditButton
          label={edit.content.label}
          icon="fonts"
          onClick={() => edit.content.onEdit(id)}
        />
      ) : null}
    </div>
  );
}

function EditButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: "brush" | "fonts";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="pointer-events-none grid cursor-pointer place-items-center rounded-md bg-[var(--m-ink)] p-2.5 text-[color:var(--m-surface)] opacity-0 shadow-[0_1px_5px_rgb(0_0_0/0.3)] transition-[opacity,background-color] hover:bg-[var(--m-ink)]/80 group-hover/edit:pointer-events-auto group-hover/edit:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mustard-500"
    >
      <Icon name={icon} className="size-5" strokeWidth={1.8} />
    </button>
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
