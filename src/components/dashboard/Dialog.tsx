"use client";

import { type ReactNode, useEffect, useId, useRef } from "react";
import { BoxHead } from "@/components/dashboard/BoxHead";
import { BOX_PAD_SIZE } from "@/components/dashboard/styles";

/** The box's colours: the plain one, or a warning's, its title in the warning's words colour and its edge in its buttons' fill. */
const SURFACE = {
  plain:
    "border-neutral-400 bg-neutral-50 text-neutral-950 [--scroll-track:var(--color-neutral-50)]",
  warn: "border-warning-700 bg-warning-150 text-warning-700 [--scroll-track:var(--color-warning-150)]",
};

interface DialogProps {
  title: string;
  hint?: string;
  /** In a warning's colours: the save confirm. */
  warn?: boolean;
  /** Esc or a click outside; the caller decides whether it closes. */
  onDismiss: () => void;
  children: ReactNode;
}

/** A modal box over the page: the match picker, New reply and the save confirm. It closes by unmounting. */
export function Dialog({
  title,
  hint,
  warn = false,
  onDismiss,
  children,
}: DialogProps) {
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
       * At most 720px tall, so on a tall screen a long reply scrolls inside a
       * box instead of filling the height.
       * Phones: the box's middle a third of the way down, above where the
       * keyboard comes up; a tall one stops 16px from the top and grows down.
       */
      className={`m-auto max-h-[min(calc(100dvh-32px),720px)] max-sm:top-[33.33dvh] max-sm:bottom-auto max-sm:my-0 max-sm:translate-y-[max(-50%,calc(16px-33.33dvh))] w-[min(480px,calc(100vw-32px))] side-scroll overflow-y-auto overscroll-contain rounded-ui border p-0 backdrop:bg-neutral-950/40 ${SURFACE[warn ? "warn" : "plain"]} ${BOX_PAD_SIZE}`}
    >
      {/*
       * The page boxes' padding, and their head (`BoxHead`).
       * No bottom padding: a body ends with `DialogActions`, or (the reply editor) a pinned bar that brings its own, so it can sit flush.
       */}
      <div className="px-(--box-pad) pt-(--box-pad)">
        <BoxHead
          as="h3"
          id={titleId}
          title={title}
          hint={hint}
          titleClass={warn ? "card-face" : "card-title"}
        />
        {children}
      </div>
    </dialog>
  );
}

/** A dialog's buttons, at its foot, with the dialog's bottom padding under them. */
export function DialogActions({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 flex flex-wrap justify-end gap-2 pb-(--box-pad)">
      {children}
    </div>
  );
}
