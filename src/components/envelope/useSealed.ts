import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Whether the invitation is still in its envelope. Turning the envelope on
 * again (the editor's switch) seals it again, so the host sees it closed.
 *
 * `page` goes on the part the envelope covers (it needs `tabIndex={-1}`):
 * opened from the keyboard, focus moves there rather than dropping to the
 * top of the document with the envelope's button.
 */
export function useSealed<T extends HTMLElement>(
  show: boolean,
): [sealed: boolean, unseal: () => void, page: RefObject<T | null>] {
  const [sealed, setSealed] = useState(show);
  const [shown, setShown] = useState(show);
  const page = useRef<T>(null);
  const handOver = useRef(false);
  if (show !== shown) {
    setShown(show);
    setSealed(show);
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

  return [sealed, unseal, page];
}
