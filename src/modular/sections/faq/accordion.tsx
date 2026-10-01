import { list, text } from "@/modular/content";
import { HEADING, PAD } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/** Questions only until tapped; the first stands open. Native `<details>`, so it needs no script. */
export function Variant({ values }: VariantProps) {
  return (
    <div className={`flex flex-col gap-6 bg-[var(--m1)] ${PAD} @5xl:px-60`}>
      <h2
        className={`${HEADING} text-center text-[28px] text-[color:var(--m8)] @3xl:text-[34px]`}
      >
        {text(values, "heading")}
      </h2>
      <div className="flex flex-col border-t-1 border-[var(--m5)]">
        {list(values, "items").map((item, index) => (
          <details
            key={index}
            open={index === 0}
            className="group border-b-1 border-[var(--m5)] py-[18px]"
          >
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold text-[color:var(--m8)] [&::-webkit-details-marker]:hidden">
              {item.question}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="shrink-0 stroke-[var(--m10)] transition-transform group-open:rotate-180"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <p className="mt-3 text-[15px] leading-[1.7] whitespace-pre-line text-[color:var(--m9)]">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
