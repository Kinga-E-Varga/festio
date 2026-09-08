import { STATS } from "@/mock/dashboard";

export function StatStrip() {
  return (
    // A one-pixel gap over a forest ground draws the dividers, so the cells
    // need no per-edge border rules as the column count changes.
    <dl className="grid grid-cols-1 gap-px border border-forest-400 bg-forest-400 min-[521px]:grid-cols-2 min-[1001px]:grid-cols-4">
      {STATS.map((stat) => (
        <div key={stat.label} className="bg-forest-100 px-[22px] py-4">
          <dt className="text-[10px] font-semibold tracking-[0.16em] text-forest-400 uppercase">
            {stat.label}
          </dt>
          <dd className="mt-1.5 flex items-baseline gap-1.5">
            <span className="font-serif text-3xl leading-none text-neutral-900">
              {stat.value}
            </span>
            {stat.detail ? (
              <span
                className={
                  stat.tone === "attention"
                    ? "text-[11px] font-semibold tracking-[0.1em] text-forest-500 uppercase"
                    : "text-xs font-medium text-forest-500"
                }
              >
                {stat.detail}
              </span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
