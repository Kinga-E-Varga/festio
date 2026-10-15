import type { ReactNode } from "react";

interface EditorSectionProps {
  title: string;
  /** Standfirst under the rule; the first block moves up when there is none. */
  hint?: string;
  /** The first section sits closer to the page head than to a section above. */
  first?: boolean;
  /** An anchor other pages link to, held clear of the top bar. */
  id?: string;
  children: ReactNode;
}

export function EditorSection({
  title,
  hint,
  first = false,
  id,
  children,
}: EditorSectionProps) {
  return (
    // The blocks inside lay themselves out against the section, not the page.
    <section
      id={id}
      className={`@container scroll-mt-[88px] ${first ? "mt-8" : "mt-11"}`}
    >
      <EditorHeading title={title} className={hint ? "mb-2" : "mb-5"} />

      {hint ? (
        <p className="mb-5 text-[12.5px] text-neutral-700">{hint}</p>
      ) : null}

      {children}
    </section>
  );
}

/**
 * A section's title: serif capitals with a rule running out to the edge.
 * Also the Design tab's group titles, so both editors title alike.
 */
export function EditorHeading({
  title,
  id,
  className = "",
}: {
  title: string;
  /** For a group that names itself by it (`aria-labelledby`). */
  id?: string;
  className?: string;
}) {
  return (
    <header className={`flex items-center gap-[18px] ${className}`}>
      <h2
        id={id}
        className="font-serif text-[15px] tracking-[0.1em] text-neutral-950 uppercase"
      >
        {title}
      </h2>
      <span aria-hidden="true" className="flex-1 border-t border-neutral-950" />
    </header>
  );
}
