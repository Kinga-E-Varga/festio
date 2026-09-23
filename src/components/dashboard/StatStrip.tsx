import { useTranslations } from "next-intl";
import { STATS } from "@/mock/dashboard";

export function StatStrip() {
  const t = useTranslations("Stats");

  return (
    // A one-pixel gap over a forest ground draws the dividers, so the cells
    // need no per-edge border rules as the column count changes.
    <dl className="grid grid-cols-1 gap-px border border-forest-500 bg-forest-500 min-[521px]:grid-cols-2 min-[1001px]:grid-cols-4">
      {STATS.map((stat) => (
        <div key={stat.labelKey} className="bg-forest-100 px-[22px] py-4">
          <dt className="text-[10px] font-semibold tracking-[0.16em] text-forest-500 uppercase">
            {t(stat.labelKey)}
          </dt>
          <dd className="mt-1.5 flex items-baseline gap-1.5">
            <span className="font-serif text-3xl leading-none text-forest-600">
              {stat.value}
            </span>
            {stat.detailKey ? (
              <span className="text-xs font-medium text-forest-600">
                {t(stat.detailKey, { count: stat.detailValue ?? 0 })}
              </span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
