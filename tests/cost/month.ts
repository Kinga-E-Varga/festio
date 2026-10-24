import type { Measured } from "./report";

/*
 * One event like the seed's big one (150 invited) over a month, from the
 * measured situations. Change the numbers here to try other habits.
 */

/**
 * How often each measured situation happens for one event in a month.
 * `reloads`: the page a save renders again afterwards (`hostSave`'s refresh).
 */
export const USE: { situation: string; times: number; reloads?: string }[] = [
  { situation: "page: landing (signed in)", times: 10 },
  { situation: "page: dashboard home", times: 40 },
  { situation: "page: event overview", times: 20 },
  { situation: "page: guest list", times: 20 },
  { situation: "page: event editor", times: 3 },
  { situation: "page: invitation editor", times: 5 },
  { situation: "page: print", times: 2 },
  /* 150 guests, each opening the invitation 3 times. */
  { situation: "guest: public invitation", times: 450 },
  {
    situation: "save: event settings",
    times: 3,
    reloads: "page: event editor",
  },
  {
    situation: "save: invitation",
    times: 5,
    reloads: "page: invitation editor",
  },
  {
    situation: "save: guest list, one reply edited",
    times: 10,
    reloads: "page: guest list",
  },
  { situation: "save: mark replies seen", times: 20 },
  { situation: "guest reply: new name", times: 50 },
  { situation: "guest reply: name already replied", times: 10 },
  { situation: "guest reply: pre-loaded name", times: 20 },
];

/**
 * Firestore (Standard edition). The free allowance is per project, per day
 * (firebase.google.com/docs/firestore/pricing, checked 2026-10-24). The prices
 * are the US list prices (cloud.google.com/firestore/pricing, 2026-10-24):
 * europe-west4's could not be read from the page, so confirm them in the
 * console at step 6.
 */
export const PRICES = {
  freeReadsPerDay: 50_000,
  freeWritesPerDay: 20_000,
  usdPer100kReads: 0.03,
  usdPer100kWrites: 0.09,
};

const DAYS = 30;

export interface MonthResult {
  reads: number;
  writes: number;
  readsPerDay: number;
  writesPerDay: number;
  /** How many such events can be active at once inside the free allowance. */
  eventsFreePerDay: number;
  /** What one such event costs a month once past the free allowance. */
  costPerEventUsd: number;
}

export function month(measured: Measured): MonthResult {
  let reads = 0;
  let writes = 0;
  for (const { situation, times, reloads } of USE) {
    for (const name of reloads ? [situation, reloads] : [situation]) {
      const count = measured[name];
      if (!count) throw new Error(`Not measured: ${name}`);
      reads += count.reads * times;
      writes += count.writes * times;
    }
  }
  const readsPerDay = reads / DAYS;
  const writesPerDay = writes / DAYS;
  return {
    reads,
    writes,
    readsPerDay,
    writesPerDay,
    eventsFreePerDay: Math.floor(
      Math.min(
        PRICES.freeReadsPerDay / readsPerDay,
        PRICES.freeWritesPerDay / writesPerDay,
      ),
    ),
    costPerEventUsd:
      (reads / 100_000) * PRICES.usdPer100kReads +
      (writes / 100_000) * PRICES.usdPer100kWrites,
  };
}

/** The month in plain words, for the report. */
export function monthInWords(result: MonthResult): string {
  return [
    `One event like the seed's big one costs about ${result.reads.toLocaleString("en")} reads and ${result.writes.toLocaleString("en")} writes a month.`,
    `About ${result.eventsFreePerDay.toLocaleString("en")} such events can be active at once before Festio pays.`,
    `After that, one costs about $${result.costPerEventUsd.toFixed(3)} a month (US list prices; confirm europe-west4's).`,
    "Saves include the page they reload; not counted: what the Server Actions read before a save (e.g. a guest reply's link lookup, 1 read).",
  ].join("\n");
}
