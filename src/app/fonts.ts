import { Kantumruy_Pro, Libre_Baskerville } from "next/font/google";

const kantumruyPro = Kantumruy_Pro({
  variable: "--font-kantumruy-pro",
  subsets: ["latin", "latin-ext"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin", "latin-ext"],
});

/** Shared by every root layout ([locale] and [invite]) so the app fonts are declared once. */
export const appFontClassName = `${kantumruyPro.variable} ${libreBaskerville.variable}`;
