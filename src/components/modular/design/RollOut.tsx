"use client";

import { useTranslations } from "next-intl";
import {
  type CSSProperties,
  type ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Icon } from "@/components/icons";
import { LINK_TEXT } from "@/components/dashboard/styles";
import type { IconName } from "@/types/dashboard";
import {
  BOX_MARK,
  BOX_MARK_STROKE,
  DESIGN_BOX_BUTTON,
  MARK_SLOT,
} from "./styles";

/**
 * One choice card in the rolled-out grid, 60px tall. Hovered, a 2px neutral
 * ring 4px outside its border; picked, the same ring darker. Either way the
 * card scales down so that it, its ring and the gap (6px a side) fit in its
 * own height: 60 / 72 ≈ 0.83, so nothing around it moves. A card of another
 * height sets `--card-h` and its own `--card-shrink` (h / (h + 12)). Hovered,
 * an invisible layer keeps the full size under the pointer, or the card
 * would flicker at its edge, shrinking out from under it. The ring and the
 * scale ease in over 200ms. Callers add what it shows, its width, its own
 * fill and its 1px border.
 */
export const OPTION_CARD =
  "relative m-1 flex h-(--card-h,60px) cursor-pointer hover:before:absolute hover:before:-inset-[6px] rounded-ui ring-offset-4 ring-offset-neutral-100 transition-[box-shadow,scale] duration-200 ease-out hover:scale-(--card-shrink,0.83) aria-pressed:scale-(--card-shrink,0.83) hover:ring-2 hover:ring-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-500 aria-pressed:ring-2 aria-pressed:ring-neutral-500";

interface RollOutProps {
  /** The rolled-out grid's id. */
  id: string;
  /** What the box says to screen readers: the setting and its value. */
  label: string;
  icon?: IconName;
  /**
   * The icon's line, when `BOX_MARK_STROKE` makes it look heavier than the
   * rest: a big outline shape carries more ink than a small one.
   */
  iconStroke?: number;
  /** What the box shows of the current choice. */
  summary: ReactNode;
  /** The choices, as `OPTION_CARD` buttons. */
  children: ReactNode;
  /** A long list: its rows a few at a time (`usePagedRows`). */
  paged?: boolean;
}

/** A paged list's rows: shown at first (and after "Show less"), and added by each "Load more". */
const ROWS_FIRST = 2;
const ROWS_MORE = 2;

/**
 * A long list's rows, a few at a time: the first two, two more for each
 * "Load more", and "Show less" back to the first two. Until either is used,
 * never fewer than reach the picked card. How many cards
 * make a row depends on the panel's width, so the rows are measured: where
 * each card starts, and the whole grid's height, again whenever it changes
 * size. `reach` is the height of the rows shown (all of them: the whole
 * height, so the change can ease too); unset until measured. The cards past
 * it are marked `data-beyond`, so they hide and leave the tab order.
 */
function usePagedRows(on: boolean) {
  const grid = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<{
    tops: number[];
    height: number;
    picked: number;
  }>({ tops: [], height: 0, picked: 0 });
  /* The rows the host asked for; null until they use Load more or Show less. */
  const [shown, setShown] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = grid.current;
    if (!on || !el) return;
    /* Called once on observing, then on every change of size. */
    const observer = new ResizeObserver(() => {
      const cards = [...el.children] as HTMLElement[];
      const tops = [...new Set(cards.map((card) => card.offsetTop))];
      const current = cards.find((card) =>
        card.querySelector("[aria-pressed=true]"),
      );
      setRows({
        tops,
        height: el.offsetHeight,
        picked: current ? tops.indexOf(current.offsetTop) : 0,
      });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [on]);

  const { tops } = rows;
  const count = Math.min(
    shown ?? Math.max(ROWS_FIRST, rows.picked + 1),
    tops.length,
  );

  useLayoutEffect(() => {
    const el = grid.current;
    if (!on || !el) return;
    const edge = count < tops.length ? tops[count] : Infinity;
    for (const card of el.children as HTMLCollectionOf<HTMLElement>) {
      card.toggleAttribute("data-beyond", card.offsetTop >= edge);
    }
  }, [on, count, tops]);

  /* The height of the first `n` rows: up to where the next one starts. */
  const upTo = (n: number) => `${n < tops.length ? tops[n] : rows.height}px`;
  return {
    grid,
    style: {
      "--reach": tops.length > 0 ? upTo(count) : undefined,
    } as CSSProperties,
    more: on && count < tops.length ? () => setShown(count + ROWS_MORE) : null,
    less: on && count > ROWS_FIRST ? () => setShown(ROWS_FIRST) : null,
  };
}

/**
 * The event editor's summary box, the whole of it a button: the current
 * choice, a down arrow, and "Change" beside it while hovered or focused —
 * "Close" while open. Clicked, the choices roll out under it as cards on the
 * panel itself; they stay out after a pick, so the host can try several,
 * and the box rolls them back.
 */
export function RollOut({
  id,
  label,
  icon,
  iconStroke = BOX_MARK_STROKE,
  summary,
  children,
  paged = false,
}: RollOutProps) {
  const t = useTranslations("DesignTab");
  const [open, setOpen] = useState(false);
  const { grid, style, more, less } = usePagedRows(paged);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={label}
        onClick={() => setOpen(!open)}
        className={DESIGN_BOX_BUTTON}
      >
        {icon ? (
          <span className={MARK_SLOT}>
            <Icon
              name={icon}
              className={`${BOX_MARK} w-[22px]`}
              strokeWidth={iconStroke}
            />
          </span>
        ) : null}
        <span className="flex min-w-0 flex-1">{summary}</span>
        <RollArrow open={open} reveal="group-focus-visible:opacity-100" />
      </button>
      <RollPanel id={id} open={open}>
        {/* Clips while rolling; fully out, it lets the cards' labels hang below. */}
        <div
          className={`transition-[overflow] transition-discrete ${open ? "overflow-visible delay-300" : "overflow-hidden"}`}
        >
          <div className="@container flex flex-col pt-3 pb-1">
            {/*
             * Clips the cards; 24px of room below them (taken back from the
             * layout), so the last row's labels hang over what follows.
             * Paged, as tall as the rows shown, its height easing as the
             * choices box rolls; the cards not yet loaded hidden, and on
             * Show less only once rolled away.
             */}
            <div
              style={style}
              className="-mb-6 max-h-[calc(var(--reach)+24px)] overflow-hidden pb-6 transition-[max-height] duration-300 ease-out"
            >
              <div
                ref={grid}
                className="relative flex flex-wrap gap-1 [&>*]:transition-[visibility] [&>*]:duration-0 [&>[data-beyond]]:invisible [&>[data-beyond]]:delay-300"
              >
                {children}
              </div>
            </div>
            {more || less ? (
              /* Positioned, so it lies over the hidden rows' room above, not under. */
              <div className="relative mt-2 flex gap-4">
                {more ? (
                  <button
                    type="button"
                    onClick={more}
                    className={`${LINK_TEXT} cursor-pointer`}
                  >
                    {t("loadMore")}
                  </button>
                ) : null}
                {less ? (
                  <button
                    type="button"
                    onClick={less}
                    className={`${LINK_TEXT} cursor-pointer`}
                  >
                    {t("showLess")}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </RollPanel>
    </>
  );
}

/** An `OPTION_CARD` with its name as the app's quick label, under it on hover or focus. */
export function OptionTip({
  tip,
  children,
}: {
  tip: string;
  children: ReactNode;
}) {
  return (
    <span data-tip={tip} className="option-tip flex">
      {children}
    </span>
  );
}

/**
 * A Design box's down arrow, with "Change" beside it while hovered or
 * focused — "Close" while open. `reveal` is the class that shows the word
 * on focus, as the box's markup decides what counts as focused.
 */
export function RollArrow({
  open,
  reveal,
  action,
}: {
  open: boolean;
  reveal: string;
  /** What it says while shut; left out, "Change". */
  action?: string;
}) {
  const t = useTranslations("DesignTab");
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center gap-1.5 text-neutral-600"
    >
      <span
        className={`text-[12.5px] font-medium opacity-0 transition-opacity group-hover:opacity-100 ${reveal}`}
      >
        {open ? t("close") : (action ?? t("change"))}
      </span>
      <Icon
        name="chevron"
        className={`size-5 transition-transform ${open ? "rotate-180" : ""}`}
      />
    </span>
  );
}

/**
 * Rolls out by growing its one grid row from nothing to its height; while
 * shut it is out of the tab order. Its child must clip (`overflow-hidden`).
 * `lazy` mounts the child only while open, and while it rolls back — for
 * forms too heavy to keep under every card.
 */
export function RollPanel({
  id,
  open,
  children,
  lazy = false,
}: {
  id: string;
  open: boolean;
  children: ReactNode;
  lazy?: boolean;
}) {
  const [shown, setShown] = useState(open);
  /* Opening mounts it at once, so it rolls out with its content. */
  if (lazy && open && !shown) setShown(true);

  return (
    <div
      id={id}
      inert={!open}
      onTransitionEnd={(event) => {
        if (lazy && !open && event.target === event.currentTarget)
          setShown(false);
      }}
      className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
    >
      {!lazy || shown ? children : null}
    </div>
  );
}
