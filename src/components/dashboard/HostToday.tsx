import { useFormatter } from "next-intl";
import { HOST } from "@/mock/dashboard";

/**
 * The date line above a dashboard page's title. One component rather than the
 * same paragraph written out on each page: the three used to carry an
 * identical hardcoded English label, and now that the date is formatted per
 * language there is a format to keep in step as well as classes.
 */
export function HostToday() {
  const format = useFormatter();

  return (
    <p className="text-[11px] font-semibold tracking-[0.16em] text-forest-500 uppercase">
      {format.dateTime(new Date(`${HOST.today}T00:00`), {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </p>
  );
}
