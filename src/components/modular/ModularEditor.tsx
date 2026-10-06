"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/dashboard/Toast";
import { EditorFrame } from "@/components/invitation/EditorTopBar";
import type { Language } from "@/lib/language";
import { useLeaveWarning } from "@/lib/leave-warning";
import { applyTemplate, resolveDesign, sameState } from "@/modular/state";
import { groundClasses } from "@/modular/styles";
import { modularVars } from "@/modular/vars";
import type {
  InvitationBasics,
  ModularLibrary,
  ModularState,
} from "@/types/modular";
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
  const toast = useToast();

  const dirty = !sameState(state, saved);
  useLeaveWarning(dirty, t("leaveUnsaved"));

  /*
   * A section just turned on, given a new style or asked for, waiting to be scrolled
   * to once it is drawn.
   */
  const toShow = useRef<string | null>(null);

  function change(next: ModularState, show?: string) {
    /* A section the change turned off has nothing to go to. */
    if (
      show &&
      next.sections.some(({ section, on }) => section === show && on)
    ) {
      toShow.current = show;
    }
    setState(next);
    setJustSaved(false);
  }

  /*
   * After the render that drew it, a section turned on, restyled or asked
   * for comes into view, so the host sees what they changed. The panel stays open:
   * they are still choosing.
   */
  useEffect(() => {
    if (!toShow.current) return;
    scrollToSection(toShow.current);
    toShow.current = null;
  });

  /* In memory only, like the simple editor: there is no event yet. */
  function save() {
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

  /* A section into view. Where the panel covers the screen it closes first, so the host sees where it went. */
  function reveal(id: string) {
    if (!window.matchMedia(PANEL_BESIDE).matches) setEditing(false);
    scrollToSection(id);
  }

  const design = resolveDesign(state, library);

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
              onRsvp={() => toast.show(t("testReply"), "warning")}
            />
          ) : null}
        </div>
        <ModularEditPanel
          open={editing}
          onClose={() => setEditing(false)}
          library={library}
          state={state}
          templateId={template}
          language={language}
          onChange={change}
          onTemplate={pickTemplate}
          onReveal={reveal}
        />
      </div>
    </EditorFrame>
  );
}
