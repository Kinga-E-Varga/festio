import { Libre_Baskerville, Work_Sans } from "next/font/google";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin", "latin-ext"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin", "latin-ext"],
});

/** Shared by every root layout ([locale] and [invite]) so the app fonts are declared once. */
export const appFontClassName = `${workSans.variable} ${libreBaskerville.variable}`;
