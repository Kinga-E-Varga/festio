import type { ReactNode } from "react";

interface EditorSectionProps {
  title: string;
  /** Standfirst under the rule; the first block moves up when there is none. */
  hint?: string;
  children: ReactNode;
}

export function EditorSection({ title, hint, children }: EditorSectionProps) {
  return (
    // The blocks inside lay themselves out against the section, not the page.
    <section className="@container mt-[50px]">
      <header
        className={`flex items-center gap-[18px] ${hint ? "mb-1" : "mb-[18px]"}`}
      >
        <h2 className="font-serif text-[17px] tracking-[0.14em] text-neutral-900 uppercase">
          {title}
        </h2>
        <span aria-hidden="true" className="h-px flex-1 bg-forest-500" />
      </header>

      {hint ? (
        <p className="mb-[18px] text-[12.5px] text-neutral-700">{hint}</p>
      ) : null}

      {children}
    </section>
  );
}
