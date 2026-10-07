"use client";

import { useTranslations } from "next-intl";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useToast } from "@/components/dashboard/Toast";
import { EditorFrame } from "@/components/invitation/EditorTopBar";
import type { PanelTabId } from "@/components/invitation/PanelTabs";
import type { Language } from "@/lib/language";
import { useLeaveWarning } from "@/lib/leave-warning";
import { firstMissing } from "@/modular/fields";
import { applyTemplate, resolveDesign, sameState } from "@/modular/state";
import { groundClasses } from "@/modular/styles";
import { modularVars } from "@/modular/vars";
import type {
  InvitationBasics,
  ModularLibrary,
  ModularState,
} from "@/types/modular";
import { contentCardId } from "./content/ContentTab";
import { designCardId } from "./design/SectionsList";
import { ModularEditPanel } from "./ModularEditPanel";
import { ModularInvitation } from "./ModularInvitation";

/**
 * `--breakpoint-invite` written out: from here the panel sits beside the
 * invitation; below it, it covers the screen.
 */
const PANEL_BESIDE = "(min-width: 1000px)";

/**
 * A section into view, in the middle of the page — or from its top when it
 * is taller than the page, so its start is never cut off. The header has no
 * anchor of its own — it is the top of the page.
 */
function scrollToSection(id: string) {
  const section = document.getElementById(id);
  const page = document.querySelector(".invite-scroll");
  if (!section) {
    page?.scrollTo({ top: 0 });
    return;
  }
  const tall = page ? section.offsetHeight > page.clientHeight : false;
  section.scrollIntoView({ block: tall ? "start" : "center" });
}

/*
 * A section's card (by its element id) to the top of the open tab, just
 * under the panel's sticky tabs. The panel scrolls on its own, apart from
 * the page.
 */
function scrollToCard(id: string) {
  const card = document.getElementById(id);
  const panel = card?.closest<HTMLElement>("[data-panel-scroll]");
  if (!card || !panel) return;
  const sticky = panel.firstElementChild?.clientHeight ?? 0;
  const top =
    card.getBoundingClientRect().top -
    panel.getBoundingClientRect().top +
    panel.scrollTop -
    sticky;
  panel.scrollTo({ top, behavior: "smooth" });
}

interface ModularEditorProps {
  library: ModularLibrary;
  /** Where the editor starts — and what Save last kept. */
  initial: ModularState;
  /** The template the page opened with; the Design tab shows it as current. */
  templateId: string;
  basics: InvitationBasics;
  language: Language;
  title: string;
}

/**
 * The modular template page: the invitation as its shadowed column
 * on its own ground, with the editor's top bar above it and the edit panel
 * beside it. Same bar, same panel shell, same toasts as the simple editor.
 * The Design tab edits `state` and the invitation follows it live; Save
 * keeps it in memory, and leaving with unsaved changes asks first. The RSVP
 * form works; a reply only ever shows the test toast.
 */
export function ModularEditor({
  library,
  initial,
  templateId,
  basics,
  language,
  title,
}: ModularEditorProps) {
  const t = useTranslations("HostEditor");
  const [editing, setEditing] = useState(true);
  const [state, setState] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [justSaved, setJustSaved] = useState(false);
  /* Not stored: only which template the Design tab shows as current. */
  const [template, setTemplate] = useState(templateId);
  const [tab, setTab] = useState<PanelTabId>("design");
  /* The Content tab's one open section. */
  const [openSection, setOpenSection] = useState<string | null>(null);
  /* The Design tab's one section with its styles out. */
  const [openStyles, setOpenStyles] = useState<string | null>(null);
  /* Save was tried with an empty required field: every such field says so. */
  const [showErrors, setShowErrors] = useState(false);
  const toast = useToast();
  const showToast = toast.show;
  /*
   * The preview draws a deferred copy of the state: typing in the panel
   * stays quick, and the invitation catches up as soon as React is free.
   */
  const preview = useDeferredValue(state);
  const design = useMemo(
    () => resolveDesign(preview, library),
    [preview, library],
  );

  const dirty = useMemo(() => !sameState(state, saved), [state, saved]);
  useLeaveWarning(dirty, t("leaveUnsaved"));

  /*
   * Steps that can only run once the next render is drawn: scrolling to a
   * section, focusing a field, scrolling to a card. Each runs once, then
   * is dropped; one that needs the preview waits until it has caught up.
   */
  const afterDraw = useRef<{ run: () => void; preview?: boolean }[]>([]);

  useEffect(() => {
    const caughtUp = preview === state;
    afterDraw.current = afterDraw.current.filter((step) => {
      if (step.preview && !caughtUp) return true;
      step.run();
      return false;
    });
  });

  function change(next: ModularState, show?: string) {
    /* A section the change turned off has nothing to go to. */
    if (
      show &&
      next.sections.some(({ section, on }) => section === show && on)
    ) {
      /*
       * The section turned on, restyled or asked for comes into view, so
       * the host sees what they changed. The panel stays open: they are
       * still choosing.
       */
      afterDraw.current.push({
        run: () => scrollToSection(show),
        preview: true,
      });
    }
    setState(next);
    setJustSaved(false);
  }

  /*
   * In memory only, like the simple editor: there is no event yet. An empty
   * required field stops it: the host is taken there, and every such field
   * says so.
   */
  function save() {
    const missing = firstMissing(state, library);
    if (missing) {
      setEditing(true);
      setTab("content");
      setShowErrors(true);
      openFields(missing.section);
      afterDraw.current.push({
        run: () => document.getElementById(missing.id)?.focus(),
      });
      return;
    }
    setShowErrors(false);
    setSaved(state);
    setJustSaved(true);
    toast.show(t("saved"));
  }

  function pickTemplate(id: string) {
    const picked = library.templates.find((candidate) => candidate.id === id);
    if (!picked) return;
    setTemplate(id);
    change(applyTemplate(state, picked));
  }

  /*
   * A section's styles out in the Design tab. Its section comes into view
   * only beside the panel: where the panel covers the screen, nothing moves
   * and it stays open on the styles just opened, as with the Content tab.
   */
  function openStylesOf(id: string | null) {
    setOpenStyles(id);
    if (id && window.matchMedia(PANEL_BESIDE).matches) scrollToSection(id);
  }

  /*
   * A style picked: where the panel covers the screen it closes, so the
   * host sees it; the change itself scrolls to the section once drawn
   * (`afterDraw`).
   */
  function stylePicked() {
    if (!window.matchMedia(PANEL_BESIDE).matches) setEditing(false);
  }

  /*
   * A section's fields out in the Content tab. Its section comes into view
   * only beside the panel: where the panel covers the screen, closing it
   * would hide the fields just opened.
   */
  const openFields = useCallback((id: string | null) => {
    setOpenSection(id);
    if (id && window.matchMedia(PANEL_BESIDE).matches) scrollToSection(id);
  }, []);

  /* The preview's Content button: the panel on Content, that section's fields out. */
  const editContent = useCallback(
    (id: string) => {
      setEditing(true);
      setTab("content");
      openFields(id);
      afterDraw.current.push({ run: () => scrollToCard(contentCardId(id)) });
    },
    [openFields],
  );

  /* The preview's Design button: the panel on Design, that section's styles out. */
  const editDesign = useCallback((id: string) => {
    setEditing(true);
    setTab("design");
    setOpenStyles(id);
    afterDraw.current.push({ run: () => scrollToCard(designCardId(id)) });
  }, []);

  /* Kept the same between renders, so the preview skips the ones that change nothing it draws. */
  const edit = useMemo(
    () =>
      editing
        ? {
            design: { label: t("editDesign"), onEdit: editDesign },
            content: { label: t("editContent"), onEdit: editContent },
          }
        : undefined,
    [editing, t, editDesign, editContent],
  );
  const testReply = useCallback(
    () => showToast(t("testReply"), "warning"),
    [showToast, t],
  );

  return (
    <EditorFrame
      title={title}
      editing={editing}
      onToggleEdit={() => setEditing(!editing)}
      action={{ kind: "save", dirty, justSaved, onSave: save }}
      toast={toast}
    >
      {/*
       * The invitation's own ground, the same as around its column on a wide
       * guest screen. It spans the whole area, under the panel too, so a
       * closing panel never drags the page behind it into view.
       */}
      <div
        style={
          design ? modularVars(design.palette, design.fontPair) : undefined
        }
        className={`relative h-full ${design ? groundClasses(design.pattern) : ""}`}
      >
        {/*
         * With the panel open above the breakpoint, the invitation gives up
         * the panel's width, so the panel opens beside it rather than over
         * it — same duration and easing as the panel.
         */}
        <div
          data-panel={editing ? "true" : undefined}
          className="h-full px-3 pt-3 transition-[margin] duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:px-4.5 md:pt-4.5 invite:px-6 invite:pt-6 invite:data-[panel=true]:mr-invite-panel rail:px-10 rail:pt-10"
        >
          {/* A state id that names nothing leaves the ground empty rather than failing the page. */}
          {design ? (
            <ModularInvitation
              design={design}
              basics={basics}
              language={language}
              framed
              edit={edit}
              onRsvp={testReply}
            />
          ) : null}
        </div>
        <ModularEditPanel
          open={editing}
          onClose={() => setEditing(false)}
          tab={tab}
          onTab={setTab}
          library={library}
          state={state}
          basics={basics}
          openSection={openSection}
          onOpenSection={openFields}
          showErrors={showErrors}
          templateId={template}
          language={language}
          onChange={change}
          onTemplate={pickTemplate}
          openStyles={openStyles}
          onOpenStyles={openStylesOf}
          onStylePicked={stylePicked}
        />
      </div>
    </EditorFrame>
  );
}
