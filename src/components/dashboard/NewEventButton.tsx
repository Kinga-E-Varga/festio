import { ButtonIcon } from "@/components/icons";

/**
 * The one thing a host starts from, beside a page's title. On a narrow page
 * it folds to a square plus so the title keeps its row; the label stays for
 * screen readers.
 */
export function NewEventButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex h-btn shrink-0 items-center justify-center gap-2 rounded-ui border border-accent-800 bg-accent-800 px-4 text-[12.5px] font-medium text-neutral-50 transition-colors hover:border-accent-900 hover:bg-accent-900 @max-[520px]:w-btn @max-[520px]:px-0"
    >
      <ButtonIcon name="plus" />
      <span className="@max-[520px]:sr-only">{label}</span>
    </button>
  );
}
