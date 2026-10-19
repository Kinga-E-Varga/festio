import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Whether the invitation is still in its envelope. Turning the envelope on
 * again (the editor's switch), or a new `replay` (the editor's opening
 * picker), seals it again, so the host sees it closed.
 *
 * `page` goes on the part the envelope covers (it needs `tabIndex={-1}`):
 * opened from the keyboard, focus moves there rather than dropping to the
 * top of the document with the envelope's button.
 *
 * `fade`: how long the envelope's fade into the page takes, once it has
 * started (`onFade`, the envelope's own callback); null before.
 */
export function useSealed<T extends HTMLElement>(
  show: boolean,
  replay?: string,
): [
  sealed: boolean,
  unseal: () => void,
  page: RefObject<T | null>,
  fade: number | null,
  onFade: (ms: number) => void,
] {
  const [sealed, setSealed] = useState(show);
  const [shown, setShown] = useState({ show, replay });
  const [fade, setFade] = useState<number | null>(null);
  const page = useRef<T>(null);
  const handOver = useRef(false);
  if (show !== shown.show || replay !== shown.replay) {
    setShown({ show, replay });
    setSealed(show);
    setFade(null);
  }

  const unseal = useCallback(() => {
    handOver.current = Boolean(document.activeElement?.closest(".env-stage"));
    setSealed(false);
  }, []);

  /* Once the page is no longer inert, it can take focus. */
  useEffect(() => {
    if (sealed || !handOver.current) return;
    handOver.current = false;
    page.current?.focus({ preventScroll: true });
  }, [sealed]);

  return [sealed, unseal, page, fade, setFade];
}
