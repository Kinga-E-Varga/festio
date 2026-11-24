import { formatInvitationDate } from "@/lib/invitation";
import { text } from "@/modular/content";
import { BAND_LINE, BODY } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * The date large, set as `BAND_LINE`, in the format the host picked, and
 * the heading's note under it, centred. The date in the accent role: on
 * the accent that is the accent's ink, on a surface the accent itself. No
 * heading. Simple accent's on its band, the Full card styles' in their card.
 */
export function BandDate({
  values,
  basics,
  language,
}: Pick<VariantProps, "values" | "basics" | "language">) {
  const note = text(values, "note");

  return (
    <div className="flex flex-col items-center text-center">
      <time
        dateTime={basics.date}
        className={`${BAND_LINE} max-w-4xl text-[color:var(--m-accent)]`}
      >
        {formatInvitationDate(
          basics.date,
          text(values, "dateFormat"),
          language,
        )}
      </time>
      {note ? <p className={`${BODY} mt-6 max-w-xl`}>{note}</p> : null}
    </div>
  );
}
