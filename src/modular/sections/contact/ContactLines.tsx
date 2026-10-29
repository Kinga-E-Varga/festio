import { Fragment } from "react";
import { Icon } from "@/modular/icons";
import { BODY, MUTED } from "@/modular/styles";
import type { ListItem } from "@/types/modular";

/* A line of contact: running text in the muted ink, as a heading's note, its icon before it. */
const LINE = `${BODY} ${MUTED} inline-flex max-w-full items-start gap-2 tabular-nums`;

/**
 * A person's number and email as plain text, each as the host typed it, a
 * small outline icon before it in the text's colour: a phone, an envelope.
 * A long email wraps, its icon on its first line. Nothing for an empty one. Side by side in the parent's flow.
 */
export function ContactLines({ person }: { person: ListItem }) {
  return (
    <>
      <ContactLine icon="phone" value={person.phone} />
      <ContactLine icon="mail" value={person.email} />
    </>
  );
}

function ContactLine({
  icon,
  value,
}: {
  icon: "phone" | "mail";
  value: string | undefined;
}) {
  if (!value?.trim()) return null;

  return (
    <span className={LINE}>
      {/* As tall as the first line, so the icon stays centred on it when the value wraps. */}
      <span className="flex h-[1lh] shrink-0 items-center">
        <Icon name={icon} className="size-3.5" />
      </span>
      {/*
       * A long email wraps balanced at its natural breaks (`breakable`),
       * and anywhere only when one part is still too long; a number keeps
       * together.
       */}
      {icon === "mail" ? (
        <span className="min-w-0 text-left text-balance [overflow-wrap:anywhere]">
          {breakable(value)}
        </span>
      ) : (
        <span className="whitespace-nowrap">{value}</span>
      )}
    </span>
  );
}

/** An email with a break allowed after its `@` and before each dot, so it wraps where it reads. */
function breakable(email: string) {
  return email.split(/(?=\.)|(?<=@)/).map((part, index) => (
    <Fragment key={index}>
      {index > 0 ? <wbr /> : null}
      {part}
    </Fragment>
  ));
}
