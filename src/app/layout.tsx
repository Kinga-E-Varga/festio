import type { Metadata } from "next";
import { Kantumruy_Pro, Libre_Baskerville } from "next/font/google";
import "./globals.css";

const kantumruyPro = Kantumruy_Pro({
  variable: "--font-kantumruy-pro",
  subsets: ["latin", "latin-ext"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Festio",
  description: "Invitations, RSVPs and everything after.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${kantumruyPro.variable} ${libreBaskerville.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col text-sm">{children}</body>
    </html>
  );
}
