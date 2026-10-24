import type { DbCount } from "@/db/count";

/** What each situation asked of Firebase, by its name in the baseline. */
export type Measured = Record<string, DbCount>;

const COLUMNS: [keyof DbCount, string][] = [
  ["reads", "reads"],
  ["writes", "writes"],
  ["authChecks", "session checks"],
];

/** One line per situation that costs more than in the baseline, or isn't in it yet. */
export function compare(now: Measured, baseline: Measured): string[] {
  return Object.entries(now).flatMap(([name, count]) => {
    const before = baseline[name];
    if (!before) return [`${name}: not in the baseline yet`];
    const rises = COLUMNS.filter(([key]) => count[key] > before[key]).map(
      ([key, label]) => `${label} ${before[key]} → ${count[key]}`,
    );
    return rises.length > 0 ? [`${name}: ${rises.join(", ")}`] : [];
  });
}

/** A number, with how far it moved from the baseline when there is one and it moved. */
function cell(value: number, before?: number): string {
  if (before === undefined || before === value) return String(value);
  const change = value - before;
  return `${value} (${change > 0 ? "+" : ""}${change})`;
}

/** The measurements as a markdown table, changes shown against the baseline if given. */
export function table(now: Measured, baseline?: Measured): string {
  const rows = Object.entries(now).map(([name, count]) => {
    const cells = COLUMNS.map(([key]) =>
      cell(count[key], baseline?.[name]?.[key]),
    );
    return `| ${name} | ${cells.join(" | ")} |`;
  });
  return [
    "| Situation | Reads | Writes | Session checks |",
    "| --- | --- | --- | --- |",
    ...rows,
  ].join("\n");
}
