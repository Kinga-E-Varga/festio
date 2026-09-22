'use client'

import { Suspense, useState } from 'react'
import { Toast, useToast } from '@/components/dashboard/Toast'
import { useLeaveFestio } from '@/lib/history'
import { cardValues } from '@/lib/invitation'
import { TemplateCard } from '@/templates/TemplateCard'
import type { InvitationTemplate, TemplateValues } from '@/types/invitation'
import { EditPanel } from './EditPanel'
import { CheckIcon } from './icons'
import { HostBar } from './HostBar'
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
  const [editing, setEditing] = useState(true)
  const toast = useToast()
  const leave = useLeaveFestio()

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
          <HostBar
            onBack={leave}
            editing={editing}
            onToggleEdit={() => setEditing(!editing)}
            thirdAction={
              <button type="button" onClick={save} className={HOST_ACTION}>
                <CheckIcon size={14} />
                Save
              </button>
            }
          />
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
