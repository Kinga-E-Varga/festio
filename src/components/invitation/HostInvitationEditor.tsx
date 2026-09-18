'use client'

import { Suspense, useState } from 'react'
import { Toast, useToast } from '@/components/dashboard/Toast'
import { cardValues } from '@/lib/invitation'
import { TemplateCard } from '@/templates/TemplateCard'
import type { InvitationTemplate, TemplateValues } from '@/types/invitation'
import { EditPanel } from './EditPanel'
import { Invitation } from './Invitation'
import { HOST_ACTION } from './styles'

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
             * Always mounted, never unmounted on `editing` — a conditional
             * render has nothing left to animate, so the pair would pop out
             * and back. They fade and slide instead, on the same 420ms curve
             * the edit panel opens with, and go inert so neither the pointer
             * nor the tab order can reach a button that isn't really there.
             */}
            <div
              inert={editing}
              className={`absolute top-5 left-5 z-10 flex gap-2 invite:top-10 invite:left-10 transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
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
  )
}
