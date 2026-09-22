/** What the host sets up on the print page, before anything is rendered out. */

/**
 * The two ways a printable is put on paper. A flat card is one sheet printed
 * on both sides; a folded one is the same sheet folded in half, so it carries
 * four faces instead of two.
 */
export type PrintShape = 'flat' | 'folded'

export interface PrintSettings {
  shape: PrintShape
  /** Whether the faces the host writes are printed on the template's colour or on bare paper. */
  tinted: boolean
  /**
   * The larger of the two printed lines. It opens on the invitation's RSVP
   * message, which is only where it starts — the two are separate from the
   * first keystroke, and editing one never touches the other.
   */
  headline: string
  /** The smaller line under it, pointing the guest at the link. */
  note: string
}
