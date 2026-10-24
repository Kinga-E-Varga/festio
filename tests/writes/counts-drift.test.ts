import { expect, test } from "vitest";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import type { GuestChanges, ReplyInput } from "@/db/schemas/guest-changes";
import type { ListName } from "@/types/guests";
import { seatingSchema } from "@/db/schemas/seating";
import { countsOf } from "@/db/writes/counts";
import { writeGuestReply } from "@/db/writes/guest-reply";
import { setGuestListOn, writeGuestChanges } from "@/db/writes/guests";
import {
  fromGuestReplies,
  toGuestReplies,
  type StoredReply,
} from "@/lib/guests";
import { random } from "../../seed/build";
import {
  createEvent,
  guestInput,
  newVisitor,
  NOW,
  readEvent,
  TEST_HOST,
} from "../helpers/events";

/*
 * Random guest and host actions on one event; after each, the stored counters
 * must equal a full recount. Host saves recount the whole event with the same
 * function the check uses; what this really tests is a guest's reply counting
 * only its group (`countsWithReply`) and the list switch, mixed with them.
 * Repeatable: `DRIFT_SEED=<n>` replays a run.
 */

const SEED = Number(process.env.DRIFT_SEED ?? 1);
const STEPS = 200;

/* Spelled differently, the same under `normalizeName`: Duplicate and list matches happen. */
const NAMES = [
  "Ana Pop",
  "ana pop",
  "Ána  Pop",
  "Ion Rusu",
  "ION RUSU",
  "Maria Ilie",
  "Dan Stan",
  "Elena Toma",
  "Radu Vlad",
  "Sorin Barbu",
];

/** One run's choices, all from its seed, so replaying the seed makes the same ones. */
function makeRun() {
  const next = random(SEED);
  const int = (below: number) => Math.floor(next() * below);
  /* Counted, not random: replies sent at the same moment are ordered by ID. */
  let made = 0;
  return {
    next,
    int,
    pick: <T>(items: T[]): T => items[int(items.length)],
    id: () => `id-${String(++made).padStart(4, "0")}`,
  };
}

type Run = ReturnType<typeof makeRun>;

/** A stored reply as the guest list page sends it back (no questions in this test). */
function asInput(reply: StoredReply): ReplyInput {
  return fromGuestReplies(toGuestReplies([reply]), [])[0];
}

/** A reply in the log by its people, the same however its card IDs were made. */
function names(reply: { people: { name: string }[] }): string {
  return JSON.stringify(reply.people.map((person) => person.name));
}

function hostSave(eventId: string, changes: Partial<GuestChanges>, now: Date) {
  return writeGuestChanges(
    TEST_HOST,
    eventId,
    { replies: { put: [], remove: [] }, list: null, ...changes },
    now,
  );
}

/** The event's cards as they are now; a step's actions choose from them. */
type State = Awaited<ReturnType<typeof readEvent>>;
type Action = (
  run: Run,
  event: TestEvent,
  state: State,
  now: Date,
) => Promise<string>;

interface TestEvent {
  id: string;
  slug: string;
}

const status = (run: Run) => (run.next() < 0.7 ? "going" : "not_going");

const ACTIONS: [number, Action][] = [
  [
    40,
    async (run, event, state, now) => {
      const people = Array.from({ length: 1 + run.int(3) }, () =>
        run.pick(NAMES),
      );
      const input = guestInput(people, status(run), run.id());
      await writeGuestReply(event.id, event.slug, input, newVisitor(), now);
      return `guest reply ${input.status} ${JSON.stringify(people)}`;
    },
  ],
  [
    10,
    async (run, event, _state, now) => {
      const reply: ReplyInput = {
        id: run.id(),
        isNew: true,
        status: status(run),
        message: null,
        people: [{ id: run.id(), name: run.pick(NAMES) }],
      };
      await hostSave(event.id, { replies: { put: [reply], remove: [] } }, now);
      return `host adds ${reply.status} ${names(reply)}`;
    },
  ],
  [
    15,
    async (run, event, state, now) => {
      if (state.replies.length === 0) return "skip edit";
      const reply = asInput(run.pick(state.replies));
      const before = names(reply);
      const person = run.pick(reply.people);
      const change = run.int(4);
      if (change === 0) {
        reply.status = reply.status === "going" ? "not_going" : "going";
      } else if (change === 1) {
        person.name = run.pick(NAMES);
      } else if (change === 2) {
        const match = state.list.length > 0 && run.next() < 0.7;
        person.listNameId = match ? run.pick(state.list).id : undefined;
      } else {
        person.differentPerson = !person.differentPerson;
      }
      await hostSave(event.id, { replies: { put: [reply], remove: [] } }, now);
      return `host edits ${before} (change ${change}) → ${names(reply)} ${reply.status}`;
    },
  ],
  [
    8,
    async (run, event, state, now) => {
      if (state.replies.length === 0) return "skip delete";
      const reply = run.pick(state.replies);
      await hostSave(
        event.id,
        { replies: { put: [], remove: [reply.id] } },
        now,
      );
      return `host deletes ${names(reply)}`;
    },
  ],
  [
    7,
    async (run, event, state, now) => {
      const groups = state.replies.filter((reply) => reply.people.length > 1);
      if (groups.length === 0) return "skip separate";
      const source = asInput(run.pick(groups));
      const before = names(source);
      const moved = source.people.splice(run.int(source.people.length), 1);
      const split: ReplyInput = {
        ...source,
        id: run.id(),
        isNew: true,
        from: source.id,
        people: moved,
      };
      await hostSave(
        event.id,
        { replies: { put: [source, split], remove: [] } },
        now,
      );
      return `host separates ${names(split)} from ${before}`;
    },
  ],
  [
    15,
    async (run, event, state, now) => {
      let list: ListName[];
      if (state.list.length > 0 && run.next() < 0.4) {
        const gone = run.pick(state.list);
        list = state.list.filter((name) => name.id !== gone.id);
      } else {
        list = [
          ...state.list,
          { id: run.id(), name: run.pick(NAMES), sent: false },
        ];
      }
      await hostSave(
        event.id,
        { list: { names: list, version: state.listVersion } },
        now,
      );
      return `list → ${JSON.stringify(list.map((name) => name.name))}`;
    },
  ],
  [
    5,
    async (run, event, state) => {
      const on = !state.event.preloaded;
      await setGuestListOn(TEST_HOST, event.id, on);
      return `list switch → ${on}`;
    },
  ],
];

const TOTAL = ACTIONS.reduce((sum, [weight]) => sum + weight, 0);

function pickAction(run: Run): Action {
  let roll = run.int(TOTAL);
  for (const [weight, action] of ACTIONS) {
    if (roll < weight) return action;
    roll -= weight;
  }
  throw new Error("unreachable");
}

/** A list of four names, a seated reply, and a chart seating it and one list name. */
async function setUp(run: Run): Promise<TestEvent> {
  const { id, doc } = await createEvent({ preloaded: true });
  const list = NAMES.slice(3, 7).map((name) => ({
    id: run.id(),
    name,
    sent: false,
  }));
  const seated: ReplyInput = {
    id: run.id(),
    isNew: true,
    status: "going",
    message: null,
    people: [{ id: run.id(), name: "Seated Guest" }],
  };
  const chart = seatingSchema.parse({
    tables: [{ id: "t1", name: "Table 1", seats: 8 }],
    seats: {
      [seated.people[0].id]: { table: "t1", name: "Seated Guest" },
      [list[0].id]: { table: "t1", name: list[0].name },
    },
    version: 1,
  });
  await db.doc(paths.seating(id)).set(chart);
  /* After the chart: no seating save exists yet, so this save's recount is what counts it. */
  await hostSave(
    id,
    {
      replies: { put: [seated], remove: [] },
      list: { names: list, version: 0 },
    },
    NOW,
  );
  return { id, slug: doc.slug };
}

/**
 * `steps` random actions on a new event, checking the counters after each.
 * Any failure, a check's or a save's, names the seed, the step and every
 * action so far. Returns the actions.
 */
async function drift(steps: number): Promise<string[]> {
  const run = makeRun();
  const event = await setUp(run);
  const log: string[] = [];
  /* One read a step: it checks the last action and is what the next one chooses from. */
  let state = await readEvent(event.id);
  for (let step = 0; step < steps; step++) {
    const replay = () => `DRIFT_SEED=${SEED}, step ${step}\n${log.join("\n")}`;
    const now = new Date(NOW.getTime() + step * 60_000);
    try {
      log.push(`${step}: ${await pickAction(run)(run, event, state, now)}`);
    } catch (cause) {
      throw new Error(`A save failed. ${replay()}`, { cause });
    }
    state = await readEvent(event.id);
    expect(state.event.counts, replay()).toEqual(countsOf(state, state.event));
  }
  return log;
}

test("counts match a full recount after every action", async () => {
  await drift(STEPS);
}, 120_000);

test("the same seed replays the same actions", async () => {
  const [first, second] = await Promise.all([drift(30), drift(30)]);
  expect(second).toEqual(first);
}, 60_000);
