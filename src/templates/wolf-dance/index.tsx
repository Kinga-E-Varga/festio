import Image from 'next/image'
import { DEFAULT_DATE_FORMAT } from '@/lib/invitation'
import { fonts } from '@/lib/fonts'
import type { InvitationTemplate, TemplateValues } from '@/types/invitation'
import pattern from './pattern.svg'
import animalCoupleDance from './animal-couple-dance.svg'

export const template: InvitationTemplate = {
  id: 'wolf-dance',
  name: 'Wolf Dance',
  type: 1,
  minTier: 1,
  eventTypes: ['wedding', 'other'],
  design: { width: 1080, height: 1532, minScale: 0.18, maxScale: 0.65 },
  printSize: 'A5 portrait — 148 × 210 mm at 300 dpi',

  /*
   * Roles are positional: 1 surface, 2 ink, 3 action, 4 on-action, 5 the
   * line under an input. The guest form reads these by number.
   */
  palette: {
    color1: '#473130',
    color2: '#adbd8f',
    color3: '#fefce5',
    color4: '#fefce569',
    color5: '#718355ff',
    color6: '#d88e5fff',
    color7: '#9cb17d',
    color8: null,
    color9: null,
    color10: null,
  },

  fonts: {
    primary: fonts.notoSerif,
    secondary: fonts.kapakana,
  },

  edge: 'wavy',

  background: {
    kind: 'image',
    src: pattern.src,
    size: '400px',
    under: 'color3',
  },

  fields: [
    /* Read by the RSVP panel, not by the card — the line above the reply. */
    {
      id: 'rsvpMessage',
      label: 'message',
      type: 'text',
      maxLength: 120,
      fallback: 'We would love to know if you can join us.',
      scope: 'rsvp',
    },
    {
      id: 'title1',
      label: 'opening line',
      type: 'text',
      maxLength: 40,
      fallback: 'We invite you to',
    },
    {
      id: 'title2',
      label: 'opening line',
      type: 'text',
      maxLength: 60,
      fallback: 'celebrate our wedding',
    },
    {
      id: 'name1',
      label: 'name',
      type: 'text',
      maxLength: 10,
      fallback: 'Jacob',
    },
    {
      id: 'name2',
      label: 'name',
      type: 'text',
      maxLength: 10,
      fallback: 'Bella',
    },
    {
      id: 'dateFormat',
      label: 'date',
      type: 'dateFormat',
      fallback: DEFAULT_DATE_FORMAT,
    },
    {
      id: 'text1',
      label: 'bold text',
      type: 'text',
      maxLength: 90,
      fallback: 'Ceremony | 1 PM',
    },
    {
      id: 'text2',
      label: 'text',
      type: 'text',
      maxLength: 90,
      fallback: 'Quileute Reservation, La Push, Washington',
    },
    {
      id: 'text3',
      label: 'bold text',
      type: 'text',
      maxLength: 90,
      fallback: 'Reception | 4 PM',
    },
    {
      id: 'text4',
      label: 'text',
      type: 'text',
      maxLength: 90,
      fallback: 'La Bella Italia, Forks, Washington',
    },
  ],
}

/*
 * Authored once at 1080 × 1532 and never reflowed — every length below is a
 * plain px, and there is not a single breakpoint inside the card. A blank
 * field drops out and the column closes the gap, which happens at the design
 * size, before the stage's transform.
 */
export function Card({ values }: { values: TemplateValues }) {
  return (
    <div
      className="absolute inset-0 p-7 text-[var(--c1)] font-[family-name:var(--font-primary)]   
    
   "
    >
      <div className="h-full p-3 bg-[var(--c3)] elevation-light">
        <div
          className="h-full flex flex-col justify-evenly items-center px-12 py-16  bg-[var(--c7)] bg-size-[550px] bg-repeat bg-center"
          style={{ backgroundImage: `url(${pattern.src})` }}
        >
          {/* Header */}
          <div className="text-center leading-[1.25] pb-5 italic">
            <p className=" text-[35px]">{values.title1}</p>
            <p className="text-[35px]">{values.title2}</p>
          </div>

          {/* Names */}
          <div className="w-full leading-[0.7] flex items-center text-[var(--c3)] text-[160px] font-[family-name:var(--font-secondary)]">
            <p className="flex-1 text-right ">{values.name1}</p>
            <p className="text-[240px] text-[var(--c1)] text-center pl-6 pr-3 ">
              &
            </p>
            <p className="flex-1 text-left">{values.name2}</p>
          </div>

          {/* Image */}
          <Image
            src={animalCoupleDance}
            alt=""
            className="h-[550px] w-auto py-4 pb-10"
          />

          {/* Date */}
          <p className="leading-[1] flex items-center gap-2 text-center text-[100px] text-[var(--c3)] font-[family-name:var(--font-secondary)]">
            {values.date}
          </p>

          {/* Bottom text */}
          <div className="text-[35px] italic text-center  ">
            {values.text1 === '' && values.text2 === '' ? (
              <></>
            ) : (
              <div className="pt-8">
                <p className="font-semibold">{values.text1}</p>
                <p className="">{values.text2}</p>
              </div>
            )}

            {values?.text3 === '' && values?.text4 === '' ? (
              <></>
            ) : (
              <div className="pt-8">
                <p className="font-semibold">{values.text3}</p>
                <p className="">{values.text4}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
