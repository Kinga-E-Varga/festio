"use client";

import {
  type CSSProperties,
  memo,
  type ReactNode,
  Suspense,
  useRef,
  useState,
} from "react";
import { Envelope } from "@/components/envelope/Envelope";
import { envelopeGround, paletteEnvelope } from "@/components/envelope/colors";
import { useSealed } from "@/components/envelope/useSealed";
import { Icon } from "@/components/icons";
import { localized, type Language, type LocalizedText } from "@/lib/language";
import { cornerVars } from "@/modular/corners";
import { hasContent } from "@/modular/fields";
import { groundRule, sectionGrounds } from "@/modular/ground";
import { HEADER_ID, RSVP_ID } from "@/modular/nav";
import { GROUND_FILL } from "@/modular/styles";
import { fontClasses, modularVars } from "@/modular/vars";
import type { Question } from "@/db/schemas/event";
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
   * In the editor: the envelope is drawn beside the invitation, over its
   * parent (the panel's room too): that parent must be positioned.
   */
  framed?: boolean;
  onRsvp?: (payload: RsvpPayload) => void;
  /** The host's own reply questions, asked in the RSVP section. Keep the same array while they don't change. */
  questions?: Question[];
  /** The editor in Edit mode: a section's Design and Content buttons. */
  edit?: SectionEdit;
  /**
   * Drawn at its content's height, not a screen's, nothing to scroll; the
   * hero this tall (a CSS length), the cover filling it. The dashboard's
   * picture of it.
   */
  hero?: string;
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
 * A modular invitation: a sticky bar, the sections stacked full width, each
 * at its own anchor, and the privacy footer. Each section's colour spans the
 * page (its ground's, or an `own` variant's `band`); its content stays in a
 * centred column that stops growing at `INVITE_COLUMN`. Laid out
 * responsively, not scaled like the simple card. Fills its parent: the
 * screen on the guest page, the preview in the editor.
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
  questions,
  edit,
  hero,
}: ModularInvitationProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sealed, unseal, page, fade, onFade] = useSealed<HTMLDivElement>(
    design.envelope,
  );
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
  const columnRef = useRef<HTMLDivElement>(null);
  const vars = {
    ...modularVars(design.palette, design.fontPair),
    ...cornerVars(design.corners),
    /* The header's fill: the second surface once a pattern is on, so the bar stands apart from the dots. */
    "--m-bar": design.pattern ? "var(--m-surface-alt)" : "var(--m-surface)",
    /* An outline in the surface round large text (`TEXT_CUT`), only with a pattern on, so it reads over it. */
    "--m-text-cut": design.pattern ? "0.1em" : "0",
  } as CSSProperties;
  const face = `invite font-[family-name:var(--font-primary)] text-[color:var(--m-ink)] ${fontClasses(design.fontPair)}`;

  /*
   * The header and the sections, drawn here and again as the envelope's
   * copies (`copy`): those have no anchors, no edit buttons and no menu.
   */
  function header(copy: boolean) {
    return bar ? (
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
            menuOpen: copy ? false : menuOpen,
            onOpenMenu: () => setMenuOpen(!copy),
            edit:
              edit && !copy ? (
                <EditButtons
                  edit={edit}
                  id={bar.definition.id}
                  content={hasContent(bar.definition)}
                />
              ) : undefined,
          }}
        />
      </Suspense>
    ) : null;
  }
  function sections(copy: boolean) {
    const views = body.map(({ definition, variant }, index) => {
      const before = body[index - 1];
      const afterSplit = Boolean(
        before?.definition.variants.find(({ id }) => id === before.variant)
          ?.split,
      );
      /* The cover takes up whatever the hero has to spare. */
      const grow = definition.id === COVER_ID;
      const band =
        groundRule(definition, variant) === "own"
          ? definition.variants.find(({ id }) => id === variant)?.band
          : undefined;
      return (
        <section
          key={definition.id}
          id={copy ? undefined : definition.id}
          style={
            band
              ? ({ "--band": `var(--m-${band})` } as CSSProperties)
              : undefined
          }
          className={`group/edit relative scroll-mt-14 @5xl:scroll-mt-16 ${band ? "bg-(--band)" : grounds[index] === "surface" ? "" : GROUND_FILL[grounds[index]]} ${grow ? "flex flex-1 flex-col" : ""}`}
        >
          {/* At the page's edge, not the column's: past 1440px they sit clear of the content. */}
          {edit && !copy ? (
            <EditButtons
              edit={edit}
              id={definition.id}
              content={hasContent(definition)}
            />
          ) : null}
          {/* The column: the container the section sizes itself by. */}
          <div
            className={`@container relative mx-auto w-full max-w-(--invite-column) ${grow ? "flex flex-1 flex-col" : ""}`}
          >
            <Suspense fallback={<SectionSkeleton />}>
              <SectionView
                section={definition}
                variant={variant}
                values={design.values[definition.id] ?? {}}
                related={relatedValues(definition, design)}
                basics={basics}
                language={language}
                ground={grounds[index]}
                afterSplit={afterSplit}
                onRsvp={copy ? undefined : onRsvp}
                questions={definition.id === RSVP_ID ? questions : undefined}
              />
            </Suspense>
          </div>
        </section>
      );
    });
    /*
     * The hero: the cover and the title, at least the screen less the
     * header (56px, 64px from `@5xl`, and its 1px line), more when their
     * content needs it; up to 1440px the cover fills that alone
     * (`CoverPhoto`). The scroller is the screen; the envelope's copy is
     * given the same height as `--strip-hero` (`Envelope.tsx`). Past the
     * column, the cover's gap above the photo (`--cover-top`) matches the
     * page's margin beside it, up to 80px.
     */
    const heroEnd = body.findIndex(
      ({ definition }) => !HERO_IDS.includes(definition.id),
    );
    const split = heroEnd === -1 ? body.length : heroEnd;
    /*
     * The pattern runs once under every section, so it never breaks at a
     * seam; a surface section paints nothing, the others cover it. Here, not
     * on the page, so the envelope's copy (no header) lines up with it. Its
     * own stacking box, for a pattern drawn on a layer behind (Pebbles).
     */
    return (
      <div className={`relative isolate ${design.pattern?.className ?? ""}`}>
        <div
          style={
            hero && !copy ? ({ "--hero": hero } as CSSProperties) : undefined
          }
          className={`flex min-h-(--hero) flex-col [--cover-top:clamp(0px,(100cqw-var(--invite-column))/2,80px)] ${copy ? "[--hero:var(--strip-hero)]" : hero ? "" : "[--hero:calc(100cqh-57px)] @5xl:[--hero:calc(100cqh-65px)]"}`}
        >
          {views.slice(0, split)}
        </div>
        {views.slice(split)}
      </div>
    );
  }
  /* A copy for the envelope, in the page's own vars and fonts, filling the box it is given. */
  const copyOf = (node: ReactNode, className: string) => (
    <div
      style={vars}
      className={`${face} @container/page h-full w-full bg-[var(--m-surface)] ${className}`}
    >
      {node}
    </div>
  );
  /*
   * In the editor the envelope covers the editor's whole area, the panel's
   * room too, and draws no ground of its own: the editor's shows through.
   * The page stays hidden under it while its copies come out of the
   * envelope (`strip.ts`), and takes over once they are in place; with
   * reduced motion it fades in instead.
   */
  const hidden = framed && sealed && fade === null;
  const envelope = sealed ? (
    <Envelope
      colors={paletteEnvelope(design.palette)}
      ground={
        framed
          ? { className: fontClasses(design.fontPair) }
          : {
              className: "bg-(--env-ground)",
              style: envelopeGround(design.palette),
            }
      }
      fontKey={design.fontPair.id}
      strip={{
        body: copyOf(sections(true), "overflow-hidden"),
        header: copyOf(header(true), ""),
        column: columnRef,
      }}
      onFade={onFade}
      onOpened={unseal}
    />
  ) : null;

  const column = (
    <div
      style={{ ...vars, "--reveal": `${fade ?? 0}ms` } as CSSProperties}
      className={`${face} relative flex h-full flex-col overflow-clip bg-[var(--m-surface)] ${hidden ? "opacity-0" : "transition-opacity duration-(--reveal)"}`}
    >
      {/* While the drawer or the envelope covers the page, everything under it is out of the tab order. */}
      <div
        ref={page}
        tabIndex={-1}
        inert={menuOpen || sealed}
        className="flex min-h-0 flex-1 flex-col outline-none"
      >
        {/* The page scrolls in here, not the window, so the header stays put. */}
        {/* A size container, so the hero can read its height (`cqh`); given its hero, neither. */}
        <div
          className={
            hero
              ? undefined
              : "invite-scroll min-h-0 flex-1 overflow-y-auto scroll-smooth [container-type:size]"
          }
        >
          {/*
           * The page's whole width: the container the header sizes itself
           * by, named so a section can still tell the page is wider than
           * its column.
           */}
          <div
            ref={columnRef}
            className="@container/page bg-[var(--m-surface)]"
          >
            {header(false)}
            {sections(false)}
          </div>
        </div>
      </div>

      {framed ? null : envelope}

      <SectionsDrawer
        open={menuOpen}
        links={links}
        onClose={() => setMenuOpen(false)}
      />
    </div>
  );

  return framed ? (
    <>
      {column}
      {envelope}
    </>
  ) : (
    column
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
      className="pointer-events-none grid size-btn cursor-pointer place-items-center rounded-ui bg-[var(--m-ink)] text-[color:var(--m-surface)] opacity-0 shadow-[0_1px_5px_rgb(0_0_0/0.3)] transition-[opacity,background-color] hover:bg-[var(--m-ink)]/80 group-hover/edit:pointer-events-auto group-hover/edit:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-500"
    >
      <Icon name={icon} className="size-5" strokeWidth={1.8} />
    </button>
  );
}

/** The sections the hero holds, in page order: the cover takes its spare height. */
const COVER_ID = "cover";
const HERO_IDS = [COVER_ID, "title"];

/** Stands in while the bar's variant loads, at the bar's own height. */
function BarSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="h-14 border-b-1 border-[var(--m-line)] bg-(--m-bar) @5xl:h-16"
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
