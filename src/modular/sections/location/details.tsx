import { useTranslations } from "next-intl";
import { list } from "@/modular/content";
import { MapsLink } from "@/modular/MapsLink";
import { BODY, HEADING, KICKER, PAD, SOLID_LINK } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/** The venue and its address with "Open in Maps"; practical notes beside them. No embedded map. */
export function Variant({ values, basics }: VariantProps) {
  const t = useTranslations("Sections");
  const notes = list(values, "notes");

  return (
    <div
      className={`grid gap-10 bg-[var(--m2)] ${PAD} @3xl:grid-cols-2 @3xl:gap-16 @5xl:px-[120px]`}
    >
      <div className="flex flex-col items-start gap-[18px]">
        <p className={KICKER}>{t("theVenue")}</p>
        <h2
          className={`${HEADING} text-[30px] text-[color:var(--m8)] @3xl:text-[40px]`}
        >
          {basics.venue}
        </h2>
        <p className={`${BODY} @3xl:text-[17px]`}>{basics.address}</p>
        <MapsLink
          query={`${basics.venue}, ${basics.address}`}
          className={`${SOLID_LINK} mt-1.5`}
        />
      </div>
      {notes.length > 0 ? (
        <dl className="flex flex-col self-center border-t-1 border-[var(--m5)]">
          {notes.map((note, index) => (
            <div
              key={index}
              className="flex gap-4 border-b-1 border-[var(--m5)] py-3 text-[15px]"
            >
              <dt className="w-[110px] shrink-0 text-[color:var(--m10)]">
                {note.label}
              </dt>
              <dd className="text-[color:var(--m8)]">{note.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}
