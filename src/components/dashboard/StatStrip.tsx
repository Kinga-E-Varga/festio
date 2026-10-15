import { useTranslations } from "next-intl";
import { STATS } from "@/mock/dashboard";

export function StatStrip() {
  const t = useTranslations("Stats");

  return (
    // Columns follow the strip's own width, not the screen's: one, two, then
    // all four once each box has room (about 170px) for its longest line.
    <div className="@container">
      {/* A one-pixel gap over the border colour draws the dividers, so the cells
          need no per-edge border rules as the column count changes. */}
      <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-ui border border-neutral-400 bg-neutral-400 shadow-card @min-[420px]:grid-cols-2 @min-[680px]:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.labelKey} className="bg-neutral-50 px-4 py-3.5">
            <dt className="label-caps font-medium! text-neutral-800!">
              {t(stat.labelKey)}
            </dt>
            <dd className="mt-2 flex items-baseline gap-1.5">
              <span className="font-serif text-[26px] leading-none text-neutral-950 @min-[680px]:text-[28px]">
                {stat.value}
              </span>
              {stat.detailKey ? (
                <span className="text-[12.5px] text-neutral-800">
                  {t(stat.detailKey, { count: stat.detailValue ?? 0 })}
                </span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
