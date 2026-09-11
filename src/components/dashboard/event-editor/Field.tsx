import type { ReactNode } from "react";
import { ERROR, HINT, LABEL } from "@/components/dashboard/event-editor/styles";

interface FieldProps {
  /** Matches the control's own id, so the label points at it. */
  htmlFor?: string;
  label: string;
  hint?: ReactNode;
  error?: string | null;
  /** Lets a field span the whole row, or sit at a fixed width. */
  className?: string;
  children: ReactNode;
}

export function Field({
  htmlFor,
  label,
  hint,
  error,
  className = "",
  children,
}: FieldProps) {
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <label htmlFor={htmlFor} className={LABEL}>
        {label}
      </label>
      {children}
      {error ? <p className={ERROR}>{error}</p> : null}
      {hint ? <p className={HINT}>{hint}</p> : null}
    </div>
  );
}
