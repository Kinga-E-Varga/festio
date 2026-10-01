import { useTranslations } from "next-intl";
import { list, text } from "@/modular/content";
import { BODY, HEADING, KICKER, PAD } from "@/modular/styles";
import type { ListItem, VariantProps } from "@/types/modular";

const HEX = /^#[0-9a-f]{6}$/i;

/** What to wear and what to skip, with swatches that carry their names. */
export function Variant({ values }: VariantProps) {
  const t = useTranslations("Sections");

  return (
    <div
      className={`grid items-center gap-12 bg-[var(--m1)] ${PAD} @3xl:grid-cols-2 @3xl:gap-20 @5xl:px-[120px]`}
    >
      <div className="flex flex-col gap-[18px]">
        <p className={KICKER}>{t("whatToWear")}</p>
        <h2
          className={`${HEADING} text-[30px] text-[color:var(--m8)] @3xl:text-[40px]`}
        >
          {text(values, "heading")}
        </h2>
        <p className={BODY}>{text(values, "body")}</p>
        <div className="mt-1.5 grid grid-cols-2 gap-6">
          <WearList title={t("yesPlease")} items={list(values, "wear")} />
          <WearList title={t("bestSkipped")} items={list(values, "skip")} />
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-[18px]">
        {list(values, "swatches").map((swatch, index) => (
          <li key={index} className="flex flex-col gap-2">
            {/*
             * The one colour on the page that is not the palette's: what to
             * wear is the host's content, so it is set where it is used.
             */}
            <span
              className="h-24 border-1 border-[var(--m5)] @3xl:h-[120px]"
              style={{
                backgroundColor: HEX.test(swatch.color ?? "")
                  ? swatch.color
                  : "transparent",
              }}
            />
            <span className="text-[14px] font-semibold text-[color:var(--m8)]">
              {swatch.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WearList({ title, items }: { title: string; items: ListItem[] }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] font-semibold text-[color:var(--m8)]">
        {title}
      </p>
      <ul className="flex flex-col gap-2">
        {items.map((item, index) => (
          <li key={index} className="text-[15px] text-[color:var(--m9)]">
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
