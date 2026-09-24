'use client'

import {
  type AbstractIntlMessages,
  NextIntlClientProvider,
  useLocale,
  useMessages,
  useTranslations,
} from 'next-intl'
import { type ReactNode, Suspense, useState } from 'react'
import { Toast, useToast } from '@/components/dashboard/Toast'
import { useLeaveFestio } from '@/lib/history'
import { cardValues } from '@/lib/invitation'
import type { Language } from '@/lib/language'
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
  /** The invitation's own language — what the card's date is written in. */
  language: Language
  /**
   * The invitation's catalog, when its language is not the host's. The
   * guest page inside is drawn in it; absent, it shares the host's.
   */
  guestMessages?: AbstractIntlMessages
}

/**
 * The host sees exactly what a guest sees, plus a layer of their own that the
 * invitation draws inside itself. The state stays here: the invitation is
 * handed the values and the rendered host surfaces, and hands nothing back.
 */
export function HostInvitationEditor({
  template,
  initial,
  language,
  guestMessages,
}: HostInvitationEditorProps) {
  const t = useTranslations('HostEditor')
  const hostLocale = useLocale()
  const hostMessages = useMessages()
  const [values, setValues] = useState(initial)
  const [editing, setEditing] = useState(true)
  const toast = useToast()
  const leave = useLeaveFestio('/dashboard/invitations')

  function change(id: string, value: string) {
    setValues((current) => ({ ...current, [id]: value }))
  }

  function save() {
    toast.show(t('saved'))
  }

  /*
   * The edit panel and the bar are drawn inside the invitation, so under
   * its language. They are the host's, so they get the host's catalog back.
   */
  function asHost(node: ReactNode) {
    return (
      <NextIntlClientProvider locale={hostLocale} messages={hostMessages}>
        {node}
      </NextIntlClientProvider>
    )
  }

  const invitation = (
    <Invitation
      template={template}
      values={values}
      replyInert={editing}
      host={asHost(
        <EditPanel
          template={template}
          values={values}
          language={language}
          open={editing}
          onChange={change}
          onClose={() => setEditing(false)}
        />,
      )}
      /*
       * A row of its own above the card, not a layer over it: the stage
       * measures what is left and paints the card to fit.
       */
      hostBar={asHost(
        <HostBar
          onBack={leave}
          editing={editing}
          onToggleEdit={() => setEditing(!editing)}
          thirdAction={
            <button type="button" onClick={save} className={HOST_ACTION}>
              <CheckIcon size={14} />
              {t('save')}
            </button>
          }
        />,
      )}
    >
      <Suspense fallback={null}>
        {/* The date is written out here, not in the template — see `cardValues`. */}
        <TemplateCard
          id={template.id}
          values={cardValues(values, language)}
        />
      </Suspense>
    </Invitation>
  )

  return (
    <>
      {guestMessages ? (
        <NextIntlClientProvider locale={language} messages={guestMessages}>
          {invitation}
        </NextIntlClientProvider>
      ) : (
        invitation
      )}
      <Toast message={toast.message} />
    </>
  )
}
