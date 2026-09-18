import { Kapakana, Noto_Serif } from 'next/font/google'
import type { TemplateFont } from '@/types/invitation'

/**
 * Every invitation font is declared once, here, and reused by whichever
 * templates want it. `next/font` calls must sit at module scope to be
 * statically analysed, so a shared module works the same way a per-template
 * declaration did — it just stops the same font's config (weights, subsets)
 * from being retyped, and able to drift, in every template that uses it.
 *
 * A template assigns these to a role (`fonts.primary` / `fonts.secondary`);
 * which physical font plays which role is the template's choice, not this
 * file's.
 */
const notoSerif = Noto_Serif({
  variable: '--font-noto-serif',
  subsets: ['latin', 'latin-ext'],
  weight: ['100', '200', '300', '400', '500', '600'],
  style: ['normal', 'italic'],
})

const kapakana = Kapakana({
  variable: '--font-kapakana',
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400'],
})

function token(
  font: { className: string; variable: string },
  cssVar: string,
): TemplateFont {
  return { className: font.variable, cssVar }
}

export const fonts = {
  notoSerif: token(notoSerif, '--font-noto-serif'),
  kapakana: token(kapakana, '--font-kapakana'),
}
