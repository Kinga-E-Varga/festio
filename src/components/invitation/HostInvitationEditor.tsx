'use client'

import { Suspense, useState } from 'react'
import { Toast, useToast } from '@/components/dashboard/Toast'
import { cardValues } from '@/lib/invitation'
import { TemplateCard } from '@/templates/TemplateCard'
import type { InvitationTemplate, TemplateValues } from '@/types/invitation'
import { EditPanel } from './EditPanel'
import { InvitationFrame } from './InvitationFrame'
import { RsvpPanel } from './RsvpPanel'
import { HOST_ACTION } from './styles'

interface HostInvitationEditorProps {
  template: InvitationTemplate
  initial: TemplateValues
}

/**
 * The host sees exactly what a guest sees. The edit form is always mounted
 * beside the RSVP panel and just slides on top of it, so opening/closing the
 * editor never changes the panel slot's layout and the invitation never
 * moves.
 */
export function HostInvitationEditor({
  template,
  initial,
}: HostInvitationEditorProps) {
  const [values, setValues] = useState(initial)
  const [editing, setEditing] = useState(false)
  const toast = useToast()

  function change(id: string, value: string) {
    setValues((current) => ({ ...current, [id]: value }))
  }

  function save() {
    toast.show('Invitation saved — your guests were not notified')
  }

  return (
    <>
      <InvitationFrame
        template={template}
        panel={
          <>
            <RsvpPanel template={template} values={values} inert={editing} />
            <EditPanel
              template={template}
              values={values}
              open={editing}
              onChange={change}
              onClose={() => setEditing(false)}
              onSave={save}
            />
          </>
        }
        overlay={
          /*
           * Always mounted, never unmounted on `editing` — a conditional
           * render has nothing left to animate, so the pair would pop out and
           * back. They fade and slide instead, on the same 420ms curve the
           * edit panel opens with, and go inert so neither the pointer nor
           * the tab order can reach a button that isn't really there.
           */
          <div
            inert={editing}
            className={`absolute top-5 left-5 z-10 flex gap-2 invitation:top-10 invitation:left-10 transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              editing ? 'pointer-events-none -translate-x-2 opacity-0' : ''
            }`}
          >
            <button
              type="button"
              onClick={() => setEditing(true)}
              className={HOST_ACTION}
            >
              Edit
            </button>
            <button type="button" onClick={save} className={HOST_ACTION}>
              Save
            </button>
          </div>
        }
      >
        <Suspense fallback={null}>
          {/* The date is written out here, not in the template — see `cardValues`. */}
          <TemplateCard id={template.id} values={cardValues(values)} />
        </Suspense>
      </InvitationFrame>
      <Toast message={toast.message} />
    </>
  )
}
