'use client'

import { useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'
import { Toast, useToast } from '@/components/dashboard/Toast'
import { hasFestioHistory } from '@/lib/history'
import { cardValues } from '@/lib/invitation'
import { TemplateCard } from '@/templates/TemplateCard'
import type { InvitationTemplate, TemplateValues } from '@/types/invitation'
import { EditPanel } from './EditPanel'
import { ArrowLeftIcon, CheckIcon, PencilIcon } from './icons'
import { Invitation } from './Invitation'
import { HOST_ACTION, HOST_BAR_TOP, HOST_TOGGLE } from './styles'

interface HostInvitationEditorProps {
  template: InvitationTemplate
  initial: TemplateValues
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
  const [values, setValues] = useState(initial)
  const [editing, setEditing] = useState(true)
  const toast = useToast()
  const router = useRouter()

  function change(id: string, value: string) {
    setValues((current) => ({ ...current, [id]: value }))
  }

  /*
   * Back to wherever in Festio the host came from — the invitations list, the
   * event editor, the template gallery — which only history knows. When the
   * entry behind this one is not ours, stepping into it would drop the host
   * off the site, so the landing page stands in instead.
   */
  function leave() {
    if (hasFestioHistory()) router.back()
    else router.push('/')
  }

  function save() {
    toast.show('Invitation saved — your guests were not notified')
  }

  return (
    <>
      <Invitation
        template={template}
        values={values}
        replyInert={editing}
        host={
          <EditPanel
            template={template}
            values={values}
            open={editing}
            onChange={change}
            onClose={() => setEditing(false)}
          />
        }
        hostBar={
          /*
           * A row of its own above the card, not a layer over it: the stage
           * measures what is left and paints the card to fit.
           */
          <div className="flex justify-center">
            {/*
             * The bar does not answer to `editing` — the host keeps Back and
             * Save within reach while the form is open, and the form opens
             * beside the bar rather than over it.
             */}
            <div className={`${HOST_BAR_TOP} mb-2 invite:mt-6 invite:mb-2`}>
              <button type="button" onClick={leave} className={HOST_ACTION}>
                <ArrowLeftIcon size={14} />
                Back
              </button>
              {/*
               * A toggle, not a way in: it holds the hover fill while the
               * form is open and closes it again on a second click, so the
               * segment always says which state the host is in.
               */}
              <button
                type="button"
                aria-pressed={editing}
                data-active={editing ? 'true' : undefined}
                onClick={() => setEditing(!editing)}
                className={HOST_TOGGLE}
              >
                <PencilIcon size={14} />
                Edit
              </button>
              <button type="button" onClick={save} className={HOST_ACTION}>
                <CheckIcon size={14} />
                Save
              </button>
            </div>
          </div>
        }
      >
        <Suspense fallback={null}>
          {/* The date is written out here, not in the template — see `cardValues`. */}
          <TemplateCard id={template.id} values={cardValues(values)} />
        </Suspense>
      </Invitation>
      <Toast message={toast.message} />
    </>
  )
}
