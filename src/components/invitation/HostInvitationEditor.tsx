"use client";

import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { Toast, useToast } from "@/components/dashboard/Toast";
import { hasFestioHistory } from "@/lib/history";
import { cardValues } from "@/lib/invitation";
import { TemplateCard } from "@/templates/TemplateCard";
import type { InvitationTemplate, TemplateValues } from "@/types/invitation";
import { EditPanel } from "./EditPanel";
import { ArrowLeftIcon, ChevronDownIcon, XIcon } from "./icons";
import { Invitation } from "./Invitation";
import { HOST_ACTION, HOST_BAR, HOST_ICON, HOST_TAB } from "./styles";

/*
 * Where the host's layer hangs, flush with the top so the handle can sit on
 * the page's own edge; the bar takes its distance from the top itself.
 *
 * Centred over the card's own slot, not the invitation: above the breakpoint
 * the right edge stops where the reply surface starts, so the controls sit
 * over the middle of what the host is looking at rather than the middle of
 * the page. Below it the reply is a bottom bar and the full width is the
 * card's.
 */
const ANCHOR =
  "absolute top-0 right-0 left-0 z-10 flex justify-center invite:right-invite-panel";

/** The one curve both surfaces come and go on — the edit panel's own. */
const FADE =
  "transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

/** Present but not there: out of reach of the pointer and of the tab order. */
const GONE = "pointer-events-none -translate-y-2 opacity-0";

interface HostInvitationEditorProps {
  template: InvitationTemplate;
  initial: TemplateValues;
}

/**
 * The host sees exactly what a guest sees, plus a layer of their own that the
 * invitation draws inside itself. The state stays here: the invitation is
 * handed the values and the rendered host surfaces, and hands nothing back.
 */
export function HostInvitationEditor({
  template,
  initial,
}: HostInvitationEditorProps) {
  const [values, setValues] = useState(initial);
  const [editing, setEditing] = useState(true);
  /** The host's own bar, dismissed to see the card exactly as a guest will. */
  const [chrome, setChrome] = useState(true);
  const toast = useToast();
  const router = useRouter();

  function change(id: string, value: string) {
    setValues((current) => ({ ...current, [id]: value }));
  }

  /*
   * Back to wherever in Festio the host came from — the invitations list, the
   * event editor, the template gallery — which only history knows. When the
   * entry behind this one is not ours, stepping into it would drop the host
   * off the site, so the landing page stands in instead.
   */
  function leave() {
    if (hasFestioHistory()) router.back();
    else router.push("/");
  }

  function save() {
    toast.show("Invitation saved — your guests were not notified");
  }

  return (
    <>
      <Invitation
        template={template}
        values={values}
        replyInert={editing}
        host={
          <>
            <EditPanel
              template={template}
              values={values}
              open={editing}
              onChange={change}
              onClose={() => setEditing(false)}
              onSave={save}
            />

            {/*
             * One stack: the bar stays in flow and sets its width, and the
             * handle lies over it, centred on it. The handle is at the
             * stack's top, on the page's edge; the bar carries its own inset
             * below it.
             *
             * Both are always mounted, never unmounted on their state — a
             * conditional render has nothing left to animate, so each would
             * pop out and back. They fade and slide instead, and go inert so
             * neither the pointer nor the tab order can reach a control that
             * isn't really there.
             */}
            <div className={ANCHOR}>
              <div className="relative">
                {/*
                 * The bar answers to the X alone, not to `editing` — the host
                 * keeps Back, Save and the dismiss within reach while the
                 * form is open, and the form opens beside it rather than over
                 * it.
                 */}
                <div
                  inert={!chrome}
                  className={`mt-5 invite:mt-10 ${FADE} ${chrome ? "" : GONE}`}
                >
                  <div className={HOST_BAR}>
                    <button
                      type="button"
                      aria-label="Back"
                      onClick={leave}
                      className={HOST_ICON}
                    >
                      <ArrowLeftIcon size={14} />
                    </button>
                    {/*
                     * A toggle, not a way in: it holds the hover fill while
                     * the form is open and closes it again on a second click,
                     * so the segment always says which state the host is in.
                     */}
                    <button
                      type="button"
                      aria-pressed={editing}
                      data-active={editing ? 'true' : undefined}
                      onClick={() => setEditing(!editing)}
                      className={HOST_ACTION}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={save}
                      className={HOST_ACTION}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      aria-label="Hide controls"
                      onClick={() => setChrome(false)}
                      className={HOST_ICON}
                    >
                      <XIcon size={14} />
                    </button>
                  </div>
                </div>

                {/*
                 * What the X leaves behind. Dismissing the bar outright would
                 * strand the host on a page with no way back, so this stays.
                 * The two are never both present.
                 */}
                <div
                  inert={chrome}
                  className={`absolute inset-x-0 top-0 flex justify-center ${FADE} ${
                    chrome ? GONE : ""
                  }`}
                >
                  <button
                    type="button"
                    aria-label="Show controls"
                    onClick={() => setChrome(true)}
                    className={HOST_TAB}
                  >
                    <ChevronDownIcon />
                  </button>
                </div>
              </div>
            </div>
          </>
        }
      >
        <Suspense fallback={null}>
          {/* The date is written out here, not in the template — see `cardValues`. */}
          <TemplateCard id={template.id} values={cardValues(values)} />
        </Suspense>
      </Invitation>
      <Toast message={toast.message} />
    </>
  );
}
