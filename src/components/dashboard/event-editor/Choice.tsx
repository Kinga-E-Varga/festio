import type { ReactNode } from "react";

/**
 * One of a radio group's choices on a plain line: a ring with a dot once
 * picked, its words beside it, and an optional line under them. Reply form
 * closes and Who can open the invitation.
 */
export function Choice({
  name,
  checked,
  onPick,
  note,
  children,
}: {
  name: string;
  checked: boolean;
  onPick: () => void;
  /** Under the words, lined up with them. */
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer flex-col">
      <span className="flex min-h-input items-center gap-2.5 font-medium text-neutral-800">
        <input
          type="radio"
          name={name}
          checked={checked}
          onChange={onPick}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className="grid size-[14px] shrink-0 place-items-center rounded-full border border-neutral-500 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-neutral-500"
        >
          {checked ? (
            <span className="size-1.5 rounded-full bg-neutral-500" />
          ) : null}
        </span>
        <span>{children}</span>
      </span>
      {note ? <span className="-mt-2 pl-6 hint-text">{note}</span> : null}
    </label>
  );
}
