import { Fragment } from "react";

/**
 * A group's names, one per line, empty lines left out, 4px apart. A line
 * break, not a box, between them, so a screen reader hears them apart.
 */
export function Names({
  names,
  className,
}: {
  names: string | undefined;
  className: string;
}) {
  const lines = (names ?? "").split("\n").filter((name) => name.trim());
  if (lines.length === 0) return null;

  return (
    <h3 className={className}>
      {lines.map((name, index) => (
        <Fragment key={index}>
          {index > 0 ? <br /> : null}
          <span className={index > 0 ? "inline-block pt-1" : ""}>{name}</span>
        </Fragment>
      ))}
    </h3>
  );
}
