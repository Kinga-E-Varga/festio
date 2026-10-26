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
import type { StoredQuestion } from "@/db/schemas/event";
import { envelopeGround } from "@/components/envelope/colors";
import { EditorFrame } from "@/components/invitation/EditorFrame";
import {
  useTabViews,
  type PanelTabId,
} from "@/components/invitation/PanelTabs";
import { PANEL_BESIDE, useEditing } from "@/components/invitation/useEditing";
import { useInvitationSave } from "@/components/invitation/useInvitationSave";
import { eventPath } from "@/lib/event";
import type { Language } from "@/lib/language";
import { useLeaveWarning } from "@/lib/leave-warning";
import { firstMissing } from "@/modular/fields";
import { RSVP_ID } from "@/modular/nav";
import { withAnswered } from "@/lib/questions";
import { resolveQuestions } from "@/lib/suggested";
import { applyTemplate, resolveDesign, sameState } from "@/modular/state";
import { modularVars } from "@/modular/vars";
import type { InvitationSaving } from "@/types/dashboard";
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
  /** The event Save writes to. Absent (a template's preview), Save keeps it in memory. */
  saving?: InvitationSaving;
  /** The host's reply questions as stored, archived ones too. */
  questions: StoredQuestion[];
}

/**
 * The modular editor, for an event's invitation or a template's preview:
 * the invitation as its shadowed column on its own ground, with the edit
 * panel beside it (the strip while it is closed). Same frame, same panel
 * shell, same toasts as the simple editor. The Design tab edits `state` and
 * the invitation follows it live; Save writes it to the event (in memory on
 * a preview), and leaving with unsaved changes asks first. The RSVP form
 * works; a reply only ever shows the test toast.
 */
export function ModularEditor({
  library,
  initial,
  templateId,
  basics,
  language,
  saving,
  questions: initialQuestions,
}: ModularEditorProps) {
  const t = useTranslations("HostEditor");
  const [editing, setEditing] = useEditing();
  const [state, setState] = useState(initial);
  const [saved, setSaved] = useState(initial);
  /* The reply questions: edited in the Replies tab, saved with the invitation. */
  const [questions, setQuestions] = useState(initialQuestions);
  const [savedQuestions, setSavedQuestions] = useState(initialQuestions);
  /* The form asks the active ones; the same array while they don't change, so the preview isn't redrawn. */
  const asked = useMemo(
    () =>
      resolveQuestions(
        questions.filter(({ archived }) => !archived),
        language,
      ),
    [questions, language],
  );
  /* Not stored: only which template the Design tab shows as current. */
  const [template, setTemplate] = useState(templateId);
  const views = useTabViews();
  const [tab, setTab] = useState<PanelTabId>("design");
  /* The Content tab's one open section. */
  const [openSection, setOpenSection] = useState<string | null>(null);
  /* The Design tab's one section with its styles out. */
  const [openStyles, setOpenStyles] = useState<string | null>(null);
  /* Save was tried with an empty required field: every such field says so. */
  const [showErrors, setShowErrors] = useState(false);
  const toast = useToast();
  const showToast = toast.show;
  const {
    save: send,
    sending,
    dialog,
  } = useInvitationSave(saving, toast, language);
  /*
   * The preview draws a deferred copy of the state: typing in the panel
   * stays quick, and the invitation catches up as soon as React is free.
   */
  const preview = useDeferredValue(state);
  const design = useMemo(
    () => resolveDesign(preview, library),
    [preview, library],
  );

  const dirty = useMemo(
    () =>
      !sameState(state, saved) ||
      JSON.stringify(questions) !== JSON.stringify(savedQuestions),
    [state, saved, questions, savedQuestions],
  );
  useLeaveWarning(dirty, t("leaveUnsaved"));

  /*
   * Steps that can only run once the next render is drawn: scrolling to a
   * section, focusing a field, scrolling to a card. Each runs once, then
   * is dropped; one that needs the preview waits until it has caught up.
   */
  const afterDraw = useRef<{ run: () => void; preview?: boolean }[]>([]);
  /*
   * A section to bring into view once the panel has finished opening: the
   * invitation narrows as it opens, so a section found earlier ends up
   * further down.
   */
  const afterOpen = useRef<string | null>(null);

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
  }

  /*
   * To the event's invitation card; on a template's preview (no event yet)
   * in memory only. An empty required field stops it: the host is taken
   * there, and every such field says so.
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
    send(
      { kind: "modular", ...state },
      (stored) => {
        setSaved(state);
        setSavedQuestions(stored?.questions ?? questions);
        if (!stored) return;
        /*
         * A question kept against the host's change: the list as saved.
         * Otherwise edits made while the save was out stay, taking only
         * which questions are now answered.
         */
        setQuestions((current) =>
          stored.kept.length > 0
            ? stored.questions
            : withAnswered(current, stored.questions),
        );
      },
      questions,
    );
  }

  /* A question added comes into view in the reply form, once the preview draws it. */
  function changeQuestions(next: StoredQuestion[]) {
    if (next.length > questions.length) {
      afterDraw.current.push({
        run: () => scrollToSection(RSVP_ID),
        preview: true,
      });
    }
    setQuestions(next);
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
    [openFields, setEditing],
  );

  /* The preview's Design button: the panel on Design, that section's styles out. */
  const editDesign = useCallback(
    (id: string) => {
      setEditing(true);
      setTab("design");
      setOpenStyles(id);
      afterDraw.current.push({ run: () => scrollToCard(designCardId(id)) });
    },
    [setEditing],
  );

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
    () => showToast(t("testReply")),
    [showToast, t],
  );

  return (
    <>
      <EditorFrame
        backTo={saving && eventPath(saving.eventId)}
        views={views}
        view={tab}
        open={editing}
        onView={(id) => {
          setTab(id);
          setEditing(true);
          /* The Form tab edits the reply form: it comes into view beside the panel. */
          if (id === "replies" && window.matchMedia(PANEL_BESIDE).matches) {
            if (editing) scrollToSection(RSVP_ID);
            else afterOpen.current = RSVP_ID;
          }
        }}
        onClose={() => setEditing(false)}
        action={{ kind: "save", dirty: dirty && !sending, onSave: save }}
        toast={toast}
      >
        {/*
         * The envelope's ground (the palette's `ground`), the same as under
         * the guest page's envelope. It spans the whole area, under the panel too, so a
         * closing panel never drags the page behind it into view.
         */}
        <div
          style={
            design
              ? {
                  ...modularVars(design.palette, design.fontPair),
                  ...envelopeGround(design.palette),
                }
              : undefined
          }
          className={`relative h-full ${design ? "bg-(--env-ground)" : ""}`}
        >
          {/*
           * With the panel open above the breakpoint, the invitation gives up
           * the panel's width, so the panel opens beside it rather than over
           * it — same duration and easing as the panel.
           */}
          <div
            data-panel={editing ? "true" : undefined}
            onTransitionEnd={(event) => {
              if (event.target !== event.currentTarget || !afterOpen.current)
                return;
              scrollToSection(afterOpen.current);
              afterOpen.current = null;
            }}
            className="relative h-full transition-[margin] duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] invite:data-[panel=true]:mr-invite-panel"
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
                questions={asked}
              />
            ) : null}
          </div>
          <ModularEditPanel
            open={editing}
            onClose={() => setEditing(false)}
            tab={tab}
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
            questions={questions}
            onQuestions={changeQuestions}
          />
        </div>
      </EditorFrame>
      {dialog}
    </>
  );
}
