import { STATS } from "@/mock/dashboard";

export function StatStrip() {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-linen-200 bg-linen-200 md:grid-cols-4">
      {STATS.map((stat) => (
        <div key={stat.label} className="bg-sage-50 px-4 py-3.5">
          <dt className="text-[11px] font-medium tracking-[0.14em] text-stone-500 uppercase">
            {stat.label}
          </dt>
          <dd className="mt-1.5 flex items-baseline gap-2">
            <span
              className={`font-serif text-3xl leading-none ${
                stat.tone === "attention" ? "text-clay-600" : "text-ink-900"
              }`}
            >
              {stat.value}
            </span>
            {stat.detail ? (
              <span
                className={
                  stat.tone === "attention"
                    ? "text-[11px] font-medium tracking-[0.14em] text-clay-600 uppercase"
                    : "text-xs text-stone-500"
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
