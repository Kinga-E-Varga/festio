"use client";

import { type ReactNode, useEffect, useId, useRef } from "react";
import { HINT } from "@/components/dashboard/event-editor/styles";

interface DialogProps {
  title: string;
  hint?: string;
  /** Esc or a click outside; the caller decides whether it closes. */
  onDismiss: () => void;
  children: ReactNode;
}

/** A modal box over the page: the match picker and New reply. It closes by unmounting. */
export function Dialog({ title, hint, onDismiss, children }: DialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialog}
      onCancel={(event) => {
        event.preventDefault();
        onDismiss();
      }}
      /*
       * Chrome closes it anyway on a second Esc in a row, skipping the cancel
       * above. Still mounted, it would sit closed while the page thinks it's
       * open: back up, and taken as a dismiss like the first Esc.
       */
      onClose={(event) => {
        if (!event.currentTarget.isConnected) return;
        event.currentTarget.showModal();
        onDismiss();
      }}
      onClick={(event) => {
        /* Only the backdrop: the box's own scrollbar is the dialog too. */
        const box = event.currentTarget.getBoundingClientRect();
        const outside =
          event.clientX < box.left ||
          event.clientX > box.right ||
          event.clientY < box.top ||
          event.clientY > box.bottom;
        if (event.target === event.currentTarget && outside) onDismiss();
      }}
      aria-labelledby={titleId}
      /*
       * Phones: the box's middle a third of the way down, above where the
       * keyboard comes up; a tall one stops 16px from the top and grows down.
       */
      className="m-auto max-h-[calc(100dvh-32px)] max-sm:top-[33.33dvh] max-sm:bottom-auto max-sm:my-0 max-sm:translate-y-[max(-50%,calc(16px-33.33dvh))] w-[min(480px,calc(100vw-32px))] side-scroll overflow-y-auto overscroll-contain rounded-ui border border-neutral-400 bg-neutral-50 p-0 text-neutral-950 backdrop:bg-neutral-950/40 [--scroll-track:var(--color-neutral-50)]"
    >
      {/* No bottom padding: each body ends with its own, so a pinned bar can sit flush. */}
      <div className="px-5 pt-5">
        <h3 id={titleId} className="font-serif text-[17px] text-neutral-950">
          {title}
        </h3>
        {hint ? <p className={`mt-1.5 ${HINT}`}>{hint}</p> : null}
        {children}
      </div>
    </dialog>
  );
}
