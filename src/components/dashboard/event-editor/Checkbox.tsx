import type { ComponentProps } from "react";
import { Icon } from "@/components/icons";

/** The box's edge and fill (`box`) and the tick's colour (`tick`), per place it sits. */
interface CheckboxLook {
  box: string;
  tick: string;
}

/** Festio's own checkbox: a drawn box with a tick, the input itself kept for forms and focus. */
export function Checkbox({
  look,
  ...input
}: ComponentProps<"input"> & { look: CheckboxLook }) {
  return (
    <span className="relative mt-px grid size-4 shrink-0 place-items-center">
      <input
        type="checkbox"
        {...input}
        className={`peer size-4 cursor-pointer appearance-none rounded-ui border-[1.5px] ${look.box}`}
      />
      <Icon
        name="check"
        className={`pointer-events-none absolute size-3 opacity-0 peer-checked:opacity-100 ${look.tick}`}
      />
    </span>
  );
}
