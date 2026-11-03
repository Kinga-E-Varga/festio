import {
  Alegreya,
  Alegreya_Sans,
  Anton,
  Archivo,
  Arimo,
  Baloo_2,
  Bevan,
  Bungee,
  Castoro,
  Coiny,
  EB_Garamond,
  Fraunces,
  Gelasio,
  Kapakana,
  Noto_Serif,
  Oswald,
  Source_Sans_3,
  Space_Grotesk,
  Zilla_Slab,
} from "next/font/google";
import type { TemplateFont } from "@/types/invitation";

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
  variable: "--font-noto-serif",
  subsets: ["latin", "latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const kapakana = Kapakana({
  variable: "--font-kapakana",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400"],
});

const gelasio = Gelasio({
  variable: "--font-gelasio",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
});

const arimo = Arimo({
  variable: "--font-arimo",
  subsets: ["latin", "latin-ext"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  // Optical size: large text takes the high-contrast display cut by itself.
  axes: ["opsz"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "latin-ext"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
});

const zillaSlab = Zilla_Slab({
  variable: "--font-zilla-slab",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const alegreya = Alegreya({
  variable: "--font-alegreya",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
});

const alegreyaSans = Alegreya_Sans({
  variable: "--font-alegreya-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
});

const coiny = Coiny({
  variable: "--font-coiny",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin", "latin-ext"],
});

const bungee = Bungee({
  variable: "--font-bungee",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

const bevan = Bevan({
  variable: "--font-bevan",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin", "latin-ext"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
});

const castoro = Castoro({
  variable: "--font-castoro",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
});

function token(
  font: { className: string; variable: string },
  cssVar: string,
): TemplateFont {
  return { className: font.variable, cssVar };
}

export const fonts = {
  notoSerif: token(notoSerif, "--font-noto-serif"),
  kapakana: token(kapakana, "--font-kapakana"),
  gelasio: token(gelasio, "--font-gelasio"),
  arimo: token(arimo, "--font-arimo"),
  fraunces: token(fraunces, "--font-fraunces"),
  spaceGrotesk: token(spaceGrotesk, "--font-space-grotesk"),
  sourceSans: token(sourceSans, "--font-source-sans"),
  zillaSlab: token(zillaSlab, "--font-zilla-slab"),
  alegreya: token(alegreya, "--font-alegreya"),
  alegreyaSans: token(alegreyaSans, "--font-alegreya-sans"),
  anton: token(anton, "--font-anton"),
  archivo: token(archivo, "--font-archivo"),
  oswald: token(oswald, "--font-oswald"),
  coiny: token(coiny, "--font-coiny"),
  baloo: token(baloo, "--font-baloo"),
  bevan: token(bevan, "--font-bevan"),
  bungee: token(bungee, "--font-bungee"),
  castoro: token(castoro, "--font-castoro"),
  ebGaramond: token(ebGaramond, "--font-eb-garamond"),
};
