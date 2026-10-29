import { Fragment } from "react";
import { ITEM_TITLE } from "@/modular/styles";

/** A course's dishes, one per line, empty lines left out. */
export function dishesOf(title: string): string[] {
  return title.split("\n").filter((dish) => dish.trim());
}

/**
 * A course's dishes, one per line with room between them; shared by Simple
 * grid, Printed card and Framed card. `dotted`: a small dot in the ink
 * between them.
 */
export function Dishes({
  title,
  className = ITEM_TITLE,
  dotted = false,
}: {
  title: string;
  className?: string;
  dotted?: boolean;
}) {
  return (
    <h3 className={`${className} flex flex-col gap-2`}>
      {dishesOf(title).map((dish, index) => (
        <Fragment key={index}>
          {dotted && index > 0 ? (
            <span
              aria-hidden="true"
              className="size-1 self-center rounded-full bg-[var(--m-ink)]"
            />
          ) : null}
          <span>{dish}</span>
        </Fragment>
      ))}
    </h3>
  );
}
