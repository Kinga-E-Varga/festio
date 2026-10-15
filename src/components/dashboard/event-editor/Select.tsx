import type { ComponentProps } from "react";
import { INPUT } from "@/components/dashboard/event-editor/styles";
import { Icon } from "@/components/icons";

/** A dropdown field with the app's chevron, the same as `MultiSelect`'s. */
export function Select({ className = "", ...props }: ComponentProps<"select">) {
  return (
    <span className="relative block">
      <select
        {...props}
        className={`${INPUT} cursor-pointer appearance-none pr-9 ${className}`}
      />
      <Icon
        name="chevron"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-neutral-700"
      />
    </span>
  );
}
