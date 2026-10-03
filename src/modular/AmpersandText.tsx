import { Fragment } from "react";

/** Text with every `&` in its own span — the mark's and the names' italic ampersand. */
export function AmpersandText({
  text,
  className,
}: {
  text: string;
  className: string;
}) {
  return text.split("&").map((part, index) => (
    <Fragment key={index}>
      {index > 0 ? <span className={className}>&amp;</span> : null}
      {part}
    </Fragment>
  ));
}
