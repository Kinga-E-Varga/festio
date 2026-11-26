import type { ReactNode } from "react";
import { CARD_FRAME, LOCKUP } from "@/components/dashboard/styles";

/**
 * A page that is only a short notice in Festio's own look: the logo over a
 * small card with a title and a line. A missing page, the contact page
 * until its form is built.
 */
export function NoticeCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-12">
      <span aria-hidden="true" className={`h-btn bg-primary-800 ${LOCKUP}`} />
      <div
        className={`flex w-full max-w-[400px] flex-col gap-3 p-6 text-center sm:p-8 ${CARD_FRAME}`}
      >
        <h1 className="card-title">{title}</h1>
        <p className="row-text">{children}</p>
      </div>
    </main>
  );
}
